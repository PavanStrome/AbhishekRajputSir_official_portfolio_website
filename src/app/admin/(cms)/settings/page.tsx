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
  const [applyingTheme, setApplyingTheme] = useState(false);
  const [applyingFont, setApplyingFont] = useState(false);

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
      setFeedback({
        type: "success",
        text: `🎨 Color palette "${themeObj?.name || themeId}" applied live! The entire public portal has been instantly updated.`,
      });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to apply theme" });
    } finally {
      setApplyingTheme(false);
    }
  };

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
      setFeedback({
        type: "success",
        text: `🔤 Typography style "${fontObj?.name || fontId}" applied live! The entire public portal has been instantly updated.`,
      });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to apply font style" });
    } finally {
      setApplyingFont(false);
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

  const activeThemeObj = ACADEMIC_THEMES[selectedTheme] || ACADEMIC_THEMES[DEFAULT_THEME_ID];
  const activeFontObj = ACADEMIC_FONT_STYLES[selectedFont] || ACADEMIC_FONT_STYLES[DEFAULT_FONT_STYLE_ID];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Website Settings & Appearance"
        subtitle="Manage website visual design theme (18 academic palettes), typography font styles (6 curated pairings), and administrator security."
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

        {/* 1. Theme & Appearance Section */}
        <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-emerald-700" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Website Theme & Color Palette (1-Click Instant Change)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  18 Handcrafted Designs
                </span>
              </div>
              <p className="text-slate-500 text-xs">
                Select from 18 curated academic themes. Single-click any card to apply it live to the entire public website.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/design-preview"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Side-by-Side Preview</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-3 h-3 text-emerald-600" />
              </Link>
            </div>
          </div>

          {/* Active Theme Status Strip */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-1.5 shrink-0">
                <div
                  className="w-7 h-7 rounded-full border-2 border-white shadow-xs"
                  style={{ backgroundColor: activeThemeObj.swatch.canvas }}
                  title="Canvas background"
                />
                <div
                  className="w-7 h-7 rounded-full border-2 border-white shadow-xs"
                  style={{ backgroundColor: activeThemeObj.swatch.card }}
                  title="Card background"
                />
                <div
                  className="w-7 h-7 rounded-full border-2 border-white shadow-xs"
                  style={{ backgroundColor: activeThemeObj.swatch.accent }}
                  title="Accent color"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Active Palette: {activeThemeObj.name}
                  </span>
                  {activeThemeObj.isPinned && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                      Pinned
                    </span>
                  )}
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-200 text-slate-700">
                    {activeThemeObj.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {activeThemeObj.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => applyThemeDirectly(selectedTheme)}
              disabled={applyingTheme}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              {applyingTheme ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Apply Palette Instantly</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { id: "all", label: `All Themes (${themeList.length})` },
              { id: "pinned", label: "📌 Pinned Favorites (2)" },
              { id: "Archival & Editorial", label: "Archival & Editorial (4)" },
              { id: "Prestigious Universities", label: "Prestigious Universities (4)" },
              { id: "Modern Minimalist", label: "Modern Minimalist (4)" },
              { id: "Earth & Nature", label: "Earth & Nature (4)" },
              { id: "Scholarly Night", label: "Scholarly Night (2)" },
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
                  Typography & Academic Font Pairings (6 Curated Styles)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Google Academic Fonts
                </span>
              </div>
              <p className="text-slate-500 text-xs">
                Pair any color theme with 6 distinguished font styles (Classical Oxford, Bodleian Roman, Modern Literary Journal, MIT Neo-Grotesque, etc.).
              </p>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2 text-xs shrink-0">
              <span className="text-slate-500 font-medium">Active Typography:</span>
              <span className="font-bold text-slate-900">
                {activeFontObj.name}
              </span>
            </div>
          </div>

          {/* Font Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(ACADEMIC_FONT_STYLES).map((f) => {
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
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">
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
                        Sample body text: Ballistic penetration & high-rate material characterization.
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
