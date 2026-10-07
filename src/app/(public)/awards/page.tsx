import React from "react";
import type { Metadata } from "next";
import { getPublicAwards } from "@/services/academic-service";
import EmptyState from "@/components/public/EmptyState";
import { Award, BookmarkCheck, ExternalLink, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Honors, Awards & Fellowships",
  description:
    "Competitive fellowships, scientific recognitions, and research grants awarded to Dr. Abhishek Rajput.",
};

export const dynamic = "force-dynamic";

export default async function AwardsPage() {
  const awards = await getPublicAwards();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="border-b border-slate-200 pb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          Recognitions & Distinctions
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          Honors, Awards & Fellowships
        </h1>
        <p className="text-slate-600 text-base mt-2 max-w-3xl leading-relaxed">
          National and international research fellowships, ministry grants, and academic recognitions for contributions to structural and impact mechanics.
        </p>
      </div>

      {awards.length > 0 ? (
        <div className="max-w-4xl space-y-6">
          {awards.map((award) => (
            <div
              key={award.id}
              className="p-6 sm:p-7 bg-white border border-slate-200/90 rounded-xl hover:border-slate-300 hover:shadow-xs transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold text-emerald-900 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-100">
                  {award.year}
                </span>

                {award.isFeatured && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200/60">
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>Distinguished Honor</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {award.title}
              </h2>

              <p className="text-sm font-medium text-slate-700">
                {award.organization}
              </p>

              {award.description && (
                <p className="text-sm text-slate-600 leading-relaxed pt-1">
                  {award.description}
                </p>
              )}

              {award.certificateUrl && (
                <div className="pt-2 border-t border-slate-100">
                  <a
                    href={award.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
                  >
                    <span>View Citation / Document</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Honors and awards will be updated shortly"
          message="Recent fellowships and citations are being compiled."
          icon={<Award className="w-6 h-6" />}
        />
      )}
    </div>
  );
}
