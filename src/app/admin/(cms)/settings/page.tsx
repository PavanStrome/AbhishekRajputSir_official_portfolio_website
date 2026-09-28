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
  Layers,
} from "lucide-react";
import {
  ACADEMIC_THEMES,
  DEFAULT_THEME_ID,
  ACADEMIC_FONT_STYLES,
  DEFAULT_FONT_STYLE_ID,
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

  const [selectedTheme, setSelectedTheme] = useState<string>(DEFAULT_THEME_ID);
  const [selectedFont, setSelectedFont] = useState<string>(DEFAULT_FONT_STYLE_ID);
  const [themeFilter, setThemeFilter] = useState<string>("all");
  const [fontFilter, setFontFilter] = useState<string>("all");
  const [applyingTheme, setApplyingTheme] = useState(false);
  const [applyingFont, setApplyingFont] = useState(false);
  const [savingCombination, setSavingCombination] = useState(false);

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
          }
          if (d.settings.fontStyle) {
            setSelectedFont(d.settings.fontStyle);
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
      const themeObj = ACADEMIC_THEMES[themeId];
      const fontObj = ACADEMIC_FONT_STYLES[selectedFont];
      setFeedback({
        type: "success",
        text: `🎨 Color palette "${themeObj?.name || themeId}" applied live! Paired with "${fontObj?.name}". The entire public portal has been instantly updated.`,
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
      const fontObj = ACADEMIC_FONT_STYLES[fontId];
      const themeObj = ACADEMIC_THEMES[selectedTheme];
      setFeedback({
        type: "success",
        text: `🔤 Typography style "${fontObj?.name || fontId}" applied live! Paired with palette "${themeObj?.name}". The entire public portal has been instantly updated.`,
      });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to apply font style" });
    } finally {
      setApplyingFont(false);
    }
  };

  // Apply Selected Combination (Both Theme + Font)
  const applyBothDirectly = async () => {
    setSavingCombination(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          theme: selectedTheme,
          fontStyle: selectedFont,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update combination");

      setSettings((prev: any) => ({ ...prev, theme: selectedTheme, fontStyle: selectedFont }));
      const themeObj = ACADEMIC_THEMES[selectedTheme];
      const fontObj = ACADEMIC_FONT_STYLES[selectedFont];
      setFeedback({
        type: "success",
        text: `✨ Combination applied live: [${themeObj?.name}] + [${fontObj?.name}]! The entire public portal has been updated.`,
      });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to apply combination" });
    } finally {
      setSavingCombination(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
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
        text: data.message || "Settings, design theme, font pairings, and administrator profile saved successfully!",
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

  const activeThemeObj = ACADEMIC_THEMES[selectedTheme] || ACADEMIC_THEMES[DEFAULT_THEME_ID];
  const activeFontObj = ACADEMIC_FONT_STYLES[selectedFont] || ACADEMIC_FONT_STYLES[DEFAULT_FONT_STYLE_ID];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Website Settings & Appearance"
        subtitle="Manage website visual appearance (18 academic color themes × 6 font pairings = 108 combinations), general site attributes, and administrator security."
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-5xl">
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
                Any color palette can be mixed and matched with any font style. You can click cards in either section to apply them in any combination!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={applyBothDirectly}
              disabled={savingCombination}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {savingCombination ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5" />
              )}
              <span>Apply Combination Live</span>
            </button>

            <Link
              href="/design-preview"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Live Preview</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* 1. Theme & Color Palette Section */}
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
                Select from 30 academic color themes (Warm Archival papers, Prestigious Universities, Modern Minimalist, Nature, and Scholarly Dark Modes).
              </p>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2 text-xs shrink-0">
              <span className="text-slate-500 font-medium">Active Color Palette:</span>
              <span className="font-bold text-slate-900">{activeThemeObj.name}</span>
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
              const isSelected = selectedTheme === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => applyThemeDirectly(t.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/20 shadow-md ring-2 ring-emerald-600/30"
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

                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                          <Check className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
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

                  {/* Action Button */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={applyingTheme}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Currently Active</span>
                        </>
                      ) : (
                        <span>Click to Apply (1-Click)</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Typography & Font Style Section */}
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
                Select your preferred font pairing. You can combine ANY font style with ANY color palette above.
              </p>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2 text-xs shrink-0">
              <span className="text-slate-500 font-medium">Active Typography:</span>
              <span className="font-bold text-slate-900" style={{ fontFamily: activeFontObj.headingFont }}>
                {activeFontObj.name}
              </span>
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
              const isSelected = selectedFont === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => applyFontDirectly(f.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/20 shadow-md ring-2 ring-emerald-600/30"
                      : "border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header Tags */}
                    <div className="flex items-center justify-between gap-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {f.category}
                      </span>
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                          <Check className="w-3 h-3" />
                          <span>Active Font</span>
                        </span>
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
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
                        Structural & Impact Mechanics Lab
                      </div>
                      <div
                        className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60"
                        style={{ fontFamily: f.bodyFont }}
                      >
                        Sample body: Ballistic penetration & extreme dynamic loading research.
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {f.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={applyingFont}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Currently Active</span>
                        </>
                      ) : (
                        <span>Click to Apply (1-Click)</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. General Parameters Form */}
        <form onSubmit={handleSave} className="space-y-8 text-xs">
          <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              General Website Parameters
            </h2>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Website Title / Brand</label>
              <input
                type="text"
                value={settings.siteTitle}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Meta Description (SEO)</label>
              <textarea
                value={settings.siteDescription || ""}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Official Contact Email (Public)</label>
                <input
                  type="email"
                  value={settings.contactEmail || ""}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Footer Attribution Text</label>
                <input
                  type="text"
                  value={settings.footerText || ""}
                  onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                  placeholder="© 2026 Dr. Abhishek Rajput. All rights reserved."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableNews}
                  onChange={(e) => setSettings({ ...settings, enableNews: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-700">Enable News & Updates Page</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableStudents}
                  onChange={(e) => setSettings({ ...settings, enableStudents: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-700">Enable Research Group Page</span>
              </label>
            </div>
          </div>

          {/* 4. Security & Admin Credentials Change */}
          <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Administrator Account & Login Credentials
              </h2>
            </div>

            <p className="text-slate-500 text-xs leading-relaxed">
              Manage the login email, display name, and password used to access the Faculty Admin CMS.
              To change your email, name, or password, enter your <strong className="text-slate-800">Current Password</strong> below for verification.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Admin Name</span>
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
                      (Required to apply changes to email or password)
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
                    placeholder="Min 8 characters, letters & numbers"
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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save All Settings, Theme & Fonts</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
