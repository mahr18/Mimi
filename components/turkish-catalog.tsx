"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Search, Star, ChevronLeft } from "lucide-react";

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

function safeHttpUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function TurkishCatalog() {
  const [shows, setShows] = useState<TurkishShow[]>([]);
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadShows(searchTerm = "", signal?: AbortSignal) {
    setLoading(true);
    setError("");
    try {
      const endpoint = searchTerm
        ? `/api/tvmaze/turkish?q=${encodeURIComponent(searchTerm)}`
        : "/api/tvmaze/turkish";
      const response = await fetch(endpoint, { signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر تحميل المسلسلات.");
      setShows(Array.isArray(data.results) ? data.results : []);
      setActiveQuery(searchTerm);
    } catch (cause) {
      if (cause instanceof Error && cause.name === "AbortError") return;
      setError(cause instanceof Error ? cause.message : "تعذر تحميل المسلسلات الآن.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    void loadShows("", controller.signal);
    return () => controller.abort();
  }, []);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed && trimmed.length < 2) {
      setError("اكتب حرفين على الأقل للبحث.");
      return;
    }
    if (trimmed.length > 80) {
      setError("عبارة البحث طويلة جدًا؛ الحد الأقصى 80 حرفًا.");
      return;
    }
    void loadShows(trimmed);
  }

  function resetDiscovery() {
    setQuery("");
    void loadShows("");
  }

  return (
    <section id="discover" className="container scroll-mt-6 py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-bold text-rose-300">اكتشاف مباشر</p>
          <h2 className="section-title">مسلسلات باللغة التركية</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 muted">ابحث باسم المسلسل، وستُعرض النتائج التي يحدد TVmaze أن لغتها الأصلية تركية. النتائج ليست فهرسًا شاملًا.</p>
        </div>
        <a href="https://www.tvmaze.com/api" target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 text-xs text-zinc-300 underline underline-offset-4 hover:text-white">مصدر البيانات <ExternalLink size={13} /></a>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="turkish-show-search" className="sr-only">ابحث عن مسلسل تركي</label>
        <input
          id="turkish-show-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="اكتب اسم المسلسل بالعربية أو التركية أو الإنجليزية..."
          maxLength={80}
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-rose-400/60"
        />
        <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60">
          <Search size={16} /> بحث
        </button>
        {activeQuery && <button type="button" onClick={resetDiscovery} disabled={loading} className="rounded-xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5 disabled:opacity-60">عرض الاكتشاف</button>}
      </form>

      {activeQuery && !loading && <p className="mb-4 text-sm muted">نتائج البحث عن: <span className="font-semibold text-white">{activeQuery}</span></p>}

      {loading && <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="glass animate-pulse overflow-hidden rounded-2xl"><div className="aspect-[2/3] bg-white/5" /><div className="space-y-2 p-3"><div className="h-3 w-3/4 rounded bg-white/10" /><div className="h-3 w-1/2 rounded bg-white/5" /></div></div>)}</div>}

      {!loading && error && <div role="alert" className="glass rounded-2xl p-6"><p className="text-sm text-rose-200">{error}</p><button onClick={() => void loadShows(activeQuery)} className="mt-3 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5">إعادة المحاولة</button></div>}

      {!loading && !error && shows.length === 0 && <div className="glass rounded-2xl p-6 text-sm leading-7 muted">{activeQuery ? "ما لقينا نتائج مطابقة باللغة التركية لهذا الاسم في TVmaze. جرّب كتابة الاسم الأصلي أو تهجئة مختلفة." : "لم يُرجع المصدر نتائج مطابقة في قائمة الاكتشاف الحالية."}</div>}

      {!loading && !error && shows.length > 0 && <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {shows.map((show) => {
          const officialSite = safeHttpUrl(show.officialSite);
          return <article key={show.id} className="group min-w-0">
            <Link href={`/tvmaze/${show.id}`} className="block overflow-hidden rounded-2xl border border-white/10 bg-[#12151d] transition hover:-translate-y-1 hover:border-rose-400/50">
              <div className="relative aspect-[2/3] bg-white/5">
                {show.imageUrl ? <img src={show.imageUrl} alt={`ملصق ${show.title}`} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" /> : <div className="grid h-full place-items-center text-5xl font-black text-rose-300">{show.title.slice(0, 1)}</div>}
                {show.rating !== null && <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-xs text-amber-300 backdrop-blur"><Star size={12} fill="currentColor" />{show.rating}</span>}
              </div>
            </Link>
            <div className="px-1 pt-3">
              <Link href={`/tvmaze/${show.id}`} className="line-clamp-2 text-sm font-bold leading-6 hover:text-rose-200">{show.title}</Link>
              <p className="mt-1 text-xs text-zinc-500">{[show.year, show.genres.slice(0, 1).join("")].filter(Boolean).join(" · ") || "مسلسل تركي"}</p>
              {show.summary && <p className="mt-2 line-clamp-3 text-xs leading-5 text-zinc-400">{show.summary.replace(/<[^>]*>/g, "").slice(0, 155)}{show.summary.length > 155 ? "…" : ""}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={`/tvmaze/${show.id}`} className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 px-2.5 py-2 text-xs font-bold text-rose-200 hover:bg-rose-500/20">التفاصيل والحلقات <ChevronLeft size={12}/></Link>
                {officialSite && <a href={officialSite} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 rounded-lg border border-emerald-400/20 px-2.5 py-2 text-xs text-emerald-200 hover:bg-emerald-400/10">المصدر الرسمي <ExternalLink size={11} /></a>}
              </div>
            </div>
          </article>;
        })}
      </div>}

      <p className="mt-5 text-xs leading-6 muted">الإسناد: TVmaze · البيانات بموجب CC BY-SA. قد تكون التغطية غير مكتملة، ولا تعني هذه الصفحة توفر حق المشاهدة أو البث.</p>
    </section>
  );
}
