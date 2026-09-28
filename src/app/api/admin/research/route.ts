import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { researchAreaSchema } from "@/lib/validators";

export async function GET() {
  try {
    const areas = await prisma.researchArea.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { publications: true },
        },
      },
    });
    return NextResponse.json({ areas });
  } catch (error) {
    console.error("Research areas fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch research areas" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = researchAreaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
    }

    const area = await prisma.researchArea.create({
      data: parsed.data,
    });
    return NextResponse.json({ success: true, area });
  } catch (error) {
    console.error("Research area create error:", error);
    return NextResponse.json({ error: "Failed to create research area" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const parsed = researchAreaSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
    }

    const area = await prisma.researchArea.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ success: true, area });
  } catch (error) {
    console.error("Research area update error:", error);
    return NextResponse.json({ error: "Failed to update research area" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.researchArea.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Research area delete error:", error);
    return NextResponse.json({ error: "Failed to delete research area" }, { status: 500 });
  }
}
