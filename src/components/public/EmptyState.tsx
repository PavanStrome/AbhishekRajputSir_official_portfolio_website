import React from "react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = "Information will be updated shortly",
  message = "This section is currently being curated. Please check back soon or reach out via our contact details.",
  icon,
}: EmptyStateProps) {
  return (
    <div className="p-10 sm:p-14 text-center bg-slate-50/70 border border-slate-200/80 rounded-2xl max-w-2xl mx-auto space-y-3">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
        {icon || <FolderOpen className="w-6 h-6" />}
      </div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
        {message}
      </p>
    </div>
  );
}
