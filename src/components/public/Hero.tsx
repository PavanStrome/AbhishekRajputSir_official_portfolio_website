import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Download, Mail, ArrowRight, GraduationCap, MapPin, Building, ShieldCheck } from "lucide-react";

interface HeroProps {
  name: string;
  designation: string;
  department: string;
  institution: string;
  shortBio: string;
  avatarUrl?: string | null;
  cvUrl?: string | null;
  researchInterests?: string | null;
  googleScholarUrl?: string | null;
  orcidUrl?: string | null;
}

export default function Hero({
  name,
  designation,
  department,
  institution,
  shortBio,
  avatarUrl,
  cvUrl,
  researchInterests,
  googleScholarUrl,
  orcidUrl,
}: HeroProps) {
  const interestsList = researchInterests
    ? researchInterests.split(",").map((s) => s.trim())
    : [];

  return (
    <section className="relative bg-gradient-to-b from-slate-50 to-white border-b border-slate-200/80 pt-10 pb-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Professor Portrait / Image (Column 1) */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
            <div className="relative group">
              <div className="w-56 h-64 sm:w-64 sm:h-76 md:w-72 md:h-84 rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200/80 shadow-md transition-shadow duration-200 group-hover:shadow-lg relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-300">
                    <GraduationCap className="w-20 h-20 text-slate-400 mb-2" />
                    <span className="text-sm font-semibold">{name}</span>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 bg-white/90 px-3 py-1.5 rounded-full border border-slate-200 shadow-xs w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span className="font-medium">Faculty Member • IIT Indore</span>
              </div>
            </div>
          </div>

          {/* Academic Info & Summary (Column 2) */}
          <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Academic Profile</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                {name}
              </h1>

              <p className="text-lg sm:text-xl font-medium text-emerald-800">
                {designation}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-1 gap-x-4 text-sm text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span>{department}</span>
                </div>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-700">{institution}</span>
                </div>
              </div>
            </div>

            {/* Short Bio */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl">
              {shortBio}
            </p>

            {/* Research Keywords */}
            {interestsList.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Primary Research Disciplines:
                </span>
                <div className="flex flex-wrap justify-center lg:justify-start gap-1.5">
                  {interestsList.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-800 border border-slate-200/60"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions & Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link
                href="/research"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
              >
                <span>Explore Research</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg border border-slate-300 shadow-xs hover:border-slate-400 transition-all"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Curriculum Vitae</span>
                </a>
              )}

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Lab</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
