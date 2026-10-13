import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "المشاهدة غير متاحة | VIP TV",
  description: "لا يتوفر لهذه الصفحة مصدر بث موثّق.",
  robots: { index: false, follow: false }
};

export default function UnavailablePlaybackPage() {
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
        <section className="glass mx-auto max-w-2xl rounded-3xl p-6 sm:p-9">
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-amber-200">
            <CircleAlert size={18} /> المشاهدة غير متاحة
          </p>
          <h1 className="text-2xl font-black sm:text-4xl">لا يوجد مصدر بث موثّق لهذه الصفحة</h1>
          <p className="mt-4 text-sm leading-7 text-zinc-300">
            أوقفنا المشغّل الخارجي لأن ملفات المشروع لا تثبت نطاق حقوق العرض أو التضمين أو الاستخدام التجاري. لا نستضيف الحلقات ولا نعرض مشغّلًا قبل مراجعة إذن موثّق للمصدر والحلقة والمنطقة.
          </p>
          <Link href="/#discover" className="mt-7 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold hover:bg-white/[.06]">
            <ArrowRight size={16} /> العودة إلى اكتشاف المسلسلات
          </Link>
        </section>
      </section>
    </main>
  );
}

