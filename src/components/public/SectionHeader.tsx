import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  linkText,
  linkHref,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-slate-200 ${className}`}>
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {linkText && linkHref && (
        <Link
          href={linkHref}
          className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors shrink-0 group"
        >
          <span>{linkText}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
