"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Layers,
  BookOpen,
  Briefcase,
  GraduationCap,
  Users,
  Award,
  Bell,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  Palette,
  Type,
} from "lucide-react";

function SidebarNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "themes";

  const menuSections = [
    {
      title: "OVERVIEW",
      items: [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "CONTENT MANAGEMENT",
      items: [
        { name: "Profile & Bio", href: "/admin/profile", icon: User },
        { name: "Research Areas", href: "/admin/research", icon: Layers },
        { name: "Publications", href: "/admin/publications", icon: BookOpen },
        { name: "Projects & Grants", href: "/admin/projects", icon: Briefcase },
        { name: "Teaching & Courses", href: "/admin/teaching", icon: GraduationCap },
        { name: "Research Group", href: "/admin/students", icon: Users },
        { name: "Awards & Honors", href: "/admin/awards", icon: Award },
        { name: "News & Alerts", href: "/admin/news", icon: Bell },
        { name: "Curriculum Vitae", href: "/admin/cv", icon: FileText },
      ],
    },
    {
      title: "PREFERENCES & APPEARANCE",
      items: [
        { name: "Color & Themes (30)", href: "/admin/settings?tab=themes", icon: Palette },
        { name: "Typography & Fonts (30)", href: "/admin/settings?tab=typography", icon: Type },
        { name: "Website Info & Text", href: "/admin/settings?tab=general", icon: Settings },
      ],
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
      {menuSections.map((section, idx) => (
        <div key={idx} className="space-y-1.5">
          <span className="px-3 text-[10px] font-bold tracking-wider uppercase text-slate-500">
            {section.title}
          </span>
          <div className="space-y-0.5">
            {section.items.map((item) => {
              let active = false;
              if (item.href.includes("?tab=")) {
                const targetTab = item.href.split("?tab=")[1];
                active = pathname === "/admin/settings" && currentTab === targetTab;
              } else {
                active = pathname === item.href && pathname !== "/admin/settings";
              }
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    active
                      ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-emerald-400" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminSidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 shrink-0 select-none">
      {/* CMS Brand */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-sm shadow-sm">
            AC
          </div>
          <div>
            <h1 className="font-bold text-sm text-white tracking-tight leading-tight">
              Academic CMS
            </h1>
            <span className="text-[10px] text-slate-400 font-medium">Faculty Portal</span>
          </div>
        </div>
      </div>

      {/* Navigation List wrapped in Suspense */}
      <Suspense fallback={<div className="flex-1 px-4 py-5" />}>
        <SidebarNav />
      </Suspense>

      {/* Footer / Quick Actions */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
            <span>View Live Website</span>
          </span>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
            ↗
          </span>
        </a>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
