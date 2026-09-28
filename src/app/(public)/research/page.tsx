import React from "react";
import type { Metadata } from "next";
import { getPublicResearchAreas } from "@/services/academic-service";
import ResearchCard from "@/components/public/ResearchCard";
import EmptyState from "@/components/public/EmptyState";
import { Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Research Thrusts & Laboratory Investigations",
  description:
    "Experimental and computational research areas in structural impact mechanics, ballistic penetration, and finite element modeling at IIT Indore.",
};

export const revalidate = 60;

export default async function ResearchPage() {
  const researchAreas = await getPublicResearchAreas();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      <div className="border-b border-slate-200 pb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          Impact & Computational Mechanics
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          Research Areas & Scientific Programs
        </h1>
        <p className="text-slate-600 text-base mt-2 max-w-3xl leading-relaxed">
          Our laboratory addresses critical engineering challenges in protective civil defense structures, naval platforms, and material performance under severe dynamic loading environments.
        </p>
      </div>

      {researchAreas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {researchAreas.map((area) => (
            <ResearchCard
              key={area.id}
              id={area.id}
              title={area.title}
              slug={area.slug}
              summary={area.summary}
              description={area.description}
              keywords={area.keywords}
              publicationsCount={area.publications.length}
              recentPublications={area.publications}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Research areas are being updated"
          message="Detailed research descriptions are currently being updated in the faculty portal. Please check back shortly."
        />
      )}
    </div>
  );
}
