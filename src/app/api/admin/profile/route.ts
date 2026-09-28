import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { profileSchema } from "@/lib/validators";

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst();
    const education = await prisma.education.findMany({ orderBy: { order: "asc" } });
    const positions = await prisma.academicPosition.findMany({ orderBy: { order: "asc" } });

    return NextResponse.json({ profile, education, positions });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const existing = await prisma.profile.findFirst();
    if (!existing) {
      const created = await prisma.profile.create({ data: parsed.data });
      return NextResponse.json({ success: true, profile: created });
    }

    const updated = await prisma.profile.update({
      where: { id: existing.id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
