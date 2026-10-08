"use client";

import React, { useState } from "react";
import { FileText, ExternalLink, ChevronDown, ChevronUp, Copy, Check, BookmarkCheck } from "lucide-react";

export interface PublicationData {
  id: string;
  title: string;
  authors: string;
  publicationType: string;
  venue: string;
  year: number;
  month?: string | null;
  volume?: string | null;
  issue?: string | null;
  pages?: string | null;
  doi?: string | null;
  paperUrl?: string | null;
  pdfUrl?: string | null;
  abstract?: string | null;
  isFeatured?: boolean;
  researchArea?: {
    id: string;
    title: string;
  } | null;
}

interface PublicationCardProps {
  publication: PublicationData;
}

export default function PublicationCard({ publication }: PublicationCardProps) {
  const [showAbstract, setShowAbstract] = useState(false);
  const [showBibtex, setShowBibtex] = useState(false);
  const [copied, setCopied] = useState(false);

  // Format type badge
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "JOURNAL":
        return "Journal Article";
      case "CONFERENCE":
        return "Conference Paper";
      case "BOOK_CHAPTER":
        return "Book Chapter";
      case "BOOK":
        return "Book";
      default:
        return type;
    }
  };

  // Generate BibTeX snippet
  const generateBibtex = () => {
    const key = `rajput${publication.year}${publication.title.split(" ")[0].toLowerCase().replace(/[^a-z0-9]/g, "")}`;
    const bibType = publication.publicationType === "JOURNAL" ? "article" : "inproceedings";
    return `@${bibType}{${key},
  title={${publication.title}},
  author={${publication.authors}},
  journal={${publication.venue}},
  year={${publication.year}}${publication.volume ? `,\n  volume={${publication.volume}}` : ""}${publication.pages ? `,\n  pages={${publication.pages}}` : ""}${publication.doi ? `,\n  doi={${publication.doi}}` : ""}
}`;
  };

  const copyBibtex = () => {
    navigator.clipboard.writeText(generateBibtex());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Highlight "Rajput, A." or "Abhishek Rajput" in authors
  const renderHighlightedAuthors = (authorsStr: string) => {
    const parts = authorsStr.split(/(Rajput,\s*A\.|Dr\.\s*Abhishek\s*Rajput|Abhishek\s*Rajput)/gi);
    return parts.map((part, i) => {
      if (part.toLowerCase().includes("rajput")) {
        return (
          <strong key={i} className="font-bold text-slate-900 underline decoration-slate-300">
            {part}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <article className="p-5 sm:p-6 bg-white border border-slate-200/90 rounded-xl hover:border-slate-300 hover:shadow-xs transition-all space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded bg-slate-100 text-slate-700 border border-slate-200/80">
            {publication.year}
          </span>
          <span className="px-2.5 py-0.5 text-xs font-medium rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
            {getTypeLabel(publication.publicationType)}
          </span>
          {publication.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded bg-amber-50 text-amber-800 border border-amber-200/60">
              <BookmarkCheck className="w-3 h-3" />
              <span>Featured</span>
            </span>
          )}
        </div>

        {publication.researchArea && (
          <span className="text-xs text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
            {publication.researchArea.title}
          </span>
        )}
      </div>

      {/* Publication Title */}
      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
        {publication.paperUrl ? (
          <a
            href={publication.paperUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-800 transition-colors"
          >
            {publication.title}
          </a>
        ) : (
          publication.title
        )}
      </h3>

      {/* Authors list */}
      <div className="text-sm text-slate-600 leading-relaxed">
        {renderHighlightedAuthors(publication.authors)}
      </div>

      {/* Journal / Venue & Citation metadata */}
      <div className="text-sm italic text-slate-700 font-serif">
        {publication.venue}
        {publication.volume && `, Vol. ${publication.volume}`}
        {publication.issue && `(${publication.issue})`}
        {publication.pages && `, pp. ${publication.pages}`}
        {publication.year && ` (${publication.year})`}
      </div>

      {/* Actions & Links Bar */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {publication.doi && (
            <a
              href={`https://doi.org/${publication.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-emerald-800 transition-colors max-w-full"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-none">DOI: {publication.doi}</span>
            </a>
          )}

          {publication.paperUrl && !publication.doi && (
            <a
              href={publication.paperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-700 hover:text-emerald-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Publisher Link</span>
            </a>
          )}

          {publication.pdfUrl && (
            <a
              href={publication.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100/70 px-2.5 py-1 rounded transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          {publication.abstract && (
            <button
              onClick={() => setShowAbstract(!showAbstract)}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium transition-colors"
            >
              <span>Abstract</span>
              {showAbstract ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            onClick={() => setShowBibtex(!showBibtex)}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium transition-colors"
          >
            <span>BibTeX</span>
            {showBibtex ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Abstract */}
      {showAbstract && publication.abstract && (
        <div className="mt-3 p-4 bg-slate-50 rounded-lg text-xs sm:text-sm text-slate-700 leading-relaxed border border-slate-200/60 animate-in fade-in duration-150">
          <p className="font-semibold text-slate-900 mb-1">Abstract:</p>
          <p>{publication.abstract}</p>
        </div>
      )}

      {/* Expandable BibTeX */}
      {showBibtex && (
        <div className="mt-3 p-3 bg-slate-900 rounded-lg text-xs text-slate-300 font-mono relative border border-slate-800 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
            <span>BibTeX Citation</span>
            <button
              onClick={copyBibtex}
              className="flex items-center gap-1 hover:text-white transition-colors bg-slate-800 px-2 py-0.5 rounded"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap">{generateBibtex()}</pre>
        </div>
      )}
    </article>
  );
}
