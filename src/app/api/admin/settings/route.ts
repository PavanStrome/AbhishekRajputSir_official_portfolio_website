import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { siteSettingsSchema } from "@/lib/validators";
import { getSession, createSession, hashPassword, verifyPassword } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    const session = await getSession();
    let user = null;
    if (session?.userId) {
      user = await prisma.user.findUnique({ where: { id: session.userId } });
    }

    return NextResponse.json({
      settings,
      adminEmail: user?.email || session?.email,
      adminName: user?.name || session?.name,
    });
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      siteTitle,
      siteDescription,
      contactEmail,
      footerText,
      enableNews,
      enableStudents,
      adminName,
      adminEmail,
      currentPassword,
      newPassword,
    } = body;

    // Validate settings
    const parsed = siteSettingsSchema.safeParse({
      siteTitle,
      siteDescription,
      contactEmail,
      footerText,
      enableNews,
      enableStudents,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
    }

    const existing = await prisma.siteSettings.findFirst();
    let updatedSettings;
    if (!existing) {
      updatedSettings = await prisma.siteSettings.create({ data: parsed.data });
    } else {
      updatedSettings = await prisma.siteSettings.update({
        where: { id: existing.id },
        data: parsed.data,
      });
    }

    // Handle Admin Account Updates (Email, Name, Password)
    const session = await getSession();
    let userUpdated = false;
    let newSessionUser = null;

    const wantsAccountChange =
      (adminEmail && session?.email && adminEmail.trim().toLowerCase() !== session.email.toLowerCase()) ||
      (adminName && session?.name && adminName.trim() !== session.name) ||
      (newPassword && newPassword.trim().length > 0);

    if (wantsAccountChange) {
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to change administrator credentials." },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({ where: { id: session.userId } });
      if (!user) {
        return NextResponse.json({ error: "Administrator user not found." }, { status: 404 });
      }

      const validCurrent = await verifyPassword(currentPassword, user.password);
      if (!validCurrent) {
        return NextResponse.json({ error: "Incorrect current password. Verification failed." }, { status: 400 });
      }

      const updateData: { name?: string; email?: string; password?: string } = {};

      if (adminName && adminName.trim().length > 0) {
        updateData.name = adminName.trim();
      }

      if (adminEmail && adminEmail.trim().length > 0) {
        const cleanEmail = adminEmail.trim().toLowerCase();
        // Check for conflict
        const conflict = await prisma.user.findFirst({
          where: { email: cleanEmail, NOT: { id: user.id } },
        });
        if (conflict) {
          return NextResponse.json(
            { error: "The requested email address is already in use by another account." },
            { status: 400 }
          );
        }
        updateData.email = cleanEmail;
      }

      if (newPassword && newPassword.trim().length > 0) {
        if (newPassword.length < 8) {
          return NextResponse.json(
            { error: "New password must be at least 8 characters long." },
            { status: 400 }
          );
        }
        const hasLetter = /[a-zA-Z]/.test(newPassword);
        const hasNumber = /[0-9]/.test(newPassword);
        if (!hasLetter || !hasNumber) {
          return NextResponse.json(
            { error: "New password must contain both letters and numbers for enhanced security." },
            { status: 400 }
          );
        }
        updateData.password = await hashPassword(newPassword);
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });

      userUpdated = true;
      newSessionUser = {
        userId: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
      };

      // Refresh active session cookie
      await createSession(newSessionUser);
    }

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
      adminEmail: newSessionUser ? newSessionUser.email : session?.email,
      adminName: newSessionUser ? newSessionUser.name : session?.name,
      message: userUpdated
        ? "Settings and administrator credentials updated successfully!"
        : "Settings saved successfully!",
    });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
