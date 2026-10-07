export const dynamic = "force-dynamic";

import React from "react";
import type { Metadata } from "next";
import { getPublicProfile } from "@/services/academic-service";
import SectionHeader from "@/components/public/SectionHeader";
import { GraduationCap, Briefcase, Download, MapPin, Mail, Building, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "About & Academic Background",
  description:
    "Biography, education, academic appointments, and research trajectory of Dr. Abhishek Rajput at IIT Indore.",
};

export default async function AboutPage() {
  const { profile, education, positions } = await getPublicProfile();

  const paragraphs = profile?.bio ? profile.bio.split("\n\n") : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="border-b border-slate-200 pb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          Faculty Profile
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          Biography & Academic Record
        </h1>
        <p className="text-slate-600 text-base mt-2 max-w-3xl">
          Complete curriculum overview, educational training, and professional appointments in structural and impact mechanics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Portrait & Affiliations Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-5">
            <div className="w-48 h-56 sm:w-full sm:h-72 mx-auto rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white">
                  <GraduationCap className="w-16 h-16 text-slate-400" />
                </div>
              )}
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-slate-900">{profile?.name}</h2>
              <p className="text-sm font-semibold text-emerald-800">{profile?.designation}</p>
              <p className="text-xs text-slate-500">{profile?.department}</p>
              <p className="text-xs font-medium text-slate-700">{profile?.institution}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{profile?.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                <a href={`mailto:${profile?.email}`} className="hover:text-slate-900 underline">
                  {profile?.email}
                </a>
              </div>
            </div>

            {profile?.cvUrl && (
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Curriculum Vitae (PDF)</span>
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Bio, Academic Positions, Education */}
        <div className="lg:col-span-8 space-y-12">
          {/* Biography Text */}
          <section className="space-y-4 text-slate-700 leading-relaxed">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight border-b border-slate-200 pb-2">
              Academic Biography
            </h3>
            {paragraphs.map((p, idx) => (
              <p key={idx} className="text-base leading-relaxed">
                {p}
              </p>
            ))}
          </section>

          {/* Academic Positions Timeline */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight border-b border-slate-200 pb-2 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-800" />
              <span>Academic Appointments</span>
            </h3>
            <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6">
              {positions.map((pos) => (
                <div key={pos.id} className="relative group">
                  <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-700 group-hover:bg-emerald-700 transition-colors"></div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      {pos.startYear} – {pos.isCurrent ? "Present" : pos.endYear}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{pos.title}</h4>
                    <p className="text-sm font-medium text-slate-700">{pos.institution}</p>
                    {pos.department && (
                      <p className="text-xs text-slate-500">{pos.department}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education & Training */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight border-b border-slate-200 pb-2 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-800" />
              <span>Education & Academic Credentials</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-5 bg-white border border-slate-200/90 rounded-xl space-y-2 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-base text-emerald-900">
                      {edu.degree}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {edu.year}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 leading-snug">{edu.field}</p>
                  <p className="text-xs text-slate-600">{edu.institution}</p>
                  {edu.location && (
                    <p className="text-[11px] text-slate-400">{edu.location}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
