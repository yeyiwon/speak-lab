import { addDays, today } from "./date";
import type { Attempt, ISODate, Material, PartNo, ReviewLog, Sentence, StudySession } from "./types";

/** Everything derived from stored data — no numbers are invented. */

export function activeDates(input: {
  sessions: StudySession[];
  reviews: ReviewLog[];
  attempts: Attempt[];
  materials: Material[];
}): Set<ISODate> {
  const set = new Set<ISODate>();
  input.sessions.forEach((s) => set.add(s.date));
  input.reviews.forEach((r) => set.add(r.date));
  input.attempts.forEach((a) => set.add(a.date));
  input.materials.forEach((m) => m.studiedDates.forEach((d) => set.add(d)));
  return set;
}

/** Consecutive days with any recorded study. If today is empty, the streak from yesterday is still alive. */
export function streak(dates: Set<ISODate>, on: ISODate = today()): number {
  let d = dates.has(on) ? on : addDays(on, -1);
  let n = 0;
  while (dates.has(d)) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

export function latestAttemptByQuestion(attempts: Attempt[]): Map<string, Attempt> {
  const m = new Map<string, Attempt>();
  for (const a of attempts) {
    const cur = m.get(a.questionId);
    if (!cur || cur.startedAt < a.startedAt) m.set(a.questionId, a);
  }
  return m;
}

export function weakSentences(sentences: Sentence[]): Sentence[] {
  return sentences
    .filter((s) => s.status === "again" || s.status === "hard" || (s.lapses >= 2 && s.status !== "mastered"))
    .sort((a, b) => b.lapses - a.lapses || a.due.localeCompare(b.due));
}

/** Questions whose most recent attempt was unfinished, flagged, or self-rated ≤ 2. */
export function weakAttempts(attempts: Attempt[]): Attempt[] {
  return [...latestAttemptByQuestion(attempts).values()]
    .filter((a) => !a.completed || a.flagged || (a.selfRating !== undefined && a.selfRating <= 2))
    .sort((a, b) => b.startedAt - a.startedAt);
}

export interface PartInsight {
  part: PartNo;
  attempts: number;
  completedRate: number | null;
  avgSelf: number | null;
}

export function partInsights(attempts: Attempt[]): PartInsight[] {
  return ([1, 2, 3, 4, 5] as PartNo[]).map((part) => {
    const xs = attempts.filter((a) => a.part === part);
    const rated = xs.filter((a) => a.selfRating !== undefined);
    return {
      part,
      attempts: xs.length,
      completedRate: xs.length ? xs.filter((a) => a.completed).length / xs.length : null,
      avgSelf: rated.length ? rated.reduce((s, a) => s + (a.selfRating ?? 0), 0) / rated.length : null,
    };
  });
}

export interface Weakness {
  id: string;
  label: string;
  detail: string;
  href: string;
}

export function weaknesses(sentences: Sentence[], attempts: Attempt[]): Weakness[] {
  const out: Weakness[] = [];
  const ws = weakSentences(sentences);
  if (ws.length) {
    out.push({
      id: "w-sent",
      label: `막힌 문장 ${ws.length}개`,
      detail: `“${ws[0].en.slice(0, 48)}${ws[0].en.length > 48 ? "…" : ""}”`,
      href: "/review",
    });
  }
  for (const p of partInsights(attempts)) {
    if (p.attempts < 2) continue;
    if (p.completedRate !== null && p.completedRate < 0.6) {
      out.push({
        id: `w-time-${p.part}`,
        label: `Part ${p.part} 답변 시간 미완주`,
        detail: `최근 ${p.attempts}회 중 ${Math.round((1 - p.completedRate) * 100)}%가 시간 전에 끝났습니다.`,
        href: `/studio?part=${p.part}`,
      });
    } else if (p.avgSelf !== null && p.avgSelf < 2.8) {
      out.push({
        id: `w-self-${p.part}`,
        label: `Part ${p.part} 자기 평가 낮음`,
        detail: `자기 평가 평균 ${p.avgSelf.toFixed(1)} / 5`,
        href: `/studio?part=${p.part}`,
      });
    }
  }
  const flagged = weakAttempts(attempts).filter((a) => a.flagged).length;
  if (flagged) out.push({ id: "w-flag", label: `어렵다고 표시한 문제 ${flagged}개`, detail: "복습 화면에서 다시 도전하세요.", href: "/review" });
  return out;
}
