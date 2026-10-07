import React from "react";
import type { Metadata } from "next";
import { getPublicProfile } from "@/services/academic-service";
import EmptyState from "@/components/public/EmptyState";
import { Download, FileText, Calendar, ExternalLink, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Curriculum Vitae",
  description:
    "Official Curriculum Vitae of Dr. Abhishek Rajput, Department of Civil Engineering, IIT Indore.",
};

export const dynamic = "force-dynamic";

export default async function CVPage() {
  const { profile, education, positions } = await getPublicProfile();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Curriculum Vitae
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Academic Record & Resume
          </h1>
          <p className="text-sm text-slate-600">
            {profile?.name} • {profile?.designation}, {profile?.institution}
          </p>
        </div>

        {profile?.cvUrl && (
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <a
              href={profile.cvUrl}
              target="_blank"
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download CV (PDF)</span>
            </a>
            {profile.cvUpdatedAt && (
              <span className="text-xs text-slate-400">
                Last updated: {new Date(profile.cvUpdatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
          </div>
        )}
      </div>

      {profile?.cvUrl ? (
        <div className="space-y-8">
          {/* Embedded PDF Viewer */}
          <div className="bg-slate-100 p-2 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-inner">
              <iframe
                src={`${profile.cvUrl}#toolbar=0&navpanes=0`}
                className="w-full h-[700px] sm:h-[850px]"
                title="Curriculum Vitae"
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-2">
              <span>Having trouble viewing the PDF document above?</span>
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
              >
                <span>Open in Full Browser Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          title="CV document will be uploaded shortly"
          message="The professor's formal curriculum vitae PDF is currently being updated."
          icon={<FileText className="w-6 h-6" />}
        />
      )}
    </div>
  );
}
