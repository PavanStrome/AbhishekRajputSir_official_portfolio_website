"use client";

import React, { useEffect, useState } from "react";
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
  GraduationCap,
  Layers,
  Sliders,
  Award,
  ArrowRight,
  ToggleLeft,
  ToggleRight,
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

export default function AdminSettingsPage() {
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

  // Interactive Live Preview tester selections (allows real-time testing of any combination)
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

  // 1-Click Apply for Color Theme (preserves current font style)
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
        text: `🎨 Color palette "${themeObj.name}" applied live! Paired with font "${fontObj.name}". The public portal has been instantly updated.`,
      });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to apply theme" });
    } finally {
      setApplyingTheme(false);
    }
  };

  // 1-Click Apply for Font Style (preserves current color theme)
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
        text: `🔤 Typography style "${fontObj.name}" applied live! Paired with palette "${themeObj.name}". The public portal has been instantly updated.`,
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
        text: `✨ Active Combination Updated Live: [${themeObj.name}] + [${fontObj.name}]! The entire public portal has been instantly refreshed.`,
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

    // If attempting to change password or admin credentials
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
        title="Website Settings & Design Architecture"
        subtitle="Manage website visual appearance (30 color themes × 30 font pairings = 900 combinations), live preview sandboxes, and modular content configuration."
      />

      <div className="p-6 sm:p-8 space-y-10 max-w-5xl">
        {feedback && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
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

        {/* Master Combination Status Banner */}
        <div className="p-5 rounded-2xl border-2 border-emerald-600/70 bg-emerald-50/50 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <span className="p-2.5 rounded-xl bg-emerald-700 text-white shadow-xs shrink-0">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                Active Website Combination (Live for Viewers)
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-0.5">
                <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                  <Palette className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{activeThemeObj.name}</span>
                </span>
                <span className="text-slate-400 font-bold text-sm">+</span>
                <span
                  className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs"
                  style={{ fontFamily: activeFontObj.headingFont }}
                >
                  <Type className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{activeFontObj.name}</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Any color palette can be mixed and matched with any font style. You can test live previews in Section 1 and Section 2 below!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsModalPreviewOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-semibold transition-colors shadow-2xs"
            >
              <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fullscreen Live Preview</span>
            </button>

            <Link
              href="/design-preview"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Design Explorer</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 1: WEBSITE THEME & COLOR PALETTE (30 CURATED DESIGNS)  */}
        {/* ============================================================== */}
        <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-emerald-700" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Section 1: Website Theme & Color Palette (30 Curated Designs)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  30 Palettes (18 Light + 12 Dark)
                </span>
              </div>
              <p className="text-slate-500 text-xs">
                Select from 30 academic color themes. Click &ldquo;Live Preview&rdquo; on any palette to test it instantly in the interactive preview sandbox below.
              </p>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2 text-xs shrink-0">
              <span className="text-slate-500 font-medium">Currently Live:</span>
              <span className="font-bold text-slate-900">{activeThemeObj.name}</span>
            </div>
          </div>

          {/* Interactive Live Preview Box for Section 1 */}
          <div className="rounded-xl border border-slate-300/80 bg-slate-50/60 p-4 sm:p-5 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Live Preview Sandbox for Section 1
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                  Testing: {previewThemeObj.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
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
                    <span>Apply This Tested Theme Live</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    <Check className="w-3 h-3" />
                    <span>This palette is currently live on your site</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setIsModalPreviewOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Maximize2 className="w-3 h-3 text-slate-500" />
                  <span>Expand</span>
                </button>
              </div>
            </div>

            {/* Simulated Live Portal Component rendered with previewTheme colors & previewFont typography */}
            <div
              className="rounded-xl p-5 border transition-all duration-300 shadow-sm space-y-4"
              style={{
                backgroundColor: previewThemeObj.cssVars.bgCanvas,
                borderColor: previewThemeObj.cssVars.borderColor,
                color: previewThemeObj.cssVars.textMain,
              }}
            >
              {/* Header preview row */}
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: previewThemeObj.cssVars.borderColor }}>
                <div className="flex items-center gap-2">
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

                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: previewThemeObj.cssVars.badgeBg,
                      color: previewThemeObj.cssVars.badgeText,
                    }}
                  >
                    {previewThemeObj.category}
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md text-white"
                    style={{ backgroundColor: previewThemeObj.cssVars.accentPrimary }}
                  >
                    Accent Button
                  </span>
                </div>
              </div>

              {/* Sample Card within the canvas */}
              <div
                className="p-4 rounded-lg border transition-all"
                style={{
                  backgroundColor: previewThemeObj.cssVars.bgCard,
                  borderColor: previewThemeObj.cssVars.borderColor,
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: previewThemeObj.cssVars.accentSubtle,
                      color: previewThemeObj.cssVars.accentPrimary,
                    }}
                  >
                    Featured Publication (Sample)
                  </span>
                  <span className="text-[10px]" style={{ color: previewThemeObj.cssVars.textMuted }}>
                    Int. J. Impact Engineering (2024)
                  </span>
                </div>

                <h4
                  className="font-bold text-sm sm:text-base leading-snug mt-1"
                  style={{
                    fontFamily: previewFontObj.headingFont,
                    color: previewThemeObj.cssVars.textMain,
                  }}
                >
                  Dynamic Failure and Ballistic Impact Response of 3D Woven Composites
                </h4>

                <p
                  className="text-xs mt-1.5 leading-relaxed"
                  style={{
                    fontFamily: previewFontObj.bodyFont,
                    color: previewThemeObj.cssVars.textMuted,
                  }}
                >
                  Investigating high-velocity impact dynamics using explicit non-linear finite element formulations and Kolsky bar high-strain-rate experiments.
                </p>

                <div className="flex items-center gap-3 mt-3 pt-2 border-t" style={{ borderColor: previewThemeObj.cssVars.borderColor }}>
                  <span className="text-[10px] font-semibold" style={{ color: previewThemeObj.cssVars.accentPrimary }}>
                    DOI: 10.1016/j.ijimpeng.2024.104982
                  </span>
                  <span className="text-[10px]" style={{ color: previewThemeObj.cssVars.textMuted }}>
                    • Citations: 420+
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { id: "all", label: `All Palettes (${themeList.length})` },
              { id: "pinned", label: "📌 Pinned Favorites (2)" },
              { id: "Archival & Editorial", label: "Archival & Editorial (5)" },
              { id: "Prestigious Universities", label: "Prestigious Universities (6)" },
              { id: "Modern Minimalist", label: "Modern Minimalist (5)" },
              { id: "Earth & Nature", label: "Earth & Nature (6)" },
              { id: "Scholarly Night", label: "🌙 Scholarly Night / Dark (8)" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setThemeFilter(f.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  themeFilter === f.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Theme Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredThemes.map((t) => {
              const isLive = selectedTheme === t.id;
              const isPreviewing = previewThemeId === t.id;

              return (
                <div
                  key={t.id}
                  onClick={() => setPreviewThemeId(t.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isLive
                      ? "border-emerald-600 bg-emerald-50/20 shadow-md ring-2 ring-emerald-600/30"
                      : isPreviewing
                      ? "border-blue-500 bg-blue-50/20 shadow-sm ring-2 ring-blue-400/20"
                      : "border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs"
                  }`}
                >
                  <div className="space-y-2">
                    {/* Header Tags */}
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {t.isPinned && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <Pin className="w-2.5 h-2.5" />
                            <span>Pinned</span>
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          {t.category.split(" ")[0]}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {isPreviewing && !isLive && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                            <Eye className="w-2.5 h-2.5" />
                            <span>Previewing</span>
                          </span>
                        )}
                        {isLive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                            <Check className="w-3 h-3" />
                            <span>Live</span>
                          </span>
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-slate-300" />
                        )}
                      </div>
                    </div>

                    {/* Theme Name */}
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">
                        {t.name}
                      </h3>
                    </div>

                    {/* Color Swatch Preview */}
                    <div className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-md border border-slate-300/80 shadow-2xs"
                          style={{ backgroundColor: t.swatch.canvas }}
                          title={`Canvas: ${t.swatch.canvas}`}
                        />
                        <div
                          className="w-5 h-5 rounded-md border border-slate-300/80 shadow-2xs"
                          style={{ backgroundColor: t.swatch.card }}
                          title={`Card: ${t.swatch.card}`}
                        />
                      </div>
                      <div
                        className="px-2.5 py-1 rounded text-[10px] font-bold text-white shadow-2xs"
                        style={{ backgroundColor: t.swatch.accent }}
                      >
                        Accent
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                      {t.description}
                    </p>
                  </div>

                  {/* Action Buttons: Preview & 1-Click Apply */}
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
                      <span>Live Preview</span>
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
                        <span>Apply (1-Click)</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 2: TYPOGRAPHY & FONT STYLE (30 CURATED ACADEMIC)       */}
        {/* ============================================================== */}
        <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-emerald-700" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Section 2: Typography & Font Style (30 Curated Academic Pairings)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  30 Google Academic Fonts
                </span>
              </div>
              <p className="text-slate-500 text-xs">
                Select your preferred font pairing. Click &ldquo;Live Preview&rdquo; on any font style to inspect how headings, citations, and prose render in real time.
              </p>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2 text-xs shrink-0">
              <span className="text-slate-500 font-medium">Currently Live:</span>
              <span className="font-bold text-slate-900" style={{ fontFamily: activeFontObj.headingFont }}>
                {activeFontObj.name}
              </span>
            </div>
          </div>

          {/* Interactive Live Preview Box for Section 2 */}
          <div className="rounded-xl border border-slate-300/80 bg-slate-50/60 p-4 sm:p-5 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Live Typography & Readability Sandbox for Section 2
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                  Testing: {previewFontObj.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
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
                    <span>Apply This Tested Font Live</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    <Check className="w-3 h-3" />
                    <span>This font style is currently live on your site</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setIsModalPreviewOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Maximize2 className="w-3 h-3 text-slate-500" />
                  <span>Expand</span>
                </button>
              </div>
            </div>

            {/* Typography Specimen Box rendered in current preview colors */}
            <div
              className="rounded-xl p-5 border transition-all duration-300 shadow-sm space-y-3"
              style={{
                backgroundColor: previewThemeObj.cssVars.bgCanvas,
                borderColor: previewThemeObj.cssVars.borderColor,
                color: previewThemeObj.cssVars.textMain,
              }}
            >
              <div className="space-y-1">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: previewThemeObj.cssVars.accentPrimary }}
                >
                  Headline &amp; Academic Hierarchy Specimen
                </span>
                <h1
                  className="text-2xl sm:text-3xl font-bold tracking-tight"
                  style={{ fontFamily: previewFontObj.headingFont }}
                >
                  Dr. Abhishek Rajput
                </h1>
                <h2
                  className="text-sm sm:text-base font-semibold italic"
                  style={{
                    fontFamily: previewFontObj.headingFont,
                    color: previewThemeObj.cssVars.textMuted,
                  }}
                >
                  Structural &amp; Impact Mechanics Laboratory • IIT Indore
                </h2>
              </div>

              <div
                className="p-3.5 rounded-lg border"
                style={{
                  backgroundColor: previewThemeObj.cssVars.bgCard,
                  borderColor: previewThemeObj.cssVars.borderColor,
                }}
              >
                <div
                  className="text-xs font-bold uppercase tracking-wide mb-1"
                  style={{ color: previewThemeObj.cssVars.accentPrimary }}
                >
                  Research Abstract Specimen ({previewFontObj.name})
                </div>
                <p
                  className="text-xs sm:text-sm leading-relaxed"
                  style={{
                    fontFamily: previewFontObj.bodyFont,
                    color: previewThemeObj.cssVars.textMain,
                  }}
                >
                  &ldquo;Our laboratory investigates the fundamental mechanics governing high-velocity impact, adiabatic shear band formation, and dynamic fracture phenomena under extreme loading regimes in advanced heterogeneous alloys and 3D woven metamaterials.&rdquo;
                </p>
                <div
                  className="mt-2.5 pt-2 border-t flex flex-wrap items-center justify-between text-[11px]"
                  style={{ borderColor: previewThemeObj.cssVars.borderColor }}
                >
                  <span style={{ color: previewThemeObj.cssVars.textMuted }}>
                    Heading Font: <strong className="font-bold">{previewFontObj.headingFont.split(",")[0]}</strong>
                  </span>
                  <span style={{ color: previewThemeObj.cssVars.textMuted }}>
                    Body Font: <strong className="font-bold">{previewFontObj.bodyFont.split(",")[0]}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Font Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { id: "all", label: `All Fonts (${fontList.length})` },
              { id: "Classical Serif", label: "🏛️ Classical & Heritage (8)" },
              { id: "Contemporary Serif", label: "📰 Contemporary & Scientific (8)" },
              { id: "Modern Technical Sans", label: "⚡ Modern Technical & STEM (8)" },
              { id: "Monospace & Architectural", label: "🔬 Monospace & Hybrids (6)" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFontFilter(f.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  fontFilter === f.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Font Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFonts.map((f) => {
              const isLive = selectedFont === f.id;
              const isPreviewing = previewFontId === f.id;

              return (
                <div
                  key={f.id}
                  onClick={() => setPreviewFontId(f.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isLive
                      ? "border-emerald-600 bg-emerald-50/20 shadow-md ring-2 ring-emerald-600/30"
                      : isPreviewing
                      ? "border-blue-500 bg-blue-50/20 shadow-sm ring-2 ring-blue-400/20"
                      : "border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header Tags */}
                    <div className="flex items-center justify-between gap-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {f.category}
                      </span>
                      <div className="flex items-center gap-1">
                        {isPreviewing && !isLive && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                            <Eye className="w-2.5 h-2.5" />
                            <span>Previewing</span>
                          </span>
                        )}
                        {isLive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                            <Check className="w-3 h-3" />
                            <span>Live</span>
                          </span>
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-slate-300" />
                        )}
                      </div>
                    </div>

                    {/* Font Name */}
                    <div>
                      <h3
                        className="font-bold text-base text-slate-900 leading-tight"
                        style={{ fontFamily: f.headingFont }}
                      >
                        {f.name}
                      </h3>
                      <span className="text-[10px] font-semibold text-emerald-800">
                        {f.tag}
                      </span>
                    </div>

                    {/* Live Font Sample Showcase */}
                    <div className="p-3 rounded-lg border border-slate-200/90 bg-slate-50/80 space-y-1">
                      <div
                        className="text-base sm:text-lg font-bold text-slate-900 leading-snug"
                        style={{ fontFamily: f.headingFont }}
                      >
                        Dr. Abhishek Rajput
                      </div>
                      <div
                        className="text-xs text-slate-600 italic leading-relaxed"
                        style={{ fontFamily: f.headingFont }}
                      >
                        Structural &amp; Impact Mechanics Lab
                      </div>
                      <div
                        className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60"
                        style={{ fontFamily: f.bodyFont }}
                      >
                        Sample body: Ballistic penetration &amp; extreme dynamic loading research.
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {f.description}
                    </p>
                  </div>

                  {/* Action Buttons: Preview & 1-Click Apply */}
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
                      <span>Live Preview</span>
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
                        <span>Apply (1-Click)</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 3: WEBSITE CONFIGURATION & CONTENT ADMINISTRATION      */}
        {/* Divided into 3 Distinct Sub-Sections as Requested              */}
        {/* ============================================================== */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
              Section 3: Website Content &amp; General Configuration
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Edit the text parameters, public contact channels, and administrator authentication credentials in 3 dedicated sub-sections.
            </p>
          </div>

          <form onSubmit={handleSaveTextSettings} className="space-y-6 text-xs">
            {/* -------------------------------------------------------- */}
            {/* SUB-SECTION 3.1: Identity & SEO Metadata                 */}
            {/* -------------------------------------------------------- */}
            <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-5">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <span className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                  <Globe className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Sub-section 3.1: Website Identity &amp; SEO Metadata
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Configure your primary website branding, page title, search engine meta descriptions, and copyright attribution.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
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
                  <p className="text-[10px] text-slate-400">
                    Appears in browser tabs, search engine indices, and header title navigation.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Meta Description (Search Engine Optimization)</label>
                  <textarea
                    value={settings.siteDescription || ""}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    rows={3}
                    placeholder="Official academic portal of Dr. Abhishek Rajput, Associate Professor at IIT Indore. Research in impact mechanics, dynamic fracture, and ballistic penetration."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400">
                    Provides summary snippets on Google Scholar, search engine crawlers, and social media link shares.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Footer Attribution &amp; Copyright Notice</label>
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
            <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-5">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <Mail className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Sub-section 3.2: Public Communication &amp; Portal Modules
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Specify public email contact channels and toggle major modular sections across the portal.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Official Public Contact Email</label>
                  <input
                    type="email"
                    value={settings.contactEmail || ""}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    placeholder="abhishekrajput@iiti.ac.in"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400">
                    Displayed on the public website footer, header contact links, and visitor inquiry modals.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setSettings({ ...settings, enableNews: !settings.enableNews })}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      settings.enableNews
                        ? "border-emerald-500 bg-emerald-50/20"
                        : "border-slate-200 bg-slate-50 opacity-70"
                    }`}
                  >
                    <span className="mt-0.5">
                      {settings.enableNews ? (
                        <ToggleRight className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-400" />
                      )}
                    </span>
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-800 text-xs">
                        Enable News &amp; Updates Page
                      </div>
                      <p className="text-[10px] text-slate-500 leading-snug">
                        Publishes alerts, conference announcements, and call for papers on the public website.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setSettings({ ...settings, enableStudents: !settings.enableStudents })}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      settings.enableStudents
                        ? "border-emerald-500 bg-emerald-50/20"
                        : "border-slate-200 bg-slate-50 opacity-70"
                    }`}
                  >
                    <span className="mt-0.5">
                      {settings.enableStudents ? (
                        <ToggleRight className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-400" />
                      )}
                    </span>
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-800 text-xs">
                        Enable Research Group &amp; Lab Page
                      </div>
                      <p className="text-[10px] text-slate-500 leading-snug">
                        Displays the directory of current PhD scholars, MTech researchers, and alumni profiles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* SUB-SECTION 3.3: Administrator Identity & Security       */}
            {/* -------------------------------------------------------- */}
            <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-5">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <span className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Sub-section 3.3: Administrator Identity &amp; Security Credentials
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Manage the administrator display name, login email, and authentication password used to access this CMS.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div className="pt-3 border-t border-slate-100 space-y-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Current Password{" "}
                        <span className="text-slate-400 font-normal">
                          (Required only if changing login email or password)
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
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
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 text-xs"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save All Text Settings &amp; Security</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ============================================================== */}
      {/* FULLSCREEN / MODAL LIVE PREVIEW COMPONENT                      */}
      {/* Allows testing any combinations in rich overlay window         */}
      {/* ============================================================== */}
      {isModalPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-700">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
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
                  <span>Apply This Combination Live</span>
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
            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                You can try all 30 themes × 30 fonts (900 combinations) in real time.
              </span>
              <button
                type="button"
                onClick={() => setIsModalPreviewOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
