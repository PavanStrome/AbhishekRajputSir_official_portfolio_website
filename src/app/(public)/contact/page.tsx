import React from "react";
import type { Metadata } from "next";
import { getPublicProfile } from "@/services/academic-service";
import {
  Mail,
  MapPin,
  Clock,
  Phone,
  Building,
  GraduationCap,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { LinkedInIcon } from "@/components/icons/SocialIcons";

export const metadata: Metadata = {
  title: "Contact & Lab Location",
  description:
    "Office hours, campus location, email address, and academic profiles for Dr. Abhishek Rajput at IIT Indore.",
};

export const revalidate = 60;

export default async function ContactPage() {
  const { profile } = await getPublicProfile();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="border-b border-slate-200 pb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          Contact & Office Details
        </h1>
        <p className="text-slate-600 text-base mt-2 max-w-3xl leading-relaxed">
          Office address, visiting hours, official correspondence email, and verified academic repository profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Office & Direct Contact Card */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-8 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Academic Office & Postal Address
            </h2>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3.5">
                <Building className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-semibold">
                    Department & School
                  </strong>
                  <span>{profile?.department}</span>
                  <span className="block text-slate-500">{profile?.institution}</span>
                </div>
              </div>

              {profile?.office && (
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">Office Location</strong>
                    <span>{profile.office}</span>
                    <span className="block text-slate-500">{profile.location}</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-semibold">Official Email</strong>
                  <a
                    href={`mailto:${profile?.email}`}
                    className="text-emerald-800 hover:text-emerald-950 font-medium underline underline-offset-2"
                  >
                    {profile?.email}
                  </a>
                  <span className="block text-xs text-slate-500 mt-0.5">
                    For research inquiries, graduate admission questions, and collaboration proposals.
                  </span>
                </div>
              </div>

              {profile?.phone && (
                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">Office Phone</strong>
                    <span>{profile.phone}</span>
                  </div>
                </div>
              )}

              {profile?.officeHours && (
                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">
                      Office / Visiting Hours
                    </strong>
                    <span>{profile.officeHours}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-xl text-xs text-slate-600 space-y-1">
              <strong className="block font-semibold text-slate-900">
                Note for Prospective Students & Interns:
              </strong>
              <p>
                Interested graduate candidates seeking Ph.D. or M.Tech research positions should review our published research areas before writing and attach their detailed CV and statement of research interests.
              </p>
            </div>
          </div>
        </div>

        {/* Academic Profile Links Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Verified Academic Profiles
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Connect via academic networks, citation indices, and scientific repositories:
            </p>

            <div className="space-y-3 text-sm">
              {profile?.googleScholarUrl && (
                <a
                  href={profile.googleScholarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-xs font-bold text-slate-900">
                        Google Scholar
                      </strong>
                      <span className="text-[11px] text-slate-500">Citation Metrics & Papers</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
                </a>
              )}

              {profile?.orcidUrl && (
                <a
                  href={profile.orcidUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-mono text-xs font-bold flex items-center justify-center">
                      iD
                    </div>
                    <div>
                      <strong className="block text-xs font-bold text-slate-900">
                        ORCID Record
                      </strong>
                      <span className="text-[11px] text-slate-500">Unique Researcher Identifier</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
                </a>
              )}

              {profile?.researchGateUrl && (
                <a
                  href={profile.researchGateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-xs font-bold text-slate-900">
                        ResearchGate
                      </strong>
                      <span className="text-[11px] text-slate-500">Publications & Preprints</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
                </a>
              )}

              {profile?.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800">
                      <LinkedInIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-xs font-bold text-slate-900">LinkedIn</strong>
                      <span className="text-[11px] text-slate-500">Professional Network</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
                </a>
              )}

              {profile?.personalWebsiteUrl && (
                <a
                  href={profile.personalWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-xs font-bold text-slate-900">
                        Institutional Directory
                      </strong>
                      <span className="text-[11px] text-slate-500">IIT Indore Faculty Directory</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
