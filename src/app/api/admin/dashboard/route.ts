import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalPublications,
      draftPublications,
      publishedPublications,
      researchAreasCount,
      projectsCount,
      coursesCount,
      studentsCount,
      awardsCount,
      newsCount,
      recentPublications,
      recentProjects,
      profile,
    ] = await Promise.all([
      prisma.publication.count(),
      prisma.publication.count({ where: { status: "DRAFT" } }),
      prisma.publication.count({ where: { status: "PUBLISHED" } }),
      prisma.researchArea.count(),
      prisma.project.count(),
      prisma.course.count(),
      prisma.student.count(),
      prisma.award.count(),
      prisma.news.count(),
      prisma.publication.findMany({
        take: 5,
        orderBy: [{ updatedAt: "desc" }],
        select: { id: true, title: true, status: true, year: true, updatedAt: true, venue: true },
      }),
      prisma.project.findMany({
        take: 4,
        orderBy: [{ updatedAt: "desc" }],
        select: { id: true, title: true, status: true, isPublished: true, updatedAt: true },
      }),
      prisma.profile.findFirst({
        select: { name: true, designation: true, department: true, institution: true, avatarUrl: true, cvUrl: true },
      }),
    ]);

    return NextResponse.json({
      metrics: {
        totalPublications,
        draftPublications,
        publishedPublications,
        researchAreasCount,
        projectsCount,
        coursesCount,
        studentsCount,
        awardsCount,
        newsCount,
      },
      recentPublications,
      recentProjects,
      profile,
    });
  } catch (error) {
    console.error("Dashboard metrics fetch error:", error);
    return NextResponse.json({ error: "Failed to load dashboard metrics" }, { status: 500 });
  }
}
