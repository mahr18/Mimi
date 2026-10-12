"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Play, Sparkles, ChevronLeft, ShieldCheck, Clapperboard, Menu } from "lucide-react";
import { categories, seriesCatalog } from "@/lib/catalog";
import { SeriesCard } from "@/components/series-card";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("الكل");
  const featured = seriesCatalog.find((item) => item.featured) ?? seriesCatalog[0];
  const filtered = useMemo(() => seriesCatalog.filter((item) => {
    const matchesCategory = category === "الكل" || item.genre === category;
    const text = `${item.title} ${item.originalTitle} ${item.genre}`.toLowerCase();
    return matchesCategory && text.includes(query.trim().toLowerCase());
  }), [category, query]);

  return (
    <main className="site-shell">
      <header className="container flex h-[82px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="Dizi الصفحة الرئيسية">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-rose-400 to-rose-700 shadow-lg shadow-rose-950/40"><Clapperboard size={22} /></span>
          <span><span className="block text-xl font-black tracking-tight">dizi<span className="text-rose-400">.</span></span><span className="block text-[10px] muted">عالم الدراما التركية</span></span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-zinc-300 md:flex">
          <a href="#discover" className="transition hover:text-white">اكتشف</a>
          <a href="#latest" className="transition hover:text-white">الأحدث</a>
          <a href="#about" className="transition hover:text-white">عن المنصة</a>
        </nav>
        <a href="#discover" className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2 text-sm hover:border-rose-400/50"><Menu size={17} /><span className="hidden sm:inline">تصفّح المسلسلات</span></a>
      </header>

      <section className="hero-bg">
        <div className="container grid min-h-[510px] items-center gap-10 py-12 md:grid-cols-[1.1fr_.9fr] md:py-16">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/[.07] px-4 py-2 text-xs text-rose-200"><Sparkles size={14} /> اكتشف قصتك القادمة</div>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.3] tracking-tight sm:text-5xl md:text-6xl">كل حكاية تركية،<br /><span className="bg-gradient-to-l from-rose-300 to-rose-500 bg-clip-text text-transparent">تبدأ من هنا.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-zinc-400 sm:text-lg">دليلك لاكتشاف المسلسلات التركية، قصصها ومواسمها وحلقاتها، مع توجيهك إلى مصادر المشاهدة الرسمية المتاحة.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#discover" className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 font-bold shadow-lg shadow-rose-950/40 transition hover:bg-rose-500"><Play size={17} fill="currentColor" /> اكتشف المسلسلات</a>
              <a href="#about" className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-zinc-300 transition hover:bg-white/5">كيف تعمل المنصة؟</a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-zinc-400"><span className="flex items-center gap-2"><ShieldCheck size={15} className="text-emerald-400" /> مصادر مشاهدة مرخّصة</span><span>واجهة عربية بالكامل</span><span>اكتشاف وبحث سريع</span></div>
          </div>
          <Link href={`/series/${featured.slug}`} className="relative mx-auto block w-full max-w-[390px]">
            <div className="absolute -inset-5 rounded-[35px] bg-rose-600/10 blur-3xl" />
            <div className="poster relative aspect-[4/5] rounded-[28px] border-white/10 shadow-2xl shadow-black/50" style={{ ["--glow" as string]: featured.palette }}>
              <div className="absolute inset-0 flex items-center justify-center"><span className="text-[15rem] font-black opacity-20" style={{ color: featured.palette }}>{featured.symbol}</span></div>
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/20 to-transparent" />
              <div className="absolute right-5 top-5 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-xs backdrop-blur">اختيار المحرّر</div>
              <div className="poster-art p-7">
                <div><div className="mb-3 text-xs font-bold text-rose-300">{featured.originalTitle}</div><h2 className="text-3xl font-black">{featured.title}</h2><p className="mt-3 max-w-xs text-sm leading-7 text-zinc-300">{featured.synopsis}</p><span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-black">اكتشف التفاصيل <ChevronLeft size={17} /></span></div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section id="discover" className="container scroll-mt-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div><p className="mb-2 text-sm font-bold text-rose-300">مكتبة DIZI</p><h2 className="section-title">اعثر على مسلسلك القادم</h2><p className="mt-2 text-sm muted">بيانات تجريبية لتطوير الواجهة — ليست قائمة بث فعلية.</p></div>
          <div className="relative w-full sm:max-w-[310px]"><Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث باسم المسلسل أو التصنيف..." className="search-field" aria-label="ابحث عن مسلسل" /></div>
        </div>
        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`pill ${category === item ? "active" : ""}`}>{item}</button>)}</div>
        {filtered.length ? <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">{filtered.map((series) => <SeriesCard key={series.slug} series={series} />)}</div> : <div className="glass mt-8 rounded-2xl p-10 text-center"><Search className="mx-auto mb-3 text-zinc-500" /><p className="font-bold">ما لقينا نتائج مطابقة</p><p className="mt-2 text-sm muted">جرّب اسمًا أو تصنيفًا مختلفًا.</p><button onClick={() => { setQuery(""); setCategory("الكل"); }} className="mt-4 text-sm text-rose-300">مسح البحث والفلاتر</button></div>}
      </section>

      <section id="latest" className="container pb-14">
        <div className="glass flex flex-col gap-5 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div><p className="text-xs font-bold text-rose-300">خطوة بخطوة</p><h2 className="mt-2 text-xl font-extrabold">من اكتشاف المسلسل إلى مصدره الرسمي</h2><p className="mt-2 max-w-2xl text-sm leading-7 muted">في المرحلة القادمة نربط البيانات بمصادر موثوقة، ونضيف تفاصيل المواسم والحلقات وروابط المشاهدة المرخّصة بعد التحقق من الحقوق.</p></div>
          <span className="grid h-14 w-14 shrink-0 place-items-center self-start rounded-2xl bg-emerald-400/10 text-emerald-300 sm:self-center"><ShieldCheck size={27} /></span>
        </div>
      </section>

      <footer id="about" className="border-t border-white/[.07]">
        <div className="container flex flex-col gap-4 py-7 text-xs muted sm:flex-row sm:items-center sm:justify-between"><span className="text-lg font-black text-white">dizi<span className="text-rose-400">.</span></span><span>منصة لاكتشاف الأعمال الدرامية ومصادرها الرسمية.</span><span>© {new Date().getFullYear()} Dizi · نموذج أولي</span></div>
      </footer>
    </main>
  );
}