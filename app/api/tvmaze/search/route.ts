import { NextRequest, NextResponse } from "next/server";

type TVMazeShow = {
  id: number;
  name: string;
  language: string | null;
  genres: string[];
  premiered: string | null;
  summary: string | null;
  url: string;
  image: { medium?: string; original?: string } | null;
  rating: { average: number | null };
  officialSite: string | null;
  externals?: { imdb?: string | null };
};

type TVMazeSearchResult = { score: number; show: TVMazeShow };

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], error: "اكتب حرفين على الأقل للبحث." }, { status: 400 });
  }
  if (query.length > 100) {
    return NextResponse.json({ results: [], error: "عبارة البحث طويلة جدًا." }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`,
      { headers: { Accept: "application/json", "User-Agent": "DiziPlatform/0.1 (metadata discovery)" }, next: { revalidate: 3600 } }
    );
    if (!response.ok) {
      return NextResponse.json({ results: [], error: "مصدر البيانات غير متاح حاليًا." }, { status: 502 });
    }

    const data = (await response.json()) as TVMazeSearchResult[];
    const results = data.slice(0, 12).map(({ show }) => ({
      id: show.id,
      title: show.name,
      language: show.language,
      genres: show.genres ?? [],
      year: show.premiered?.slice(0, 4) ?? null,
      summary: show.summary?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() ?? "",
      sourceUrl: show.url,
      imageUrl: show.image?.medium ?? null,
      rating: show.rating?.average ?? null,
      officialSite: show.officialSite ?? null
    }));

    return NextResponse.json(
      { results, attribution: { name: "TVmaze", url: "https://www.tvmaze.com/" } },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
    );
  } catch {
    return NextResponse.json({ results: [], error: "تعذر الاتصال بمصدر البيانات. حاول لاحقًا." }, { status: 502 });
  }
}
