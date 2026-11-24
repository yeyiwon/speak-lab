"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFocusMode } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { speak, stopSpeaking } from "@/lib/audio/sound";
import { useData } from "@/lib/data/store";
import { DISPLAY_LABEL, saveSession, type DrillSession } from "@/lib/session";
import type { Sentence, TrainerMode } from "@/lib/types";

const LOG_MODE: Record<DrillSession["display"], TrainerMode> = { both: "read", ko: "hint", cloze: "cloze" };

/**
 * One sentence at a time.
 *  정답 보기 / 확인 — only reveals; records nothing
 *  알고 있음        — records "good": the next review moves further out
 *  다시 연습        — records "again": review tomorrow, and it comes back once at the end of this session
 *  건너뛰기         — moves on without recording anything
 *  종료             — leaves; the session can be resumed later (persist=true)
 */
export function Trainer({ session: initial, persist, onExit, onRestart }: { session: DrillSession; persist: boolean; onExit: () => void; onRestart?: () => void }) {
  const { data, actions } = useData();
  const setFocus = useFocusMode();
  const [s, setS] = useState(initial);
  const revealByDefault = s.display === "both";
  const [revealed, setRevealed] = useState(revealByDefault);
  const [answers, setAnswers] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [autoPlay, setAutoPlay] = useState(() => {
    try {
      return localStorage.getItem("sl-autoplay") !== "0";
    } catch {
      return true;
    }
  });
  const rated = useRef(0);

  useEffect(() => {
    setFocus(true);
    const started = Date.now();
    return () => {
      setFocus(false);
      actions.logSession("sentences", (Date.now() - started) / 1000, rated.current);
      stopSpeaking();
    };
  }, [setFocus, actions]);

  const id = s.ids[s.idx];
  const current: Sentence | undefined = data?.sentences.find((x) => x.id === id);
  const finished = s.idx >= s.ids.length;
  const checked = s.display === "cloze" && revealed;

  useEffect(() => {
    if (persist) saveSession(s);
  }, [s, persist]);

  const currentEn = current?.en;
  // Shadowing: play the native recording once the English is on screen (never before the answer is revealed).
  useEffect(() => {
    if (!autoPlay || !currentEn || !revealed || s.display === "cloze") return;
    const stop = speak(currentEn);
    return () => stop();
  }, [s.idx, currentEn, autoPlay, revealed, s.display]);

  const cloze = useMemo(() => (current ? buildCloze(current) : null), [current]);
  const blanks = cloze?.parts.filter((p): p is { n: number; word: string } => typeof p !== "string") ?? [];
  const allRight = checked && blanks.every((b) => norm(answers[b.n] ?? "") === norm(b.word));

  function goNext(update: (p: DrillSession) => DrillSession) {
    setS((p) => update({ ...p, idx: p.idx + 1 }));
    setRevealed(revealByDefault);
    setAnswers([]);
  }

  async function rate(known: boolean) {
    if (!current || busy || !revealed) return;
    setBusy(true);
    await actions.reviewSentence(current.id, known ? "good" : "again", LOG_MODE[s.display]);
    rated.current += 1;
    const requeue = !known && !s.requeued.includes(current.id);
    goNext((p) => ({
      ...p,
      known: p.known + (known ? 1 : 0),
      again: p.again + (known ? 0 : 1),
      ids: requeue ? [...p.ids, current.id] : p.ids,
      requeued: requeue ? [...p.requeued, current.id] : p.requeued,
    }));
    setBusy(false);
  }

  // Keyboard: Space = 정답 보기 · 1/← = 다시 연습 · 2/→ = 알고 있음 · Esc = 종료
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") {
        if (e.key === "Enter") setRevealed(true);
        return;
      }
      if (e.key === "Escape") return onExit();
      if (!revealed && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        setRevealed(true);
      } else if (revealed && (e.key === "ArrowRight" || e.key === "2")) rate(true);
      else if (revealed && (e.key === "ArrowLeft" || e.key === "1")) rate(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const total = s.ids.length;
  const pct = (Math.min(s.idx, total) / Math.max(1, total)) * 100;

  return (
    <div className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-[var(--bg)]">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-4 px-4 pt-4 sm:px-8 sm:pt-6" style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}>
        <button type="button" className="btn btn-ghost !min-h-[40px] !px-3 !text-sm" onClick={onExit}>
          <Icon name="x" size={16} /> 종료
        </button>
        <div className="track flex-1" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="진행률">
          <span style={{ width: `${pct}%` }} />
        </div>
        <span className="num w-16 text-right text-sm font-semibold text-ink-muted" aria-label="현재 문제">
          {Math.min(s.idx + 1, total)} / {total}
        </span>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-8 sm:px-8">
        {finished ? (
          <div className="clay p-8 text-center">
            <p className="text-xl font-bold">세션 완료</p>
            <p className="num mt-3 text-ink-muted">
              알고 있음 <strong className="text-ink">{s.known}</strong> · 다시 연습 <strong className="text-ink">{s.again}</strong>
            </p>
            <p className="mt-1 text-sm text-ink-muted">다시 연습한 문장은 내일 복습에 나옵니다.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {onRestart && (
                <button type="button" className="btn btn-primary" onClick={onRestart}>
                  새 세션 시작
                </button>
              )}
              <button type="button" className="btn" onClick={onExit}>
                목록으로
              </button>
            </div>
          </div>
        ) : !current ? (
          // The sentence was deleted after this session started.
          <div className="clay p-8 text-center">
            <p className="text-ink-muted">삭제된 문장이에요.</p>
            <button type="button" className="btn btn-primary mt-4" onClick={() => goNext((p) => p)}>
              다음 문장
            </button>
          </div>
        ) : (
          <>
            <p className="eyebrow mb-3">{DISPLAY_LABEL[s.display]}</p>
            <AnimatePresence mode="wait">
              <motion.div key={`${s.idx}-${current.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                {s.display === "cloze" && cloze ? (
                  <div className="clay p-7 sm:p-9">
                    <p className="text-sm text-ink-muted">{current.ko}</p>
                    <p className="mt-4 text-[1.3rem] font-semibold leading-[2.2]">
                      {cloze.parts.map((p, i) =>
                        typeof p === "string" ? (
                          <span key={i}>{p}</span>
                        ) : (
                          <input
                            key={i}
                            aria-label={`빈칸 ${p.n + 1}`}
                            autoCapitalize="off"
                            autoCorrect="off"
                            className={`field !inline-block !min-h-0 !w-auto !px-3 !py-0.5 align-middle !text-[1.05rem] font-semibold ${
                              checked ? (norm(answers[p.n] ?? "") === norm(p.word) ? "!text-ok" : "!text-rec") : ""
                            }`}
                            style={{ width: `${Math.max(4, p.word.length + 2)}ch` }}
                            value={answers[p.n] ?? ""}
                            disabled={checked}
                            onChange={(e) => {
                              const a = [...answers];
                              a[p.n] = e.target.value;
                              setAnswers(a);
                            }}
                          />
                        ),
                      )}
                    </p>
                    {checked && <p className={`mt-5 text-sm font-semibold ${allRight ? "text-ok" : "text-glacier-700"}`}>{allRight ? "정답" : `정답: ${current.en}`}</p>}
                  </div>
                ) : (
                  <div className="clay-graphite flex min-h-[220px] flex-col justify-center p-7 sm:p-9">
                    {s.display === "ko" && <p className="text-[1.35rem] font-semibold leading-snug">{current.ko}</p>}
                    {revealed && <p className={`font-semibold leading-snug ${s.display === "ko" ? "mt-4 text-lg text-lime" : "text-[1.45rem] sm:text-[1.7rem]"}`}>{current.en}</p>}
                    {s.display === "both" && <p className="mt-4 text-[0.98rem] text-glacier-300">{current.ko}</p>}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex flex-col gap-3">
              {s.display !== "cloze" && (
                <div className="flex items-center gap-3">
                  <button type="button" className="btn btn-glacier !min-h-[48px] flex-1" disabled={!revealed} onClick={() => speak(current.en)}>
                    <Icon name="speaker" size={18} /> 원어민 발음 듣기
                  </button>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoPlay}
                    onClick={() => {
                      setAutoPlay(!autoPlay);
                      try {
                        localStorage.setItem("sl-autoplay", autoPlay ? "0" : "1");
                      } catch {
                        /* keep in memory */
                      }
                    }}
                    className={`btn !min-h-[48px] !px-4 !text-sm ${autoPlay ? "!bg-graphite-900 !text-lime" : ""}`}
                  >
                    자동 재생 {autoPlay ? "ON" : "OFF"}
                  </button>
                </div>
              )}
              {!revealed ? (
                <button type="button" className="btn btn-primary !min-h-[56px] !text-base" onClick={() => setRevealed(true)}>
                  {s.display === "cloze" ? "확인" : "정답 보기"}
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" className="btn !min-h-[56px]" disabled={busy} onClick={() => rate(false)}>
                    <Icon name="retry" size={17} /> 다시 연습
                  </button>
                  <button type="button" className="btn btn-primary !min-h-[56px] !text-base" disabled={busy} onClick={() => rate(true)}>
                    <Icon name="check" size={17} /> 알고 있음
                  </button>
                </div>
              )}
              <button type="button" className="btn btn-ghost mx-auto !min-h-[36px] !text-sm text-ink-muted" onClick={() => goNext((p) => p)}>
                건너뛰기 <span className="text-xs">(기록 안 함)</span>
              </button>
              <p className="hidden text-center text-xs text-ink-muted sm:block">Space 정답 보기 · 1 다시 연습 · 2 알고 있음 · Esc 종료</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();

function buildCloze(s: Sentence): { parts: (string | { n: number; word: string })[] } {
  const keys = s.keywords.filter(Boolean).length ? s.keywords.filter(Boolean) : [s.en.split(/\s+/).sort((a, b) => b.length - a.length)[0].replace(/[^\w']/g, "")];
  let parts: (string | { n: number; word: string })[] = [s.en];
  keys.forEach((k, n) => {
    const next: typeof parts = [];
    let used = false;
    for (const p of parts) {
      if (typeof p !== "string" || used) {
        next.push(p);
        continue;
      }
      const i = p.toLowerCase().indexOf(k.replace(/[[\]]/g, "").toLowerCase());
      if (i < 0) {
        next.push(p);
        continue;
      }
      used = true;
      next.push(p.slice(0, i), { n, word: p.slice(i, i + k.length) }, p.slice(i + k.length));
    }
    parts = next;
  });
  return { parts };
}
