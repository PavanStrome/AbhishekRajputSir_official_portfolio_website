import React from "react";
import type { Metadata } from "next";
import { getPublicNews } from "@/services/academic-service";
import EmptyState from "@/components/public/EmptyState";
import { Bell, Calendar, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "News, Announcements & Events",
  description:
    "Recent publications, invited talks, seminar presentations, and research updates from Dr. Abhishek Rajput's laboratory.",
};

export const revalidate = 60;

export default async function NewsPage() {
  const news = await getPublicNews();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="border-b border-slate-200 pb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          Laboratory Updates
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          News & Research Announcements
        </h1>
        <p className="text-slate-600 text-base mt-2 max-w-3xl leading-relaxed">
          Stay informed with the latest updates from our research group: journal publications, conference lectures, new student admissions, and laboratory milestones.
        </p>
      </div>

      {news.length > 0 ? (
        <div className="max-w-4xl space-y-6">
          {news.map((item) => (
            <article
              key={item.id}
              className="p-6 sm:p-7 bg-white border border-slate-200/90 rounded-xl hover:border-slate-300 hover:shadow-xs transition-all space-y-3"
            >
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  {new Date(item.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="text-slate-300">•</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold uppercase text-[10px]">
                  {item.category}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
                {item.title}
              </h2>

              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                {item.content}
              </p>

              {item.externalUrl && (
                <div className="pt-2">
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
                  >
                    <span>More Information & Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No current news items"
          message="Announcements for conferences, talks, and grants will be posted here."
          icon={<Bell className="w-6 h-6" />}
        />
      )}
    </div>
  );
}
