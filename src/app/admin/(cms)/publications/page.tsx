"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import PreviewModal from "@/components/admin/PreviewModal";
import FileUploader from "@/components/admin/FileUploader";
import PublicationCard, { PublicationData } from "@/components/public/PublicationCard";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  ExternalLink,
} from "lucide-react";

export default function AdminPublicationsPage() {
  const [publications, setPublications] = useState<any[]>([]);
  const [researchAreas, setResearchAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Edit/Add modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activePublication, setActivePublication] = useState<any>({
    title: "",
    authors: "Rajput, A.",
    publicationType: "JOURNAL",
    venue: "",
    year: new Date().getFullYear(),
    month: "",
    volume: "",
    issue: "",
    pages: "",
    doi: "",
    paperUrl: "",
    pdfUrl: "",
    scholarUrl: "",
    abstract: "",
    isFeatured: false,
    status: "PUBLISHED",
    researchAreaId: "",
  });

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Preview modal state
  const [previewItem, setPreviewItem] = useState<any | null>(null);

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchPublications = async () => {
    try {
      const res = await fetch("/api/admin/publications");
      const data = await res.json();
      if (data.publications) setPublications(data.publications);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchResearchAreas = async () => {
    try {
      const res = await fetch("/api/admin/research");
      const data = await res.json();
      if (data.areas) setResearchAreas(data.areas);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    Promise.all([fetchPublications(), fetchResearchAreas()]).finally(() => setLoading(false));
  }, []);

  const handleOpenCreate = () => {
    setModalMode("create");
    setActivePublication({
      title: "",
      authors: "Rajput, A.",
      publicationType: "JOURNAL",
      venue: "",
      year: new Date().getFullYear(),
      month: "",
      volume: "",
      issue: "",
      pages: "",
      doi: "",
      paperUrl: "",
      pdfUrl: "",
      scholarUrl: "",
      abstract: "",
      isFeatured: false,
      status: "PUBLISHED",
      researchAreaId: researchAreas[0]?.id || "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pub: any) => {
    setModalMode("edit");
    setActivePublication({
      ...pub,
      researchAreaId: pub.researchAreaId || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload = {
      ...activePublication,
      year: Number(activePublication.year),
      researchAreaId: activePublication.researchAreaId || null,
    };

    try {
      const url = "/api/admin/publications";
      const method = modalMode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save publication");

      setFeedback({
        type: "success",
        text: `Publication ${modalMode === "create" ? "created" : "updated"} successfully!`,
      });
      setIsModalOpen(false);
      fetchPublications();
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to save publication" });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (pub: any) => {
    const nextStatus = pub.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch("/api/admin/publications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pub.id, status: nextStatus }),
      });
      if (res.ok) {
        setPublications(
          publications.map((p) => (p.id === pub.id ? { ...p, status: nextStatus } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/publications?id=${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPublications(publications.filter((p) => p.id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered publications
  const filtered = publications.filter((p) => {
    if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q) ||
        p.venue.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Publications Management"
        subtitle="Create, edit, toggle draft/publish, and organize peer-reviewed journal & conference papers."
        actions={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Publication</span>
          </button>
        }
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        {feedback && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, author, venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-xs font-semibold text-slate-500">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="ALL">All Statuses ({publications.length})</option>
              <option value="PUBLISHED">Published Only</option>
              <option value="DRAFT">Drafts Only</option>
            </select>
          </div>
        </div>

        {/* Publications Table */}
        <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Publication Title & Venue</th>
                  <th className="py-3.5 px-4">Year</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length > 0 ? (
                  filtered.map((pub) => (
                    <tr key={pub.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 max-w-md">
                        <span className="font-bold text-slate-900 block leading-snug">
                          {pub.title}
                        </span>
                        <span className="text-slate-500 block text-[11px] mt-0.5">
                          {pub.authors} • <em className="text-slate-700">{pub.venue}</em>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">{pub.year}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {pub.publicationType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleStatus(pub)}
                          title="Click to toggle status"
                          className="hover:opacity-80 transition-opacity"
                        >
                          <StatusBadge status={pub.status} />
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview button */}
                          <button
                            onClick={() => setPreviewItem(pub)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Live Public Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit button */}
                          <button
                            onClick={() => handleOpenEdit(pub)}
                            className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => setDeleteId(pub.id)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Publication"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No publications found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create / Edit Publication Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="font-bold text-sm text-slate-900">
                {modalMode === "create" ? "Add New Publication" : "Edit Publication"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Paper Title</label>
                <input
                  type="text"
                  value={activePublication.title}
                  onChange={(e) =>
                    setActivePublication({ ...activePublication, title: e.target.value })
                  }
                  required
                  placeholder="Full title of the manuscript or article"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Authors (Comma-separated)</label>
                <input
                  type="text"
                  value={activePublication.authors}
                  onChange={(e) =>
                    setActivePublication({ ...activePublication, authors: e.target.value })
                  }
                  required
                  placeholder="e.g. Rajput, A., Paik, J. K., Iqbal, M. A."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Publication Type</label>
                  <select
                    value={activePublication.publicationType}
                    onChange={(e) =>
                      setActivePublication({ ...activePublication, publicationType: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="JOURNAL">Journal Paper</option>
                    <option value="CONFERENCE">Conference Paper</option>
                    <option value="BOOK_CHAPTER">Book Chapter</option>
                    <option value="BOOK">Book</option>
                    <option value="OTHER">Other Technical Report</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Publication Year</label>
                  <input
                    type="number"
                    value={activePublication.year}
                    onChange={(e) =>
                      setActivePublication({ ...activePublication, year: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Venue (Journal or Conference Name)</label>
                <input
                  type="text"
                  value={activePublication.venue}
                  onChange={(e) =>
                    setActivePublication({ ...activePublication, venue: e.target.value })
                  }
                  required
                  placeholder="e.g. Thin-Walled Structures (Elsevier)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Volume</label>
                  <input
                    type="text"
                    value={activePublication.volume || ""}
                    onChange={(e) =>
                      setActivePublication({ ...activePublication, volume: e.target.value })
                    }
                    placeholder="e.g. 126"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Issue</label>
                  <input
                    type="text"
                    value={activePublication.issue || ""}
                    onChange={(e) =>
                      setActivePublication({ ...activePublication, issue: e.target.value })
                    }
                    placeholder="e.g. 2"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Pages</label>
                  <input
                    type="text"
                    value={activePublication.pages || ""}
                    onChange={(e) =>
                      setActivePublication({ ...activePublication, pages: e.target.value })
                    }
                    placeholder="e.g. 171-181"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Digital Object Identifier (DOI)</label>
                  <input
                    type="text"
                    value={activePublication.doi || ""}
                    onChange={(e) =>
                      setActivePublication({ ...activePublication, doi: e.target.value })
                    }
                    placeholder="10.1016/j.istruc.2020.06.014"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Research Discipline</label>
                  <select
                    value={activePublication.researchAreaId || ""}
                    onChange={(e) =>
                      setActivePublication({ ...activePublication, researchAreaId: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="">None Selected</option>
                    {researchAreas.map((ra) => (
                      <option key={ra.id} value={ra.id}>
                        {ra.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <FileUploader
                  label="Upload Full-Text PDF"
                  folder="papers"
                  allowedExtensions={[".pdf"]}
                  maxSizeMB={20}
                  currentUrl={activePublication.pdfUrl}
                  onUploadSuccess={(url) =>
                    setActivePublication({ ...activePublication, pdfUrl: url })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Abstract</label>
                <textarea
                  rows={4}
                  value={activePublication.abstract || ""}
                  onChange={(e) =>
                    setActivePublication({ ...activePublication, abstract: e.target.value })
                  }
                  placeholder="Summary of research methodology and experimental findings..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activePublication.isFeatured}
                      onChange={(e) =>
                        setActivePublication({ ...activePublication, isFeatured: e.target.checked })
                      }
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-slate-700">Featured Paper</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activePublication.status === "PUBLISHED"}
                      onChange={(e) =>
                        setActivePublication({
                          ...activePublication,
                          status: e.target.checked ? "PUBLISHED" : "DRAFT",
                        })
                      }
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-slate-700">
                      Publish Live on Website
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm transition-colors"
                >
                  {saving ? "Saving..." : "Save Publication"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewItem && (
        <PreviewModal
          isOpen={Boolean(previewItem)}
          onClose={() => setPreviewItem(null)}
          title={previewItem.title}
        >
          <PublicationCard publication={previewItem} />
        </PreviewModal>
      )}

      {/* Confirmation Dialog for Deletion */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Publication"
        message="Are you sure you want to permanently delete this publication record? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
