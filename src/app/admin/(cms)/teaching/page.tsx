"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import PreviewModal from "@/components/admin/PreviewModal";
import FileUploader from "@/components/admin/FileUploader";
import CourseCard from "@/components/public/CourseCard";
import { Plus, Edit2, Trash2, Eye, GraduationCap, CheckCircle, AlertCircle, FileText } from "lucide-react";

export default function AdminTeachingPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeCourse, setActiveCourse] = useState<any>({
    code: "",
    title: "",
    semester: "Autumn",
    academicYear: "2024-2025",
    level: "Undergraduate (B.Tech)",
    description: "",
    syllabusUrl: "",
    courseUrl: "",
    isPublished: true,
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/admin/teaching");
      const data = await res.json();
      if (data.courses) setCourses(data.courses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenCreate = () => {
    setModalMode("create");
    setActiveCourse({
      code: "",
      title: "",
      semester: "Autumn",
      academicYear: "2024-2025",
      level: "Undergraduate (B.Tech)",
      description: "",
      syllabusUrl: "",
      courseUrl: "",
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: any) => {
    setModalMode("edit");
    setActiveCourse(course);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const method = modalMode === "create" ? "POST" : "PUT";
      const res = await fetch("/api/admin/teaching", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activeCourse),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save course");

      setFeedback({
        type: "success",
        text: `Course ${modalMode === "create" ? "created" : "updated"} successfully!`,
      });
      setIsModalOpen(false);
      fetchCourses();
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to save course" });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (course: any) => {
    try {
      const next = !course.isPublished;
      const res = await fetch("/api/admin/teaching", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: course.id, isPublished: next }),
      });
      if (res.ok) {
        setCourses(courses.map((c) => (c.id === course.id ? { ...c, isPublished: next } : c)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/teaching?id=${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setCourses(courses.filter((c) => c.id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Teaching & Courses"
        subtitle="Manage academic courses, codes, semester groupings, and syllabus document uploads."
        actions={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Course</span>
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
                  <th className="py-3.5 px-4">Code & Course Title</th>
                  <th className="py-3.5 px-4">Academic Term</th>
                  <th className="py-3.5 px-4">Level</th>
                  <th className="py-3.5 px-4">Syllabus</th>
                  <th className="py-3.5 px-4">Visibility</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded text-[10px]">
                            {course.code}
                          </span>
                          <strong className="text-slate-900 font-bold text-sm leading-snug">
                            {course.title}
                          </strong>
                        </div>
                        <p className="text-slate-500 text-[11px] line-clamp-1 mt-1">
                          {course.description}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {course.semester} • {course.academicYear}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{course.level}</td>
                      <td className="py-3.5 px-4">
                        {course.syllabusUrl ? (
                          <a
                            href={course.syllabusUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-medium text-[11px]"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </a>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleTogglePublish(course)}
                          title="Click to toggle publish"
                        >
                          <StatusBadge isPublished={course.isPublished} status="" />
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewItem(course)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                            title="Preview Public Card"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(course)}
                            className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg"
                            title="Edit Course"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(course.id)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg"
                            title="Delete Course"
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
                      No courses found. Click "Add New Course" to create one.
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
                {modalMode === "create" ? "Add New Course" : "Edit Course"}
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Course Code</label>
                  <input
                    type="text"
                    value={activeCourse.code}
                    onChange={(e) => setActiveCourse({ ...activeCourse, code: e.target.value })}
                    required
                    placeholder="e.g. CE 201"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">Course Title</label>
                  <input
                    type="text"
                    value={activeCourse.title}
                    onChange={(e) => setActiveCourse({ ...activeCourse, title: e.target.value })}
                    required
                    placeholder="e.g. Structural Mechanics"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Semester</label>
                  <select
                    value={activeCourse.semester}
                    onChange={(e) => setActiveCourse({ ...activeCourse, semester: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Autumn">Autumn</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Academic Year</label>
                  <input
                    type="text"
                    value={activeCourse.academicYear}
                    onChange={(e) =>
                      setActiveCourse({ ...activeCourse, academicYear: e.target.value })
                    }
                    required
                    placeholder="2024-2025"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Level</label>
                  <input
                    type="text"
                    value={activeCourse.level}
                    onChange={(e) => setActiveCourse({ ...activeCourse, level: e.target.value })}
                    required
                    placeholder="Undergraduate (B.Tech)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Course Syllabus & Description</label>
                <textarea
                  rows={4}
                  value={activeCourse.description}
                  onChange={(e) =>
                    setActiveCourse({ ...activeCourse, description: e.target.value })
                  }
                  required
                  placeholder="Topics covered, energy methods, finite element formulations..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <FileUploader
                  label="Upload Syllabus Outline (PDF)"
                  folder="syllabus"
                  allowedExtensions={[".pdf"]}
                  maxSizeMB={15}
                  currentUrl={activeCourse.syllabusUrl}
                  onUploadSuccess={(url) =>
                    setActiveCourse({ ...activeCourse, syllabusUrl: url })
                  }
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeCourse.isPublished}
                    onChange={(e) =>
                      setActiveCourse({ ...activeCourse, isPublished: e.target.checked })
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
                  {saving ? "Saving..." : "Save Course"}
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
          <CourseCard {...previewItem} />
        </PreviewModal>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Course"
        message="Are you sure you want to remove this course from the academic catalog?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
