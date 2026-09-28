"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";

interface FileUploaderProps {
  label: string;
  folder?: string;
  allowedExtensions?: string[];
  maxSizeMB?: number;
  currentUrl?: string | null;
  onUploadSuccess: (url: string) => void;
  helperText?: string;
}

export default function FileUploader({
  label,
  folder = "general",
  allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".webp"],
  maxSizeMB = 20,
  currentUrl,
  onUploadSuccess,
  helperText,
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(false);

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File exceeds ${maxSizeMB}MB maximum limit.`);
      return;
    }

    // Validate extension
    const nameLower = file.name.toLowerCase();
    const isValidExt = allowedExtensions.some((ext) => nameLower.endsWith(ext));
    if (!isValidExt) {
      setError(`Unsupported file format. Please provide ${allowedExtensions.join(", ")}`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    setUploading(true);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onUploadSuccess(data.file.url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        {label}
      </label>

      {/* Upload Zone */}
      <div className="p-4 border-2 border-dashed border-slate-200 hover:border-emerald-600/70 rounded-xl bg-slate-50/60 transition-colors flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-2xs">
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
            ) : currentUrl ? (
              <FileText className="w-5 h-5 text-emerald-700" />
            ) : (
              <UploadCloud className="w-5 h-5 text-slate-400" />
            )}
          </div>

          <div className="space-y-0.5">
            {currentUrl ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-800 truncate max-w-xs block">
                  {currentUrl.split("/").pop()}
                </span>
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-emerald-700 hover:underline"
                >
                  View
                </a>
              </div>
            ) : (
              <span className="text-xs font-medium text-slate-600 block">
                No file currently selected
              </span>
            )}

            <p className="text-[11px] text-slate-400">
              {helperText || `Supported formats: ${allowedExtensions.join(", ")} (Max ${maxSizeMB}MB)`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept={allowedExtensions.join(",")}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors disabled:opacity-50"
          >
            {uploading ? "Uploading..." : currentUrl ? "Replace File" : "Choose File"}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {success && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 animate-in fade-in">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>File uploaded successfully!</span>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-rose-600 animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
