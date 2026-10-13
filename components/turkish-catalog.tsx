"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, Star, ChevronLeft } from "lucide-react";

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
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestedQuery, setRequestedQuery] = useState("");
  const [partial, setPartial] = useState(false);
  const [canRetry, setCanRetry] = useState(false);
  const requestId = useRef(0);
  const requestController = useRef<AbortController | null>(null);

  const availableGenres = [...new Set(shows.flatMap((show) => show.genres))].slice(0, 6);
  const visibleShows = selectedGenre
    ? shows.filter((show) => show.genres.includes(selectedGenre))
    : shows;
  const genreLabels: Record<string, string> = {
    Action: "أكشن", Adventure: "مغامرة", Anime: "أنمي", Comedy: "كوميديا",
    Crime: "جريمة", Drama: "دراما", Family: "عائلي", Fantasy: "فانتازيا",
    Romance: "رومانسي", "Science-Fiction": "خيال علمي", Thriller: "تشويق"
  };

  async function loadShows(searchTerm = "") {
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;
    const currentRequest = ++requestId.current;

    setRequestedQuery(searchTerm);
    setLoading(true);
    setError("");
    setCanRetry(false);
    setPartial(false);
    if (searchTerm !== activeQuery) setSelectedGenre("");

    try {
      const endpoint = searchTerm
        ? `/api/tvmaze/turkish?q=${encodeURIComponent(searchTerm)}`
        : "/api/tvmaze/turkish";
      const response = await fetch(endpoint, { signal: controller.signal });
      const data = await response.json().catch(() => null) as {
        results?: unknown;
        error?: unknown;
        partial?: unknown;
      } | null;
      if (!response.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : "تعذر تحميل المسلسلات.");
      }
      if (!Array.isArray(data?.results)) throw new Error("تعذر قراءة نتائج المسلسلات.");
      if (currentRequest !== requestId.current) return;

      setShows(data.results as TurkishShow[]);
      setActiveQuery(searchTerm);
      setPartial(data.partial === true);
    } catch (cause) {
      if (controller.signal.aborted || currentRequest !== requestId.current) return;
      setError(cause instanceof Error ? cause.message : "تعذر تحميل المسلسلات الآن.");
      setCanRetry(true);
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }

  useEffect(() => {
    void loadShows("");
    return () => {
      requestId.current += 1;
      requestController.current?.abort();
    };
  }, []);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed && trimmed.length < 2) {
      requestController.current?.abort();
      requestId.current += 1;
      setLoading(false);
      setCanRetry(false);
      setError("اكتب حرفين على الأقل للبحث.");
      return;
    }
    if (trimmed.length > 80) {
      requestController.current?.abort();
      requestId.current += 1;
      setLoading(false);
      setCanRetry(false);
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
    <section id="discover" className="container scroll-mt-6 py-12" aria-busy={loading}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-bold text-rose-300">اكتشاف مباشر</p>
          <h2 className="section-title">مسلسلات باللغة التركية</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 muted">ابحث باسم المسلسل، وستُعرض النتائج التي يحدد TVmaze أن لغتها الأصلية تركية. النتائج ليست فهرسًا شاملًا.</p>
        </div>
        <span className="text-xs text-zinc-500">بيانات تعريفية من TVmaze</span>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="turkish-show-search" className="sr-only">ابحث عن مسلسل تركي</label>
        <input
          id="turkish-show-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="اكتب اسم المسلسل كما يورده TVmaze..."
          maxLength={80}
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-rose-400/60"
        />
        <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60">
          <Search size={16} /> بحث
        </button>
        {activeQuery && <button type="button" onClick={resetDiscovery} disabled={loading} className="rounded-xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5 disabled:opacity-60">عرض الاكتشاف</button>}
      </form>

      {!loading && !error && availableGenres.length > 0 && <div className="catalog-filters mb-6" aria-label="تصفية حسب النوع"><span className="catalog-filter-label">تصفية حسب النوع</span><div className="flex gap-2 overflow-x-auto pb-1">{["", ...availableGenres].map((genre) => <button key={genre || "all"} type="button" onClick={() => setSelectedGenre(genre)} aria-pressed={selectedGenre === genre} className={`catalog-chip ${selectedGenre === genre ? "catalog-chip-active" : ""}`}>{genre ? genreLabels[genre] ?? genre : "الكل"}</button>)}</div></div>}

      {activeQuery && !loading && <p className="mb-4 text-sm muted">نتائج البحث عن: <span className="font-semibold text-white">{activeQuery}</span></p>}
      {!loading && !error && partial && <p role="status" className="mb-4 rounded-xl border border-amber-300/20 bg-amber-300/[.05] px-4 py-3 text-sm leading-6 text-amber-100">تعذّر تحميل بعض عمليات البحث من TVmaze؛ قد تكون هذه القائمة غير مكتملة.</p>}
      {!loading && !error && shows.length > 0 && <p className="mb-3 text-xs text-zinc-500">{selectedGenre ? `${genreLabels[selectedGenre] ?? selectedGenre} · ` : ""}{visibleShows.length} نتيجة من بيانات TVmaze</p>}

      {loading && <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="glass animate-pulse overflow-hidden rounded-2xl"><div className="aspect-[2/3] bg-white/5" /><div className="space-y-2 p-3"><div className="h-3 w-3/4 rounded bg-white/10" /><div className="h-3 w-1/2 rounded bg-white/5" /></div></div>)}</div>}

      {!loading && error && <div role="alert" className="glass rounded-2xl p-6"><p className="text-sm text-rose-200">{error}</p>{canRetry && <button onClick={() => void loadShows(requestedQuery)} className="mt-3 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5">إعادة المحاولة</button>}</div>}

      {!loading && !error && shows.length === 0 && <div className="glass rounded-2xl p-6 text-sm leading-7 muted">{activeQuery ? "ما لقينا نتائج مطابقة باللغة التركية لهذا الاسم في TVmaze. جرّب كتابة الاسم الأصلي أو تهجئة مختلفة." : "لم يُرجع المصدر نتائج مطابقة في قائمة الاكتشاف الحالية."}</div>}
      {!loading && !error && shows.length > 0 && visibleShows.length === 0 && <div className="glass rounded-2xl p-6 text-sm leading-7 muted">ما فيه نتيجة من هذا النوع ضمن النتائج الحالية. جرّب نوعًا ثانيًا أو اختر «الكل».</div>}

      {!loading && !error && visibleShows.length > 0 && <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
        {visibleShows.map((show) => {
          return <article key={show.id} className="group min-w-0">
            <Link href={`/tvmaze/${show.id}`} className="catalog-card block overflow-hidden rounded-2xl transition">
              <div className="catalog-poster relative aspect-[.73] overflow-hidden bg-white/5">
                {show.imageUrl ? <img src={show.imageUrl} alt={`ملصق ${show.title}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]" /> : <div className="grid h-full place-items-center bg-[radial-gradient(ellipse_at_top,#462332,#13131b_70%)] text-6xl font-black text-rose-200/70">{show.title.slice(0, 1)}</div>}
                <div className="catalog-poster-shade absolute inset-0" />
                {show.rating !== null && <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/65 px-2.5 py-1 text-xs text-amber-300 backdrop-blur"><Star size={12} fill="currentColor" />{show.rating}</span>}
                <div className="absolute inset-x-3 bottom-3"><span className="rounded-full border border-white/20 bg-black/35 px-2.5 py-1 text-[10px] font-semibold text-white/90 backdrop-blur">{show.language === "Turkish" ? "تركي" : show.language}</span><p className="mt-2 line-clamp-2 text-sm font-extrabold leading-5 text-white drop-shadow sm:text-base">{show.title}</p></div>
              </div>
            </Link>
            <div className="px-1 pt-2.5">
              <p className="truncate text-xs text-zinc-400">{[show.year, show.genres.slice(0, 1).map((genre) => genreLabels[genre] ?? genre).join("")].filter(Boolean).join(" · ") || "مسلسل تركي"}</p>
              <Link href={`/tvmaze/${show.id}`} className="catalog-details mt-2 inline-flex items-center gap-1 text-xs font-bold">التفاصيل <ChevronLeft size={13}/></Link>
            </div>
          </article>;
        })}
      </div>}

      <p className="mt-5 text-xs leading-6 muted">الإسناد: TVmaze · البيانات بموجب CC BY-SA. قد تكون التغطية غير مكتملة، ولا تعني هذه الصفحة توفر حق المشاهدة أو البث.</p>
    </section>
  );
}

