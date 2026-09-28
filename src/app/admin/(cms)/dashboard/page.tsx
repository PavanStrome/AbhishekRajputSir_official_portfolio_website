"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  BookOpen,
  Layers,
  Briefcase,
  Users,
  Bell,
  PlusCircle,
  Edit,
  ArrowRight,
  FileCheck,
  FileClock,
  ExternalLink,
  GraduationCap,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data:", err);
        setLoading(false);
      });
  }, []);

  const metrics = data?.metrics || {
    totalPublications: 0,
    draftPublications: 0,
    publishedPublications: 0,
    researchAreasCount: 0,
    projectsCount: 0,
    coursesCount: 0,
    studentsCount: 0,
    awardsCount: 0,
    newsCount: 0,
  };

  const profile = data?.profile;
  const recentPubs = data?.recentPublications || [];
  const recentProjects = data?.recentProjects || [];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Faculty CMS Dashboard"
        subtitle={`Welcome back, ${profile?.name || "Professor"}. Here is an overview of your academic website content.`}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/publications"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Publication</span>
            </Link>
          </div>
        }
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Publications Metric */}
          <div className="p-5 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Publications
              </span>
              <BookOpen className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {metrics.totalPublications}
              </span>
              <span className="text-xs text-slate-500 font-medium">Total</span>
            </div>
            <div className="flex items-center gap-3 pt-1 border-t border-slate-100 text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <FileCheck className="w-3 h-3" />
                <span>{metrics.publishedPublications} Live</span>
              </span>
              <span className="flex items-center gap-1 text-amber-700 font-semibold">
                <FileClock className="w-3 h-3" />
                <span>{metrics.draftPublications} Drafts</span>
              </span>
            </div>
          </div>

          {/* Research Areas Metric */}
          <div className="p-5 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Research Areas
              </span>
              <Layers className="w-4 h-4 text-blue-700" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {metrics.researchAreasCount}
              </span>
              <span className="text-xs text-slate-500 font-medium">Disciplines</span>
            </div>
            <p className="pt-1 border-t border-slate-100 text-[11px] text-slate-500">
              Active structural & impact domains
            </p>
          </div>

          {/* Projects Metric */}
          <div className="p-5 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Sponsored Projects
              </span>
              <Briefcase className="w-4 h-4 text-purple-700" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {metrics.projectsCount}
              </span>
              <span className="text-xs text-slate-500 font-medium">Grants</span>
            </div>
            <p className="pt-1 border-t border-slate-100 text-[11px] text-slate-500">
              DST, TEQIP & institutional grants
            </p>
          </div>

          {/* Students / Group Metric */}
          <div className="p-5 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Research Group
              </span>
              <Users className="w-4 h-4 text-amber-700" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {metrics.studentsCount}
              </span>
              <span className="text-xs text-slate-500 font-medium">Members</span>
            </div>
            <p className="pt-1 border-t border-slate-100 text-[11px] text-slate-500">
              Ph.D., M.Tech, staff & alumni
            </p>
          </div>
        </div>

        {/* Quick Action Buttons Bar */}
        <div className="p-6 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Quick Content Shortcuts
          </h2>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/admin/publications"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Publication</span>
            </Link>
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Project</span>
            </Link>
            <Link
              href="/admin/news"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Announcement</span>
            </Link>
            <Link
              href="/admin/profile"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Biography & Office Info</span>
            </Link>
            <Link
              href="/admin/cv"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Update CV Document</span>
            </Link>
          </div>
        </div>

        {/* Two Columns: Recent Publications & Recent Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Publications Table */}
          <div className="p-6 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Recently Edited Publications</h3>
              <Link
                href="/admin/publications"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Manage all →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentPubs.length > 0 ? (
                recentPubs.map((pub: any) => (
                  <div key={pub.id} className="py-3 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                        {pub.title}
                      </span>
                      <StatusBadge status={pub.status} />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{pub.venue}</span>
                      <span>•</span>
                      <span>{pub.year}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">No publications found</p>
              )}
            </div>
          </div>

          {/* Recent Projects Table */}
          <div className="p-6 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Recent Research Grants & Projects</h3>
              <Link
                href="/admin/projects"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Manage all →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentProjects.length > 0 ? (
                recentProjects.map((proj: any) => (
                  <div key={proj.id} className="py-3 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                        {proj.title}
                      </span>
                      <StatusBadge isPublished={proj.isPublished} status="" />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="capitalize">{proj.status.toLowerCase()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">No projects found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
