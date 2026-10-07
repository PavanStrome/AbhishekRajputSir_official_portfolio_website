import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, token, newPassword, confirmPassword } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "A valid reset token from your email is required." },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    // Enforce password complexity (at least one letter and one digit)
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (!hasLetter || !hasNumber) {
      return NextResponse.json(
        { error: "Password must contain both letters and numbers for enhanced security." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match. Please re-enter." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findFirst({
      where: { email: cleanEmail },
    });

    if (!user || !user.resetTokenHash || !user.resetTokenExpiry) {
      return NextResponse.json(
        { error: "Invalid, expired, or already used password reset link. Please request a new one." },
        { status: 401 }
      );
    }

    // Check expiration (strict 15-minute validity)
    if (new Date() > user.resetTokenExpiry) {
      // Invalidate expired token
      await prisma.user.update({
        where: { id: user.id },
        data: { resetTokenHash: null, resetTokenExpiry: null },
      });
      return NextResponse.json(
        { error: "This password reset link has expired (valid for 15 minutes). Please request a new link." },
        { status: 401 }
      );
    }

    // Compute SHA-256 hash of incoming token and compare in constant time
    const incomingTokenHash = crypto.createHash("sha256").update(token.trim()).digest("hex");
    const isTokenMatch = crypto.timingSafeEqual(
      Buffer.from(incomingTokenHash, "utf-8"),
      Buffer.from(user.resetTokenHash, "utf-8")
    );

    if (!isTokenMatch) {
      return NextResponse.json(
        { error: "Invalid password reset token. Please ensure you clicked the exact link from your email." },
        { status: 401 }
      );
    }

    // Hash the new password securely
    const newHash = await hashPassword(newPassword);

    // Update password and immediately invalidate token (single-use guarantee)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: newHash,
        resetTokenHash: null,
        resetTokenExpiry: null,
        failedLoginAttempts: 0,
        lockoutUntil: null,
      },
    });

    console.log(`🔒 Password successfully updated and reset token invalidated for: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: "Your password has been successfully updated. You may now sign in with your new credentials.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password. Please try again or contact support." },
      { status: 500 }
    );
  }
}
