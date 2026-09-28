"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Save,
  Key,
  CheckCircle,
  AlertCircle,
  Loader2,
  User,
  Mail,
  ShieldCheck,
  Palette,
  ExternalLink,
  Check,
  Sparkles,
  Pin,
  Eye,
  Type,
  Globe,
  Maximize2,
  X,
  BookOpen,
  Award,
  ToggleLeft,
  ToggleRight,
  Layers,
  Settings,
  Compass,
} from "lucide-react";
import {
  ACADEMIC_THEMES,
  DEFAULT_THEME_ID,
  ACADEMIC_FONT_STYLES,
  DEFAULT_FONT_STYLE_ID,
  getTheme,
  getFontStyle,
} from "@/lib/themes";
import Link from "next/link";

function AdminSettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");

  // Active tab: "themes" | "typography" | "general" | "all"
  const [activeTab, setActiveTab] = useState<"themes" | "typography" | "general" | "all">(
    tabParam === "typography" ? "typography" : tabParam === "general" ? "general" : tabParam === "all" ? "all" : "themes"
  );

  useEffect(() => {
    if (tabParam === "typography" || tabParam === "general" || tabParam === "all" || tabParam === "themes") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (newTab: "themes" | "typography" | "general" | "all") => {
    setActiveTab(newTab);
    router.push(`/admin/settings?tab=${newTab}`);
  };

  const [settings, setSettings] = useState<any>({
    siteTitle: "",
    siteDescription: "",
    contactEmail: "",
    footerText: "",
    theme: DEFAULT_THEME_ID,
    fontStyle: DEFAULT_FONT_STYLE_ID,
    enableNews: true,
    enableStudents: true,
  });

  // Database-persisted active selections
  const [selectedTheme, setSelectedTheme] = useState<string>(DEFAULT_THEME_ID);
  const [selectedFont, setSelectedFont] = useState<string>(DEFAULT_FONT_STYLE_ID);

  // Interactive Live Preview tester selections
  const [previewThemeId, setPreviewThemeId] = useState<string>(DEFAULT_THEME_ID);
  const [previewFontId, setPreviewFontId] = useState<string>(DEFAULT_FONT_STYLE_ID);
  const [isModalPreviewOpen, setIsModalPreviewOpen] = useState(false);

  const [themeFilter, setThemeFilter] = useState<string>("all");
  const [fontFilter, setFontFilter] = useState<string>("all");
  const [applyingTheme, setApplyingTheme] = useState(false);
  const [applyingFont, setApplyingFont] = useState(false);
  const [savingCombination, setSavingCombination] = useState(false);

  // Admin account security states
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((d) => {
        if (d.settings) {
          setSettings(d.settings);
          if (d.settings.theme) {
            setSelectedTheme(d.settings.theme);
            setPreviewThemeId(d.settings.theme);
          }
          if (d.settings.fontStyle) {
            setSelectedFont(d.settings.fontStyle);
            setPreviewFontId(d.settings.fontStyle);
          }
        }
        if (d.adminEmail) setAdminEmail(d.adminEmail);
        if (d.adminName) setAdminName(d.adminName);
      })
      .finally(() => setLoading(false));
  }, []);

  // 1-Click Apply for Color Theme
  const applyThemeDirectly = async (themeId: string) => {
    setSelectedTheme(themeId);
    setPreviewThemeId(themeId);
    setApplyingTheme(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          theme: themeId,
          fontStyle: selectedFont,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update theme");

      setSettings((prev: any) => ({ ...prev, theme: themeId }));
      const themeObj = getTheme(themeId);
      const fontObj = getFontStyle(selectedFont);
      setFeedback({
        type: "success",
        text: `🎨 Color palette "${themeObj.name}" applied live! Paired with font "${fontObj.name}". Public portal updated.`,
      });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to apply theme" });
    } finally {
      setApplyingTheme(false);
    }
  };

  // 1-Click Apply for Font Style
  const applyFontDirectly = async (fontId: string) => {
    setSelectedFont(fontId);
    setPreviewFontId(fontId);
    setApplyingFont(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          theme: selectedTheme,
          fontStyle: fontId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update font style");

      setSettings((prev: any) => ({ ...prev, fontStyle: fontId }));
      const fontObj = getFontStyle(fontId);
      const themeObj = getTheme(selectedTheme);
      setFeedback({
        type: "success",
        text: `🔤 Typography "${fontObj.name}" applied live! Paired with palette "${themeObj.name}". Public portal updated.`,
      });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to apply font style" });
    } finally {
      setApplyingFont(false);
    }
  };

  // Apply Previewed Combination (Both Theme + Font) Live
  const applyCombination = async (themeId: string, fontId: string) => {
    setSavingCombination(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          theme: themeId,
          fontStyle: fontId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update combination");

      setSelectedTheme(themeId);
      setSelectedFont(fontId);
      setSettings((prev: any) => ({ ...prev, theme: themeId, fontStyle: fontId }));
      const themeObj = getTheme(themeId);
      const fontObj = getFontStyle(fontId);
      setFeedback({
        type: "success",
        text: `✨ Active Combination Updated Live: [${themeObj.name}] + [${fontObj.name}]!`,
      });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to apply combination" });
    } finally {
      setSavingCombination(false);
    }
  };

  const handleSaveTextSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    if (newPassword) {
      if (newPassword.length < 8) {
        setFeedback({ type: "error", text: "New password must be at least 8 characters long." });
        setSaving(false);
        return;
      }
      const hasLetter = /[a-zA-Z]/.test(newPassword);
      const hasNumber = /[0-9]/.test(newPassword);
      if (!hasLetter || !hasNumber) {
        setFeedback({ type: "error", text: "New password must contain both letters and numbers." });
        setSaving(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setFeedback({ type: "error", text: "New passwords do not match." });
        setSaving(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          theme: selectedTheme,
          fontStyle: selectedFont,
          adminName: adminName || undefined,
          adminEmail: adminEmail || undefined,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update settings");

      setFeedback({
        type: "success",
        text: data.message || "Website configuration and administrator security saved successfully!",
      });
      if (data.adminEmail) setAdminEmail(data.adminEmail);
      if (data.adminName) setAdminName(data.adminName);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  };

  const themeList = Object.values(ACADEMIC_THEMES);
  const filteredThemes = themeList.filter((t) => {
    if (themeFilter === "all") return true;
    if (themeFilter === "pinned") return t.isPinned;
    return t.category === themeFilter;
  });

  const fontList = Object.values(ACADEMIC_FONT_STYLES);
  const filteredFonts = fontList.filter((f) => {
    if (fontFilter === "all") return true;
    return f.category === fontFilter;
  });

  // Objects for active database settings
  const activeThemeObj = getTheme(selectedTheme);
  const activeFontObj = getFontStyle(selectedFont);

  // Objects for interactive live preview sandbox
  const previewThemeObj = getTheme(previewThemeId);
  const previewFontObj = getFontStyle(previewFontId);
  const isPreviewDifferentFromActive =
    previewThemeId !== selectedTheme || previewFontId !== selectedFont;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Website Settings & Appearance"
        subtitle="Configure your live academic theme, typography styles, and website content."
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-5xl">
        {feedback && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* CLEAN UNIFIED TOP STATUS BAR (No bulky boxes, single clean row) */}
        {/* ============================================================== */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-700 text-white shadow-xs shrink-0">
              <Sparkles className="w-4 h-4" />
            </span>
            <div className="space-y-0.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Live Public Website Combination
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                  <Palette className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{activeThemeObj.name}</span>
                </span>
                <span className="text-slate-400 text-xs font-bold">+</span>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200"
                  style={{ fontFamily: activeFontObj.headingFont }}
                >
                  <Type className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{activeFontObj.name}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Global Launchers (Design Explorer & Fullscreen Preview) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsModalPreviewOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
            >
              <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Fullscreen Preview</span>
            </button>

            <Link
              href="/design-preview"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-2xs"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Design Explorer</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CLEAN SEGMENTED TABS (Instant Switch Without Redundancy)       */}
        {/* ============================================================== */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => handleTabChange("themes")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "themes"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>1. Color &amp; Themes (30)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("typography")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "typography"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>2. Typography &amp; Fonts (30)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("general")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "general"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>3. Website Info &amp; Text</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("all")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>View All</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* SECTION 1: WEBSITE THEME & COLOR PALETTE (30 CURATED DESIGNS)  */}
        {/* Clean, un-cluttered layout without duplicate buttons/badges    */}
        {/* ============================================================== */}
        {(activeTab === "themes" || activeTab === "all") && (
          <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-emerald-700" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Section 1: Academic Color Themes
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    30 Palettes
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-0.5">
                  Click &ldquo;Live Preview&rdquo; on any palette to test it below, or &ldquo;Apply (1-Click)&rdquo; to publish.
                </p>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: "all", label: "All (30)" },
                  { id: "pinned", label: "📌 Pinned (2)" },
                  { id: "Archival & Editorial", label: "Archival (5)" },
                  { id: "Prestigious Universities", label: "Universities (6)" },
                  { id: "Modern Minimalist", label: "Minimalist (5)" },
                  { id: "Earth & Nature", label: "Nature (6)" },
                  { id: "Scholarly Night", label: "🌙 Dark (8)" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setThemeFilter(f.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      themeFilter === f.id
                        ? "bg-slate-900 text-white shadow-2xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Streamlined Live Preview Sandbox for Section 1 */}
            <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-800">
                    Interactive Live Preview:
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                    {previewThemeObj.name}
                  </span>
                </div>

                <div>
                  {isPreviewDifferentFromActive ? (
                    <button
                      type="button"
                      onClick={() => applyCombination(previewThemeId, previewFontId)}
                      disabled={savingCombination}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
                    >
                      {savingCombination ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      <span>Apply This Palette Live</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      <Check className="w-3 h-3" />
                      <span>Currently Live on Website</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Simulated Live Portal Component */}
              <div
                className="rounded-xl p-4 sm:p-5 border transition-all duration-200 shadow-2xs space-y-3"
                style={{
                  backgroundColor: previewThemeObj.cssVars.bgCanvas,
                  borderColor: previewThemeObj.cssVars.borderColor,
                  color: previewThemeObj.cssVars.textMain,
                }}
              >
                <div className="flex items-center justify-between pb-2.5 border-b" style={{ borderColor: previewThemeObj.cssVars.borderColor }}>
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white"
                      style={{ backgroundColor: previewThemeObj.cssVars.accentPrimary }}
                    >
                      AR
                    </div>
                    <div>
                      <div className="font-bold text-xs leading-none" style={{ fontFamily: previewFontObj.headingFont }}>
                        Dr. Abhishek Rajput
                      </div>
                      <div className="text-[10px]" style={{ color: previewThemeObj.cssVars.textMuted }}>
                        IIT Indore • Department of Mechanical Engineering
                      </div>
                    </div>
                  </div>

                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: previewThemeObj.cssVars.badgeBg,
                      color: previewThemeObj.cssVars.badgeText,
                    }}
                  >
                    {previewThemeObj.category}
                  </span>
                </div>

                <div
                  className="p-3.5 rounded-lg border transition-all"
                  style={{
                    backgroundColor: previewThemeObj.cssVars.bgCard,
                    borderColor: previewThemeObj.cssVars.borderColor,
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: previewThemeObj.cssVars.accentSubtle,
                        color: previewThemeObj.cssVars.accentPrimary,
                      }}
                    >
                      Sample Publication
                    </span>
                    <span className="text-[10px]" style={{ color: previewThemeObj.cssVars.textMuted }}>
                      Int. J. Impact Eng. (2024)
                    </span>
                  </div>

                  <h4
                    className="font-bold text-sm leading-snug mt-1"
                    style={{
                      fontFamily: previewFontObj.headingFont,
                      color: previewThemeObj.cssVars.textMain,
                    }}
                  >
                    Dynamic Failure and Ballistic Impact Response of 3D Woven Composites
                  </h4>

                  <p
                    className="text-xs mt-1 leading-relaxed"
                    style={{
                      fontFamily: previewFontObj.bodyFont,
                      color: previewThemeObj.cssVars.textMuted,
                    }}
                  >
                    Investigating high-velocity impact dynamics using explicit non-linear finite element formulations and Kolsky bar high-strain-rate experiments.
                  </p>
                </div>
              </div>
            </div>

            {/* Theme Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
              {filteredThemes.map((t) => {
                const isLive = selectedTheme === t.id;
                const isPreviewing = previewThemeId === t.id;

                return (
                  <div
                    key={t.id}
                    onClick={() => setPreviewThemeId(t.id)}
                    className={`relative p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                      isLive
                        ? "border-emerald-600 bg-emerald-50/20 shadow-xs ring-2 ring-emerald-600/30"
                        : isPreviewing
                        ? "border-blue-500 bg-blue-50/20 shadow-2xs ring-2 ring-blue-400/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5">
                          {t.isPinned && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              <Pin className="w-2.5 h-2.5" />
                              <span>Pinned</span>
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                            {t.category.split(" ")[0]}
                          </span>
                        </div>

                        {isLive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                            <Check className="w-3 h-3" />
                            <span>Live</span>
                          </span>
                        ) : isPreviewing ? (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                            <Eye className="w-2.5 h-2.5" />
                            <span>Testing</span>
                          </span>
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                        )}
                      </div>

                      <h3 className="font-bold text-xs text-slate-900 leading-tight">
                        {t.name}
                      </h3>

                      {/* Swatch */}
                      <div className="p-2 rounded-lg border border-slate-200/80 bg-slate-50 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-4 h-4 rounded border border-slate-300/80 shadow-2xs"
                            style={{ backgroundColor: t.swatch.canvas }}
                            title={`Canvas: ${t.swatch.canvas}`}
                          />
                          <div
                            className="w-4 h-4 rounded border border-slate-300/80 shadow-2xs"
                            style={{ backgroundColor: t.swatch.card }}
                            title={`Card: ${t.swatch.card}`}
                          />
                        </div>
                        <div
                          className="px-2 py-0.5 rounded text-[9px] font-bold text-white shadow-2xs"
                          style={{ backgroundColor: t.swatch.accent }}
                        >
                          Accent
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
                        {t.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewThemeId(t.id);
                        }}
                        className="flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-slate-500" />
                        <span>Preview</span>
                      </button>

                      <button
                        type="button"
                        disabled={applyingTheme}
                        onClick={(e) => {
                          e.stopPropagation();
                          applyThemeDirectly(t.id);
                        }}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                          isLive
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                      >
                        {isLive ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <span>Apply</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 2: TYPOGRAPHY & FONT STYLE (30 CURATED ACADEMIC)       */}
        {/* Clean, un-cluttered layout without duplicate buttons/badges    */}
        {/* ============================================================== */}
        {(activeTab === "typography" || activeTab === "all") && (
          <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-emerald-700" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Section 2: Typography &amp; Font Pairings
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    30 Font Styles
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-0.5">
                  Click &ldquo;Live Preview&rdquo; on any typography style to test hierarchy and readability below.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "all", label: "All (30)" },
                  { id: "Classical Serif", label: "Classical (8)" },
                  { id: "Contemporary Serif", label: "Contemporary (8)" },
                  { id: "Modern Technical Sans", label: "STEM Sans (8)" },
                  { id: "Monospace & Architectural", label: "Monospace (6)" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFontFilter(f.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      fontFilter === f.id
                        ? "bg-slate-900 text-white shadow-2xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Streamlined Live Typography Sandbox for Section 2 */}
            <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-800">
                    Typeface Specimen:
                  </span>
                  <span
                    className="text-xs font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs"
                    style={{ fontFamily: previewFontObj.headingFont }}
                  >
                    {previewFontObj.name}
                  </span>
                </div>

                <div>
                  {previewFontId !== selectedFont ? (
                    <button
                      type="button"
                      onClick={() => applyCombination(selectedTheme, previewFontId)}
                      disabled={savingCombination}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
                    >
                      {savingCombination ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      <span>Apply This Font Live</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      <Check className="w-3 h-3" />
                      <span>Currently Live on Website</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Typography Specimen Box */}
              <div
                className="rounded-xl p-4 sm:p-5 border transition-all duration-200 shadow-2xs space-y-2.5"
                style={{
                  backgroundColor: previewThemeObj.cssVars.bgCanvas,
                  borderColor: previewThemeObj.cssVars.borderColor,
                  color: previewThemeObj.cssVars.textMain,
                }}
              >
                <div>
                  <h1
                    className="text-xl sm:text-2xl font-bold tracking-tight"
                    style={{ fontFamily: previewFontObj.headingFont }}
                  >
                    Dr. Abhishek Rajput
                  </h1>
                  <h2
                    className="text-xs sm:text-sm font-semibold italic mt-0.5"
                    style={{
                      fontFamily: previewFontObj.headingFont,
                      color: previewThemeObj.cssVars.textMuted,
                    }}
                  >
                    Structural &amp; Impact Mechanics Laboratory • IIT Indore
                  </h2>
                </div>

                <div
                  className="p-3 rounded-lg border"
                  style={{
                    backgroundColor: previewThemeObj.cssVars.bgCard,
                    borderColor: previewThemeObj.cssVars.borderColor,
                  }}
                >
                  <p
                    className="text-xs leading-relaxed"
                    style={{
                      fontFamily: previewFontObj.bodyFont,
                      color: previewThemeObj.cssVars.textMain,
                    }}
                  >
                    &ldquo;Our laboratory investigates the fundamental mechanics governing high-velocity impact, adiabatic shear band formation, and dynamic fracture phenomena under extreme loading regimes in advanced heterogeneous alloys and 3D woven metamaterials.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Font Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
              {filteredFonts.map((f) => {
                const isLive = selectedFont === f.id;
                const isPreviewing = previewFontId === f.id;

                return (
                  <div
                    key={f.id}
                    onClick={() => setPreviewFontId(f.id)}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                      isLive
                        ? "border-emerald-600 bg-emerald-50/20 shadow-xs ring-2 ring-emerald-600/30"
                        : isPreviewing
                        ? "border-blue-500 bg-blue-50/20 shadow-2xs ring-2 ring-blue-400/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {f.category}
                        </span>
                        {isLive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                            <Check className="w-3 h-3" />
                            <span>Live</span>
                          </span>
                        ) : isPreviewing ? (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                            <Eye className="w-2.5 h-2.5" />
                            <span>Testing</span>
                          </span>
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                        )}
                      </div>

                      <div>
                        <h3
                          className="font-bold text-sm text-slate-900 leading-tight"
                          style={{ fontFamily: f.headingFont }}
                        >
                          {f.name}
                        </h3>
                        <span className="text-[10px] font-medium text-emerald-800">
                          {f.tag}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg border border-slate-200/90 bg-slate-50 space-y-0.5">
                        <div
                          className="text-sm font-bold text-slate-900 leading-snug"
                          style={{ fontFamily: f.headingFont }}
                        >
                          Dr. Abhishek Rajput
                        </div>
                        <div
                          className="text-[11px] text-slate-600 italic"
                          style={{ fontFamily: f.headingFont }}
                        >
                          Impact Mechanics Lab
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
                        {f.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewFontId(f.id);
                        }}
                        className="flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-slate-500" />
                        <span>Preview</span>
                      </button>

                      <button
                        type="button"
                        disabled={applyingFont}
                        onClick={(e) => {
                          e.stopPropagation();
                          applyFontDirectly(f.id);
                        }}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                          isLive
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                      >
                        {isLive ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <span>Apply</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 3: WEBSITE CONFIGURATION & CONTENT ADMINISTRATION      */}
        {/* 3 Distinct Sub-Sections with ZERO Scrolling Required           */}
        {/* ============================================================== */}
        {(activeTab === "general" || activeTab === "all") && (
          <div className="space-y-5">
            <div className="border-b border-slate-200 pb-2.5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Section 3: Website Content &amp; General Configuration
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Edit website identity, public contact channels, and administrator authentication.
              </p>
            </div>

            <form onSubmit={handleSaveTextSettings} className="space-y-5 text-xs">
              {/* -------------------------------------------------------- */}
              {/* SUB-SECTION 3.1: Identity & SEO Metadata                 */}
              {/* -------------------------------------------------------- */}
              <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5">
                  <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                    <Globe className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Sub-section 3.1: Website Identity &amp; SEO
                    </h3>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Website Title / Brand Headline</label>
                    <input
                      type="text"
                      value={settings.siteTitle}
                      onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                      required
                      placeholder="Dr. Abhishek Rajput | IIT Indore"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Meta Description (SEO)</label>
                    <textarea
                      value={settings.siteDescription || ""}
                      onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                      rows={2}
                      placeholder="Official academic portal of Dr. Abhishek Rajput, Associate Professor at IIT Indore."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Footer Copyright Notice</label>
                    <input
                      type="text"
                      value={settings.footerText || ""}
                      onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                      placeholder="© 2026 Dr. Abhishek Rajput. All rights reserved."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* SUB-SECTION 3.2: Contact & Portal Modules                */}
              {/* -------------------------------------------------------- */}
              <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5">
                  <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Sub-section 3.2: Contact &amp; Feature Modules
                    </h3>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Official Public Contact Email</label>
                    <input
                      type="email"
                      value={settings.contactEmail || ""}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      placeholder="abhishekrajput@iiti.ac.in"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setSettings({ ...settings, enableNews: !settings.enableNews })}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                        settings.enableNews
                          ? "border-emerald-500 bg-emerald-50/20"
                          : "border-slate-200 bg-slate-50 opacity-70"
                      }`}
                    >
                      <span className="mt-0.5">
                        {settings.enableNews ? (
                          <ToggleRight className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <ToggleLeft className="w-4 h-4 text-slate-400" />
                        )}
                      </span>
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-800 text-xs">
                          News &amp; Updates Page
                        </div>
                        <p className="text-[10px] text-slate-500 leading-snug">
                          Publish announcements and call for papers.
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => setSettings({ ...settings, enableStudents: !settings.enableStudents })}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                        settings.enableStudents
                          ? "border-emerald-500 bg-emerald-50/20"
                          : "border-slate-200 bg-slate-50 opacity-70"
                      }`}
                    >
                      <span className="mt-0.5">
                        {settings.enableStudents ? (
                          <ToggleRight className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <ToggleLeft className="w-4 h-4 text-slate-400" />
                        )}
                      </span>
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-800 text-xs">
                          Research Group &amp; Lab Page
                        </div>
                        <p className="text-[10px] text-slate-500 leading-snug">
                          Directory of scholars and alumni profiles.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* SUB-SECTION 3.3: Administrator Identity & Security       */}
              {/* -------------------------------------------------------- */}
              <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5">
                  <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Sub-section 3.3: Administrator Account &amp; Security
                    </h3>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Admin Display Name</span>
                      </label>
                      <input
                        type="text"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        placeholder="Dr. Abhishek Rajput"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>Admin Login Email</span>
                      </label>
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="abhishekrajput@iiti.ac.in"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 space-y-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          Current Password{" "}
                          <span className="text-slate-400 font-normal">
                            (Required only to change login credentials)
                          </span>
                        </span>
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full max-w-md px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">
                          New Password <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min 8 chars, letters &amp; numbers"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat new password"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Master Save Button for Section 3 Text Parameters */}
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 text-xs"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save All Website Settings</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* FULLSCREEN / MODAL LIVE PREVIEW COMPONENT                      */}
      {/* ============================================================== */}
      {isModalPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-700">
            {/* Modal Header */}
            <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm">
                    Interactive Live Preview Tester
                  </h3>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>Palette: <strong className="text-white">{previewThemeObj.name}</strong></span>
                    <span>•</span>
                    <span>Typography: <strong className="text-white">{previewFontObj.name}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    applyCombination(previewThemeId, previewFontId);
                    setIsModalPreviewOpen(false);
                  }}
                  disabled={savingCombination}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  {savingCombination ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Apply Combination Live</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalPreviewOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Palette & Font Switcher inside modal */}
            <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold text-[11px]">Test Color Palette:</span>
                <select
                  value={previewThemeId}
                  onChange={(e) => setPreviewThemeId(e.target.value)}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded-md text-slate-800 text-xs font-medium focus:outline-none"
                >
                  {themeList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold text-[11px]">Test Font Style:</span>
                <select
                  value={previewFontId}
                  onChange={(e) => setPreviewFontId(e.target.value)}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded-md text-slate-800 text-xs font-medium focus:outline-none"
                >
                  {fontList.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Body: High-Fidelity Mockup */}
            <div
              className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6"
              style={{
                backgroundColor: previewThemeObj.cssVars.bgCanvas,
                color: previewThemeObj.cssVars.textMain,
              }}
            >
              {/* Simulated Navigation Bar */}
              <div
                className="flex items-center justify-between pb-4 border-b"
                style={{ borderColor: previewThemeObj.cssVars.borderColor }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-sm"
                    style={{ backgroundColor: previewThemeObj.cssVars.accentPrimary }}
                  >
                    AR
                  </div>
                  <div>
                    <div
                      className="font-bold text-base leading-tight"
                      style={{ fontFamily: previewFontObj.headingFont }}
                    >
                      Dr. Abhishek Rajput
                    </div>
                    <div className="text-xs" style={{ color: previewThemeObj.cssVars.textMuted }}>
                      Associate Professor • IIT Indore
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-xs font-semibold" style={{ color: previewThemeObj.cssVars.textMuted }}>
                  <span style={{ color: previewThemeObj.cssVars.accentPrimary }} className="underline decoration-2 underline-offset-4">
                    Research
                  </span>
                  <span>Publications (7)</span>
                  <span>Sponsored Grants</span>
                  <span>Teaching</span>
                  <span>Lab Group</span>
                </div>
              </div>

              {/* Hero Banner Mockup */}
              <div
                className="p-6 rounded-2xl border shadow-xs space-y-3"
                style={{
                  backgroundColor: previewThemeObj.cssVars.bgCard,
                  borderColor: previewThemeObj.cssVars.borderColor,
                }}
              >
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: previewThemeObj.cssVars.badgeBg,
                    color: previewThemeObj.cssVars.badgeText,
                  }}
                >
                  Structural &amp; Impact Mechanics Laboratory
                </span>

                <h1
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight"
                  style={{ fontFamily: previewFontObj.headingFont }}
                >
                  High-Strain-Rate Dynamics &amp; Shock Wave Penetration
                </h1>

                <p
                  className="text-sm leading-relaxed max-w-2xl"
                  style={{
                    fontFamily: previewFontObj.bodyFont,
                    color: previewThemeObj.cssVars.textMuted,
                  }}
                >
                  Pioneering experimental and computational research in ballistic impact resilience, high-velocity deformation of woven fiber composites, and dynamic mechanical behaviors under extreme environments.
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                    style={{ backgroundColor: previewThemeObj.cssVars.accentPrimary }}
                  >
                    Explore 7 Publications
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl text-xs font-bold border"
                    style={{
                      borderColor: previewThemeObj.cssVars.borderColor,
                      color: previewThemeObj.cssVars.textMain,
                      backgroundColor: previewThemeObj.cssVars.bgSubtle,
                    }}
                  >
                    Contact Lab
                  </button>
                </div>
              </div>

              {/* Research Grid Mockup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className="p-4 rounded-xl border space-y-2"
                  style={{
                    backgroundColor: previewThemeObj.cssVars.bgCard,
                    borderColor: previewThemeObj.cssVars.borderColor,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg" style={{ backgroundColor: previewThemeObj.cssVars.accentSubtle, color: previewThemeObj.cssVars.accentPrimary }}>
                      <BookOpen className="w-4 h-4" />
                    </span>
                    <h4 className="font-bold text-sm" style={{ fontFamily: previewFontObj.headingFont }}>
                      Ballistic Penetration Mechanics
                    </h4>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ fontFamily: previewFontObj.bodyFont, color: previewThemeObj.cssVars.textMuted }}>
                    Explicit 3D finite element simulation and experimental validation with split-Hopkinson pressure bars.
                  </p>
                </div>

                <div
                  className="p-4 rounded-xl border space-y-2"
                  style={{
                    backgroundColor: previewThemeObj.cssVars.bgCard,
                    borderColor: previewThemeObj.cssVars.borderColor,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg" style={{ backgroundColor: previewThemeObj.cssVars.accentSubtle, color: previewThemeObj.cssVars.accentPrimary }}>
                      <Award className="w-4 h-4" />
                    </span>
                    <h4 className="font-bold text-sm" style={{ fontFamily: previewFontObj.headingFont }}>
                      Sponsored Research Grants
                    </h4>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ fontFamily: previewFontObj.bodyFont, color: previewThemeObj.cssVars.textMuted }}>
                    ₹1.45+ Crores in active grants from DST-SERB, ARDB, and ISRO for aerospace defense structures.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                You can try all 30 themes × 30 fonts (900 combinations) in real time.
              </span>
              <button
                type="button"
                onClick={() => setIsModalPreviewOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-12">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
      }
    >
      <AdminSettingsContent />
    </Suspense>
  );
}
