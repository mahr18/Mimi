"use client";

import { useState } from "react";
import { Check, CircleAlert, PlayCircle } from "lucide-react";
import type { PlaybackSource } from "@/lib/authorized-playback";

type Episode = {
  id: number;
  name: string;
  number: number | null;
  airdate: string | null;
  runtime: number | null;
  summary: string;
  playback: PlaybackSource | null;
};

export default function AuthorizedEpisodeList({ episodes }: { episodes: Episode[] }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = episodes.find((episode) => episode.id === selectedId);

  return (
    <>
      <div className="grid gap-3 md:grid-cols-2">
        {episodes.map((episode) => (
          <article key={episode.id} className="glass rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-bold">
                  {episode.number ? "الحلقة " + episode.number + ": " : ""}
                  {episode.name}
                </h4>
                <p className="mt-1 text-xs muted">
                  {[episode.airdate, episode.runtime ? episode.runtime + " دقيقة" : null]
                    .filter(Boolean)
                    .join(" · ") || "لا تتوفر تفاصيل إضافية"}
                </p>
              </div>

              {episode.playback ? (
                <button
                  type="button"
                  onClick={() => setSelectedId(episode.id)}
                  aria-pressed={selectedId === episode.id}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-rose-300/40 px-3 py-2 text-sm font-bold text-rose-100 hover:bg-rose-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-300"
                >
                  {selectedId === episode.id ? <Check size={16} /> : <PlayCircle size={16} />}
                  مشاهدة
                </button>
              ) : (
                <span
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-500"
                  aria-label="لا يتوفر بث موثّق لهذه الحلقة"
                >
                  <CircleAlert size={15} />
                  غير متاحة
                </span>
              )}
            </div>
            {episode.summary && <p className="mt-3 text-sm leading-6 muted">{episode.summary}</p>}
          </article>
        ))}
      </div>

      {selected?.playback && (
        <section
          className="mt-5 rounded-2xl border border-rose-300/20 bg-black/30 p-3 sm:p-5"
          aria-label={"مشغل " + selected.name}
        >
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h4 className="font-bold">{selected.name}</h4>
              <p className="mt-1 text-xs muted">
                مشغل مقدّم من {selected.playback.providerName}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-300"
            >
              إغلاق المشغل
            </button>
          </div>

          <div className="aspect-video overflow-hidden rounded-xl bg-black">
            {selected.playback.kind === "embed" ? (
              <iframe
                key={selected.playback.url}
                src={selected.playback.url}
                title={"مشغل الحلقة: " + selected.name}
                className="h-full w-full border-0"
                allow="fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                sandbox="allow-scripts allow-same-origin allow-presentation"
              />
            ) : (
              <video
                key={selected.playback.url}
                className="h-full w-full"
                controls
                playsInline
                preload="metadata"
              >
                <source
                  src={selected.playback.url}
                  type={selected.playback.mimeType ?? "video/mp4"}
                />
                {selected.playback.captions?.map((caption) => (
                  <track
                    key={caption.language + caption.url}
                    kind="captions"
                    src={caption.url}
                    srcLang={caption.language}
                    label={caption.label}
                    default={caption.isDefault}
                  />
                ))}
                يتعذر تشغيل الفيديو في هذا المتصفح.
              </video>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs muted">
            <span>الصوت: {selected.playback.audioLanguages.join("، ") || "غير محدد"}</span>
            <span>الترجمة: {selected.playback.subtitleLanguages.join("، ") || "غير متاحة"}</span>
          </div>
        </section>
      )}
    </>
  );
}
