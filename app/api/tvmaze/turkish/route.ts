import { NextRequest, NextResponse } from "next/server";

type Country = { code: string; name: string };
type TVmazeShow = {
  id: number;
  name: string;
  language: string | null;
  genres: string[];
  premiered: string | null;
  summary: string | null;
  url: string;
  officialSite: string | null;
  image: { medium?: string; original?: string } | null;
  rating: { average: number | null } | null;
  network: { country: Country | null } | null;
  webChannel: { country: Country | null } | null;
};
type SearchItem = { score: number; show: TVmazeShow };

const discoveryQueries = [
  "Kurulus Osman",
  "Yargi",
  "Kara Sevda",
  "Erkenci Kus",
  "Forbidden Fruit Yasak Elma",
  "Golden Boy Yali Capkini",
  "Love Is in the Air Sen Cal Kapimi",
  "Magnificent Century"
];

function normalizeShow(show: TVmazeShow) {
  return {
    id: show.id,
    title: show.name,
    language: show.language,
    genres: show.genres ?? [],
    year: show.premiered?.slice(0, 4) ?? null,
    summary: (show.summary ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
    sourceUrl: show.url,
    imageUrl: show.image?.medium ?? null,
    rating: show.rating?.average ?? null,
    officialSite: show.officialSite ?? null,
    countryCode: show.network?.country?.code ?? show.webChannel?.country?.code ?? null
  };
}

async function searchShows(query: string): Promise<SearchItem[]> {
  const response = await fetch(
    `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`,
    {
      headers: { Accept: "application/json", "User-Agent": "DiziPlatform/0.2 (metadata discovery)" },
      next: { revalidate: 3600 }
    }
  );
  if (!response.ok) throw new Error("TVmaze search failed");
  return (await response.json()) as SearchItem[];
}

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") ?? "").trim();
  if (query && (query.length < 2 || query.length > 80)) {
    return NextResponse.json(
      { results: [], error: "اكتب حرفين على الأقل، وبحد أقصى 80 حرفًا." },
      { status: 400 }
    );
  }

  try {
    if (query) {
      const items = await searchShows(query);
      const results = items
        .map((item) => item.show)
        .filter((show) => show.language?.toLowerCase() === "turkish")
        .slice(0, 12)
        .map(normalizeShow);

      return NextResponse.json(
        { results, query, attribution: { name: "TVmaze", url: "https://www.tvmaze.com/" } },
        { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
      );
    }

    const responses = await Promise.all(
      discoveryQueries.map(async (discoveryQuery) => {
        try {
          return await searchShows(discoveryQuery);
        } catch {
          return [];
        }
      })
    );

    const unique = new Map<number, TVmazeShow>();
    for (const items of responses) {
      for (const item of items.slice(0, 5)) {
        const show = item.show;
        if (show.language?.toLowerCase() !== "turkish") continue;
        if (!unique.has(show.id)) unique.set(show.id, show);
      }
    }

    const results = [...unique.values()]
      .sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
      .slice(0, 24)
      .map(normalizeShow);

    return NextResponse.json(
      { results, attribution: { name: "TVmaze", url: "https://www.tvmaze.com/" } },
      { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" } }
    );
  } catch {
    return NextResponse.json(
      { results: [], error: "تعذر تحميل المسلسلات الآن. حاول مرة أخرى بعد قليل." },
      { status: 502 }
    );
  }
}
