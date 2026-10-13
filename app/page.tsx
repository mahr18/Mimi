import Link from "next/link";
import { Clapperboard, Search, Play, Film, Sparkles, ChevronLeft, Languages, Zap } from "lucide-react";
import { TurkishCatalog } from "@/components/turkish-catalog";

export default function HomePage() {
  return <main className="site-shell min-h-screen">
    <header className="sticky top-0 z-40 border-b border-white/[.07] bg-[#09090d]/85 backdrop-blur-xl">
      <div className="container flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="VIP TV الصفحة الرئيسية"><span className="brand-mark grid h-10 w-10 place-items-center rounded-xl text-white"><Clapperboard size={21}/></span><span className="leading-none"><span className="block text-xl font-black">VIP <span className="text-rose-400">TV</span></span><span className="mt-1.5 block text-[10px] text-zinc-500">عالم المسلسلات بين يديك</span></span></Link>
        <nav className="hidden items-center gap-7 text-sm text-zinc-300 md:flex"><a href="#discover" className="hover:text-white">اكتشف</a><a href="#latest" className="hover:text-white">المسلسلات</a><a href="#about" className="hover:text-white">عن المنصة</a></nav>
        <a href="#discover" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3.5 py-2.5 text-sm font-semibold hover:border-rose-400/40"><Search size={16}/><span className="hidden sm:inline">ابحث عن مسلسل</span><span className="sm:hidden">بحث</span></a>
      </div>
    </header>
    <section className="vip-hero relative isolate overflow-hidden">
      <div className="hero-orb hero-orb-one"/><div className="hero-orb hero-orb-two"/>
      <div className="container relative grid min-h-[540px] items-center gap-9 py-10 sm:py-14 md:grid-cols-[1fr_.95fr] md:py-16">
        <div className="relative z-10"><div className="hero-kicker mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold"><Sparkles size={14}/> حكايات من العالم، بلغتك</div>
          <h1 className="max-w-2xl text-[2.65rem] font-black leading-[1.25] tracking-tight sm:text-5xl md:text-[4.2rem]">كل حكاية<br/><span className="vip-gradient-text">تستحق أن تُكتشف.</span></h1>
          <p className="mt-5 max-w-xl text-sm leading-8 text-zinc-300 sm:text-base">ابحث عن مسلسلك القادم، تعرّف على قصته وطاقمه ومواسمه، واكتشف أعمالًا تركية جديدة من مكان واحد.</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#discover" className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-3.5 text-sm font-extrabold shadow-lg shadow-rose-950/30 hover:bg-rose-400"><Search size={17}/> ابدأ البحث</a><a href="#latest" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[.04] px-5 py-3.5 text-sm font-bold"><Play size={16} fill="currentColor"/> تصفّح المكتبة</a></div>
          <div className="hero-proof mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs text-zinc-400"><span className="inline-flex items-center gap-2"><Languages size={15} className="text-rose-300"/> تجربة عربية من اليمين لليسار</span><span className="inline-flex items-center gap-2"><Zap size={15} className="text-amber-300"/> بيانات من مصدر معروف</span></div>
        </div>
        <div className="hero-art relative mx-auto w-full max-w-[470px]"><div className="hero-art-grid" aria-hidden="true"><div className="hero-art-panel hero-art-panel-a"><span>DRAMA</span><i/></div><div className="hero-art-panel hero-art-panel-b"><span>ROMANCE</span><i/></div><div className="hero-art-panel hero-art-panel-c"><span>THRILLER</span><i/></div><div className="hero-art-panel hero-art-panel-d"><span>WORLD</span><i/></div><div className="hero-art-center"><span className="hero-art-ring"/><Clapperboard size={32}/><span>قصتك التالية</span></div></div><div className="hero-note"><span className="hero-note-icon"><Search size={17}/></span><span><b>ابحث بالاسم المتاح</b><small>حسب إدراج TVmaze</small></span><ChevronLeft size={16} className="mr-auto text-zinc-500"/></div></div>
      </div>
    </section>
    <section className="container pt-7">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "اكتشف الدراما التركية", detail: "أعمال وقصص وطاقم التمثيل", icon: Clapperboard, href: "#discover" },
          { label: "اعثر على مسلسل بالاسم", detail: "اكتب الاسم كما هو مسجّل في TVmaze", icon: Search, href: "#discover" },
          { label: "تفاصيل المواسم والحلقات", detail: "بيانات TVmaze — بلا روابط بث غير موثقة", icon: Film, href: "#discover" }
        ].map(({ label, detail, icon: Icon, href }, index) => (
          <Link
            key={label}
            href={href}
            className={`quick-tile group flex items-center justify-between rounded-2xl p-4 sm:p-5 ${index === 0 ? "quick-tile-primary" : "quick-tile-secondary"}`}
          >
            <span className="flex items-center gap-3">
              <span className="quick-tile-icon grid h-11 w-11 place-items-center rounded-xl"><Icon size={19} /></span>
              <span>
                <span className="block text-sm font-bold">{label}</span>
                <span className="mt-1 block text-xs text-zinc-500">{detail}</span>
              </span>
            </span>
            <ChevronLeft size={16} className="text-zinc-600 transition group-hover:-translate-x-1" />
          </Link>
        ))}
      </div>
    </section>
    <section id="latest" className="container scroll-mt-24 pt-4"><div className="mb-5"><p className="mb-2 text-xs font-bold tracking-wide text-rose-300">مكتبة متجددة</p><h2 className="text-2xl font-black tracking-tight sm:text-3xl">اكتشف مسلسلك القادم</h2><p className="mt-2 text-sm leading-7 text-zinc-500">ملصقات وقصص وتفاصيل من قاعدة بيانات مباشرة، وليست أسماء تجريبية.</p></div></section>
    <TurkishCatalog/>
    <section id="about" className="container pb-12 pt-4"><div className="rounded-3xl border border-white/[.07] bg-gradient-to-l from-rose-500/[.07] via-white/[.025] to-transparent p-6 sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="max-w-2xl"><p className="text-xs font-bold text-rose-300">VIP TV</p><h2 className="mt-2 text-xl font-black">واجهة بسيطة. بحث أوضح. تفاصيل أكثر.</h2><p className="mt-2 text-sm leading-7 text-zinc-400">نعرض بيانات المسلسلات والحلقات من مصادر معلوماتية، ونربط المشاهدة فقط عند توفر مصدر مخوّل. الإعلانات غير مفعّلة حتى اعتماد الناشر واستكمال متطلبات الخصوصية والموافقة.</p></div><a href="#discover" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold hover:bg-white/[.06]"><Search size={16}/> ابحث الآن</a></div></div></section>
    <footer className="border-t border-white/[.07] bg-black/20"><div className="container flex flex-col gap-3 py-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between"><span className="text-base font-black text-white">VIP <span className="text-rose-400">TV</span></span><span>منصة لاكتشاف المسلسلات ومعلوماتها ومصادر المشاهدة.</span><span>© {new Date().getFullYear()} VIP TV</span></div></footer>
  </main>;
}

