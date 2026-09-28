"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import PreviewModal from "@/components/admin/PreviewModal";
import FileUploader from "@/components/admin/FileUploader";
import StudentCard from "@/components/public/StudentCard";
import { Plus, Edit2, Trash2, Eye, Users, CheckCircle, AlertCircle, ArrowUp, ArrowDown } from "lucide-react";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeStudent, setActiveStudent] = useState<any>({
    name: "",
    category: "PHD",
    researchArea: "",
    degree: "Ph.D. Scholar",
    joiningYear: new Date().getFullYear().toString(),
    graduationYear: "",
    status: "CURRENT",
    photoUrl: "",
    bio: "",
    websiteUrl: "",
    linkedinUrl: "",
    scholarUrl: "",
    email: "",
    isPublished: true,
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/admin/students");
      const data = await res.json();
      if (data.students) setStudents(data.students);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleOpenCreate = () => {
    setModalMode("create");
    setActiveStudent({
      name: "",
      category: "PHD",
      researchArea: "",
      degree: "Ph.D. Scholar",
      joiningYear: new Date().getFullYear().toString(),
      graduationYear: "",
      status: "CURRENT",
      photoUrl: "",
      bio: "",
      websiteUrl: "",
      linkedinUrl: "",
      scholarUrl: "",
      email: "",
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (stu: any) => {
    setModalMode("edit");
    setActiveStudent(stu);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const method = modalMode === "create" ? "POST" : "PUT";
      const res = await fetch("/api/admin/students", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activeStudent),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save student");

      setFeedback({
        type: "success",
        text: `Student ${modalMode === "create" ? "added" : "updated"} successfully!`,
      });
      setIsModalOpen(false);
      fetchStudents();
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to save student" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/students?id=${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setStudents(students.filter((s) => s.id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Research Group & Personnel"
        subtitle="Manage doctoral candidates, master's students, technical staff, and alumni."
        actions={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Group Member</span>
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
                  <th className="py-3.5 px-4">Member Name</th>
                  <th className="py-3.5 px-4">Role / Category</th>
                  <th className="py-3.5 px-4">Research Topic</th>
                  <th className="py-3.5 px-4">Joining Year</th>
                  <th className="py-3.5 px-4">Visibility</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.length > 0 ? (
                  students.map((stu) => (
                    <tr key={stu.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <strong className="text-slate-900 block font-bold text-sm">
                          {stu.name}
                        </strong>
                        <span className="text-slate-500 text-[11px] block">{stu.degree}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">{stu.category}</td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {stu.researchArea || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{stu.joiningYear}</td>
                      <td className="py-3.5 px-4">
                        <StatusBadge isPublished={stu.isPublished} status="" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewItem(stu)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                            title="Preview Member Card"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(stu)}
                            className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg"
                            title="Edit Member"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(stu.id)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg"
                            title="Delete Member"
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
                      No group members found. Click "Add Group Member" to create one.
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
                {modalMode === "create" ? "Add Research Group Member" : "Edit Group Member"}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={activeStudent.name}
                    onChange={(e) => setActiveStudent({ ...activeStudent, name: e.target.value })}
                    required
                    placeholder="e.g. Ankit Sharma"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category / Role</label>
                  <select
                    value={activeStudent.category}
                    onChange={(e) =>
                      setActiveStudent({ ...activeStudent, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="PHD">Ph.D. Scholar</option>
                    <option value="MASTERS">M.Tech / Master's Student</option>
                    <option value="UNDERGRAD">B.Tech / Undergraduate Researcher</option>
                    <option value="STAFF">Technical Assistant / Staff</option>
                    <option value="ALUMNI">Alumnus</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Degree / Designation</label>
                  <input
                    type="text"
                    value={activeStudent.degree || ""}
                    onChange={(e) => setActiveStudent({ ...activeStudent, degree: e.target.value })}
                    placeholder="e.g. Ph.D. Scholar or Senior Technical Assistant"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Joining Year</label>
                  <input
                    type="text"
                    value={activeStudent.joiningYear || ""}
                    onChange={(e) =>
                      setActiveStudent({ ...activeStudent, joiningYear: e.target.value })
                    }
                    placeholder="2022"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Research Topic / Expertise</label>
                <input
                  type="text"
                  value={activeStudent.researchArea || ""}
                  onChange={(e) =>
                    setActiveStudent({ ...activeStudent, researchArea: e.target.value })
                  }
                  placeholder="e.g. High-velocity projectile penetration in UHPC"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <FileUploader
                  label="Member Photograph"
                  folder="students"
                  allowedExtensions={[".jpg", ".jpeg", ".png", ".webp"]}
                  maxSizeMB={5}
                  currentUrl={activeStudent.photoUrl}
                  onUploadSuccess={(url) =>
                    setActiveStudent({ ...activeStudent, photoUrl: url })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Short Biography / Statement</label>
                <textarea
                  rows={3}
                  value={activeStudent.bio || ""}
                  onChange={(e) => setActiveStudent({ ...activeStudent, bio: e.target.value })}
                  placeholder="Brief description of research focus and prior background..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={activeStudent.email || ""}
                    onChange={(e) => setActiveStudent({ ...activeStudent, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">LinkedIn URL</label>
                  <input
                    type="url"
                    value={activeStudent.linkedinUrl || ""}
                    onChange={(e) =>
                      setActiveStudent({ ...activeStudent, linkedinUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeStudent.isPublished}
                    onChange={(e) =>
                      setActiveStudent({ ...activeStudent, isPublished: e.target.checked })
                    }
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-700">Publish on Public Page</span>
                </label>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm transition-colors"
                >
                  {saving ? "Saving..." : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview */}
      {previewItem && (
        <PreviewModal
          isOpen={Boolean(previewItem)}
          onClose={() => setPreviewItem(null)}
          title={previewItem.name}
        >
          <StudentCard {...previewItem} />
        </PreviewModal>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Group Member"
        message="Are you sure you want to remove this student or staff profile?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
