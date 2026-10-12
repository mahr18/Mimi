"use client";

import { useState } from "react";
import { ExternalLink, Search, Star } from "lucide-react";

type LiveShow = {
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
};

export function TVmazeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LiveShow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (query.trim().length < 2) {
      setError("اكتب حرفين على الأقل.");
      return;
    }
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const response = await fetch(`/api/tvmaze/search?q=${encodeURIComponent(query.trim())}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "فشل البحث.");
      setResults(data.results || []);
    } catch (cause) {
      setResults([]);
      setError(cause instanceof Error ? cause.message : "تعذر البحث الآن.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-16 border-t border-white/[.07] pt-12">
      <div className="mb-5"><p className="mb-2 text-sm font-bold text-rose-300">بحث مباشر عبر مصدر خارجي</p><h2 className="section-title">ابحث في قاعدة بيانات TVmaze</h2><p className="mt-2 text-sm leading-7 muted">هذه نتائج معلوماتية من TVmaze وليست روابط مشاهدة. تحقق من حقوق البيانات والصور وشروط الاستخدام قبل الإطلاق التجاري.</p></div>
      <form onSubmit={search} className="flex gap-2">
        <input className="search-field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جرّب اسم مسلسل بالتركي أو الإنجليزي..." aria-label="بحث TVmaze" />
        <button disabled={loading} className="flex shrink-0 items-center gap-2 rounded-xl bg-rose-600 px-4 font-bold transition hover:bg-rose-500 disabled:opacity-50"><Search size={17} />{loading ? "جارٍ البحث" : "بحث"}</button>
      </form>
      {error && <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p>}
      {searched && !loading && !error && results.length === 0 && <p className="mt-5 text-sm muted">ما ظهرت نتائج لهذا البحث.</p>}
      {results.length > 0 && <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{results.map((show) => <article key={show.id} className="glass flex gap-4 rounded-2xl p-4">
        {show.imageUrl ? <img src={show.imageUrl} alt="" loading="lazy" className="h-28 w-[76px] shrink-0 rounded-lg object-cover bg-white/5" /> : <div className="grid h-28 w-[76px] shrink-0 place-items-center rounded-lg bg-white/5 text-2xl font-black text-rose-300">D</div>}
        <div className="min-w-0"><h3 className="font-bold leading-6">{show.title}</h3><p className="mt-1 text-xs muted">{[show.year, show.language, show.genres.slice(0, 2).join(" · ")].filter(Boolean).join(" · ")}</p>{show.rating !== null && <p className="mt-2 flex items-center gap-1 text-xs text-amber-300"><Star size={12} fill="currentColor" />{show.rating}</p>}<div className="mt-3 flex flex-wrap gap-3 text-xs"><a className="inline-flex items-center gap-1 text-rose-300 hover:text-rose-200" href={show.sourceUrl} target="_blank" rel="noreferrer">TVmaze <ExternalLink size={12} /></a>{show.officialSite && <a className="inline-flex items-center gap-1 text-zinc-300 hover:text-white" href={show.officialSite} target="_blank" rel="noreferrer">الموقع الرسمي <ExternalLink size={12} /></a>}</div></div>
      </article>)}</div>}
      <p className="mt-5 text-xs muted">البيانات: <a className="underline underline-offset-4" href="https://www.tvmaze.com/api" target="_blank" rel="noreferrer">TVmaze API</a> · CC BY-SA مع الإسناد وشروط المشاركة بالمثل.</p>
    </section>
  );
}
