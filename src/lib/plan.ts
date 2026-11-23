import { SETS_BY_PART } from "@/content/questions";
import { PART_SPECS } from "@/content/exam";
import { addDays, diffDays, uid } from "./date";
import { weakAttempts, weakSentences } from "./insights";
import type { Attempt, DailyPlan, ISODate, Material, PartNo, PlanItem, ReviewLog, Sentence, Settings } from "./types";

export interface PlanInputs {
  settings: Settings;
  materials: Material[];
  sentences: Sentence[];
  reviews: ReviewLog[];
  attempts: Attempt[];
  plans: DailyPlan[];
}

const QUESTIONS_PER_SET: Record<PartNo, number> = { 1: 2, 2: 2, 3: 3, 4: 3, 5: 1 };
const MIN_PER_QUESTION: Record<PartNo, number> = { 1: 3, 2: 3, 3: 2, 4: 3, 5: 4 };

/** Progress of a plan item, computed only from what was actually recorded on that date. */
export function itemProgress(item: PlanItem, date: ISODate, d: Omit<PlanInputs, "settings" | "plans">): number {
  switch (item.kind) {
    case "lecture": {
      const m = d.materials.find((x) => x.id === item.materialId);
      return m && m.studiedDates.includes(date) ? 1 : 0;
    }
    case "sentences":
      return new Set(d.reviews.filter((r) => r.date === date).map((r) => r.sentenceId)).size;
    case "speaking":
      return d.attempts.filter((a) => a.date === date && a.part === item.part).length;
    case "review": {
      const refs = new Set(item.refs ?? []);
      const touched = new Set<string>();
      d.reviews.forEach((r) => r.date === date && refs.has(r.sentenceId) && touched.add(r.sentenceId));
      d.attempts.forEach((a) => a.date === date && refs.has(a.questionId) && touched.add(a.questionId));
      return touched.size;
    }
  }
}

export function planProgress(plan: DailyPlan, d: Omit<PlanInputs, "settings" | "plans">) {
  const rows = plan.items.map((it) => {
    const p = Math.min(it.target, itemProgress(it, plan.date, d));
    return { item: it, progress: p, done: p >= it.target };
  });
  const total = rows.reduce((s, r) => s + r.item.estMinutes, 0) || 1;
  const done = rows.reduce((s, r) => s + r.item.estMinutes * (r.progress / r.item.target), 0);
  return { rows, ratio: done / total };
}

/** Picks the part trained least in the last 7 days, favouring the learner's focus parts. */
function pickParts(inputs: PlanInputs, date: ISODate, count: number): PartNo[] {
  const since = addDays(date, -7);
  const recent = inputs.attempts.filter((a) => a.date >= since);
  const focus = inputs.settings.focusParts.length ? inputs.settings.focusParts : ([1, 2, 3, 4, 5] as PartNo[]);
  const score = (p: PartNo) => recent.filter((a) => a.part === p).length - (focus.includes(p) ? 1.5 : 0);
  return ([1, 2, 3, 4, 5] as PartNo[]).sort((a, b) => score(a) - score(b) || a - b).slice(0, count);
}

export function buildPlan(inputs: PlanInputs, date: ISODate): DailyPlan {
  const { settings, materials, sentences } = inputs;
  let budget = settings.dailyMinutes;
  const items: PlanItem[] = [];
  const has = (kind: PlanItem["kind"], part?: PartNo) => items.some((i) => i.kind === kind && i.part === part);

  // 1) Carry over what was left unfinished on the previous planned day.
  const prev = [...inputs.plans].filter((p) => p.date < date).sort((a, b) => b.date.localeCompare(a.date))[0];
  if (prev && diffDays(prev.date, date) <= 3) {
    for (const r of planProgress(prev, inputs).rows) {
      if (r.done) continue;
      const it = r.item;
      if (it.kind === "lecture") {
        const m = materials.find((x) => x.id === it.materialId);
        if (!m || m.done) continue;
      }
      if (it.kind === "sentences" || it.kind === "review") continue; // recomputed fresh below from due dates
      const remaining = it.target - r.progress;
      const est = Math.max(3, Math.round((it.estMinutes * remaining) / it.target));
      items.push({ ...it, id: uid("pi-"), target: remaining, carried: true, estMinutes: est });
      budget -= est;
    }
  }

  // 2) Weak spots first: failed sentences + unfinished / flagged answers.
  const weakS = weakSentences(sentences).slice(0, 4).map((s) => s.id);
  const weakQ = weakAttempts(inputs.attempts).slice(0, 2).map((a) => a.questionId);
  const refs = [...weakS, ...weakQ];
  if (refs.length) {
    const est = Math.round(weakS.length * 0.7 + weakQ.length * 3) || 2;
    items.push({
      id: uid("pi-"),
      kind: "review",
      title: "약점 복습",
      detail: [weakS.length && `막힌 문장 ${weakS.length}`, weakQ.length && `다시 할 문제 ${weakQ.length}`].filter(Boolean).join(" · "),
      target: refs.length,
      refs,
      carried: false,
      estMinutes: est,
    });
    budget -= est;
  }

  // 3) Sentence repetition: everything due + a few new ones.
  const due = sentences.filter((s) => s.status !== "new" && s.due <= date && !weakS.includes(s.id)).length;
  const fresh = sentences.filter((s) => s.status === "new").length;
  const newCount = Math.min(fresh, settings.dailyMinutes >= 30 ? 6 : 4);
  const sentTarget = Math.min(due + newCount, Math.max(4, Math.round(settings.dailyMinutes * 0.6)));
  if (sentTarget > 0) {
    const est = Math.max(3, Math.round(sentTarget * 0.6));
    items.push({
      id: uid("pi-"),
      kind: "sentences",
      title: "만능문장 암기",
      detail: `복습 ${Math.min(due, sentTarget)} · 새 문장 ${Math.max(0, sentTarget - due)}`,
      target: sentTarget,
      carried: false,
      estMinutes: est,
    });
    budget -= est;
  }

  // 4) One lecture, unless one was carried over.
  if (!has("lecture") && budget >= 10) {
    const focus = settings.focusParts;
    const pending = materials
      .filter((m) => !m.done)
      .sort((a, b) => {
        const fa = a.part !== "all" && focus.includes(a.part) ? 0 : 1;
        const fb = b.part !== "all" && focus.includes(b.part) ? 0 : 1;
        return fa - fb || a.order - b.order;
      });
    const m = pending[0];
    if (m) {
      const est = Math.min(20, Math.max(10, Math.round(budget * 0.35)));
      items.push({
        id: uid("pi-"),
        kind: "lecture",
        title: "오늘의 강의",
        detail: m.title,
        materialId: m.id,
        part: m.part === "all" ? undefined : m.part,
        target: 1,
        carried: false,
        estMinutes: est,
      });
      budget -= est;
    }
  }

  // 5) Timed speaking practice. Exam close → train more parts.
  const daysLeft = settings.examDate ? diffDays(date, settings.examDate) : null;
  const wanted = daysLeft !== null && daysLeft >= 0 && daysLeft <= 14 ? 3 : settings.dailyMinutes >= 30 ? 2 : 1;
  for (const part of pickParts(inputs, date, wanted)) {
    if (has("speaking", part)) continue;
    if (!SETS_BY_PART(part).length) continue;
    const n = QUESTIONS_PER_SET[part];
    const est = n * MIN_PER_QUESTION[part];
    if (budget < est && items.some((i) => i.kind === "speaking")) break;
    items.push({
      id: uid("pi-"),
      kind: "speaking",
      title: `Part ${part} 실전 훈련`,
      detail: `${PART_SPECS[part].nameKo} · ${PART_SPECS[part].summary}`,
      part,
      target: n,
      carried: false,
      estMinutes: est,
    });
    budget -= est;
  }

  return { date, items, createdAt: Date.now() };
}
