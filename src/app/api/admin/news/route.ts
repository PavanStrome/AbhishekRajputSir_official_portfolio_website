import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { newsSchema } from "@/lib/validators";

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ news });
  } catch (error) {
    console.error("News fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = newsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
    }

    const item = await prisma.news.create({
      data: parsed.data,
    });
    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("News create error:", error);
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const parsed = newsSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
    }

    const item = await prisma.news.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("News update error:", error);
    return NextResponse.json({ error: "Failed to update news" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, isFeatured } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const data: any = {};
    if (status !== undefined) data.status = status;
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);

    const item = await prisma.news.update({
      where: { id },
      data,
    });
    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("News patch error:", error);
    return NextResponse.json({ error: "Failed to update news" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("News delete error:", error);
    return NextResponse.json({ error: "Failed to delete news" }, { status: 500 });
  }
}
