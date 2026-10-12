import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";

const embedUrl = "https://w.anaplayer.online/albaplayer/yeralti-2026-s01e17/?serv=0";
const qarmziEpisodeUrl = "https://www.qrmzi.tv/episode/%D9%85%D8%B3%D9%84%D8%B3%D9%84-%D8%AA%D8%AD%D8%AA-%D8%A7%D9%84%D8%A3%D8%B1%D8%B6-%D8%A7%D9%84%D8%AD%D9%84%D9%82%D8%A9-17/";

export const metadata: Metadata = {
  title: "تحت الأرض الحلقة 17 | VIP TV",
  description: "مشاهدة الحلقة 17 من مسلسل تحت الأرض عبر المشغل المضمّن.",
  robots: { index: false, follow: true }
};

export default function YeraltıEpisode17Page() {
  return (
    <main className="site-shell min-h-screen">
      <header className="border-b border-white/[.07] bg-[#09090d]/85">
        <div className="container flex h-[68px] items-center justify-between">
          <Link href="/" className="text-lg font-black">VIP <span className="text-rose-400">TV</span></Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white">
            <ArrowRight size={16} /> العودة للرئيسية
          </Link>
        </div>
      </header>

      <section className="container py-8 sm:py-12">
        <div className="mb-5">
          <p className="mb-2 inline-flex items-center gap-2 text-sm font-bold text-rose-300">
            <PlayCircle size={17} /> مشغل خارجي مضمّن عبر صفحة قرمزي
          </p>
          <h1 className="text-2xl font-black sm:text-4xl">تحت الأرض — الحلقة 17</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
            تعمل الحلقة داخل صفحة VIP TV عبر مشغل خارجي تعرضه صفحة قرمزي. قد تختلف الإتاحة بحسب المشغل والمنطقة.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/40">
          <div className="aspect-video min-h-56">
            <iframe
              src={embedUrl}
              title="مشغل خارجي مقدم عبر قرمزي: تحت الأرض الحلقة 17"
              className="h-full w-full border-0"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              loading="eager"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>

        <p className="mt-4 text-xs leading-6 text-zinc-500">
          المشغل مستضاف لدى AnaPlayer ويُعرض كما يقدمه مصدر الحلقة. <a className="underline underline-offset-4 hover:text-zinc-300" href={qarmziEpisodeUrl} target="_blank" rel="noreferrer">صفحة الحلقة في قرمزي</a>.
        </p>

        <aside className="mt-5 rounded-2xl border border-white/10 bg-white/[.03] p-4 text-sm leading-7 text-zinc-400" aria-label="معلومات الإعلانات ومصدر المشغل">
          <p>الإعلانات داخل المشغل الخارجي تتبع إعدادات الجهة التي تديره. التضمين وحده لا يحوّل عائدها إلى VIP TV، ولم نتحقق من حساب الناشر أو جهة الدفع المرتبطة به.</p>
          <p className="mt-2">معاينة هذه النسخة لا تعرض إعلانات خاصة بـ VIP TV في صفحة المشاهدة. يلزم حساب ناشر معتمد وإعداد وحدات إعلانية باسمك لتسجيل عائد الموقع في حسابك.</p>
        </aside>
      </section>
    </main>
  );
}

