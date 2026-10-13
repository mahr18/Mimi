import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const configuredUrl = getPublicSiteUrl()?.origin;
  const isProductionReady = process.env.NODE_ENV === "production" && Boolean(configuredUrl);

  return {
    rules: {
      userAgent: "*",
      allow: isProductionReady ? "/" : undefined,
      disallow: isProductionReady ? ["/api/"] : "/"
    },
    ...(configuredUrl ? { sitemap: `${configuredUrl.replace(/\/$/, "")}/sitemap.xml` } : {})
  };
}
