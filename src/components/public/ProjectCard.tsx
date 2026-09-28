import React from "react";
import { Briefcase, Calendar, Award, ExternalLink } from "lucide-react";

interface ProjectCardProps {
  title: string;
  shortDescription: string;
  detailedDescription?: string | null;
  status: string;
  role: string;
  fundingAgency?: string | null;
  grantAmount?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  projectUrl?: string | null;
  isFeatured?: boolean;
}

export default function ProjectCard({
  title,
  shortDescription,
  detailedDescription,
  status,
  role,
  fundingAgency,
  grantAmount,
  startDate,
  endDate,
  projectUrl,
  isFeatured,
}: ProjectCardProps) {
  const isOngoing = status === "ONGOING";

  return (
    <div className="p-6 sm:p-7 bg-white border border-slate-200/90 rounded-xl hover:border-slate-300 hover:shadow-xs transition-all space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
            isOngoing
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          {isOngoing ? "Active / Ongoing" : "Completed"}
        </span>

        {startDate && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {startDate} {endDate ? `– ${endDate}` : "– Present"}
            </span>
          </div>
        )}
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
        {projectUrl ? (
          <a
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-800 transition-colors"
          >
            {title}
          </a>
        ) : (
          title
        )}
      </h3>

      <p className="text-sm text-slate-700 leading-relaxed font-medium">
        {shortDescription}
      </p>

      {detailedDescription && (
        <p className="text-sm text-slate-600 leading-relaxed">
          {detailedDescription}
        </p>
      )}

      {/* Metadata footer */}
      <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {fundingAgency && (
          <div className="flex items-start gap-1.5 text-slate-600">
            <Award className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Funding Agency
              </span>
              <span className="font-semibold text-slate-800">{fundingAgency}</span>
            </div>
          </div>
        )}

        <div className="flex items-start gap-1.5 text-slate-600">
          <Briefcase className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Project Role
            </span>
            <span className="font-semibold text-slate-800">{role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
