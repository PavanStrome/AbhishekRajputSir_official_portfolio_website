"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import PreviewModal from "@/components/admin/PreviewModal";
import ResearchCard from "@/components/public/ResearchCard";
import { Plus, Edit2, Trash2, Eye, Layers, ArrowUp, ArrowDown, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminResearchPage() {
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeArea, setActiveArea] = useState<any>({
    title: "",
    slug: "",
    summary: "",
    description: "",
    keywords: "",
    order: 0,
    isPublished: true,
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchAreas = async () => {
    try {
      const res = await fetch("/api/admin/research");
      const data = await res.json();
      if (data.areas) setAreas(data.areas);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleOpenCreate = () => {
    setModalMode("create");
    setActiveArea({
      title: "",
      slug: "",
      summary: "",
      description: "",
      keywords: "",
      order: areas.length + 1,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (area: any) => {
    setModalMode("edit");
    setActiveArea(area);
    setIsModalOpen(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (val: string) => {
    setActiveArea({
      ...activeArea,
      title: val,
      slug: modalMode === "create" ? generateSlug(val) : activeArea.slug,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const method = modalMode === "create" ? "POST" : "PUT";
      const res = await fetch("/api/admin/research", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...activeArea,
          order: Number(activeArea.order),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save research area");

      setFeedback({
        type: "success",
        text: `Research area ${modalMode === "create" ? "created" : "updated"} successfully!`,
      });
      setIsModalOpen(false);
      fetchAreas();
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to save area" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/research?id=${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setAreas(areas.filter((a) => a.id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newAreas = [...areas];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newAreas.length) return;

    const temp = newAreas[index];
    newAreas[index] = newAreas[targetIdx];
    newAreas[targetIdx] = temp;

    setAreas(newAreas);

    // Save orders
    await Promise.all(
      newAreas.map((item, idx) =>
        fetch("/api/admin/research", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...item, order: idx + 1 }),
        })
      )
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Research Disciplines"
        subtitle="Manage primary research programs, scientific methodologies, and associated key themes."
        actions={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Research Discipline</span>
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

        <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 w-12 text-center">Order</th>
                  <th className="py-3.5 px-4">Discipline Title & Summary</th>
                  <th className="py-3.5 px-4">Keywords</th>
                  <th className="py-3.5 px-4">Papers</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {areas.length > 0 ? (
                  areas.map((area, idx) => (
                    <tr key={area.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-400">
                          <button
                            onClick={() => handleMove(idx, "up")}
                            disabled={idx === 0}
                            className="p-1 hover:text-slate-800 disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMove(idx, "down")}
                            disabled={idx === areas.length - 1}
                            className="p-1 hover:text-slate-800 disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-sm">
                        <strong className="text-slate-900 block font-bold text-sm leading-snug">
                          {area.title}
                        </strong>
                        <p className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">
                          {area.summary}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {area.keywords || "—"}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {area._count?.publications || 0}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge isPublished={area.isPublished} status="" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewItem(area)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Preview Public Card"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(area)}
                            className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit Discipline"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(area.id)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Discipline"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No research areas defined yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="font-bold text-sm text-slate-900">
                {modalMode === "create" ? "Add Research Discipline" : "Edit Research Discipline"}
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
                <label className="font-bold text-slate-700">Discipline Title</label>
                <input
                  type="text"
                  value={activeArea.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  placeholder="e.g. Impact & Ballistic Mechanics"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">URL Slug</label>
                <input
                  type="text"
                  value={activeArea.slug}
                  onChange={(e) => setActiveArea({ ...activeArea, slug: e.target.value })}
                  required
                  placeholder="impact-ballistic-mechanics"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Summary Statement</label>
                <textarea
                  rows={2}
                  value={activeArea.summary}
                  onChange={(e) => setActiveArea({ ...activeArea, summary: e.target.value })}
                  required
                  placeholder="Concise 1-2 sentence overview of the research program..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Detailed Description & Methodology</label>
                <textarea
                  rows={5}
                  value={activeArea.description}
                  onChange={(e) => setActiveArea({ ...activeArea, description: e.target.value })}
                  required
                  placeholder="Experimental protocols, projectile launchers, finite element solvers (LS-DYNA), and theoretical foundations..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Scientific Keywords (Comma-separated)</label>
                <input
                  type="text"
                  value={activeArea.keywords || ""}
                  onChange={(e) => setActiveArea({ ...activeArea, keywords: e.target.value })}
                  placeholder="Ballistic Impact, High Strain Rate, Concrete Penetration"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeArea.isPublished}
                    onChange={(e) => setActiveArea({ ...activeArea, isPublished: e.target.checked })}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-700">Publish Live</span>
                </label>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm transition-colors"
                >
                  {saving ? "Saving..." : "Save Discipline"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <PreviewModal
          isOpen={Boolean(previewItem)}
          onClose={() => setPreviewItem(null)}
          title={previewItem.title}
        >
          <ResearchCard
            id={previewItem.id}
            title={previewItem.title}
            slug={previewItem.slug}
            summary={previewItem.summary}
            description={previewItem.description}
            keywords={previewItem.keywords}
          />
        </PreviewModal>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Research Discipline"
        message="Are you sure you want to remove this research area? Associated publications will remain intact."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
