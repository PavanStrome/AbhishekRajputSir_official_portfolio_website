import React from "react";
import { BookOpen, FileText, ExternalLink } from "lucide-react";

interface CourseCardProps {
  code: string;
  title: string;
  semester: string;
  academicYear: string;
  level: string;
  description: string;
  syllabusUrl?: string | null;
  courseUrl?: string | null;
}

export default function CourseCard({
  code,
  title,
  semester,
  academicYear,
  level,
  description,
  syllabusUrl,
  courseUrl,
}: CourseCardProps) {
  return (
    <div className="p-6 bg-white border border-slate-200/90 rounded-xl hover:border-slate-300 hover:shadow-xs transition-all space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2.5 py-1 rounded">
            {code}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
            {level}
          </span>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {semester} Semester • {academicYear}
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-900 leading-snug">
        {courseUrl ? (
          <a
            href={courseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-800 transition-colors"
          >
            {title}
          </a>
        ) : (
          title
        )}
      </h3>

      <p className="text-sm text-slate-600 leading-relaxed">
        {description}
      </p>

      {syllabusUrl && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <a
            href={syllabusUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100/70 px-3 py-1.5 rounded transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Course Syllabus & Outline (PDF)</span>
          </a>
        </div>
      )}
    </div>
  );
}
