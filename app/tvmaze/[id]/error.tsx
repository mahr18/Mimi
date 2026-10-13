"use client";

import Link from "next/link";

export default function TVmazeDetailsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="site-shell grid min-h-screen place-items-center px-5 py-16">
      <section className="glass w-full max-w-xl rounded-3xl p-8 text-center">
        <p className="text-sm font-bold text-rose-300">تعذر تحميل البيانات</p>
        <h1 className="mt-3 text-2xl font-black">ما قدرنا نوصل إلى TVmaze الآن</h1>
        <p className="mt-3 text-sm leading-7 muted">قد يكون مصدر البيانات متوقفًا مؤقتًا. جرّب إعادة المحاولة، أو ارجع للبحث بدون فقدان بقية الموقع.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={() => reset()} className="rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold hover:bg-rose-500">إعادة المحاولة</button>
          <Link href="/#discover" className="rounded-xl border border-white/10 px-5 py-3 text-sm hover:bg-white/5">العودة إلى VIP TV</Link>
        </div>
      </section>
    </main>
  );
}
