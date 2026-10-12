import type { NextConfig } from "next";
import { parsePlaybackOrigins } from "./lib/playback-origins";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org" }]
  },
  async headers() {
    const embedOrigins = [...new Set([
      "https://www.youtube-nocookie.com",
      ...parsePlaybackOrigins(process.env.PLAYBACK_EMBED_ORIGINS)
    ])];
    const mediaOrigins = parsePlaybackOrigins(process.env.PLAYBACK_MEDIA_ORIGINS);
    const contentSecurityPolicy = [
      "frame-src 'self'" + (embedOrigins.length ? " " + embedOrigins.join(" ") : ""),
      "media-src 'self'" + (mediaOrigins.length ? " " + mediaOrigins.join(" ") : ""),
      "frame-ancestors 'none'"
    ].join("; ");

    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Content-Security-Policy", value: contentSecurityPolicy }
      ]
    }];
  }
};

export default nextConfig;

