import { isAllowedPlaybackUrl, parsePlaybackOrigins } from "@/lib/playback-origins";

export type PlaybackSource = {
  kind: "embed" | "video";
  url: string;
  providerName: string;
  audioLanguages: string[];
  subtitleLanguages: string[];
  mimeType?: "video/mp4" | "application/vnd.apple.mpegurl";
  captions?: { url: string; language: string; label: string; isDefault?: boolean }[];
};

type Verified = PlaybackSource & {
  rightsVerified: true;
  rightsEvidence: string;
  territories: string[];
  reviewedAt: string;
};

const officialEmbedOrigins = ["https://www.youtube-nocookie.com"];

/**
 * Kara Sevda 1. Bölüm is embedded directly from the show's official YouTube
 * channel. Other episodes stay unavailable until an official provider is verified.
 */
const verifiedPlaybackByEpisodeId: Record<number, Verified> = {
  427468: {
    kind: "embed",
    url: "https://www.youtube-nocookie.com/embed/fVNzewv_2oU?rel=0",
    providerName: "قناة Kara Sevda الرسمية على YouTube",
    audioLanguages: ["التركية"],
    subtitleLanguages: [],
    rightsVerified: true,
    rightsEvidence: "الفيديو الكامل منشور على قناة Kara Sevda التي تدرجها شركة الإنتاج Ay Yapım ضمن قنواتها الرسمية، ورابط YouTube الرسمي يعيد بيانات تضمين عامة. يُعرض عبر مشغل YouTube دون تنزيل أو إعادة رفع.",
    territories: ["وفق قيود التوفر التي يفرضها YouTube على الفيديو"],
    reviewedAt: "2026-10-12"
  }
};

export function getAuthorizedPlayback(id:number):PlaybackSource|null {
 const r=verifiedPlaybackByEpisodeId[id]; if(!r||r.rightsVerified!==true||!r.rightsEvidence.trim()||!r.territories.length||!r.reviewedAt)return null;
 const media=parsePlaybackOrigins(process.env.PLAYBACK_MEDIA_ORIGINS);
 const allowed=r.kind==="embed"?[...new Set([...officialEmbedOrigins,...parsePlaybackOrigins(process.env.PLAYBACK_EMBED_ORIGINS)])]:media;
 if(!isAllowedPlaybackUrl(r.url,allowed))return null;
 const captions=r.captions?.filter(c=>isAllowedPlaybackUrl(c.url,media));
 return {kind:r.kind,url:r.url,providerName:r.providerName,audioLanguages:r.audioLanguages,subtitleLanguages:r.subtitleLanguages,...(captions?.length?{captions}:{}),...(r.kind==="video"&&r.mimeType?{mimeType:r.mimeType}:{})};
}

