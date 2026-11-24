import type { ISODate, PartNo, Sentence } from "./types";

/** How a sentence practice session picks its questions. */
export type DrillOrder = "random" | "weak" | "new" | "picked";
export type DrillSize = 5 | 10 | 20 | "all";
/** both = English + Korean together · ko = Korean hint, reveal English · cloze = fill the key words */
export type DrillDisplay = "both" | "ko" | "cloze";

export interface DrillConfig {
  order: DrillOrder;
  size: DrillSize;
  part: PartNo | "all" | "any"; // "all" = 공통 sentences, "any" = every part
  display: DrillDisplay;
}

export const DEFAULT_DRILL: DrillConfig = { order: "random", size: "all", part: "any", display: "both" };

export const ORDER_LABEL: Record<DrillOrder, string> = { random: "랜덤", weak: "틀린 문장 우선", new: "새 문장 우선", picked: "선택한 문장만" };
export const DISPLAY_LABEL: Record<DrillDisplay, string> = { both: "영어+한국어", ko: "한국어 보고 말하기", cloze: "빈칸 채우기" };
export const SIZES: DrillSize[] = [5, 10, 20, "all"];

function shuffle<T>(xs: T[], rand: () => number): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Coverage order: never-practiced sentences first (in random order), then the ones
 * practiced longest ago. Taking the head of this list over consecutive sessions
 * walks the whole bank before anything repeats.
 */
function cycleOrder(xs: Sentence[], rand: () => number): Sentence[] {
  return shuffle(xs, rand).sort((a, b) => (a.lastReviewed ?? 0) - (b.lastReviewed ?? 0));
}

export const isWeak = (s: Sentence, date: ISODate) => s.status === "again" || s.status === "hard" || (s.status !== "new" && s.due <= date);

export function drillPool(sentences: Sentence[], cfg: DrillConfig, picked: string[]): Sentence[] {
  const byPart = cfg.part === "any" ? sentences : sentences.filter((s) => s.part === cfg.part);
  return cfg.order === "picked" ? byPart.filter((s) => picked.includes(s.id)) : byPart;
}

/** Number of questions a session will actually have (never more than the sentences available). */
export function drillCount(sentences: Sentence[], cfg: DrillConfig, picked: string[]): number {
  const n = drillPool(sentences, cfg, picked).length;
  // Hand-picked sentences are all served — the count limit would silently drop some.
  return cfg.size === "all" || cfg.order === "picked" ? n : Math.min(cfg.size, n);
}

/** Builds the question order once, at session start. No duplicates; the order is then fixed. */
export function buildSession(sentences: Sentence[], cfg: DrillConfig, picked: string[], date: ISODate, rand: () => number = Math.random): string[] {
  const pool = drillPool(sentences, cfg, picked);
  const n = drillCount(sentences, cfg, picked);
  let chosen: Sentence[];
  if (cfg.order === "weak" || cfg.order === "new") {
    const want = cfg.order === "weak" ? (s: Sentence) => isWeak(s, date) : (s: Sentence) => s.status === "new";
    // Weak mode caps priority items at 70% so a few hard sentences can't take over every session.
    const cap = cfg.order === "weak" ? Math.ceil(n * 0.7) : n;
    const prio = cycleOrder(pool.filter(want), rand);
    const first = prio.slice(0, cap);
    // Fill the rest with other sentences first; leftover priority ones only if the bank runs short.
    const rest = [...cycleOrder(pool.filter((s) => !want(s)), rand), ...prio.slice(cap)];
    chosen = [...first, ...rest.slice(0, n - first.length)];
  } else {
    chosen = cycleOrder(pool, rand).slice(0, n);
  }
  return shuffle(chosen, rand).map((s) => s.id);
}

/* ───────── In-progress session (survives navigation / reload on this device) ───────── */

export interface DrillSession {
  ids: string[];
  idx: number;
  requeued: string[]; // "다시 연습" puts a sentence back once per session — never an endless loop
  known: number;
  again: number;
  display: DrillDisplay;
  startedAt: number;
}

const KEY = "sl-drill-session";

export function loadSession(): DrillSession | null {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? "null") as DrillSession | null;
    return s && Array.isArray(s.ids) && s.idx < s.ids.length ? s : null;
  } catch {
    return null;
  }
}

export function saveSession(s: DrillSession | null) {
  try {
    if (s && s.idx < s.ids.length) localStorage.setItem(KEY, JSON.stringify(s));
    else localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable — session just won't resume */
  }
}

export function newSession(ids: string[], display: DrillDisplay): DrillSession {
  return { ids, idx: 0, requeued: [], known: 0, again: 0, display, startedAt: Date.now() };
}
