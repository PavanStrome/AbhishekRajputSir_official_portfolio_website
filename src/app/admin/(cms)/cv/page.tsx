"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import FileUploader from "@/components/admin/FileUploader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { FileText, Download, Trash2, CheckCircle, ExternalLink, Calendar } from "lucide-react";

export default function AdminCVPage() {
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvUpdatedAt, setCvUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((res) => res.json())
      .then((d) => {
        if (d.profile) {
          setCvUrl(d.profile.cvUrl);
          setCvUpdatedAt(d.profile.cvUpdatedAt);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUploadSuccess = async (url: string) => {
    try {
      const now = new Date().toISOString();
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvUrl: url,
          cvUpdatedAt: now,
        }),
      });
      if (res.ok) {
        setCvUrl(url);
        setCvUpdatedAt(now);
        setFeedback("CV uploaded and updated successfully!");
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCV = async () => {
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvUrl: null,
          cvUpdatedAt: null,
        }),
      });
      if (res.ok) {
        setCvUrl(null);
        setCvUpdatedAt(null);
        setShowDeleteConfirm(false);
        setFeedback("CV removed successfully.");
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Curriculum Vitae Management"
        subtitle="Upload, preview, replace, or remove your official academic CV document (PDF format)."
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-4xl">
        {feedback && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
        )}

        <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Current Academic CV</h2>
              {cvUpdatedAt ? (
                <p className="text-xs text-slate-500 mt-0.5">
                  Last updated on {new Date(cvUpdatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              ) : (
                <p className="text-xs text-slate-400 mt-0.5">No CV currently on file</p>
              )}
            </div>

            {cvUrl && (
              <div className="flex items-center gap-2">
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove CV</span>
                </button>
              </div>
            )}
          </div>

          <FileUploader
            label="Upload New or Replacement CV"
            folder="cv"
            allowedExtensions={[".pdf"]}
            maxSizeMB={20}
            currentUrl={cvUrl}
            onUploadSuccess={handleUploadSuccess}
            helperText="Only official PDF documents are supported (Max 20MB)."
          />

          {/* Embedded live preview */}
          {cvUrl && (
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Live Document Preview:
              </span>
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-[600px]">
                <iframe src={`${cvUrl}#toolbar=0`} className="w-full h-full" title="CV Preview" />
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Remove CV Document"
        message="Are you sure you want to remove the published CV? Visitors will see a placeholder notice until a new CV is uploaded."
        onConfirm={handleDeleteCV}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
