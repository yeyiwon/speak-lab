"use client";

import { useEffect, useRef, useState } from "react";
import { useData } from "@/lib/data/store";
import { Icon } from "./Icon";

/** Clay audio player that loads a recording from IndexedDB by id. */
export function AudioPlayer({ audioId, blob, label = "내 녹음" }: { audioId?: string; blob?: Blob; label?: string }) {
  const { actions } = useData();
  const [url, setUrl] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let u: string | null = null;
    let alive = true;
    (async () => {
      const b = blob ?? (audioId ? (await actions.getAudio(audioId))?.blob : undefined);
      if (!alive) return;
      if (!b) {
        setMissing(true);
        return;
      }
      u = URL.createObjectURL(b);
      setUrl(u);
    })();
    return () => {
      alive = false;
      if (u) URL.revokeObjectURL(u);
    };
  }, [audioId, blob, actions]);

  if (missing) return <p className="text-sm text-ink-muted">녹음 파일이 없어요 (삭제되었거나 가져오기에 포함되지 않음).</p>;

  const fmt = (s: number) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");
  const ratio = dur > 0 ? t / dur : 0;

  return (
    <div className="clay-sm flex items-center gap-3 p-2.5 pr-4">
      <button
        type="button"
        className="btn btn-primary !h-11 !w-11 !min-h-0 !px-0"
        aria-label={playing ? `${label} 일시정지` : `${label} 재생`}
        disabled={!url}
        onClick={() => {
          const a = ref.current!;
          if (a.paused) a.play();
          else a.pause();
        }}
      >
        <Icon name={playing ? "pause" : "play"} size={18} />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between text-xs font-bold text-ink-muted">
          <span>{label}</span>
          <span className="num">
            {fmt(t)} / {fmt(dur)}
          </span>
        </div>
        <input
          type="range"
          aria-label="재생 위치"
          min={0}
          max={1000}
          value={Math.round(ratio * 1000)}
          onChange={(e) => {
            const a = ref.current;
            if (a && dur) a.currentTime = (Number(e.target.value) / 1000) * dur;
          }}
          className="mt-1 w-full accent-[#4c6f93]"
        />
      </div>
      {url && (
        <audio
          ref={ref}
          src={url}
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => {
            const d = e.currentTarget.duration;
            // Chrome reports Infinity for fresh webm blobs; seek trick resolves real duration.
            if (!Number.isFinite(d)) {
              e.currentTarget.currentTime = 1e7;
              e.currentTarget.ontimeupdate = function () {
                const el = this as HTMLAudioElement;
                el.ontimeupdate = null;
                setDur(el.duration);
                el.currentTime = 0;
              };
            } else setDur(d);
          }}
          onDurationChange={(e) => Number.isFinite(e.currentTarget.duration) && setDur(e.currentTarget.duration)}
        />
      )}
    </div>
  );
}
