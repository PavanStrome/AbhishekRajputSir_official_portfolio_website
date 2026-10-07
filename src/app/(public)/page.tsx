import React from "react";
import Link from "next/link";
import Hero from "@/components/public/Hero";
import SectionHeader from "@/components/public/SectionHeader";
import PublicationCard from "@/components/public/PublicationCard";
import ResearchCard from "@/components/public/ResearchCard";
import ProjectCard from "@/components/public/ProjectCard";
import {
  getPublicProfile,
  getPublicResearchAreas,
  getPublicPublications,
  getPublicProjects,
  getPublicNews,
} from "@/services/academic-service";
import { ArrowRight, Bell, Calendar, MapPin, Mail } from "lucide-react";

export const dynamic = "force-dynamic"; // Revalidate every 60 seconds

export default async function HomePage() {
  const [{ profile }, researchAreas, publications, projects, news] =
    await Promise.all([
      getPublicProfile(),
      getPublicResearchAreas(),
      getPublicPublications({ featuredOnly: true }),
      getPublicProjects(true),
      getPublicNews(3),
    ]);

  // Fallback to top publications if none flagged as featured
  const displayPublications =
    publications.length > 0
      ? publications.slice(0, 4)
      : (await getPublicPublications()).slice(0, 4);

  return (
    <div className="space-y-16 lg:space-y-20">
      {/* 1. Hero Section */}
      <Hero
        name={profile?.name || "Dr. Abhishek Rajput"}
        designation={profile?.designation || "Assistant Professor"}
        department={profile?.department || "Department of Civil Engineering"}
        institution={profile?.institution || "Indian Institute of Technology Indore"}
        shortBio={
          profile?.shortBio ||
          "Assistant Professor in Civil Engineering at IIT Indore investigating structural impact mechanics, ballistic penetration of concrete and metals, and crashworthiness."
        }
        avatarUrl={profile?.avatarUrl}
        cvUrl={profile?.cvUrl}
        researchInterests={profile?.researchInterests}
        googleScholarUrl={profile?.googleScholarUrl}
        orcidUrl={profile?.orcidUrl}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16 lg:space-y-20">
        {/* 2. About Me Snippet */}
        <section className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Academic Background
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
                About the Laboratory
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Advancing computational and experimental mechanics for protective civil and marine infrastructure.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950 mt-4 group"
              >
                <span>Read Full Biography & CV</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="lg:col-span-8 text-slate-700 leading-relaxed space-y-4 text-sm sm:text-base">
              <p>
                {profile?.bio?.split("\n\n")[0] ||
                  "Dr. Abhishek Rajput is an Assistant Professor in the Department of Civil Engineering at the Indian Institute of Technology Indore (IIT Indore)."}
              </p>
              <p>
                {profile?.bio?.split("\n\n")[1] ||
                  "His research group investigates the behavior of concrete and metallic materials under extreme dynamic loading conditions, including projectile impact, blast loading, and crashworthiness."}
              </p>
            </div>
          </div>
        </section>

        {/* 3. Research Areas */}
        <section>
          <SectionHeader
            title="Core Research Thrusts"
            subtitle="Pioneering experimental setups and high-fidelity numerical formulations for extreme loading."
            linkText="All Research Details"
            linkHref="/research"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {researchAreas.slice(0, 4).map((area) => (
              <ResearchCard
                key={area.id}
                id={area.id}
                title={area.title}
                slug={area.slug}
                summary={area.summary}
                description={area.description}
                keywords={area.keywords}
                publicationsCount={area.publications.length}
                recentPublications={area.publications}
              />
            ))}
          </div>
        </section>

        {/* 4. Selected Publications */}
        <section>
          <SectionHeader
            title="Selected Publications"
            subtitle="Peer-reviewed research articles in prominent journals of impact engineering and structural mechanics."
            linkText="View All Publications"
            linkHref="/publications"
          />
          <div className="space-y-4">
            {displayPublications.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} />
            ))}
          </div>
        </section>

        {/* 5. Sponsored Research Projects */}
        {projects.length > 0 && (
          <section>
            <SectionHeader
              title="Sponsored Research & Grants"
              subtitle="Funded experimental investigations backed by national and international granting agencies."
              linkText="View All Projects"
              linkHref="/projects"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.slice(0, 2).map((proj) => (
                <ProjectCard
                  key={proj.id}
                  title={proj.title}
                  shortDescription={proj.shortDescription}
                  status={proj.status}
                  role={proj.role}
                  fundingAgency={proj.fundingAgency}
                  grantAmount={proj.grantAmount}
                  startDate={proj.startDate}
                  endDate={proj.endDate}
                  projectUrl={proj.projectUrl}
                  isFeatured={proj.isFeatured}
                />
              ))}
            </div>
          </section>
        )}

        {/* 6. Recent News & Announcements */}
        {news.length > 0 && (
          <section>
            <SectionHeader
              title="News & Announcements"
              subtitle="Latest lab milestones, paper acceptances, and conference participations."
              linkText="All News"
              linkHref="/news"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-white border border-slate-200/90 rounded-xl space-y-2.5 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.content}
                  </p>
                  {item.externalUrl && (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 pt-1"
                    >
                      <span>Read announcement</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. Quick Contact Card */}
        <section className="bg-slate-900 text-white p-8 sm:p-10 rounded-2xl border border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight">
                Interested in Collaborative Research or Graduate Studies?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Our group regularly welcomes inquiries from prospective Ph.D. scholars, postdocs, and industry partners in structural crashworthiness and impact modeling.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors"
              >
                Contact Information
              </Link>
              <Link
                href="/students"
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-lg transition-colors"
              >
                Meet the Group
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
