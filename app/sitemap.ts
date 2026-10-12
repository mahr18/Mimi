import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return [];

  const base = siteUrl.replace(/\/$/, "");
  // The local /series/[slug] entries are fictional design samples, so only
  // publish the homepage until a licensed, persistent catalogue is available.
  return [{ url: base, changeFrequency: "daily", priority: 1 }];
}
