import Link from "next/link";
import { ArrowUpLeft, Star } from "lucide-react";
import type { Series } from "@/lib/catalog";

export function SeriesCard({ series }: { series: Series }) {
  return (
    <Link href={`/series/${series.slug}`} className="group block" aria-label={`تفاصيل مسلسل ${series.title}`}>
      <div className="poster" style={{ ["--glow" as string]: series.palette }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="select-none text-[8rem] font-black opacity-20" style={{ color: series.palette }}>{series.symbol}</span>
        </div>
        <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-xs backdrop-blur">
          {series.status}
        </div>
        <div className="poster-art">
          <div>
            <div className="mb-2 flex items-center gap-1 text-xs text-amber-300"><Star size={13} fill="currentColor" /> {series.rating}</div>
            <div className="poster-title">{series.title}</div>
            <div className="poster-meta">{series.year} · {series.genre}</div>
          </div>
          <ArrowUpLeft className="absolute bottom-4 left-4 opacity-0 transition group-hover:opacity-100" size={19} />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{series.title}</p>
          <p className="mt-1 truncate text-xs muted">{series.originalTitle}</p>
        </div>
        <span className="shrink-0 text-xs muted">{series.episodes} حلقة</span>
      </div>
    </Link>
  );
}