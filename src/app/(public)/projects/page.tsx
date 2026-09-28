import React from "react";
import type { Metadata } from "next";
import { getPublicProjects } from "@/services/academic-service";
import ProjectCard from "@/components/public/ProjectCard";
import EmptyState from "@/components/public/EmptyState";
import { Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "Sponsored Research & Consultancy Projects",
  description:
    "Government, institutional, and industrial sponsored research projects led by Dr. Abhishek Rajput at IIT Indore.",
};

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getPublicProjects();

  const ongoing = projects.filter((p) => p.status === "ONGOING");
  const completed = projects.filter((p) => p.status === "COMPLETED");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="border-b border-slate-200 pb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          Sponsored Investigations
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          Research Projects & Grants
        </h1>
        <p className="text-slate-600 text-base mt-2 max-w-3xl leading-relaxed">
          Funded research initiatives in prestressed concrete under extreme loading rates, TEQIP grants, and industrial structural crashworthiness evaluations.
        </p>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-12">
          {/* Ongoing Projects */}
          {ongoing.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>Active & Ongoing Research Grants</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ongoing.map((proj) => (
                  <ProjectCard
                    key={proj.id}
                    title={proj.title}
                    shortDescription={proj.shortDescription}
                    detailedDescription={proj.detailedDescription}
                    status={proj.status}
                    role={proj.role}
                    fundingAgency={proj.fundingAgency}
                    grantAmount={proj.grantAmount}
                    startDate={proj.startDate}
                    endDate={proj.endDate}
                    projectUrl={proj.projectUrl}
                    isFeatured={proj.isFeatured}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Projects */}
          {completed.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <span>Completed Grants & Projects</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completed.map((proj) => (
                  <ProjectCard
                    key={proj.id}
                    title={proj.title}
                    shortDescription={proj.shortDescription}
                    detailedDescription={proj.detailedDescription}
                    status={proj.status}
                    role={proj.role}
                    fundingAgency={proj.fundingAgency}
                    grantAmount={proj.grantAmount}
                    startDate={proj.startDate}
                    endDate={proj.endDate}
                    projectUrl={proj.projectUrl}
                    isFeatured={proj.isFeatured}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          title="No projects currently listed"
          message="Project summaries are being updated. Check back soon or view our publications for active findings."
          icon={<Briefcase className="w-6 h-6" />}
        />
      )}
    </div>
  );
}
