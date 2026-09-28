import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { publicationSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { authors: { contains: search, mode: "insensitive" } },
        { venue: { contains: search, mode: "insensitive" } },
      ];
    }

    const publications = await prisma.publication.findMany({
      where,
      orderBy: [{ year: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      include: {
        researchArea: {
          select: { id: true, title: true },
        },
      },
    });

    return NextResponse.json({ publications });
  } catch (error) {
    console.error("Publications fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch publications" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = publicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
    }

    const publication = await prisma.publication.create({
      data: parsed.data,
    });
    return NextResponse.json({ success: true, publication });
  } catch (error) {
    console.error("Publication create error:", error);
    return NextResponse.json({ error: "Failed to create publication" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const parsed = publicationSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
    }

    const publication = await prisma.publication.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ success: true, publication });
  } catch (error) {
    console.error("Publication update error:", error);
    return NextResponse.json({ error: "Failed to update publication" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, isFeatured, order } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const data: any = {};
    if (status !== undefined) data.status = status;
    if (isFeatured !== undefined) data.isFeatured = isFeatured;
    if (order !== undefined) data.order = Number(order);

    const publication = await prisma.publication.update({
      where: { id },
      data,
    });
    return NextResponse.json({ success: true, publication });
  } catch (error) {
    console.error("Publication patch error:", error);
    return NextResponse.json({ error: "Failed to update publication status" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.publication.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Publication delete error:", error);
    return NextResponse.json({ error: "Failed to delete publication" }, { status: 500 });
  }
}
