import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

// GET: Basic health check; does not expose sensitive administrator details openly
export async function GET() {
  return NextResponse.json({ success: true });
}

// POST: Dispatches the reset link exclusively to the registered administrator's email inbox
export async function POST(req: NextRequest) {
  try {
    let targetEmail: string | undefined;

    try {
      const body = await req.json();
      if (body && body.email && typeof body.email === "string" && body.email.includes("@")) {
        targetEmail = body.email.trim().toLowerCase();
      }
    } catch {
      // Empty body
    }

    if (!targetEmail) {
      return NextResponse.json(
        { error: "Please enter your registered administrator email address." },
        { status: 400 }
      );
    }

    // Find administrator by email
    const admin = await prisma.user.findFirst({
      where: { email: { equals: targetEmail, mode: "insensitive" } },
    });

    // To prevent account enumeration, return success message even if email not found
    if (!admin) {
      return NextResponse.json({
        success: true,
        message: "If an administrator account with this email exists, a secure password reset link has been dispatched to your email address.",
      });
    }

    // Cooldown check: prevent rapid spamming within 60 seconds
    if (admin.resetTokenExpiry) {
      const remainingMs = admin.resetTokenExpiry.getTime() - Date.now();
      if (remainingMs > 14 * 60 * 1000) {
        return NextResponse.json({
          success: true,
          message: "A password reset link was already sent recently. Please check your email inbox or wait a moment before requesting another.",
        });
      }
    }

    // Generate cryptographically secure 32-byte hex token
    const rawToken = crypto.randomBytes(32).toString("hex");

    // Compute SHA-256 hash for database storage
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    // Set strict 15-minute expiration
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    // Save token hash and expiry to user
    await prisma.user.update({
      where: { id: admin.id },
      data: {
        resetTokenHash: tokenHash,
        resetTokenExpiry: tokenExpiry,
      },
    });

    // Construct reset URL (sent exclusively via email)
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

    // Strictly return generic success without exposing the reset URL or token to the client
    return NextResponse.json({
      success: true,
      message: "A secure password reset link has been dispatched directly to your registered email address. Please check your email inbox and spam folder.",
    });
  } catch (error) {
    console.error("Forgot password handler error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while dispatching the reset email. Please try again." },
      { status: 500 }
    );
  }
}
