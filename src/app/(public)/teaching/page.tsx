import React from "react";
import type { Metadata } from "next";
import { getPublicCourses } from "@/services/academic-service";
import CourseCard from "@/components/public/CourseCard";
import EmptyState from "@/components/public/EmptyState";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Teaching & Academic Pedagogy",
  description:
    "Curriculum and courses taught in structural mechanics, reinforced concrete, and finite element modeling at IIT Indore.",
};

export const revalidate = 60;

export default async function TeachingPage() {
  const courses = await getPublicCourses();

  // Group courses by academic year
  const coursesByYear = courses.reduce((acc, course) => {
    const yr = course.academicYear;
    if (!acc[yr]) acc[yr] = [];
    acc[yr].push(course);
    return acc;
  }, {} as Record<string, typeof courses>);

  const sortedYears = Object.keys(coursesByYear).sort((a, b) => b.localeCompare(a));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="border-b border-slate-200 pb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          Academic Instruction
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          Courses & Teaching
        </h1>
        <p className="text-slate-600 text-base mt-2 max-w-3xl leading-relaxed">
          Undergraduate and postgraduate courses instructed in the Department of Civil Engineering at IIT Indore, covering structural mechanics, finite elements, and impact dynamics.
        </p>
      </div>

      {courses.length > 0 ? (
        <div className="space-y-12">
          {sortedYears.map((year) => (
            <div key={year} className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Academic Year: {year}
                </span>
                <span className="h-px flex-1 bg-slate-200"></span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coursesByYear[year].map((course) => (
                  <CourseCard
                    key={course.id}
                    code={course.code}
                    title={course.title}
                    semester={course.semester}
                    academicYear={course.academicYear}
                    level={course.level}
                    description={course.description}
                    syllabusUrl={course.syllabusUrl}
                    courseUrl={course.courseUrl}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Teaching curriculum will be updated shortly"
          message="Courses and lecture outlines for upcoming sessions are being configured."
          icon={<BookOpen className="w-6 h-6" />}
        />
      )}
    </div>
  );
}
