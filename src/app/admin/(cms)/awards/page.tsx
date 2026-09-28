"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Plus, Edit2, Trash2, Award, BookmarkCheck, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminAwardsPage() {
  const [awards, setAwards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeAward, setActiveAward] = useState<any>({
    title: "",
    organization: "",
    year: new Date().getFullYear().toString(),
    description: "",
    certificateUrl: "",
    isFeatured: false,
    isPublished: true,
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchAwards = async () => {
    try {
      const res = await fetch("/api/admin/awards");
      const data = await res.json();
      if (data.awards) setAwards(data.awards);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  const handleOpenCreate = () => {
    setModalMode("create");
    setActiveAward({
      title: "",
      organization: "",
      year: new Date().getFullYear().toString(),
      description: "",
      certificateUrl: "",
      isFeatured: false,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (award: any) => {
    setModalMode("edit");
    setActiveAward(award);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const method = modalMode === "create" ? "POST" : "PUT";
      const res = await fetch("/api/admin/awards", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activeAward),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save award");

      setFeedback({
        type: "success",
        text: `Award ${modalMode === "create" ? "created" : "updated"} successfully!`,
      });
      setIsModalOpen(false);
      fetchAwards();
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to save award" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/awards?id=${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setAwards(awards.filter((a) => a.id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Awards, Honors & Fellowships"
        subtitle="Manage academic distinctions, national research fellowships, and grant recognitions."
        actions={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Award / Honor</span>
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
                  <th className="py-3.5 px-4 w-20">Year</th>
                  <th className="py-3.5 px-4">Award Title</th>
                  <th className="py-3.5 px-4">Conferring Organization</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {awards.length > 0 ? (
                  awards.map((award) => (
                    <tr key={award.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-emerald-900">{award.year}</td>
                      <td className="py-3.5 px-4 max-w-sm">
                        <strong className="text-slate-900 block font-bold text-sm leading-snug">
                          {award.title}
                        </strong>
                        {award.description && (
                          <span className="text-slate-500 text-[11px] line-clamp-1 block mt-0.5">
                            {award.description}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {award.organization}
                      </td>
                      <td className="py-3.5 px-4">
                        {award.isFeatured ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                            <BookmarkCheck className="w-3 h-3" />
                            <span>Featured</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge isPublished={award.isPublished} status="" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(award)}
                            className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg"
                            title="Edit Award"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(award.id)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg"
                            title="Delete Award"
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
                      No awards listed yet. Click "Add Award / Honor" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="font-bold text-sm text-slate-900">
                {modalMode === "create" ? "Add Award / Honor" : "Edit Award"}
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
                <label className="font-bold text-slate-700">Award / Honor Title</label>
                <input
                  type="text"
                  value={activeAward.title}
                  onChange={(e) => setActiveAward({ ...activeAward, title: e.target.value })}
                  required
                  placeholder="e.g. Post-Doctoral Fellowship"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Organization</label>
                  <input
                    type="text"
                    value={activeAward.organization}
                    onChange={(e) =>
                      setActiveAward({ ...activeAward, organization: e.target.value })
                    }
                    required
                    placeholder="e.g. Korean Ships and Offshore Structure Institute"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Year</label>
                  <input
                    type="text"
                    value={activeAward.year}
                    onChange={(e) => setActiveAward({ ...activeAward, year: e.target.value })}
                    required
                    placeholder="2017"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description / Citation</label>
                <textarea
                  rows={3}
                  value={activeAward.description || ""}
                  onChange={(e) =>
                    setActiveAward({ ...activeAward, description: e.target.value })
                  }
                  placeholder="Details of the fellowship, selection criteria, or grant magnitude..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeAward.isFeatured}
                      onChange={(e) =>
                        setActiveAward({ ...activeAward, isFeatured: e.target.checked })
                      }
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-slate-700">Highlight / Featured</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeAward.isPublished}
                      onChange={(e) =>
                        setActiveAward({ ...activeAward, isPublished: e.target.checked })
                      }
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-slate-700">Publish Live</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm transition-colors"
                >
                  {saving ? "Saving..." : "Save Award"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Award"
        message="Are you sure you want to remove this award or recognition?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
