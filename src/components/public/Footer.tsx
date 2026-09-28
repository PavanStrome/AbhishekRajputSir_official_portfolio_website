import React from "react";
import Link from "next/link";
import { Mail, MapPin, ExternalLink, GraduationCap, BookOpen } from "lucide-react";
import { LinkedInIcon, GitHubIcon } from "@/components/icons/SocialIcons";

interface FooterProps {
  name?: string;
  department?: string;
  institution?: string;
  email?: string;
  location?: string;
  footerText?: string | null;
  googleScholarUrl?: string | null;
  orcidUrl?: string | null;
  researchGateUrl?: string | null;
  linkedinUrl?: string | null;
}

export default function Footer({
  name = "Dr. Abhishek Rajput",
  department = "Department of Civil Engineering",
  institution = "Indian Institute of Technology Indore",
  email = "abhishekrajput@iiti.ac.in",
  location = "Simrol, Khandwa Road, Indore - 453552, M.P., India",
  footerText,
  googleScholarUrl,
  orcidUrl,
  researchGateUrl,
  linkedinUrl,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Academic Identity */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-white tracking-tight">{name}</h3>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Assistant Professor in the {department} at the {institution}. Researching structural crashworthiness, impact mechanics, and protective materials.
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-white transition-colors underline decoration-slate-600 underline-offset-2"
                >
                  {email}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-slate-100 uppercase">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  Biography & CV
                </Link>
              </li>
              <li>
                <Link href="/research" className="hover:text-emerald-400 transition-colors">
                  Research Areas
                </Link>
              </li>
              <li>
                <Link href="/publications" className="hover:text-emerald-400 transition-colors">
                  Publications
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-emerald-400 transition-colors">
                  Sponsored Projects
                </Link>
              </li>
              <li>
                <Link href="/teaching" className="hover:text-emerald-400 transition-colors">
                  Teaching & Courses
                </Link>
              </li>
              <li>
                <Link href="/students" className="hover:text-emerald-400 transition-colors">
                  Research Group
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Academic Profiles */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-slate-100 uppercase">
              Academic Profiles
            </h4>
            <div className="flex flex-col gap-2 text-sm text-slate-400">
              {googleScholarUrl && (
                <a
                  href={googleScholarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  <span>Google Scholar</span>
                </a>
              )}
              {orcidUrl && (
                <a
                  href={orcidUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <span className="w-4 h-4 flex items-center justify-center font-mono text-[10px] bg-emerald-700 text-white rounded-full">
                    iD
                  </span>
                  <span>ORCID Profile</span>
                </a>
              )}
              {researchGateUrl && (
                <a
                  href={researchGateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>ResearchGate</span>
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <LinkedInIcon className="w-4 h-4 text-slate-400" />
                  <span>LinkedIn</span>
                </a>
              )}
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mt-3 transition-colors"
              >
                <span>Faculty Administration</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            {footerText ||
              `© ${currentYear} ${name}. ${department}, ${institution}. All rights reserved.`}
          </p>
          <p className="text-slate-400">
            Last updated: September 2026 • Verified Academic Portal
          </p>
        </div>
      </div>
    </footer>
  );
}
