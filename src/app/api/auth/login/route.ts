import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

// Standard dummy hash for timing attack mitigation (cost factor 10)
const DUMMY_HASH = "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid credentials format. Please provide a valid email and password." },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const cleanEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    // Timing attack mitigation: run bcrypt verification even if user does not exist
    if (!user) {
      await verifyPassword(password, DUMMY_HASH);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if account is currently locked out
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / (60 * 1000));
      return NextResponse.json(
        {
          error: `Account temporarily locked due to multiple failed login attempts. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}, or use the Forgot Password link to reset your credentials.`,
          locked: true,
        },
        { status: 429 }
      );
    }

    // Verify password against stored hash
    const isMatch = await verifyPassword(password, user.password);

    if (!isMatch) {
      const newAttempts = (user.failedLoginAttempts || 0) + 1;
      const shouldLock = newAttempts >= 5;
      const lockoutTime = shouldLock ? new Date(Date.now() + 15 * 60 * 1000) : null;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: newAttempts,
          lockoutUntil: lockoutTime,
        },
      });

      if (shouldLock) {
        console.warn(`🚨 Account locked out due to 5 failed attempts: ${user.email}`);
        return NextResponse.json(
          {
            error: "Account temporarily locked for 15 minutes due to 5 consecutive failed login attempts. Please try again later or reset your password.",
            locked: true,
          },
          { status: 429 }
        );
      }

      const remaining = 5 - newAttempts;
      const warning = remaining <= 2 ? ` (${remaining} attempt${remaining > 1 ? "s" : ""} remaining before lockout)` : "";

      return NextResponse.json(
        { error: `Invalid email or password${warning}` },
        { status: 401 }
      );
    }

    // Login successful: reset failed login attempts and clear any lockout
    if ((user.failedLoginAttempts || 0) > 0 || user.lockoutUntil) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lockoutUntil: null,
        },
      });
    }

    // Issue cryptographic session cookie
    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    console.log(`✅ Administrator successfully logged in: ${user.email}`);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred during authentication." },
      { status: 500 }
    );
  }
}
