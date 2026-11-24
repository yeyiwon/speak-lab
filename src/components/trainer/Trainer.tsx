"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFocusMode } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { speak, stopSpeaking } from "@/lib/audio/sound";
import { useCountdown } from "@/lib/audio/useCountdown";
import { useData } from "@/lib/data/store";
import type { Sentence, TrainerMode } from "@/lib/types";

export const MODES: { id: TrainerMode; label: string; desc: string }[] = [
  { id: "hint", label: "보면서 말하기", desc: "영어·한국어를 한 화면에 보고 소리 내어 말하기" },
  { id: "shuffle", label: "섞어서 말하기", desc: "전체 문장을 랜덤 순서로" },
  { id: "timed", label: "시간 안에 말하기", desc: "문장 길이에 맞춘 시간 막대를 보며 말하기" },
  { id: "cloze", label: "빈칸 채우기", desc: "핵심 표현을 직접 입력" },
];

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Deliberately simple: one card, two choices.
 *  "다시 볼래요" → comes back later in this session (and sooner next time)
 *  "다음"       → scheduled further out automatically
 * The spaced-repetition details stay out of the learner's way.
 */
export function Trainer({ mode, pool, onExit }: { mode: TrainerMode; pool: Sentence[]; onExit: () => void }) {
  const { data, actions } = useData();
  const setFocus = useFocusMode();
  const [queue, setQueue] = useState<string[]>(() => (mode === "shuffle" ? shuffle(pool) : pool).map((s) => s.id));
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(mode !== "cloze");
  const [answers, setAnswers] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [done, setDone] = useState(0);
  const [again, setAgain] = useState(0);
  const [autoPlay, setAutoPlay] = useState(() => {
    try {
      return localStorage.getItem("sl-autoplay") !== "0";
    } catch {
      return true;
    }
  });
  const toggleAuto = () => {
    const v = !autoPlay;
    setAutoPlay(v);
    try {
      localStorage.setItem("sl-autoplay", v ? "1" : "0");
    } catch {
      /* storage unavailable — keep in memory */
    }
  };
  const doneRef = useRef(0);
  useEffect(() => {
    doneRef.current = done;
  }, [done]);

  useEffect(() => {
    setFocus(true);
    const started = Date.now();
    return () => {
      setFocus(false);
      actions.logSession("sentences", (Date.now() - started) / 1000, doneRef.current);
      stopSpeaking();
    };
  }, [setFocus, actions]);

  const current = data?.sentences.find((s) => s.id === queue[idx]);
  const finished = idx >= queue.length;
  const effMode: TrainerMode = mode === "shuffle" || mode === "read" ? "hint" : mode;
  const currentEn = current?.en;
  // Shadowing: play the native recording as each card appears (not in fill-in mode, where it would give the answer away).
  useEffect(() => {
    if (!autoPlay || !currentEn || mode === "cloze") return;
    const stop = speak(currentEn);
    return () => stop();
  }, [idx, currentEn, autoPlay, mode]);

  const timedSec = current ? Math.min(15, Math.max(4, Math.round(current.en.split(/\s+/).length * 0.6 + 2))) : 5;
  const remaining = useCountdown(timedSec, effMode === "timed" && !finished, () => {}, `${idx}-${queue[idx]}`);

  const cloze = useMemo(() => (current ? buildCloze(current) : null), [current]);
  const blanks = cloze?.parts.filter((p): p is { n: number; word: string } => typeof p !== "string") ?? [];
  const allRight = checked && blanks.every((b) => norm(answers[b.n] ?? "") === norm(b.word));

  async function advance(gotIt: boolean) {
    if (!current) return;
    await actions.reviewSentence(current.id, gotIt ? "good" : "again", mode);
    setDone((d) => d + 1);
    if (!gotIt) {
      setAgain((a) => a + 1);
      setQueue((q) => [...q, current.id]);
    }
    setIdx((i) => i + 1);
    setRevealed(mode !== "cloze");
    setChecked(false);
    setAnswers([]);
  }

  // Keyboard: Space = flip, → / Enter = next, ← = again, Esc = exit
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.key === "Escape") return onExit();
      if (!revealed && e.key === " ") {
        e.preventDefault();
        setRevealed(true);
      } else if (revealed && (e.key === "ArrowRight" || e.key === "Enter")) advance(effMode === "cloze" ? allRight : true);
      else if (revealed && e.key === "ArrowLeft") advance(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const total = queue.length;
  const pct = (Math.min(idx, total) / Math.max(1, total)) * 100;

  return (
    <div className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-[var(--bg)]">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-4 px-4 pt-4 sm:px-8 sm:pt-6" style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}>
        <button type="button" className="btn btn-ghost !min-h-[40px] !px-3" onClick={onExit} aria-label="끝내기">
          <Icon name="x" size={18} />
        </button>
        <div className="track !h-2.5 flex-1" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="진행률">
          <span style={{ width: `${pct}%` }} />
        </div>
        <span className="num w-14 text-right text-sm font-bold text-ink-muted">
          {Math.min(idx + 1, total)}/{total}
        </span>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-8 sm:px-8">
        {finished || !current ? (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="clay p-8 text-center">
            <motion.div
              className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-graphite-900 text-glacier-100"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 14 }}
            >
              <Icon name="check" size={30} />
            </motion.div>
            <p className="mt-4 text-2xl font-bold">오늘 {done - again}문장 통과</p>
            <p className="mt-2 text-sm text-ink-muted">{again ? `다시 본 문장 ${again}개는 다음에 조금 더 일찍 나와요.` : "막힘 없이 끝냈어요."}</p>
            <button type="button" className="btn btn-primary mt-6" onClick={onExit}>
              돌아가기
            </button>
          </motion.div>
        ) : (
          <>
            <p className="eyebrow mb-3 flex items-center justify-between">
              <span>{MODES.find((m) => m.id === mode)?.label}</span>
              {effMode === "timed" && <span className={`num text-xl font-bold normal-case tracking-normal ${remaining < 2000 ? "text-rec" : "text-ink"}`}>{Math.ceil(remaining / 1000)}s</span>}
            </p>

            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${idx}-${current.id}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                >
                  {effMode === "cloze" && cloze ? (
                    <div className="clay p-7 sm:p-9">
                      <p className="text-sm text-ink-muted">{current.ko}</p>
                      <p className="mt-4 text-[1.3rem] font-bold leading-[2.2]">
                        {cloze.parts.map((p, i) =>
                          typeof p === "string" ? (
                            <span key={i}>{p}</span>
                          ) : (
                            <input
                              key={i}
                              aria-label={`빈칸 ${p.n + 1}`}
                              autoCapitalize="off"
                              autoCorrect="off"
                              className={`field !inline-block !min-h-0 !w-auto !px-3 !py-0.5 align-middle !text-[1.05rem] font-bold ${
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
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  setChecked(true);
                                  setRevealed(true);
                                }
                              }}
                            />
                          ),
                        )}
                      </p>
                      {checked && (
                        <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className={`mt-5 text-sm font-bold ${allRight ? "text-ok" : "text-glacier-700"}`}>
                          {allRight ? "정답이에요!" : `정답: ${current.en}`}
                        </motion.p>
                      )}
                    </div>
                  ) : (
                    <div className="clay-graphite flex min-h-[240px] flex-col justify-center p-7 sm:p-9">
                      <p className="text-[1.45rem] font-semibold leading-snug sm:text-[1.7rem]">{current.en}</p>
                      <p className="mt-4 text-[0.98rem] text-glacier-300">{current.ko}</p>
                      {effMode === "timed" && (
                        <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/10" aria-hidden>
                          <div className="h-full rounded-full bg-lime transition-[width] duration-100" style={{ width: `${(remaining / (timedSec * 1000)) * 100}%` }} />
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-7 flex flex-col gap-3">
              {revealed && (
                <div className="flex items-center gap-3">
                  <button type="button" className="btn btn-glacier !min-h-[52px] flex-1 !text-base" onClick={() => speak(current.en)}>
                    <Icon name="speaker" size={18} /> 원어민 발음 듣기
                  </button>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoPlay}
                    onClick={() => toggleAuto()}
                    className={`btn !min-h-[52px] !px-4 !text-sm ${autoPlay ? "!bg-graphite-900 !text-lime" : ""}`}
                  >
                    자동 재생 {autoPlay ? "ON" : "OFF"}
                  </button>
                </div>
              )}
              {effMode === "cloze" && !checked && (
                <button
                  type="button"
                  className="btn btn-primary !min-h-[56px] !text-base"
                  onClick={() => {
                    setChecked(true);
                    setRevealed(true);
                  }}
                >
                  확인
                </button>
              )}
              {revealed && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-[1fr_1.6fr] gap-3">
                  <button type="button" className="btn !min-h-[56px]" onClick={() => advance(false)}>
                    <Icon name="retry" size={17} /> 다시 볼래요
                  </button>
                  <button type="button" className="btn btn-primary !min-h-[56px] !text-base" onClick={() => advance(effMode === "cloze" ? allRight : true)}>
                    다음 <Icon name="arrow" size={18} />
                  </button>
                </motion.div>
              )}
              <p className="hidden text-center text-xs text-ink-muted sm:block">→ / Enter 다음 · ← 다시 · Esc 끝내기</p>
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
      const i = p.toLowerCase().indexOf(k.toLowerCase());
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
