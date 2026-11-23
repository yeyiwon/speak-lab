import { addDays, today } from "./date";
import type { ISODate, Rating, Sentence, SentenceStatus } from "./types";

/**
 * A deliberately simple spaced-repetition scheduler (SM-2 flavoured).
 *   again → see again tomorrow, ease −0.2, counts as a lapse
 *   hard  → interval × 1.2 (min 1 day), ease −0.15
 *   good  → 1 → 3 → interval × ease
 *   easy  → good × 1.3, ease +0.15
 * Status is derived from the result so the learner can see where each sentence stands.
 */
export const RATING_LABEL: Record<Rating, string> = {
  again: "다시 복습",
  hard: "어려움",
  good: "익숙함",
  easy: "완전 암기",
};

export const STATUS_LABEL: Record<SentenceStatus, string> = {
  new: "처음 학습",
  hard: "어려움",
  again: "다시 복습",
  familiar: "익숙함",
  mastered: "완전 암기",
};

export const MASTERED_INTERVAL = 14;

export function schedule(s: Sentence, rating: Rating, on: ISODate = today()): Sentence {
  let { ease, interval, reps, lapses } = s;
  let status: SentenceStatus;

  switch (rating) {
    case "again":
      ease = Math.max(1.3, ease - 0.2);
      interval = 1;
      reps = 0;
      lapses += 1;
      status = "again";
      break;
    case "hard":
      ease = Math.max(1.3, ease - 0.15);
      interval = Math.max(1, Math.round(interval * 1.2));
      reps += 1;
      status = "hard";
      break;
    case "good":
      interval = reps === 0 ? 1 : reps === 1 ? 3 : Math.round(interval * ease);
      reps += 1;
      status = interval >= MASTERED_INTERVAL ? "mastered" : "familiar";
      break;
    case "easy":
      interval = Math.max(reps === 0 ? 3 : 4, Math.round((reps === 0 ? 2 : interval * ease) * 1.3));
      ease = Math.min(3, ease + 0.15);
      reps += 1;
      status = interval >= MASTERED_INTERVAL ? "mastered" : "familiar";
      break;
  }

  return { ...s, ease, interval, reps, lapses, status, due: addDays(on, interval), lastReviewed: Date.now() };
}

export function isDue(s: Sentence, on: ISODate = today()) {
  return s.due <= on;
}

/** Preview how many days until next review for each rating (shown on buttons). */
export function previewIntervals(s: Sentence): Record<Rating, number> {
  const r: Rating[] = ["again", "hard", "good", "easy"];
  return Object.fromEntries(r.map((x) => [x, schedule(s, x).interval])) as Record<Rating, number>;
}

/** Simplified learner-facing status (the detailed status stays internal for scheduling). */
export type SimpleStatus = "new" | "learning" | "known";
export const SIMPLE_LABEL: Record<SimpleStatus, string> = { new: "새 문장", learning: "연습 중", known: "외웠어요" };
export function simpleStatus(s: Sentence): SimpleStatus {
  if (s.status === "new") return "new";
  if (s.status === "mastered" || (s.status === "familiar" && s.interval >= 7)) return "known";
  return "learning";
}
