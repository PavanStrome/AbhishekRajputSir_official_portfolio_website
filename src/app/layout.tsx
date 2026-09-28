import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Dr. Abhishek Rajput - IIT Indore",
    default: "Dr. Abhishek Rajput | Assistant Professor, Civil Engineering, IIT Indore",
  },
  description:
    "Official academic homepage and research portal of Dr. Abhishek Rajput, Assistant Professor in the Department of Civil Engineering at Indian Institute of Technology Indore.",
  keywords: [
    "Dr. Abhishek Rajput",
    "IIT Indore",
    "Civil Engineering",
    "Structural Mechanics",
    "Impact Mechanics",
    "Ballistic Impact",
    "Prestressed Concrete",
    "Crashworthiness",
    "Finite Element Analysis",
  ],
  authors: [{ name: "Dr. Abhishek Rajput", url: "https://people.iiti.ac.in/~abhishekrajput/" }],
  creator: "Dr. Abhishek Rajput",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://dr-abhishek-rajput.vercel.app"),
  openGraph: {
    title: "Dr. Abhishek Rajput | Assistant Professor, IIT Indore",
    description:
      "Academic research group investigating dynamic loading of concrete and metals, ballistic impact, and crashworthiness.",
    url: "/",
    siteName: "Dr. Abhishek Rajput Academic Portal",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col bg-[#fdfdfd] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}
