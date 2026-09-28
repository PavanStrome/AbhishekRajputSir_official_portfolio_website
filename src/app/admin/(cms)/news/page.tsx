"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Plus, Edit2, Trash2, Bell, Calendar, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";

export default function AdminNewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeNews, setActiveNews] = useState<any>({
    title: "",
    slug: "",
    date: new Date().toISOString().split("T")[0],
    content: "",
    category: "ANNOUNCEMENT",
    externalUrl: "",
    isFeatured: false,
    status: "PUBLISHED",
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/admin/news");
      const data = await res.json();
      if (data.news) setNews(data.news);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleOpenCreate = () => {
    setModalMode("create");
    const today = new Date().toISOString().split("T")[0];
    setActiveNews({
      title: "",
      slug: "",
      date: today,
      content: "",
      category: "ANNOUNCEMENT",
      externalUrl: "",
      isFeatured: false,
      status: "PUBLISHED",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setModalMode("edit");
    const dateFormatted = new Date(item.date).toISOString().split("T")[0];
    setActiveNews({ ...item, date: dateFormatted });
    setIsModalOpen(true);
  };

  const generateSlug = (title: string) => {
    return (
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString().slice(-4)
    );
  };

  const handleTitleChange = (val: string) => {
    setActiveNews({
      ...activeNews,
      title: val,
      slug: modalMode === "create" ? generateSlug(val) : activeNews.slug,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const method = modalMode === "create" ? "POST" : "PUT";
      const res = await fetch("/api/admin/news", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activeNews),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save news announcement");

      setFeedback({
        type: "success",
        text: `Announcement ${modalMode === "create" ? "published" : "updated"} successfully!`,
      });
      setIsModalOpen(false);
      fetchNews();
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to save news" });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (item: any) => {
    const nextStatus = item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch("/api/admin/news", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, status: nextStatus }),
      });
      if (res.ok) {
        setNews(news.map((n) => (n.id === item.id ? { ...n, status: nextStatus } : n)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/news?id=${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setNews(news.filter((n) => n.id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="News & Announcements"
        subtitle="Manage public announcements, paper acceptance alerts, invited talks, and symposium updates."
        actions={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Announcement</span>
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
                  <th className="py-3.5 px-4 w-28">Date</th>
                  <th className="py-3.5 px-4">Announcement Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {news.length > 0 ? (
                  news.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 text-slate-600 font-semibold">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 px-4 max-w-md">
                        <strong className="text-slate-900 block font-bold text-sm leading-snug">
                          {item.title}
                        </strong>
                        <p className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">
                          {item.content}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleStatus(item)}
                          title="Click to toggle status"
                        >
                          <StatusBadge status={item.status} />
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg"
                            title="Edit Announcement"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(item.id)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg"
                            title="Delete Announcement"
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
                      No announcements posted yet. Click "New Announcement" to publish one.
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
                {modalMode === "create" ? "Create Announcement" : "Edit Announcement"}
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
                <label className="font-bold text-slate-700">Announcement Title</label>
                <input
                  type="text"
                  value={activeNews.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  placeholder="e.g. Paper Accepted in Structures journal"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Date</label>
                  <input
                    type="date"
                    value={activeNews.date}
                    onChange={(e) => setActiveNews({ ...activeNews, date: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={activeNews.category}
                    onChange={(e) => setActiveNews({ ...activeNews, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="ANNOUNCEMENT">General Announcement</option>
                    <option value="PAPER">Paper Accepted / Published</option>
                    <option value="GRANT">Research Grant Received</option>
                    <option value="TALK">Keynote / Invited Talk</option>
                    <option value="AWARD">Fellowship / Honor</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description / Announcement Content</label>
                <textarea
                  rows={4}
                  value={activeNews.content}
                  onChange={(e) => setActiveNews({ ...activeNews, content: e.target.value })}
                  required
                  placeholder="Details of the announcement, symposium location, or co-author acknowledgement..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">External Web Link (Optional)</label>
                <input
                  type="url"
                  value={activeNews.externalUrl || ""}
                  onChange={(e) => setActiveNews({ ...activeNews, externalUrl: e.target.value })}
                  placeholder="https://doi.org/... or conference website"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeNews.status === "PUBLISHED"}
                    onChange={(e) =>
                      setActiveNews({
                        ...activeNews,
                        status: e.target.checked ? "PUBLISHED" : "DRAFT",
                      })
                    }
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-700">Publish Live</span>
                </label>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm transition-colors"
                >
                  {saving ? "Saving..." : "Save Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Announcement"
        message="Are you sure you want to remove this news announcement?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
