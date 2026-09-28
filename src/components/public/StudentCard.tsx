import { User, Mail, ExternalLink, GraduationCap } from "lucide-react";
import { LinkedInIcon } from "@/components/icons/SocialIcons";

interface StudentCardProps {
  name: string;
  category: string;
  researchArea?: string | null;
  degree?: string | null;
  joiningYear?: string | null;
  graduationYear?: string | null;
  status: string;
  photoUrl?: string | null;
  bio?: string | null;
  websiteUrl?: string | null;
  linkedinUrl?: string | null;
  scholarUrl?: string | null;
  email?: string | null;
}

export default function StudentCard({
  name,
  category,
  researchArea,
  degree,
  joiningYear,
  graduationYear,
  status,
  photoUrl,
  bio,
  websiteUrl,
  linkedinUrl,
  scholarUrl,
  email,
}: StudentCardProps) {
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "PHD":
        return { label: "Ph.D. Scholar", color: "bg-purple-50 text-purple-800 border-purple-200" };
      case "MASTERS":
        return { label: "M.Tech / Master's", color: "bg-blue-50 text-blue-800 border-blue-200" };
      case "UNDERGRAD":
        return { label: "B.Tech Researcher", color: "bg-emerald-50 text-emerald-800 border-emerald-200" };
      case "ALUMNI":
        return { label: "Alumnus", color: "bg-amber-50 text-amber-800 border-amber-200" };
      case "STAFF":
        return { label: "Technical Assistant", color: "bg-slate-100 text-slate-800 border-slate-200" };
      default:
        return { label: cat, color: "bg-slate-100 text-slate-800 border-slate-200" };
    }
  };

  const badge = getCategoryBadge(category);

  return (
    <div className="p-6 bg-white border border-slate-200/90 rounded-xl hover:border-slate-300 hover:shadow-xs transition-all space-y-4">
      <div className="flex items-start gap-4">
        {/* Student Avatar / Photo */}
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative flex items-center justify-center">
          {photoUrl ? (
            <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-slate-400" />
          )}
        </div>

        {/* Basic info */}
        <div className="space-y-1">
          <span className={`inline-block px-2 py-0.5 text-[11px] font-bold rounded border ${badge.color}`}>
            {badge.label}
          </span>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">{name}</h3>
          {degree && <p className="text-xs text-slate-500 font-medium">{degree}</p>}
        </div>
      </div>

      {researchArea && (
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Research Theme:
          </span>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
            {researchArea}
          </p>
        </div>
      )}

      {bio && (
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {bio}
        </p>
      )}

      {/* Footer with joining year & links */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-slate-500 font-medium">
          {joiningYear && `Joined ${joiningYear}`}
          {graduationYear && ` • Graduated ${graduationYear}`}
        </span>

        <div className="flex items-center gap-2">
          {email && (
            <a
              href={`mailto:${email}`}
              className="text-slate-500 hover:text-slate-900 transition-colors"
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 transition-colors"
              title="LinkedIn Profile"
            >
              <LinkedInIcon className="w-4 h-4" />
            </a>
          )}
          {scholarUrl && (
            <a
              href={scholarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 transition-colors"
              title="Google Scholar"
            >
              <GraduationCap className="w-4 h-4" />
            </a>
          )}
          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 transition-colors"
              title="Personal Website"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
