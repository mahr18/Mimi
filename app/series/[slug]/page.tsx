import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Clapperboard, Film, ShieldCheck, Star } from "lucide-react";
import { getSeriesBySlug, seriesCatalog } from "@/lib/catalog";

export function generateStaticParams() {
  return seriesCatalog.map((series) => ({ slug: series.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  return { title: series?.title ?? "مسلسل غير موجود", description: series?.synopsis, robots: { index: false, follow: false } };
}

export default async function SeriesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) notFound();

  return (
    <main className="site-shell min-h-screen">
      <header className="container flex h-[82px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-600"><Clapperboard size={20} /></span><span className="text-xl font-black">dizi<span className="text-rose-400">.</span></span></Link>
        <Link href="/" className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white"><ArrowRight size={17} /> العودة للمكتبة</Link>
      </header>
      <section className="hero-bg border-y border-white/[.06]">
        <div className="container grid gap-8 py-12 md:grid-cols-[250px_1fr] md:py-16">
          <div className="poster mx-auto w-full max-w-[250px] rounded-3xl" style={{ ["--glow" as string]: series.palette }}>
            <div className="absolute inset-0 flex items-center justify-center"><span className="text-[10rem] font-black opacity-20" style={{ color: series.palette }}>{series.symbol}</span></div>
            <div className="poster-art p-5"><div><div className="text-xs text-rose-200">{series.originalTitle}</div><div className="mt-2 text-2xl font-black">{series.title}</div></div></div>
          </div>
          <div className="self-center">
            <div className="mb-4 flex flex-wrap gap-2"><span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs text-rose-200">{series.genre}</span><span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">{series.status}</span></div>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">{series.title}</h1>
            <p className="mt-3 text-zinc-400">{series.originalTitle}</p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300">{series.synopsis}</p>
            <div className="mt-7 flex flex-wrap gap-5 text-sm text-zinc-300"><span className="flex items-center gap-2"><Star size={16} className="text-amber-300" /> {series.rating} <span className="muted">تقييم تجريبي</span></span><span className="flex items-center gap-2"><CalendarDays size={16} /> {series.year}</span><span className="flex items-center gap-2"><Film size={16} /> {series.seasons} موسم · {series.episodes} حلقة</span></div>
          </div>
        </div>
      </section>
      <section className="container py-12">
        <div className="mb-6"><h2 className="section-title">المواسم والحلقات</h2><p className="mt-2 text-sm muted">هيكل عرض تجريبي — ستُضاف بيانات الحلقات بعد ربط مصدر بيانات موثوق.</p></div>
        <div className="glass flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-bold">الموسم الأول</h3><p className="mt-1 text-sm muted">قائمة الحلقات قيد الإعداد</p></div><span className="rounded-lg bg-white/5 px-3 py-2 text-sm">{Math.min(series.episodes, 12)} حلقة نموذجية</span></div>
        <div className="glass mt-4 rounded-2xl p-5"><div className="flex items-start gap-3"><ShieldCheck className="mt-1 shrink-0 text-emerald-300" size={21} /><div><h3 className="font-bold">روابط المشاهدة الرسمية</h3><p className="mt-2 text-sm leading-7 muted">لم تتم إضافة رابط بث لهذا العنوان. لن نعرض روابط إلا بعد التحقق من مصدرها وحقوق إتاحتها.</p></div></div></div>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5"><ArrowRight size={16} /> استكشاف مسلسلات أخرى</Link>
      </section>
      <footer className="border-t border-white/[.07]"><div className="container py-6 text-xs muted">محتوى هذه الصفحة تجريبي لأغراض تطوير الواجهة.</div></footer>
    </main>
  );
}