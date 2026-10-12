import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
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
