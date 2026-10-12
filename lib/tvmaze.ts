export type TVMazeShow = {
  id: number;
  name: string;
  language: string | null;
  genres: string[];
  premiered: string | null;
  summary: string | null;
  url: string;
  image: { medium?: string; original?: string } | null;
  rating: { average: number | null } | null;
  officialSite: string | null;
  network?: { country: { code: string | null; name: string } | null } | null;
  webChannel?: { country: { code: string | null; name: string } | null } | null;
};

type TVMazeSearchResult = { score: number; show: TVMazeShow };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSearchResult(value: unknown): value is TVMazeSearchResult {
  if (!isRecord(value) || !isRecord(value.show)) return false;
  const show = value.show;
  const nullableString = (candidate: unknown) => candidate === null || typeof candidate === "string";
  const imageValid = show.image === null || (isRecord(show.image) &&
    (show.image.medium === undefined || typeof show.image.medium === "string") &&
    (show.image.original === undefined || typeof show.image.original === "string"));
  const ratingValid = show.rating === null || (isRecord(show.rating) &&
    (show.rating.average === null || typeof show.rating.average === "number"));
  const countryValid = (candidate: unknown) => candidate === undefined || candidate === null ||
    (isRecord(candidate) && (candidate.country === null || candidate.country === undefined ||
      (isRecord(candidate.country) && nullableString(candidate.country.code) && typeof candidate.country.name === "string")));

  return Number.isSafeInteger(show.id) && Number(show.id) > 0 && typeof show.name === "string" &&
    (show.language === undefined || nullableString(show.language)) &&
    (show.genres === undefined || (Array.isArray(show.genres) && show.genres.every((genre) => typeof genre === "string"))) &&
    (show.premiered === undefined || nullableString(show.premiered)) &&
    (show.summary === undefined || nullableString(show.summary)) && typeof show.url === "string" &&
    imageValid && ratingValid &&
    (show.officialSite === undefined || nullableString(show.officialSite)) &&
    countryValid(show.network) && countryValid(show.webChannel);
}

/** Fetch and minimally validate TVmaze's public search response before app code consumes it. */
export async function searchTVmaze(query: string): Promise<TVMazeShow[]> {
  const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`, {
    headers: { Accept: "application/json", "User-Agent": "VIPTV/0.1 (metadata discovery)" },
    signal: AbortSignal.timeout(8_000),
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error(response.status === 429 ? "TVMAZE_RATE_LIMIT" : "TVMAZE_UNAVAILABLE");
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) throw new Error("TVMAZE_INVALID_RESPONSE");
  return payload.filter(isSearchResult).map(({ show }) => show);
}

export function safeHttpsUrl(value: string | null | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function safeTVmazeImageUrl(value: string | undefined) {
  const url = safeHttpsUrl(value);
  if (!url) return null;
  return new URL(url).hostname === "static.tvmaze.com" ? url : null;
}

export function tvmazeErrorResponse(error: unknown) {
  const rateLimited = error instanceof Error && error.message === "TVMAZE_RATE_LIMIT";
  return {
    status: rateLimited ? 503 : 502,
    message: rateLimited
      ? "تجاوز مصدر البيانات حد الطلبات مؤقتًا. انتظر قليلًا ثم أعد المحاولة."
      : "تعذر تحميل بيانات المسلسلات الآن. حاول مرة أخرى لاحقًا.",
    headers: rateLimited ? { "Retry-After": "5" } : undefined
  };
}

