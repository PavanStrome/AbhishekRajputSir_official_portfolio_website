import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { studentSchema } from "@/lib/validators";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: [{ order: "asc" }, { joiningYear: "desc" }],
    });
    return NextResponse.json({ students });
  } catch (error) {
    console.error("Students fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = studentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
    }

    const student = await prisma.student.create({
      data: parsed.data,
    });
    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error("Student create error:", error);
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const parsed = studentSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
    }

    const student = await prisma.student.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error("Student update error:", error);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isPublished, status } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const data: any = {};
    if (isPublished !== undefined) data.isPublished = Boolean(isPublished);
    if (status !== undefined) data.status = status;

    const student = await prisma.student.update({
      where: { id },
      data,
    });
    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error("Student patch error:", error);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.student.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Student delete error:", error);
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}
