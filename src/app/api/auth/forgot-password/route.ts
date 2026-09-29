import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const prefix = user.slice(0, Math.min(2, user.length));
  const suffix = user.length > 3 ? user.slice(-1) : "";
  return `${prefix}••••${suffix}@${domain}`;
}

// GET: Returns the masked registered admin email so the user knows where the email will be sent
export async function GET() {
  try {
    const admin =
      (await prisma.user.findFirst({ where: { role: "ADMIN" } })) ||
      (await prisma.user.findFirst());

    if (!admin) {
      return NextResponse.json({ error: "No administrator account configured." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      maskedEmail: maskEmail(admin.email),
      adminName: admin.name,
    });
  } catch (error) {
    console.error("Forgot password GET error:", error);
    return NextResponse.json({ error: "Failed to load registered account details." }, { status: 500 });
  }
}

// POST: Dispatches the reset link directly to the registered administrator's email inbox
export async function POST(req: NextRequest) {
  try {
    let targetEmail: string | undefined;

    // Read body if provided
    try {
      const body = await req.json();
      if (body && body.email && typeof body.email === "string" && body.email.includes("@")) {
        targetEmail = body.email.trim().toLowerCase();
      }
    } catch {
      // Body may be empty if one-click button is used
    }

    // If specific email provided, find that user; otherwise find the registered administrator
    let admin = null;
    if (targetEmail) {
      admin = await prisma.user.findFirst({
        where: { email: { equals: targetEmail, mode: "insensitive" } },
      });
    } else {
      admin =
        (await prisma.user.findFirst({ where: { role: "ADMIN" } })) ||
        (await prisma.user.findFirst());
    }

    if (!admin) {
      return NextResponse.json(
        { error: "No registered administrator account found in the system." },
        { status: 404 }
      );
    }

    // Cooldown check: prevent rapid spamming within 60 seconds
    if (admin.resetTokenExpiry) {
      const remainingMs = admin.resetTokenExpiry.getTime() - Date.now();
      if (remainingMs > 14 * 60 * 1000) {
        return NextResponse.json({
          success: true,
          sentTo: maskEmail(admin.email),
          message: `A password reset link was already sent recently to ${maskEmail(admin.email)}. Please check your inbox or wait a moment before requesting another.`,
        });
      }
    }

    // Generate cryptographically secure 32-byte hex token
    const rawToken = crypto.randomBytes(32).toString("hex");

    // Compute SHA-256 hash for database storage
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    // Set 15-minute expiration
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    // Save token hash and expiry to user
    await prisma.user.update({
      where: { id: admin.id },
      data: {
        resetTokenHash: tokenHash,
        resetTokenExpiry: tokenExpiry,
      },
    });

    // Construct reset URL (delivered ONLY via email)
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
    const resetUrl = `${baseUrl}/admin/reset-password?token=${encodeURIComponent(rawToken)}&email=${encodeURIComponent(admin.email)}`;

    // Send the email directly to the registered admin's inbox via SMTP
    const emailResult = await sendPasswordResetEmail({
      to: admin.email,
      resetUrl,
      recipientName: admin.name,
    });

    console.log(`✉️ Password reset email dispatched to: ${admin.email} (mode: ${emailResult.mode})`);

    // Strictly send only to mail; NEVER return resetUrl or devResetUrl to the client browser
    return NextResponse.json({
      success: true,
      sentTo: maskEmail(admin.email),
      deliveryMode: emailResult.mode,
      message: `A secure password reset link has been dispatched directly to the registered administrator email (${maskEmail(admin.email)}). Please check your inbox.`,
    });
  } catch (error) {
    console.error("Forgot password handler error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while dispatching the reset email. Please try again." },
      { status: 500 }
    );
  }
}
