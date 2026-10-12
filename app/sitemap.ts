import type { MetadataRoute } from "next";
import { seriesCatalog } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return [];

  const base = siteUrl.replace(/\/$/, "");
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    ...seriesCatalog.map((series) => ({
      url: `${base}/series/${series.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7
    }))
  ];
}
