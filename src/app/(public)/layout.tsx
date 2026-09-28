import React from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import NewsTicker from "@/components/public/NewsTicker";
import { getPublicProfile, getPublicSiteSettings, getPublicNews } from "@/services/academic-service";
import { getTheme, getFontStyle } from "@/lib/themes";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ profile }, settings, news] = await Promise.all([
    getPublicProfile(),
    getPublicSiteSettings(),
    getPublicNews(8),
  ]);

  const activeTheme = getTheme(settings?.theme);
  const activeFont = getFontStyle(settings?.fontStyle);

  return (
    <div className="public-theme-root flex flex-col min-h-screen">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --bg-canvas: ${activeTheme.cssVars.bgCanvas};
              --bg-card: ${activeTheme.cssVars.bgCard};
              --bg-subtle: ${activeTheme.cssVars.bgSubtle};
              --border-color: ${activeTheme.cssVars.borderColor};
              --text-main: ${activeTheme.cssVars.textMain};
              --text-muted: ${activeTheme.cssVars.textMuted};
              --accent-primary: ${activeTheme.cssVars.accentPrimary};
              --accent-hover: ${activeTheme.cssVars.accentHover};
              --accent-subtle: ${activeTheme.cssVars.accentSubtle};
              --badge-bg: ${activeTheme.cssVars.badgeBg};
              --badge-text: ${activeTheme.cssVars.badgeText};
              --font-heading: ${activeFont.headingFont};
              --font-body: ${activeFont.bodyFont};
            }
            body {
              background-color: ${activeTheme.cssVars.bgCanvas} !important;
              color: ${activeTheme.cssVars.textMain} !important;
              font-family: ${activeFont.bodyFont} !important;
            }
          `,
        }}
      />
      <Navbar
        professorName={profile?.name || "Dr. Abhishek Rajput"}
        institution={profile?.institution || "IIT Indore"}
      />
      <NewsTicker news={news} />
      <main className="flex-1">{children}</main>
      <Footer
        name={profile?.name || "Dr. Abhishek Rajput"}
        department={profile?.department || "Department of Civil Engineering"}
        institution={profile?.institution || "Indian Institute of Technology Indore"}
        email={profile?.email || "abhishekrajput@iiti.ac.in"}
        location={profile?.location || "Simrol, Khandwa Road, Indore - 453552, M.P., India"}
        footerText={settings?.footerText}
        googleScholarUrl={profile?.googleScholarUrl}
        orcidUrl={profile?.orcidUrl}
        researchGateUrl={profile?.researchGateUrl}
        linkedinUrl={profile?.linkedinUrl}
      />
    </div>
  );
}
