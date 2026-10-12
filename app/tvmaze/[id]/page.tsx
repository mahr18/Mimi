import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Film, Star, PlayCircle } from "lucide-react";
import { safeTVmazeImageUrl } from "@/lib/tvmaze";
import { getAuthorizedPlayback } from "@/lib/authorized-playback";
import AuthorizedEpisodeList from "@/components/authorized-episode-list";

type TVmazeChannel = { name: string; officialSite?: string | null };
type TVmazeShow = {
  id: number;
  name: string;
  language: string | null;
  genres: string[];
  premiered: string | null;
  ended: string | null;
  status: string | null;
  summary: string | null;
  url: string;
  officialSite: string | null;
  image: { medium?: string; original?: string } | null;
  rating: { average: number | null } | null;
  runtime: number | null;
  network: TVmazeChannel | null;
  webChannel: TVmazeChannel | null;
};

type TVmazeEpisode = {
  id: number;
  name: string;
  season: number;
  number: number | null;
  airdate: string | null;
  runtime: number | null;
  summary: string | null;
  url: string;
};

function cleanSummary(value: string | null) {
  return (value ?? "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
}

async function getShow(id: string) {
  if (!/^\d+$/.test(id) || Number(id) < 1 || Number(id) > 2147483647) return null;
  try {
    const response = await fetch(`https://api.tvmaze.com/shows/${id}`, {
      headers: { Accept: "application/json", "User-Agent": "VIPTV/0.1 (metadata discovery)" },
      signal: AbortSignal.timeout(8_000),
      next: { revalidate: 3600 }
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("TVMAZE_SHOW_UNAVAILABLE");
    const show: unknown = await response.json();
    if (!show || typeof show !== "object" || Array.isArray(show)) throw new Error("TVMAZE_INVALID_SHOW");
    const candidate = show as Partial<TVmazeShow>;
    if (candidate.id !== Number(id) || typeof candidate.name !== "string" ||
      !Array.isArray(candidate.genres) || !candidate.genres.every((genre) => typeof genre === "string")) {
      throw new Error("TVMAZE_INVALID_SHOW");
    }
    return candidate as TVmazeShow;
  } catch {
    throw new Error("TVMAZE_SHOW_UNAVAILABLE");
  }
}

async function getEpisodes(id: string): Promise<TVmazeEpisode[]> {
  try {
    const response = await fetch(`https://api.tvmaze.com/shows/${id}/episodes`, {
      headers: { Accept: "application/json", "User-Agent": "VIPTV/0.1 (metadata discovery)" },
      signal: AbortSignal.timeout(8_000),
      next: { revalidate: 3600 }
    });
    if (response.status === 404) return [];
    if (!response.ok) throw new Error("TVMAZE_EPISODES_UNAVAILABLE");
    const episodes: unknown = await response.json();
    if (!Array.isArray(episodes)) throw new Error("TVMAZE_INVALID_EPISODES");
    return episodes.filter((episode): episode is TVmazeEpisode => Boolean(
      episode && typeof episode === "object" &&
      Number.isSafeInteger(episode.id) && typeof episode.name === "string" &&
      Number.isSafeInteger(episode.season) &&
      (episode.number === null || typeof episode.number === "number") &&
      (episode.airdate === null || typeof episode.airdate === "string") &&
      (episode.runtime === null || typeof episode.runtime === "number") &&
      (episode.summary === null || typeof episode.summary === "string") &&
      typeof episode.url === "string"
    ));
  } catch {
    throw new Error("TVMAZE_EPISODES_UNAVAILABLE");
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const show = await getShow(id);
  return {
    title: show?.name ?? "تفاصيل المسلسل",
    description: cleanSummary(show?.summary ?? null) || "معلومات المسلسل ومواسمه وحلقاته من TVmaze."
  };
}

export default async function TVmazeShowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const show = await getShow(id);
  if (!show) notFound();

  const episodes = await getEpisodes(id);
  const seasons = new Map<number, TVmazeEpisode[]>();
  for (const episode of episodes) {
    const list = seasons.get(episode.season) ?? [];
    list.push(episode);
    seasons.set(episode.season, list);
  }
  const summary = cleanSummary(show.summary);
  const channel = show.webChannel ?? show.network;
  const posterUrl = safeTVmazeImageUrl(show.image?.medium);

  return (
    <main className="site-shell min-h-screen">
      <header className="container flex h-[82px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-rose-400 to-rose-700 text-white"><Film size={19}/></span><span className="text-xl font-black">VIP <span className="text-rose-400">TV</span></span></Link>
        <Link href="/#discover" className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white"><ArrowRight size={17} /> العودة للاكتشاف</Link>
      </header>

      <section className="hero-bg border-y border-white/[.06]">
        <div className="container grid gap-8 py-12 md:grid-cols-[240px_1fr] md:py-16">
          {posterUrl ? <img src={posterUrl} alt={`ملصق ${show.name}`} className="mx-auto w-full max-w-[240px] rounded-2xl border border-white/10 object-cover shadow-2xl" /> : <div className="poster mx-auto grid w-full max-w-[240px] place-items-center rounded-2xl text-7xl font-black text-rose-300">D</div>}
          <div className="self-center">
            <p className="mb-3 text-sm font-bold text-rose-300">معلومات من TVmaze</p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">{show.name}</h1>
            <div className="mt-4 flex flex-wrap gap-2">{show.genres.map((genre) => <span key={genre} className="rounded-full bg-rose-500/10 px-3 py-1 text-xs text-rose-200">{genre}</span>)}</div>
            <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-300">{summary || "لا يتوفر ملخص لهذا العمل حاليًا."}</p>
            <div className="mt-6 flex flex-wrap gap-5 text-sm text-zinc-300">
              {show.premiered && <span className="flex items-center gap-2"><CalendarDays size={16} /> {show.premiered.slice(0, 4)}{show.ended ? ` – ${show.ended.slice(0, 4)}` : ""}</span>}
              {show.rating?.average !== null && show.rating?.average !== undefined && <span className="flex items-center gap-2"><Star size={16} className="text-amber-300" /> {show.rating.average}</span>}
              <span className="flex items-center gap-2"><Film size={16} /> {episodes.length} حلقة مسجلة</span>
              {channel?.name && <span>القناة/المنصة: {channel.name}</span>}
            </div>
            <div className="mt-7 rounded-2xl border border-rose-400/15 bg-rose-400/[.05] p-4">
              <div className="flex items-start gap-3"><PlayCircle size={22} className="mt-0.5 shrink-0 text-rose-300"/><div><p className="font-bold">المشاهدة داخل VIP TV</p><p className="mt-1 text-sm leading-6 text-zinc-400">تظهر المشاهدة داخل الصفحة عند إعداد مزود بث مخوّل والتحقق من حقوق هذا العمل. بيانات المسلسل وحدها لا توفر فيديو.</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="mb-6"><h2 className="section-title">المواسم والحلقات</h2><p className="mt-2 text-sm muted">هذه بيانات تعريفية فقط؛ لا نوفر ملفات فيديو أو روابط بث غير مرخّصة.</p></div>
        {episodes.length === 0 ? <div className="glass rounded-2xl p-6 text-sm muted">لا توجد بيانات حلقات متاحة لهذا العمل.</div> : <div className="space-y-7">
          {Array.from(seasons.entries()).sort(([a], [b]) => a - b).map(([season, list]) => <section key={season}>
            <h3 className="mb-3 text-lg font-extrabold">الموسم {season} <span className="text-sm font-normal muted">· {list.length} حلقة</span></h3>
            <AuthorizedEpisodeList episodes={list.map((episode) => ({ id: episode.id, name: episode.name, number: episode.number, airdate: episode.airdate, runtime: episode.runtime, summary: cleanSummary(episode.summary), playback: getAuthorizedPlayback(episode.id) }))} />
          </section>)}
        </div>}
        <p className="mt-8 border-t border-white/10 pt-5 text-xs leading-6 muted">مصدر البيانات: TVmaze API (CC BY-SA؛ الإسناد والمشاركة بالمثل). الصور والبيانات لا تمنح حق بث المسلسل. تأكد من الحقوق قبل أي استخدام تجاري.</p>
      </section>
      <footer className="border-t border-white/[.07]"><div className="container py-6 text-xs muted">Dizi · دليل اكتشاف الأعمال ومصادرها الرسمية.</div></footer>
    </main>
  );
}
