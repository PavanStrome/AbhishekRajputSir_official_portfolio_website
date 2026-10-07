import React from "react";
import type { Metadata } from "next";
import { getPublicPublications, getPublicResearchAreas } from "@/services/academic-service";
import PublicationFilterClient from "@/components/public/PublicationFilterClient";
import EmptyState from "@/components/public/EmptyState";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Publications & Peer-Reviewed Papers",
  description:
    "Peer-reviewed journal articles, conference proceedings, and book chapters published by Dr. Abhishek Rajput in impact mechanics and materials engineering.",
};

export const dynamic = "force-dynamic";

export default async function PublicationsPage() {
  const [publications, researchAreas] = await Promise.all([
    getPublicPublications(),
    getPublicResearchAreas(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      <div className="border-b border-slate-200 pb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          Scholarly Output
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          Publications & Research Articles
        </h1>
        <p className="text-slate-600 text-base mt-2 max-w-3xl leading-relaxed">
          Comprehensive database of peer-reviewed journal papers, conference proceedings, and technical manuscripts with full-text links, DOIs, and BibTeX citations.
        </p>
      </div>

      {publications.length > 0 ? (
        <PublicationFilterClient
          initialPublications={publications as any}
          researchAreas={researchAreas.map((a) => ({ id: a.id, title: a.title }))}
        />
      ) : (
        <EmptyState
          title="No published papers listed yet"
          message="Publications are currently being compiled. Please return soon or contact Dr. Rajput directly for preprint copies."
          icon={<BookOpen className="w-6 h-6" />}
        />
      )}
    </div>
  );
}
