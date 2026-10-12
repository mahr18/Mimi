"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Play, Sparkles, ChevronLeft, ShieldCheck, Clapperboard, Menu, ExternalLink } from "lucide-react";
import { categories, seriesCatalog } from "@/lib/catalog";
import { SeriesCard } from "@/components/series-card";
import { TVmazeSearch } from "@/components/tvmaze-search";
import { TurkishCatalog } from "@/components/turkish-catalog";

const officialProviders = [
  { name: "tabii", description: "منصة TRT للأعمال الأصلية والمسلسلات والبرامج.", url: "https://www.tabii.com/tr", tag: "منصة رقمية" },
  { name: "Kanal D", description: "موقع القناة الرسمي، مع حلقات وأرشيف لبعض المسلسلات.", url: "https://www.kanald.com.tr/", tag: "قناة رسمية" },
  { name: "NOW", description: "موقع القناة الرسمي، ويضم مسلسلات وأرشيفًا حسب التوفر.", url: "https://www.nowtv.com.tr/", tag: "قناة رسمية" },
  { name: "Netflix Türkiye", description: "كتالوج الأعمال التركية المتاح على نتفلكس؛ يتطلب الاشتراك وقد يتغير حسب المنطقة.", url: "https://www.netflix.com/tr/browse/genre/81314775", tag: "اشتراك" },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("الكل");
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
          <a href="#providers" className="transition hover:text-white">مصادر المشاهدة</a>
          <a href="#demo-library" className="transition hover:text-white">معاينة التصميم</a>
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
              <a href="#providers" className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-zinc-300 transition hover:bg-white/5">مصادر مشاهدة رسمية</a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-zinc-400"><span className="flex items-center gap-2"><ShieldCheck size={15} className="text-emerald-400" /> روابط رسمية عند توفرها</span><span>واجهة عربية بالكامل</span><span>اكتشاف وبحث سريع</span></div>
          </div>
          <Link href="#discover" className="relative mx-auto block w-full max-w-[390px]">
            <div className="absolute -inset-5 rounded-[35px] bg-rose-600/10 blur-3xl" />
            <div className="poster relative aspect-[4/5] rounded-[28px] border-white/10 shadow-2xl shadow-black/50" style={{ ["--glow" as string]: "rgba(183,45,73,.42)" }}>
              <div className="absolute inset-0 flex items-center justify-center"><span className="text-[15rem] font-black opacity-20 text-rose-300">D</span></div>
              <div className="absolute right-5 top-5 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-xs backdrop-blur">بيانات مباشرة</div>
              <div className="poster-art p-7">
                <div><div className="mb-3 text-xs font-bold text-rose-300">DIZI · TVmaze</div><h2 className="text-3xl font-black">مسلسلات تركية حقيقية</h2><p className="mt-3 max-w-xs text-sm leading-7 text-zinc-300">اكتشف العناوين المتاحة، افتح تفاصيلها، وتصفح المواسم والحلقات المسجلة من مصدر البيانات.</p><span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-black">تصفح المكتبة <ChevronLeft size={17} /></span></div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <TurkishCatalog />

      <section id="providers" className="container scroll-mt-6 py-14">
        <div className="max-w-2xl">
          <p className="mb-2 text-sm font-bold text-rose-300">مصادر رسمية</p>
          <h2 className="section-title">أين تتابع المسلسلات؟</h2>
          <p className="mt-3 text-sm leading-7 muted">هذه روابط مباشرة إلى مواقع القنوات والمنصات الرسمية، وليست ضمانًا بأن مسلسلًا بعينه متاح فيها. تختلف الحقوق والاشتراكات والتوفر حسب العمل والبلد والوقت؛ تحقّق من صفحة المسلسل قبل المشاهدة.</p>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {officialProviders.map((provider) => (
            <a key={provider.name} href={provider.url} target="_blank" rel="noreferrer noopener" className="glass group rounded-2xl p-5 transition hover:-translate-y-1 hover:border-rose-400/30">
              <div className="flex items-start justify-between gap-3"><span className="rounded-full border border-rose-400/20 bg-rose-400/[.07] px-2.5 py-1 text-[11px] text-rose-200">{provider.tag}</span><ExternalLink size={17} className="text-zinc-500 transition group-hover:text-rose-300" /></div>
              <h3 className="mt-5 text-lg font-extrabold">{provider.name}</h3>
              <p className="mt-2 min-h-[72px] text-sm leading-6 muted">{provider.description}</p>
              <span className="mt-4 inline-flex text-sm font-bold text-rose-300">فتح الموقع الرسمي ←</span>
            </a>
          ))}
        </div>
      </section>

      <section id="demo-library" className="container scroll-mt-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div><p className="mb-2 text-sm font-bold text-rose-300">معاينة التصميم</p><h2 className="section-title">بطاقات تجريبية للواجهة</h2><p className="mt-2 text-sm muted">هذه العناوين خيالية لأغراض التصميم فقط؛ استخدم المكتبة المباشرة أعلاه للبحث عن عناوين حقيقية.</p></div>
          <div className="relative w-full sm:max-w-[310px]"><Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث باسم المسلسل أو التصنيف..." className="search-field" aria-label="ابحث عن مسلسل" /></div>
        </div>
        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`pill ${category === item ? "active" : ""}`}>{item}</button>)}</div>
        {filtered.length ? <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">{filtered.map((series) => <SeriesCard key={series.slug} series={series} />)}</div> : <div className="glass mt-8 rounded-2xl p-10 text-center"><Search className="mx-auto mb-3 text-zinc-500" /><p className="font-bold">ما لقينا نتائج مطابقة</p><p className="mt-2 text-sm muted">جرّب اسمًا أو تصنيفًا مختلفًا.</p><button onClick={() => { setQuery(""); setCategory("الكل"); }} className="mt-4 text-sm text-rose-300">مسح البحث والفلاتر</button></div>}
      </section>

      <section id="latest" className="container pb-14">
        <div className="glass flex flex-col gap-5 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div><p className="text-xs font-bold text-rose-300">خطوة بخطوة</p><h2 className="mt-2 text-xl font-extrabold">من اكتشاف المسلسل إلى بياناته الرسمية</h2><p className="mt-2 max-w-2xl text-sm leading-7 muted">يمكنك استكشاف المعلومات والمواسم والحلقات المسجلة، والانتقال إلى صفحة TVmaze أو الموقع الرسمي إن توفر. لن نضيف روابط بث قبل التحقق من حق إتاحتها.</p></div>
          <span className="grid h-14 w-14 shrink-0 place-items-center self-start rounded-2xl bg-emerald-400/10 text-emerald-300 sm:self-center"><ShieldCheck size={27} /></span>
        </div>
      </section>

      <section className="container pb-14"><TVmazeSearch /></section>

      <footer id="about" className="border-t border-white/[.07]">
        <div className="container flex flex-col gap-4 py-7 text-xs muted sm:flex-row sm:items-center sm:justify-between"><span className="text-lg font-black text-white">dizi<span className="text-rose-400">.</span></span><span>منصة لاكتشاف الأعمال الدرامية ومصادرها الرسمية.</span><span>© {new Date().getFullYear()} Dizi · نموذج أولي</span></div>
      </footer>
    </main>
  );
}