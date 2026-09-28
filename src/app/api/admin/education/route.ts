import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { degree, field, institution, year, location, order } = body;
    if (!degree || !institution || !year) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const item = await prisma.education.create({
      data: {
        degree,
        field: field || "",
        institution,
        year,
        location: location || "",
        order: Number(order) || 0,
      },
    });
    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Education create error:", error);
    return NextResponse.json({ error: "Failed to create education entry" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, degree, field, institution, year, location, order } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const item = await prisma.education.update({
      where: { id },
      data: {
        degree,
        field,
        institution,
        year,
        location,
        order: Number(order) || 0,
      },
    });
    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Education update error:", error);
    return NextResponse.json({ error: "Failed to update education entry" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.education.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Education delete error:", error);
    return NextResponse.json({ error: "Failed to delete education entry" }, { status: 500 });
  }
}
