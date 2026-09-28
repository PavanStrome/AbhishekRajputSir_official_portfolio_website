import React from "react";
import Link from "next/link";
import { BookOpen, Layers, ArrowRight } from "lucide-react";

interface ResearchCardProps {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  keywords?: string | null;
  publicationsCount?: number;
  recentPublications?: Array<{
    id: string;
    title: string;
    year: number;
    venue: string;
  }>;
}

export default function ResearchCard({
  title,
  slug,
  summary,
  description,
  keywords,
  recentPublications,
}: ResearchCardProps) {
  const keywordList = keywords ? keywords.split(",").map((k) => k.trim()) : [];

  return (
    <div className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-xl hover:border-slate-300 hover:shadow-xs transition-all space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm mb-2 border border-emerald-100">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
        </div>
      </div>

      <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
        {summary}
      </p>

      <p className="text-sm text-slate-600 leading-relaxed">
        {description}
      </p>

      {/* Keywords */}
      {keywordList.length > 0 && (
        <div className="pt-2">
          <div className="flex flex-wrap gap-1.5">
            {keywordList.map((kw, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200/60"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Associated papers if provided */}
      {recentPublications && recentPublications.length > 0 && (
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Selected Papers in this Area:
          </span>
          <div className="space-y-1.5">
            {recentPublications.map((pub) => (
              <div key={pub.id} className="text-xs text-slate-700 flex items-start gap-1.5">
                <span className="text-emerald-700 font-semibold">•</span>
                <span>
                  <strong className="font-semibold text-slate-900">{pub.title}</strong>{" "}
                  <span className="text-slate-500 italic">({pub.venue}, {pub.year})</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
