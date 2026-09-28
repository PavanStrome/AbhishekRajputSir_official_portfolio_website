import prisma from "@/lib/prisma";

export async function getPublicProfile() {
  const profile = await prisma.profile.findFirst();
  const education = await prisma.education.findMany({
    orderBy: { order: "asc" },
  });
  const positions = await prisma.academicPosition.findMany({
    orderBy: { order: "asc" },
  });
  return { profile, education, positions };
}

export async function getPublicResearchAreas() {
  return prisma.researchArea.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    include: {
      publications: {
        where: { status: "PUBLISHED" },
        take: 3,
        orderBy: { year: "desc" },
        select: { id: true, title: true, year: true, venue: true, doi: true },
      },
    },
  });
}

export async function getPublicPublications(filters?: {
  search?: string;
  year?: number;
  type?: string;
  researchAreaId?: string;
  featuredOnly?: boolean;
}) {
  const where: any = {
    status: "PUBLISHED",
  };

  if (filters?.featuredOnly) {
    where.isFeatured = true;
  }

  if (filters?.year) {
    where.year = filters.year;
  }

  if (filters?.type && filters.type !== "ALL") {
    where.publicationType = filters.type;
  }

  if (filters?.researchAreaId && filters.researchAreaId !== "ALL") {
    where.researchAreaId = filters.researchAreaId;
  }

  if (filters?.search && filters.search.trim()) {
    const term = filters.search.trim();
    where.OR = [
      { title: { contains: term, mode: "insensitive" } },
      { authors: { contains: term, mode: "insensitive" } },
      { venue: { contains: term, mode: "insensitive" } },
      { abstract: { contains: term, mode: "insensitive" } },
    ];
  }

  return prisma.publication.findMany({
    where,
    orderBy: [{ year: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    include: {
      researchArea: {
        select: { id: true, title: true, slug: true },
      },
    },
  });
}

export async function getPublicProjects(featuredOnly?: boolean) {
  const where: any = {
    isPublished: true,
  };
  if (featuredOnly) {
    where.isFeatured = true;
  }
  return prisma.project.findMany({
    where,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export async function getPublicCourses() {
  return prisma.course.findMany({
    where: { isPublished: true },
    orderBy: [{ academicYear: "desc" }, { semester: "asc" }, { order: "asc" }],
  });
}

export async function getPublicStudents() {
  return prisma.student.findMany({
    where: { isPublished: true },
    orderBy: [{ order: "asc" }, { joiningYear: "desc" }],
  });
}

export async function getPublicAwards() {
  return prisma.award.findMany({
    where: { isPublished: true },
    orderBy: [{ year: "desc" }, { order: "asc" }],
  });
}

export async function getPublicNews(limit?: number) {
  return prisma.news.findMany({
    where: { status: "PUBLISHED" },
    take: limit,
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });
}

export async function getPublicSiteSettings() {
  return prisma.siteSettings.findFirst();
}
