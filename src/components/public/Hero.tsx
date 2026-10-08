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
    <section className="relative hero-wrapper pt-6 pb-12 sm:pt-10 sm:pb-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Professor Portrait / Image (Column 1) */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
            <div className="relative group">
              <div className="w-48 h-56 sm:w-64 sm:h-76 md:w-72 md:h-84 rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200/80 shadow-md transition-shadow duration-200 group-hover:shadow-lg relative">
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
              <div className="mt-3 flex items-center justify-center lg:justify-start gap-1.5 text-xs theme-badge px-3 py-1.5 rounded-full border shadow-xs w-fit mx-auto lg:mx-0">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--accent-text, var(--accent-primary))" }}></span>
                <span className="font-medium">Faculty Member • IIT Indore</span>
              </div>
            </div>
          </div>

          {/* Academic Info & Summary (Column 2) */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-6 text-center lg:text-left">
            <div className="space-y-1.5 sm:space-y-2">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight" style={{ color: "var(--text-main)" }}>
                {name}
              </h1>

              <p className="text-base sm:text-xl font-medium" style={{ color: "var(--accent-text, var(--accent-primary))" }}>
                {designation}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-1 gap-x-3 text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70" />
                  <span>{department}</span>
                </div>
                <span className="opacity-40 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70" />
                  <span className="font-semibold" style={{ color: "var(--text-main)" }}>{institution}</span>
                </div>
              </div>
            </div>

            {/* Short Bio */}
            <p className="text-sm sm:text-lg leading-relaxed max-w-3xl opacity-90 px-1 sm:px-0" style={{ color: "var(--text-main)" }}>
              {shortBio}
            </p>

            {/* Research Keywords */}
            {interestsList.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: "var(--text-muted)" }}>
                  Primary Research Disciplines:
                </span>
                <div className="flex flex-wrap justify-center lg:justify-start gap-1.5">
                  {interestsList.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium rounded-md theme-badge border"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions & Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-3 w-full sm:w-auto">
              <Link
                href="/research"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all hero-primary-btn"
              >
                <span>Explore Research</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg border shadow-xs transition-all hero-secondary-btn"
                >
                  <Download className="w-4 h-4" />
                  <span>Curriculum Vitae</span>
                </a>
              )}

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-100 opacity-80"
                style={{ color: "var(--text-main)" }}
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
