"use client";

import React, { useState, useMemo } from "react";
import PublicationCard, { PublicationData } from "./PublicationCard";
import { Search, Filter, RotateCcw } from "lucide-react";

interface PublicationFilterClientProps {
  initialPublications: PublicationData[];
  researchAreas: { id: string; title: string }[];
}

export default function PublicationFilterClient({
  initialPublications,
  researchAreas,
}: PublicationFilterClientProps) {
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedArea, setSelectedArea] = useState<string>("ALL");

  // Extract unique years sorted descending
  const years = useMemo(() => {
    const unique = Array.from(new Set(initialPublications.map((p) => p.year)));
    return unique.sort((a, b) => b - a);
  }, [initialPublications]);

  // Filtered publications
  const filteredPublications = useMemo(() => {
    return initialPublications.filter((pub) => {
      // Search term
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          pub.title.toLowerCase().includes(q) ||
          pub.authors.toLowerCase().includes(q) ||
          pub.venue.toLowerCase().includes(q) ||
          (pub.abstract && pub.abstract.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Year filter
      if (selectedYear !== "ALL" && pub.year !== parseInt(selectedYear, 10)) {
        return false;
      }

      // Type filter
      if (selectedType !== "ALL" && pub.publicationType !== selectedType) {
        return false;
      }

      // Research Area filter
      if (selectedArea !== "ALL" && pub.researchArea?.id !== selectedArea) {
        return false;
      }

      return true;
    });
  }, [initialPublications, search, selectedYear, selectedType, selectedArea]);

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedYear !== "ALL" ||
    selectedType !== "ALL" ||
    selectedArea !== "ALL";

  const handleReset = () => {
    setSearch("");
    setSelectedYear("ALL");
    setSelectedType("ALL");
    setSelectedArea("ALL");
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <div className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-xl shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search publications by title, author, venue, or keywords..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-600 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
          />
        </div>

        {/* Dropdowns & Selects */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Year Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="ALL">All Years ({initialPublications.length})</option>
              {years.map((yr) => (
                <option key={yr} value={yr.toString()}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Publication Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="JOURNAL">Journal Papers</option>
              <option value="CONFERENCE">Conference Papers</option>
              <option value="BOOK_CHAPTER">Book Chapters</option>
              <option value="BOOK">Books</option>
            </select>
          </div>

          {/* Research Area Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Research Discipline
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="ALL">All Research Areas</option>
              {researchAreas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count & reset button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filteredPublications.length}</strong> of{" "}
            <strong className="text-slate-800">{initialPublications.length}</strong> published works
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Publications List */}
      {filteredPublications.length > 0 ? (
        <div className="space-y-4">
          {filteredPublications.map((publication) => (
            <PublicationCard key={publication.id} publication={publication} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-xl space-y-3">
          <Filter className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No publications matched your filters</h4>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms, changing the publication year, or resetting the filter options.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
