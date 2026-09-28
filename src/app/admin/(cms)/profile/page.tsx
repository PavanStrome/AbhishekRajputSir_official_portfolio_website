"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import FileUploader from "@/components/admin/FileUploader";
import { Check, Loader2, Save, Plus, Trash2, Edit2, AlertCircle } from "lucide-react";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<any>({});
  const [education, setEducation] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // New education modal state
  const [newDegree, setNewDegree] = useState({ degree: "", field: "", institution: "", year: "", location: "" });
  // New position modal state
  const [newPosition, setNewPosition] = useState({ title: "", institution: "", department: "", startYear: "", endYear: "", isCurrent: false });

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((res) => res.json())
      .then((d) => {
        if (d.profile) setProfile(d.profile);
        if (d.education) setEducation(d.education);
        if (d.positions) setPositions(d.positions);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        setLoading(false);
      });
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setProfile(data.profile);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDegree.degree || !newDegree.institution || !newDegree.year) return;

    try {
      const res = await fetch("/api/admin/education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDegree),
      });
      const data = await res.json();
      if (res.ok) {
        setEducation([...education, data.item]);
        setNewDegree({ degree: "", field: "", institution: "", year: "", location: "" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm("Are you sure you want to remove this education record?")) return;
    try {
      const res = await fetch(`/api/admin/education?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setEducation(education.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPosition.title || !newPosition.institution || !newPosition.startYear) return;

    try {
      const res = await fetch("/api/admin/positions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPosition),
      });
      const data = await res.json();
      if (res.ok) {
        setPositions([...positions, data.item]);
        setNewPosition({ title: "", institution: "", department: "", startYear: "", endYear: "", isCurrent: false });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePosition = async (id: string) => {
    if (!confirm("Are you sure you want to remove this appointment?")) return;
    try {
      const res = await fetch(`/api/admin/positions?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPositions(positions.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-700 mb-2" />
        <p className="text-xs">Loading faculty profile data...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Faculty Profile & Biography"
        subtitle="Manage designations, biographical narratives, office hours, and academic credentials."
        actions={
          <button
            onClick={handleProfileSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Profile</span>
          </button>
        }
      />

      <div className="p-6 sm:p-8 space-y-10 max-w-5xl">
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleProfileSave} className="space-y-8">
          {/* Identity & Photo Card */}
          <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              1. Professional Identity & Photograph
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div className="space-y-3">
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Current Profile Photo
                </span>
                <div className="w-36 h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Portrait" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                      No Photo
                    </div>
                  )}
                </div>
                <FileUploader
                  label="Upload / Replace Photo"
                  folder="profile"
                  allowedExtensions={[".jpg", ".jpeg", ".png", ".webp"]}
                  maxSizeMB={5}
                  currentUrl={profile.avatarUrl}
                  onUploadSuccess={(url) => setProfile({ ...profile, avatarUrl: url })}
                />
              </div>

              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={profile.name || ""}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Academic Title</label>
                  <input
                    type="text"
                    value={profile.title || ""}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    placeholder="Ph.D., IIT Roorkee"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Designation / Role</label>
                  <input
                    type="text"
                    value={profile.designation || ""}
                    onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Department</label>
                  <input
                    type="text"
                    value={profile.department || ""}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Institution</label>
                  <input
                    type="text"
                    value={profile.institution || ""}
                    onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Campus Location</label>
                  <input
                    type="text"
                    value={profile.location || ""}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Biographies & Research Interests */}
          <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-5 text-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              2. Biographies & Research Keywords
            </h2>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">
                Short Bio (Summarized in Hero and page headers)
              </label>
              <textarea
                rows={2}
                value={profile.shortBio || ""}
                onChange={(e) => setProfile({ ...profile, shortBio: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none leading-relaxed"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">
                Full Academic Biography (Markdown supported; paragraphs separated by blank lines)
              </label>
              <textarea
                rows={6}
                value={profile.bio || ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none leading-relaxed"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">
                Research Keywords & Disciplines (Comma-separated)
              </label>
              <input
                type="text"
                value={profile.researchInterests || ""}
                onChange={(e) => setProfile({ ...profile, researchInterests: e.target.value })}
                placeholder="Structural Mechanics, Impact Mechanics, Ballistic Penetration, Prestressed Concrete"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Office, Contact, and External Profiles */}
          <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-5 text-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              3. Office Details & Scholarly Profile Links
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Official Email</label>
                <input
                  type="email"
                  value={profile.email || ""}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Office Phone (Optional)</label>
                <input
                  type="text"
                  value={profile.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Office Room / Building</label>
                <input
                  type="text"
                  value={profile.office || ""}
                  onChange={(e) => setProfile({ ...profile, office: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Office Hours & Visiting Schedule</label>
                <input
                  type="text"
                  value={profile.officeHours || ""}
                  onChange={(e) => setProfile({ ...profile, officeHours: e.target.value })}
                  placeholder="Monday to Friday: 10:00 AM - 6:00 PM (by appointment)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Google Scholar Profile URL</label>
                <input
                  type="url"
                  value={profile.googleScholarUrl || ""}
                  onChange={(e) => setProfile({ ...profile, googleScholarUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">ORCID Identifier URL</label>
                <input
                  type="url"
                  value={profile.orcidUrl || ""}
                  onChange={(e) => setProfile({ ...profile, orcidUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">ResearchGate URL</label>
                <input
                  type="url"
                  value={profile.researchGateUrl || ""}
                  onChange={(e) => setProfile({ ...profile, researchGateUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={profile.linkedinUrl || ""}
                  onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save All Profile Details</span>
              </button>
            </div>
          </div>
        </form>

        {/* Manage Academic Positions */}
        <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            4. Academic Appointments & Trajectory
          </h2>

          <div className="space-y-3">
            {positions.map((pos) => (
              <div
                key={pos.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <strong className="text-slate-900 block font-bold text-sm">
                    {pos.title}
                  </strong>
                  <span className="text-slate-600">
                    {pos.institution} {pos.department && `• ${pos.department}`}
                  </span>
                  <span className="text-slate-400 block mt-0.5">
                    {pos.startYear} – {pos.isCurrent ? "Present" : pos.endYear}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeletePosition(pos.id)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddPosition} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
            <h3 className="font-bold text-slate-800">Add New Academic Appointment</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Title (e.g. Assistant Professor)"
                value={newPosition.title}
                onChange={(e) => setNewPosition({ ...newPosition, title: e.target.value })}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                required
              />
              <input
                type="text"
                placeholder="Institution (e.g. IIT Indore)"
                value={newPosition.institution}
                onChange={(e) => setNewPosition({ ...newPosition, institution: e.target.value })}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                required
              />
              <input
                type="text"
                placeholder="Department"
                value={newPosition.department}
                onChange={(e) => setNewPosition({ ...newPosition, department: e.target.value })}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Start Year"
                  value={newPosition.startYear}
                  onChange={(e) => setNewPosition({ ...newPosition, startYear: e.target.value })}
                  className="w-1/2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                  required
                />
                <input
                  type="text"
                  placeholder="End Year"
                  value={newPosition.endYear}
                  disabled={newPosition.isCurrent}
                  onChange={(e) => setNewPosition({ ...newPosition, endYear: e.target.value })}
                  className="w-1/2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 disabled:bg-slate-100"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPosition.isCurrent}
                  onChange={(e) => setNewPosition({ ...newPosition, isCurrent: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Current Position</span>
              </label>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                + Add Appointment
              </button>
            </div>
          </form>
        </div>

        {/* Manage Education Degrees */}
        <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            5. Education & Academic Degrees
          </h2>

          <div className="space-y-3">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <strong className="text-slate-900 block font-bold text-sm">
                    {edu.degree} in {edu.field}
                  </strong>
                  <span className="text-slate-600">
                    {edu.institution} ({edu.year})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteEducation(edu.id)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddEducation} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
            <h3 className="font-bold text-slate-800">Add Academic Degree</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Degree (e.g. Ph.D., M.Tech., B.E.)"
                value={newDegree.degree}
                onChange={(e) => setNewDegree({ ...newDegree, degree: e.target.value })}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                required
              />
              <input
                type="text"
                placeholder="Field / Discipline"
                value={newDegree.field}
                onChange={(e) => setNewDegree({ ...newDegree, field: e.target.value })}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                required
              />
              <input
                type="text"
                placeholder="Institution"
                value={newDegree.institution}
                onChange={(e) => setNewDegree({ ...newDegree, institution: e.target.value })}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                required
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Graduation Year (e.g. 2017)"
                  value={newDegree.year}
                  onChange={(e) => setNewDegree({ ...newDegree, year: e.target.value })}
                  className="w-1/2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                  required
                />
                <input
                  type="text"
                  placeholder="Location (Optional)"
                  value={newDegree.location}
                  onChange={(e) => setNewDegree({ ...newDegree, location: e.target.value })}
                  className="w-1/2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                + Add Degree
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
