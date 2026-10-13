import { NextRequest, NextResponse } from "next/server";
import { safeHttpsUrl, safeTVmazeImageUrl, searchTVmaze, tvmazeErrorResponse } from "@/lib/tvmaze";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], error: "اكتب حرفين على الأقل للبحث." }, { status: 400 });
  }
  if (query.length > 100) {
    return NextResponse.json({ results: [], error: "عبارة البحث طويلة جدًا." }, { status: 400 });
  }

  try {
    const shows = await searchTVmaze(query);
    const results = shows.slice(0, 12).map((show) => ({
      id: show.id,
      title: show.name,
      language: show.language,
      genres: show.genres ?? [],
      year: show.premiered?.slice(0, 4) ?? null,
      summary: show.summary?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() ?? "",
      sourceUrl: `https://www.tvmaze.com/shows/${show.id}`,
      imageUrl: safeTVmazeImageUrl(show.image?.medium),
      rating: show.rating?.average ?? null,
      officialSite: safeHttpsUrl(show.officialSite)
    }));

    return NextResponse.json(
      { results, attribution: { name: "TVmaze", url: "https://www.tvmaze.com/" } },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
    );
  } catch (error) {
    const failure = tvmazeErrorResponse(error);
    return NextResponse.json({ results: [], error: failure.message }, { status: failure.status, headers: failure.headers });
  }
}
