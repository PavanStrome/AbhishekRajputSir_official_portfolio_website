import React from "react";

interface StatusBadgeProps {
  status: "PUBLISHED" | "DRAFT" | string;
  isPublished?: boolean;
}

export default function StatusBadge({ status, isPublished }: StatusBadgeProps) {
  const published =
    isPublished !== undefined ? isPublished : status === "PUBLISHED" || status === "published";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
        published
          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
          : "bg-amber-50 text-amber-800 border border-amber-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${published ? "bg-emerald-600" : "bg-amber-600"}`}
      ></span>
      <span>{published ? "Published" : "Draft"}</span>
    </span>
  );
}
