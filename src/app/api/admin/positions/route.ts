import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, institution, department, startYear, endYear, isCurrent, order } = body;
    if (!title || !institution || !startYear) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const item = await prisma.academicPosition.create({
      data: {
        title,
        institution,
        department: department || "",
        startYear,
        endYear: isCurrent ? null : endYear || null,
        isCurrent: Boolean(isCurrent),
        order: Number(order) || 0,
      },
    });
    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Position create error:", error);
    return NextResponse.json({ error: "Failed to create position entry" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, institution, department, startYear, endYear, isCurrent, order } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const item = await prisma.academicPosition.update({
      where: { id },
      data: {
        title,
        institution,
        department,
        startYear,
        endYear: isCurrent ? null : endYear || null,
        isCurrent: Boolean(isCurrent),
        order: Number(order) || 0,
      },
    });
    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Position update error:", error);
    return NextResponse.json({ error: "Failed to update position entry" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.academicPosition.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Position delete error:", error);
    return NextResponse.json({ error: "Failed to delete position entry" }, { status: 500 });
  }
}
