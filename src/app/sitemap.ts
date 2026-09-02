import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools-config";
import { GUIDES } from "@/lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const staticPages = [
    "",
    "/tools",
    "/guides",
    "/pricing",
    "/about",
    "/contact",
    "/privacy",
    "/cookies",
    "/terms",
    "/legal",
  ];

  const toolPages = TOOLS.map((tool) => `/tools/${tool.slug}`);
  const guidePages = GUIDES.map((guide) => `/guides/${guide.slug}`);

  const allPages = [...staticPages, ...toolPages, ...guidePages];

  return allPages.map((path) => ({
    url: `${appUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
