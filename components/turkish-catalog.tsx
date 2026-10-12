"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Star } from "lucide-react";

type TurkishShow = {
  id: number;
  title: string;
  language: string | null;
  genres: string[];
  year: string | null;
  summary: string;
  sourceUrl: string;
  imageUrl: string | null;
  rating: number | null;
  officialSite: string | null;
  countryCode: string | null;
};

export function TurkishCatalog() {
  const [shows, setShows] = useState<TurkishShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/tvmaze/turkish", { signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "تعذر تحميل المسلسلات.");
        setShows(Array.isArray(data.results) ? data.results : []);
      } catch (cause) {
        if (cause instanceof Error && cause.name === "AbortError") return;
        setError(cause instanceof Error ? cause.message : "تعذر تحميل المسلسلات الآن.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, []);

  return (
    <section id="discover" className="container scroll-mt-6 py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-bold text-rose-300">اكتشاف مباشر</p>
          <h2 className="section-title">مسلسلات باللغة التركية</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 muted">عناوين حقيقية تُجلب من TVmaze وتُعرض بعد التحقق من أن اللغة المسجلة تركية. توفر النتائج يعتمد على تغطية المصدر.</p>
        </div>
        <a href="https://www.tvmaze.com/api" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs text-zinc-300 underline underline-offset-4 hover:text-white">مصدر البيانات <ExternalLink size={13} /></a>
      </div>

      {loading && <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="glass animate-pulse overflow-hidden rounded-2xl"><div className="aspect-[2/3] bg-white/5" /><div className="space-y-2 p-3"><div className="h-3 w-3/4 rounded bg-white/10" /><div className="h-3 w-1/2 rounded bg-white/5" /></div></div>)}</div>}

      {!loading && error && <div role="alert" className="glass rounded-2xl p-6"><p className="text-sm text-rose-200">{error}</p><button onClick={() => window.location.reload()} className="mt-3 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5">إعادة المحاولة</button></div>}

      {!loading && !error && shows.length === 0 && <div className="glass rounded-2xl p-6 text-sm leading-7 muted">لم يُرجع المصدر نتائج مطابقة في قائمة الاكتشاف الحالية. جرّب البحث المباشر بالاسم التركي في القسم أدناه.</div>}

      {!loading && !error && shows.length > 0 && <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {shows.map((show) => <article key={show.id} className="group min-w-0">
          <Link href={`/tvmaze/${show.id}`} className="block overflow-hidden rounded-2xl border border-white/10 bg-[#12151d] transition hover:-translate-y-1 hover:border-rose-400/50">
            <div className="relative aspect-[2/3] bg-white/5">
              {show.imageUrl ? <img src={show.imageUrl} alt={`ملصق ${show.title}`} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" /> : <div className="grid h-full place-items-center text-5xl font-black text-rose-300">{show.title.slice(0, 1)}</div>}
              {show.rating !== null && <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-xs text-amber-300 backdrop-blur"><Star size={12} fill="currentColor" />{show.rating}</span>}
            </div>
          </Link>
          <div className="px-1 pt-3">
            <Link href={`/tvmaze/${show.id}`} className="line-clamp-2 text-sm font-bold leading-6 hover:text-rose-200">{show.title}</Link>
            <p className="mt-1 text-xs muted">{[show.year, show.genres.slice(0, 1).join("")].filter(Boolean).join(" · ") || "مسلسل تركي"}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs">
              <Link href={`/tvmaze/${show.id}`} className="text-rose-300 hover:text-rose-200">التفاصيل والحلقات</Link>
              <a href={show.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-zinc-400 hover:text-white">TVmaze <ExternalLink size={11} /></a>
            </div>
          </div>
        </article>)}
      </div>}

      <p className="mt-5 text-xs leading-6 muted">الإسناد: TVmaze · البيانات بموجب CC BY-SA. قد تكون تغطية المسلسلات التركية غير مكتملة، ولا تعني هذه الصفحة توفر حق المشاهدة أو البث.</p>
    </section>
  );
}
