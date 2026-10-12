import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getPublicSiteUrl()?.origin;
  if (!siteUrl) return [];

  const base = siteUrl.replace(/\/$/, "");
  // The local /series/[slug] entries are fictional design samples, so only
  // publish the homepage until a licensed, persistent catalogue is available.
  return [{ url: base, changeFrequency: "daily", priority: 1 }];
}

