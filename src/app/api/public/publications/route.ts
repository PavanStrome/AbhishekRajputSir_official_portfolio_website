import { NextRequest, NextResponse } from "next/server";
import { getPublicPublications } from "@/services/academic-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : undefined;
    const type = searchParams.get("type") || undefined;
    const researchAreaId = searchParams.get("researchAreaId") || undefined;
    const featuredOnly = searchParams.get("featured") === "true";

    const publications = await getPublicPublications({
      search,
      year,
      type,
      researchAreaId,
      featuredOnly,
    });

    return NextResponse.json({ publications });
  } catch (error) {
    console.error("Public publications API error:", error);
    return NextResponse.json({ error: "Failed to fetch publications" }, { status: 500 });
  }
}
