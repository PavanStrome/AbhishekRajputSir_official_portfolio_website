import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { courseSchema } from "@/lib/validators";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: [{ academicYear: "desc" }, { semester: "asc" }, { order: "asc" }],
    });
    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Courses fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = courseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: parsed.data,
    });
    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("Course create error:", error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const parsed = courseSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
    }

    const course = await prisma.course.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("Course update error:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isPublished } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const course = await prisma.course.update({
      where: { id },
      data: { isPublished: Boolean(isPublished) },
    });
    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("Course patch error:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Course delete error:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
