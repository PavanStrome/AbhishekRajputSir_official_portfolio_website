import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dr-abhishek-rajput.vercel.app";

  const staticRoutes = [
    "",
    "/about",
    "/research",
    "/publications",
    "/projects",
    "/teaching",
    "/students",
    "/awards",
    "/news",
    "/cv",
    "/contact",
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
