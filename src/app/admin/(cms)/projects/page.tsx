"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import PreviewModal from "@/components/admin/PreviewModal";
import ProjectCard from "@/components/public/ProjectCard";
import { Plus, Edit2, Trash2, Eye, Briefcase, CheckCircle, AlertCircle, Copy } from "lucide-react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeProject, setActiveProject] = useState<any>({
    title: "",
    slug: "",
    shortDescription: "",
    detailedDescription: "",
    status: "ONGOING",
    role: "Principal Investigator",
    fundingAgency: "",
    grantAmount: "",
    startDate: "",
    endDate: "",
    projectUrl: "",
    isFeatured: false,
    isPublished: true,
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (data.projects) setProjects(data.projects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenCreate = () => {
    setModalMode("create");
    setActiveProject({
      title: "",
      slug: "",
      shortDescription: "",
      detailedDescription: "",
      status: "ONGOING",
      role: "Principal Investigator",
      fundingAgency: "",
      grantAmount: "",
      startDate: "",
      endDate: "",
      projectUrl: "",
      isFeatured: false,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: any) => {
    setModalMode("edit");
    setActiveProject(proj);
    setIsModalOpen(true);
  };

  const handleDuplicate = (proj: any) => {
    setModalMode("create");
    setActiveProject({
      ...proj,
      id: undefined,
      title: `${proj.title} (Copy)`,
      slug: `${proj.slug}-copy-${Date.now().toString().slice(-4)}`,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const method = modalMode === "create" ? "POST" : "PUT";
      const res = await fetch("/api/admin/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activeProject),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save project");

      setFeedback({
        type: "success",
        text: `Project ${modalMode === "create" ? "created" : "updated"} successfully!`,
      });
      setIsModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to save project" });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (proj: any) => {
    try {
      const next = !proj.isPublished;
      const res = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: proj.id, isPublished: next }),
      });
      if (res.ok) {
        setProjects(projects.map((p) => (p.id === proj.id ? { ...p, isPublished: next } : p)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Sponsored Projects & Grants"
        subtitle="Manage funding agencies, timelines, research grants, and investigator roles."
        actions={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
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
                  <th className="py-3.5 px-4">Project Title</th>
                  <th className="py-3.5 px-4">Funding Agency</th>
                  <th className="py-3.5 px-4">Timeline</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Visibility</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.length > 0 ? (
                  projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 max-w-sm">
                        <strong className="text-slate-900 block font-bold text-sm leading-snug">
                          {proj.title}
                        </strong>
                        <span className="text-slate-500 text-[11px] block mt-0.5">
                          {proj.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {proj.fundingAgency || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {proj.startDate} {proj.endDate ? `– ${proj.endDate}` : ""}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            proj.status === "ONGOING"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {proj.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleTogglePublish(proj)}
                          title="Click to toggle publish"
                        >
                          <StatusBadge isPublished={proj.isPublished} status="" />
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewItem(proj)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                            title="Preview Public Card"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(proj)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                            title="Duplicate Project"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(proj)}
                            className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg"
                            title="Edit Project"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(proj.id)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg"
                            title="Delete Project"
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
                      No research projects found. Click "Add New Project" to create one.
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
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="font-bold text-sm text-slate-900">
                {modalMode === "create" ? "Add Sponsored Project" : "Edit Project"}
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
                <label className="font-bold text-slate-700">Project Title</label>
                <input
                  type="text"
                  value={activeProject.title}
                  onChange={(e) => setActiveProject({ ...activeProject, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">URL Slug</label>
                  <input
                    type="text"
                    value={activeProject.slug}
                    onChange={(e) => setActiveProject({ ...activeProject, slug: e.target.value })}
                    required
                    placeholder="concrete-under-high-rate-of-loading"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Status</label>
                  <select
                    value={activeProject.status}
                    onChange={(e) => setActiveProject({ ...activeProject, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="ONGOING">Ongoing / Active</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Funding Agency</label>
                  <input
                    type="text"
                    value={activeProject.fundingAgency || ""}
                    onChange={(e) =>
                      setActiveProject({ ...activeProject, fundingAgency: e.target.value })
                    }
                    placeholder="e.g. TEQIP-III / DST / Ministry of Defence"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Project Role</label>
                  <input
                    type="text"
                    value={activeProject.role}
                    onChange={(e) => setActiveProject({ ...activeProject, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Start Date</label>
                  <input
                    type="text"
                    value={activeProject.startDate || ""}
                    onChange={(e) =>
                      setActiveProject({ ...activeProject, startDate: e.target.value })
                    }
                    placeholder="e.g. Dec 2020"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">End Date</label>
                  <input
                    type="text"
                    value={activeProject.endDate || ""}
                    onChange={(e) =>
                      setActiveProject({ ...activeProject, endDate: e.target.value })
                    }
                    placeholder="e.g. Dec 2023 or Present"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Short Summary</label>
                <textarea
                  rows={2}
                  value={activeProject.shortDescription}
                  onChange={(e) =>
                    setActiveProject({ ...activeProject, shortDescription: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Detailed Description</label>
                <textarea
                  rows={4}
                  value={activeProject.detailedDescription}
                  onChange={(e) =>
                    setActiveProject({ ...activeProject, detailedDescription: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeProject.isPublished}
                    onChange={(e) =>
                      setActiveProject({ ...activeProject, isPublished: e.target.checked })
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
                  {saving ? "Saving..." : "Save Project"}
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
          <ProjectCard {...previewItem} />
        </PreviewModal>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Sponsored Project"
        message="Are you sure you want to remove this project? This action is permanent."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
