"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export interface NewsItem {
  id: string;
  title: string;
  date: Date | string;
  category: string;
  externalUrl?: string | null;
}

interface NewsTickerProps {
  news: NewsItem[];
}

export default function NewsTicker({ news }: NewsTickerProps) {
  if (!news || news.length === 0) return null;

  // Duplicate items for a seamless continuous marquee loop
  const tickerItems = [...news, ...news];

  const formatMonthYear = (dateInput: Date | string) => {
    const d = new Date(dateInput);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <aside aria-label="Latest Announcements Ticker" className="w-full bg-slate-900 border-b border-slate-800 text-slate-200 text-xs overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center h-10">
        {/* Fixed Left Badge */}
        <div className="shrink-0 flex items-center gap-2 pr-4 border-r border-slate-800 z-10 bg-slate-900 py-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold tracking-wider uppercase text-[11px] text-emerald-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>Latest News</span>
          </span>
        </div>

        {/* Marquee Track Container */}
        <div className="relative flex-1 overflow-hidden mx-3">
          <div className="animate-marquee items-center py-1">
            {tickerItems.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="inline-flex items-center mx-5 shrink-0">
                <Link
                  href={item.externalUrl || "/news"}
                  target={item.externalUrl ? "_blank" : undefined}
                  rel={item.externalUrl ? "noopener noreferrer" : undefined}
                  className="group inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60 uppercase">
                    {item.category}
                  </span>
                  <span className="font-medium group-hover:underline underline-offset-2 text-slate-200">
                    {item.title}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    ({formatMonthYear(item.date)})
                  </span>
                </Link>
                <span className="ml-5 text-slate-600 select-none">✦</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed Right Link */}
        <div className="shrink-0 hidden sm:flex items-center pl-3 border-l border-slate-800 z-10 bg-slate-900">
          <Link
            href="/news"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-emerald-400 transition-colors py-1"
          >
            <span>All News</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
