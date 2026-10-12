import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, ExternalLink, Film, Star } from "lucide-react";

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

function isHttpUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

async function getShow(id: string) {
  if (!/^\d+$/.test(id) || Number(id) < 1 || Number(id) > 2147483647) return null;
  const response = await fetch(`https://api.tvmaze.com/shows/${id}`, {
    headers: { Accept: "application/json", "User-Agent": "DiziPlatform/0.1 (metadata discovery)" },
    next: { revalidate: 3600 }
  });
  if (!response.ok) return null;
  return (await response.json()) as TVmazeShow;
}

async function getEpisodes(id: string): Promise<TVmazeEpisode[]> {
  const response = await fetch(`https://api.tvmaze.com/shows/${id}/episodes`, {
    headers: { Accept: "application/json", "User-Agent": "DiziPlatform/0.1 (metadata discovery)" },
    next: { revalidate: 3600 }
  });
  if (!response.ok) return [];
  return (await response.json()) as TVmazeEpisode[];
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
  const channelSite = isHttpUrl(channel?.officialSite) ? channel.officialSite : null;
  const showSite = isHttpUrl(show.officialSite) ? show.officialSite : null;

  return (
    <main className="site-shell min-h-screen">
      <header className="container flex h-[82px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-600 text-lg font-black">D</span><span className="text-xl font-black">dizi<span className="text-rose-400">.</span></span></Link>
        <Link href="/#discover" className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white"><ArrowRight size={17} /> العودة للاكتشاف</Link>
      </header>

      <section className="hero-bg border-y border-white/[.06]">
        <div className="container grid gap-8 py-12 md:grid-cols-[240px_1fr] md:py-16">
          {show.image?.medium ? <img src={show.image.medium} alt={`ملصق ${show.name}`} className="mx-auto w-full max-w-[240px] rounded-2xl border border-white/10 object-cover shadow-2xl" /> : <div className="poster mx-auto grid w-full max-w-[240px] place-items-center rounded-2xl text-7xl font-black text-rose-300">D</div>}
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
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={show.url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5">صفحة TVmaze <ExternalLink size={15} /></a>
              {showSite && <a href={showSite} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold hover:bg-rose-500">الموقع الرسمي للعمل <ExternalLink size={15} /></a>}
              {channelSite && channelSite !== showSite && <a href={channelSite} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/[.07] px-4 py-3 text-sm font-bold text-emerald-200 hover:bg-emerald-400/10">موقع القناة/المنصة <ExternalLink size={15} /></a>}
            </div>
            {!showSite && !channelSite && <p className="mt-4 text-xs leading-6 muted">لم يوفّر مصدر البيانات رابطًا رسميًا موثوقًا لهذا العمل أو قناته. لن نخمن رابط المشاهدة؛ يمكنك استخدام دليل المصادر الرسمية في الصفحة الرئيسية.</p>}
            {(showSite || channelSite) && <p className="mt-4 text-xs leading-6 muted">هذه روابط مواقع رسمية مسجلة في بيانات TVmaze، لكنها لا تؤكد أن الحلقات متاحة للمشاهدة في منطقتك. تحقّق من صفحة العمل وشروط المنصة.</p>}
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="mb-6"><h2 className="section-title">المواسم والحلقات</h2><p className="mt-2 text-sm muted">هذه بيانات تعريفية فقط؛ لا نوفر ملفات فيديو أو روابط بث غير مرخّصة.</p></div>
        {episodes.length === 0 ? <div className="glass rounded-2xl p-6 text-sm muted">لا توجد بيانات حلقات متاحة لهذا العمل.</div> : <div className="space-y-7">
          {Array.from(seasons.entries()).sort(([a], [b]) => a - b).map(([season, list]) => <section key={season}>
            <h3 className="mb-3 text-lg font-extrabold">الموسم {season} <span className="text-sm font-normal muted">· {list.length} حلقة</span></h3>
            <div className="grid gap-3 md:grid-cols-2">
              {list.map((episode) => <article key={episode.id} className="glass rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3"><div><h4 className="font-bold">{episode.number ? `الحلقة ${episode.number}: ` : ""}{episode.name}</h4><p className="mt-1 text-xs muted">{[episode.airdate, episode.runtime ? `${episode.runtime} دقيقة` : null].filter(Boolean).join(" · ") || "لا تتوفر تفاصيل إضافية"}</p></div><a href={episode.url} target="_blank" rel="noreferrer noopener" aria-label={`فتح الحلقة ${episode.name} في TVmaze`} className="shrink-0 rounded-lg border border-white/10 p-2 text-rose-300 hover:bg-white/5"><ExternalLink size={15} /></a></div>
                {cleanSummary(episode.summary) && <p className="mt-3 text-sm leading-6 muted">{cleanSummary(episode.summary)}</p>}
              </article>)}
            </div>
          </section>)}
        </div>}
        <p className="mt-8 border-t border-white/10 pt-5 text-xs leading-6 muted">مصدر البيانات: <a href="https://www.tvmaze.com/api" target="_blank" rel="noreferrer noopener" className="underline underline-offset-4">TVmaze API</a> (CC BY-SA؛ الإسناد والمشاركة بالمثل). الصور والبيانات لا تمنح حق بث المسلسل. تأكد من الحقوق قبل أي استخدام تجاري.</p>
      </section>
      <footer className="border-t border-white/[.07]"><div className="container py-6 text-xs muted">Dizi · دليل اكتشاف الأعمال ومصادرها الرسمية.</div></footer>
    </main>
  );
}
