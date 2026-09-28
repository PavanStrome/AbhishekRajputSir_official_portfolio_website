import React from "react";
import type { Metadata } from "next";
import { getPublicStudents } from "@/services/academic-service";
import StudentCard from "@/components/public/StudentCard";
import EmptyState from "@/components/public/EmptyState";
import { Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Research Group & Scholars",
  description:
    "Ph.D. candidates, M.Tech scholars, and research personnel in the Structural & Impact Mechanics Laboratory at IIT Indore.",
};

export const revalidate = 60;

export default async function StudentsPage() {
  const students = await getPublicStudents();

  const phds = students.filter((s) => s.category === "PHD");
  const masters = students.filter((s) => s.category === "MASTERS");
  const undergrads = students.filter((s) => s.category === "UNDERGRAD");
  const staff = students.filter((s) => s.category === "STAFF");
  const alumni = students.filter((s) => s.category === "ALUMNI");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="border-b border-slate-200 pb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          Impact Mechanics Laboratory
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          Research Group & Scholars
        </h1>
        <p className="text-slate-600 text-base mt-2 max-w-3xl leading-relaxed">
          Meet the doctoral researchers, master's students, technical specialists, and alumni investigating high strain rate dynamics, ballistic penetration, and computational fracture at IIT Indore.
        </p>
      </div>

      {students.length > 0 ? (
        <div className="space-y-14">
          {/* Ph.D. Scholars */}
          {phds.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Doctoral Scholars (Ph.D.)
                </span>
                <span className="h-px flex-1 bg-slate-200"></span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {phds.map((student) => (
                  <StudentCard key={student.id} {...student} />
                ))}
              </div>
            </div>
          )}

          {/* Master's Students */}
          {masters.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  M.Tech / Master's Researchers
                </span>
                <span className="h-px flex-1 bg-slate-200"></span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {masters.map((student) => (
                  <StudentCard key={student.id} {...student} />
                ))}
              </div>
            </div>
          )}

          {/* Technical Assistants / Staff */}
          {staff.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Laboratory Personnel & Technical Staff
                </span>
                <span className="h-px flex-1 bg-slate-200"></span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {staff.map((student) => (
                  <StudentCard key={student.id} {...student} />
                ))}
              </div>
            </div>
          )}

          {/* Undergraduate Researchers */}
          {undergrads.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Undergraduate Research Interns
                </span>
                <span className="h-px flex-1 bg-slate-200"></span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {undergrads.map((student) => (
                  <StudentCard key={student.id} {...student} />
                ))}
              </div>
            </div>
          )}

          {/* Alumni */}
          {alumni.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Lab Alumni
                </span>
                <span className="h-px flex-1 bg-slate-200"></span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {alumni.map((student) => (
                  <StudentCard key={student.id} {...student} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          title="Research group information is being updated"
          message="Student profiles and joining positions will be displayed here soon."
          icon={<Users className="w-6 h-6" />}
        />
      )}
    </div>
  );
}
