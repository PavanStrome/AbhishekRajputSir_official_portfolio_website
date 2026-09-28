import React from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import NewsTicker from "@/components/public/NewsTicker";
import { getPublicProfile, getPublicSiteSettings, getPublicNews } from "@/services/academic-service";

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

  return (
    <div className="flex flex-col min-h-screen">
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
