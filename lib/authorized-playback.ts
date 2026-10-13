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

type ReviewedSource = PlaybackSource & {
  sourceReviewed: true;
  sourceEvidence: string;
  availabilityNotes: string;
  reviewedAt: string;
};

const officialEmbedOrigins = ["https://www.youtube-nocookie.com"];

/**
 * The public evidence associates Kara Sevda's YouTube source with the producer's
 * channel directory. This is a source review, not independent proof of commercial
 * rights or guaranteed availability. Other episodes stay unavailable until reviewed.
 */
const reviewedPlaybackByEpisodeId: Record<number, ReviewedSource> = {
  427468: {
    kind: "embed",
    url: "https://www.youtube-nocookie.com/embed/fVNzewv_2oU?rel=0",
    providerName: "قناة Kara Sevda الرسمية على YouTube",
    audioLanguages: ["التركية"],
    subtitleLanguages: [],
    sourceReviewed: true,
    sourceEvidence: "قائمة قنوات Ay Yapım الرسمية تتضمن قناة باسم Kara Sevda، وبيانات YouTube oEmbed لهذا الفيديو تعيد عنوانه واسم ناشره ورمز مشغل YouTube الرسمي.",
    availabilityNotes: "تطبق قيود YouTube على التضمين والتشغيل والمنطقة؛ لا نضمن التوفر أو الترجمة.",
    reviewedAt: "2026-10-13"
  }
};

export function getConfiguredPlayback(id: number): PlaybackSource | null {
  const source = reviewedPlaybackByEpisodeId[id];
  if (
    !source ||
    source.sourceReviewed !== true ||
    !source.sourceEvidence.trim() ||
    !source.availabilityNotes.trim() ||
    !source.reviewedAt
  ) return null;

  const mediaOrigins = parsePlaybackOrigins(process.env.PLAYBACK_MEDIA_ORIGINS);
  const allowedOrigins = source.kind === "embed"
    ? [...new Set([...officialEmbedOrigins, ...parsePlaybackOrigins(process.env.PLAYBACK_EMBED_ORIGINS)])]
    : mediaOrigins;
  if (!isAllowedPlaybackUrl(source.url, allowedOrigins)) return null;

  const captions = source.captions?.filter((caption) =>
    isAllowedPlaybackUrl(caption.url, mediaOrigins)
  );
  return {
    kind: source.kind,
    url: source.url,
    providerName: source.providerName,
    audioLanguages: source.audioLanguages,
    subtitleLanguages: source.subtitleLanguages,
    ...(captions?.length ? { captions } : {}),
    ...(source.kind === "video" && source.mimeType ? { mimeType: source.mimeType } : {})
  };
}

