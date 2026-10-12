import { NextResponse } from "next/server";

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

// These are discovery queries, not a hard-coded catalogue. Results are accepted only
// when TVmaze identifies the show's language as Turkish.
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

export async function GET() {
  try {
    const responses = await Promise.all(
      discoveryQueries.map(async (query) => {
        const response = await fetch(
          `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`,
          {
            headers: { Accept: "application/json", "User-Agent": "DiziPlatform/0.1 (metadata discovery)" },
            next: { revalidate: 21600 }
          }
        );
        if (!response.ok) return [];
        return (await response.json()) as SearchItem[];
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
      .map((show) => ({
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
      }));

    return NextResponse.json(
      { results, attribution: { name: "TVmaze", url: "https://www.tvmaze.com/" } },
      { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" } }
    );
  } catch {
    return NextResponse.json(
      { results: [], error: "تعذر تحميل كتالوج المسلسلات الآن. جرّب البحث المباشر أدناه." },
      { status: 502 }
    );
  }
}
