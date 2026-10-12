import { NextRequest, NextResponse } from "next/server";
import { safeHttpsUrl, safeTVmazeImageUrl, searchTVmaze, tvmazeErrorResponse, type TVMazeShow } from "@/lib/tvmaze";

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

function normalizeShow(show: TVMazeShow) {
  return {
    id: show.id,
    title: show.name,
    language: show.language,
    genres: show.genres ?? [],
    year: show.premiered?.slice(0, 4) ?? null,
    summary: (show.summary ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
    sourceUrl: `https://www.tvmaze.com/shows/${show.id}`,
    imageUrl: safeTVmazeImageUrl(show.image?.medium),
    rating: show.rating?.average ?? null,
    officialSite: safeHttpsUrl(show.officialSite),
    countryCode: show.network?.country?.code ?? show.webChannel?.country?.code ?? null
  };
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
      const shows = await searchTVmaze(query);
      const results = shows
        .filter((show) => show.language?.toLowerCase() === "turkish")
        .slice(0, 12)
        .map(normalizeShow);

      return NextResponse.json(
        { results, query, attribution: { name: "TVmaze", url: "https://www.tvmaze.com/" } },
        { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
      );
    }

    const responses = await Promise.allSettled(discoveryQueries.map(searchTVmaze));

    const unique = new Map<number, TVMazeShow>();
    for (const response of responses) {
      if (response.status === "rejected") continue;
      const items = response.value;
      for (const show of items.slice(0, 5)) {
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
  } catch (error) {
    const failure = tvmazeErrorResponse(error);
    return NextResponse.json(
      { results: [], error: failure.message },
      { status: failure.status, headers: failure.headers }
    );
  }
}
