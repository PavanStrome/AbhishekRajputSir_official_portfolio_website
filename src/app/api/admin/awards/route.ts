import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { awardSchema } from "@/lib/validators";

export async function GET() {
  try {
    const awards = await prisma.award.findMany({
      orderBy: [{ year: "desc" }, { order: "asc" }],
    });
    return NextResponse.json({ awards });
  } catch (error) {
    console.error("Awards fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch awards" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = awardSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
    }

    const award = await prisma.award.create({
      data: parsed.data,
    });
    return NextResponse.json({ success: true, award });
  } catch (error) {
    console.error("Award create error:", error);
    return NextResponse.json({ error: "Failed to create award" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const parsed = awardSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
    }

    const award = await prisma.award.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ success: true, award });
  } catch (error) {
    console.error("Award update error:", error);
    return NextResponse.json({ error: "Failed to update award" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isPublished, isFeatured } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const data: any = {};
    if (isPublished !== undefined) data.isPublished = Boolean(isPublished);
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);

    const award = await prisma.award.update({
      where: { id },
      data,
    });
    return NextResponse.json({ success: true, award });
  } catch (error) {
    console.error("Award patch error:", error);
    return NextResponse.json({ error: "Failed to update award" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.award.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Award delete error:", error);
    return NextResponse.json({ error: "Failed to delete award" }, { status: 500 });
  }
}
