"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Mail,
  Download,
  ExternalLink,
  ArrowRight,
  MapPin,
  Building,
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowUpRight,
  Check,
  Calendar,
  Pin,
  Sliders,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { ACADEMIC_THEMES, DEFAULT_THEME_ID, ThemeDefinition } from "@/lib/themes";

export default function DesignPreviewPage() {
  const [selectedThemeId, setSelectedThemeId] = useState<string>(DEFAULT_THEME_ID);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [applying, setApplying] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const themeList = Object.values(ACADEMIC_THEMES);
  const filteredThemes = themeList.filter((t) => {
    if (categoryFilter === "all") return true;
    if (categoryFilter === "pinned") return t.isPinned;
    return t.category === categoryFilter;
  });

  const activeTheme = ACADEMIC_THEMES[selectedThemeId] || ACADEMIC_THEMES[DEFAULT_THEME_ID];
  const { cssVars, fontHeading } = activeTheme;

  const handleApplyToLiveSite = async () => {
    setApplying(true);
    setSaveStatus(null);
    try {
      // First fetch current settings to preserve them
      const getRes = await fetch("/api/admin/settings");
      if (!getRes.ok) {
        throw new Error("Please log in to the Faculty Admin CMS to apply changes directly.");
      }
      const data = await getRes.json();
      const currentSettings = data.settings || {};

      const putRes = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentSettings,
          theme: selectedThemeId,
        }),
      });

      const putData = await putRes.json();
      if (!putRes.ok) {
        throw new Error(putData.error || "Failed to update website theme.");
      }

      setSaveStatus({
        type: "success",
        text: `Design "${activeTheme.name}" is now LIVE on the public website!`,
      });
    } catch (err: any) {
      setSaveStatus({
        type: "error",
        text: err.message || "Could not save theme. Make sure you are logged in to /admin.",
      });
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Controller Bar */}
      <div className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                  <Sliders className="w-4 h-4" />
                </span>
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Academic Design Explorer (18 Themes)
                </h1>
                <span className="hidden sm:inline px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  Live Preview
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any palette below to preview instantly. Test archival papers, Ivy League tones, modern minimalists, or dark modes.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleApplyToLiveSite}
                disabled={applying}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {applying ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                )}
                <span>Make Active on Website</span>
              </button>

              <Link
                href="/admin/settings"
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs border border-slate-700 transition-colors flex items-center gap-1"
              >
                <span>Admin CMS</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Feedback Banner */}
          {saveStatus && (
            <div
              className={`mt-2 p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                saveStatus.type === "success"
                  ? "bg-emerald-950/80 text-emerald-200 border border-emerald-700"
                  : "bg-rose-950/80 text-rose-200 border border-rose-700"
              }`}
            >
              {saveStatus.type === "success" ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{saveStatus.text}</span>
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar text-xs">
            {[
              { id: "all", label: `All (18)` },
              { id: "pinned", label: "📌 Pinned (2)" },
              { id: "Archival & Editorial", label: "Archival (4)" },
              { id: "Prestigious Universities", label: "Universities (4)" },
              { id: "Modern Minimalist", label: "Minimalist (4)" },
              { id: "Earth & Nature", label: "Nature (4)" },
              { id: "Scholarly Night", label: "Dark (2)" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-colors shrink-0 ${
                  categoryFilter === cat.id
                    ? "bg-slate-200 text-slate-900"
                    : "bg-slate-800/80 hover:bg-slate-800 text-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Theme Horizontal Selector */}
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar">
            {filteredThemes.map((t) => {
              const isSelected = selectedThemeId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedThemeId(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 shrink-0 transition-all border ${
                    isSelected
                      ? "bg-slate-800 border-emerald-400 text-white shadow-sm ring-1 ring-emerald-400"
                      : "bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center -space-x-1 shrink-0">
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-slate-700"
                      style={{ backgroundColor: t.swatch.canvas }}
                    />
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-slate-700"
                      style={{ backgroundColor: t.swatch.card }}
                    />
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-slate-700"
                      style={{ backgroundColor: t.swatch.accent }}
                    />
                  </div>
                  <span>{t.name}</span>
                  {t.isPinned && <Pin className="w-2.5 h-2.5 text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Preview Canvas Container */}
      <div
        className="flex-1 transition-colors duration-200"
        style={{
          backgroundColor: cssVars.bgCanvas,
          color: cssVars.textMain,
          fontFamily:
            fontHeading === "serif"
              ? 'Georgia, Cambria, "Times New Roman", Times, serif'
              : 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Academic Sub-header Bar */}
        <div
          className="border-b text-xs py-2 px-4 sm:px-8"
          style={{
            backgroundColor: cssVars.bgSubtle,
            borderColor: cssVars.borderColor,
            color: cssVars.textMuted,
          }}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 font-serif text-[11px] sm:text-xs">
              <span className="font-bold tracking-wider uppercase">
                Indian Institute of Technology Indore
              </span>
              <span>•</span>
              <span className="hidden sm:inline">Department of Civil Engineering</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="font-sans px-2 py-0.5 rounded border" style={{ borderColor: cssVars.borderColor, backgroundColor: cssVars.bgCard }}>
                {activeTheme.name}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section
          className="py-12 sm:py-16 border-b"
          style={{
            backgroundColor: cssVars.bgSubtle,
            borderColor: cssVars.borderColor,
          }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-sans font-semibold border"
                  style={{
                    backgroundColor: cssVars.badgeBg,
                    color: cssVars.badgeText,
                    borderColor: cssVars.borderColor,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Faculty Academic Portfolio • Est. 2024</span>
                </div>

                <h1
                  className="text-3xl sm:text-5xl font-extrabold tracking-tight"
                  style={{ color: cssVars.textMain }}
                >
                  Dr. Abhishek Rajput
                </h1>

                <p
                  className="text-lg sm:text-xl font-medium"
                  style={{ color: cssVars.accentPrimary }}
                >
                  Assistant Professor in Civil Engineering
                </p>

                <p
                  className="text-sm sm:text-base leading-relaxed max-w-2xl"
                  style={{ color: cssVars.textMuted }}
                >
                  Investigating structural impact mechanics, ballistic penetration of concrete and metallic targets, high-rate material characterization, and crashworthiness in protective civil and marine infrastructure.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3 font-sans text-xs">
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-lg font-bold text-white shadow-sm flex items-center gap-2 transition-all hover:opacity-90"
                    style={{ backgroundColor: cssVars.accentPrimary }}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CV</span>
                  </button>

                  <button
                    type="button"
                    className="px-4 py-2.5 rounded-lg font-semibold border transition-all"
                    style={{
                      backgroundColor: cssVars.bgCard,
                      borderColor: cssVars.borderColor,
                      color: cssVars.textMain,
                    }}
                  >
                    <Mail className="w-4 h-4 inline mr-1.5" />
                    <span>abhishekrajput@iiti.ac.in</span>
                  </button>
                </div>
              </div>

              {/* Portrait */}
              <div className="md:col-span-4 flex flex-col items-center">
                <div
                  className="w-52 h-64 sm:w-60 sm:h-72 rounded-2xl overflow-hidden border-2 shadow-lg relative"
                  style={{
                    backgroundColor: cssVars.bgCard,
                    borderColor: cssVars.borderColor,
                  }}
                >
                  <img
                    src="/images/Drabhishekrajput.jpg"
                    alt="Dr. Abhishek Rajput"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div
                  className="mt-3 text-xs italic text-center"
                  style={{ color: cssVars.textMuted }}
                >
                  Ph.D. IIT Roorkee • Postdoc PNU South Korea
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Preview Grid: Research Thrusts & Publications */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-14 space-y-12">
          {/* Research Thrusts */}
          <section className="space-y-6">
            <div
              className="flex items-end justify-between pb-3 border-b"
              style={{ borderColor: cssVars.borderColor }}
            >
              <div>
                <span
                  className="text-xs uppercase font-bold tracking-wider font-sans block"
                  style={{ color: cssVars.accentPrimary }}
                >
                  Laboratory Research Focus
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-bold tracking-tight mt-1"
                  style={{ color: cssVars.textMain }}
                >
                  Core Research Thrusts
                </h2>
              </div>
              <span
                className="text-xs font-sans font-semibold flex items-center gap-1"
                style={{ color: cssVars.accentPrimary }}
              >
                <span>4 Active Thrusts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
              {[
                {
                  title: "Structural Impact & Ballistic Penetration",
                  desc: "Investigating perforation mechanics of reinforced concrete, ultra-high-performance concrete, and metallic sandwich panels against projectile impact.",
                },
                {
                  title: "Dynamic Material Characterization",
                  desc: "Constitutive formulation and high-strain-rate material testing using Split Hopkinson Pressure Bar (SHPB) and drop-weight impact apparatus.",
                },
                {
                  title: "Crashworthiness & Energy Absorption",
                  desc: "Design and numerical optimization of thin-walled structural members, metamaterials, and energy-absorbing lattices under dynamic axial crushing.",
                },
                {
                  title: "Computational Blast Mechanics",
                  desc: "High-fidelity finite element and smoothed particle hydrodynamics (SPH) modeling of explosive blast interactions with critical structures.",
                },
              ].map((area, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl border shadow-xs space-y-2 transition-all hover:shadow-sm"
                  style={{
                    backgroundColor: cssVars.bgCard,
                    borderColor: cssVars.borderColor,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold"
                      style={{
                        backgroundColor: cssVars.badgeBg,
                        color: cssVars.badgeText,
                      }}
                    >
                      Thrust 0{idx + 1}
                    </span>
                    <span className="text-xs" style={{ color: cssVars.textMuted }}>
                      IIT Indore
                    </span>
                  </div>
                  <h3
                    className="font-bold text-base tracking-tight"
                    style={{ color: cssVars.textMain }}
                  >
                    {area.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: cssVars.textMuted }}
                  >
                    {area.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Publications Preview */}
          <section className="space-y-6">
            <div
              className="flex items-end justify-between pb-3 border-b"
              style={{ borderColor: cssVars.borderColor }}
            >
              <div>
                <span
                  className="text-xs uppercase font-bold tracking-wider font-sans block"
                  style={{ color: cssVars.accentPrimary }}
                >
                  Scholarly Works
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-bold tracking-tight mt-1"
                  style={{ color: cssVars.textMain }}
                >
                  Featured Peer-Reviewed Publications
                </h2>
              </div>
              <span
                className="text-xs font-sans font-semibold flex items-center gap-1"
                style={{ color: cssVars.accentPrimary }}
              >
                <span>View All 7 Publications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="space-y-4 font-sans">
              {[
                {
                  year: 2024,
                  type: "Journal Article",
                  title: "Ballistic performance of target configuration against projectile impact: Experimental and numerical investigations",
                  journal: "International Journal of Impact Engineering, Elsevier",
                  authors: "Rajput, A., & Iqbal, M. A.",
                },
                {
                  year: 2023,
                  type: "Journal Article",
                  title: "Energy absorption behavior of double-cell thin-walled tubes under dynamic crushing",
                  journal: "Thin-Walled Structures, Elsevier",
                  authors: "Rajput, A., Kumar, P., & Cho, S. R.",
                },
                {
                  year: 2022,
                  type: "Conference Paper",
                  title: "Penetration depth assessment in ultra-high-performance concrete targets under ogive-nosed projectile impact",
                  journal: "14th International Conference on Shock & Impact Mechanics",
                  authors: "Rajput, A., & Iqbal, M. A.",
                },
              ].map((pub, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border shadow-xs space-y-2 transition-all hover:shadow-sm"
                  style={{
                    backgroundColor: cssVars.bgCard,
                    borderColor: cssVars.borderColor,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-bold border"
                      style={{
                        backgroundColor: cssVars.bgSubtle,
                        borderColor: cssVars.borderColor,
                        color: cssVars.textMain,
                      }}
                    >
                      {pub.year}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-medium"
                      style={{
                        backgroundColor: cssVars.badgeBg,
                        color: cssVars.badgeText,
                      }}
                    >
                      {pub.type}
                    </span>
                  </div>

                  <h3
                    className="font-bold text-sm sm:text-base leading-snug"
                    style={{ color: cssVars.textMain }}
                  >
                    {pub.title}
                  </h3>

                  <p className="text-xs" style={{ color: cssVars.textMuted }}>
                    {pub.authors} • <em style={{ color: cssVars.accentPrimary }}>{pub.journal}</em>
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer
          className="border-t py-12 px-4 sm:px-8 text-xs font-sans"
          style={{
            backgroundColor: cssVars.bgSubtle,
            borderColor: cssVars.borderColor,
            color: cssVars.textMuted,
          }}
        >
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-bold block" style={{ color: cssVars.textMain }}>
                Dr. Abhishek Rajput
              </span>
              <span>
                Department of Civil Engineering, Indian Institute of Technology Indore
              </span>
            </div>
            <div className="text-center sm:text-right">
              <span>© {new Date().getFullYear()} All academic rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}