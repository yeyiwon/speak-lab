/**
 * SPEAK LAB — domain model.
 * Every persisted entity lives here so that the storage backend
 * (IndexedDB today, Supabase later) can be swapped behind `Repository`.
 */

export type PartNo = 1 | 2 | 3 | 4 | 5;
export const PARTS: PartNo[] = [1, 2, 3, 4, 5];

export type ISODate = string; // "YYYY-MM-DD" in the user's local time zone

/* ───────── Settings ───────── */

export interface Settings {
  id: "settings";
  onboarded: boolean;
  targetLevel: number; // ETS TOEIC Speaking proficiency level 1–8
  examDate: ISODate | null;
  dailyMinutes: number; // 10–90
  focusParts: PartNo[];
  timerSound: boolean;
  autoRecord: boolean; // start recording automatically when the response phase begins
  speakQuestions: boolean; // read Part 3/4 questions aloud with the browser's speech synthesis
  voiceURI?: string | null; // chosen English voice; null = best available
  speechRate?: number; // 0.7–1.2
  seedVersion?: number; // bundled content version already merged into this browser
  createdAt: number;
}

/* ───────── Library ───────── */

/** "official": a public video verified on the channel. "user": registered by the learner. */
export type MaterialOrigin = "official" | "user";

export interface Material {
  id: string;
  origin: MaterialOrigin;
  part: PartNo | "all";
  title: string;
  url: string;
  channel: string; // source label, e.g. "YouTube · 시계토끼제니쌤"
  verifiedAt?: ISODate; // when origin === "official": date the link was checked
  done: boolean;
  doneAt?: number;
  bookmarked: boolean;
  note: string;
  studiedDates: ISODate[];
  sentenceIds: string[];
  chapters?: { part: PartNo; label: string; t: number }[];
  order: number;
  createdAt: number;
}

/* ───────── Sentences / spaced repetition ───────── */

export type SentenceStatus = "new" | "hard" | "again" | "familiar" | "mastered";
export type SentenceOrigin = "sample" | "user";
export type Rating = "again" | "hard" | "good" | "easy";

export interface Sentence {
  id: string;
  origin: SentenceOrigin;
  en: string;
  ko: string;
  part: PartNo | "all";
  keywords: string[]; // words blanked in cloze mode
  materialId?: string;
  status: SentenceStatus;
  ease: number;
  interval: number; // days
  reps: number;
  lapses: number;
  due: ISODate;
  lastReviewed?: number;
  createdAt: number;
}

export interface ReviewLog {
  id: string;
  sentenceId: string;
  date: ISODate;
  at: number;
  rating: Rating;
  mode: TrainerMode;
}

export type TrainerMode = "read" | "hint" | "cloze" | "shuffle" | "timed";

/* ───────── Speaking practice ───────── */

export interface Attempt {
  id: string;
  questionId: string;
  setId: string;
  part: PartNo;
  date: ISODate;
  startedAt: number;
  mode: "exam" | "free";
  prepSec: number;
  respSec: number;
  /** true when the learner spoke through the whole response window (or stopped in the last 3 seconds). */
  completed: boolean;
  spokenMs: number; // time the mic detected voice (RMS threshold) — measured, not a score
  answeredMs?: number; // response-window time actually used
  audioId?: string;
  /** Self-assessment 1–5. This is NOT a score; it's how the learner felt. */
  selfRating?: number;
  note: string;
  flagged: boolean;
  /** Reserved for Phase 3. Never mixed with self-assessment or official scoring. */
  transcript?: string;
  aiFeedback?: { provider: string; createdAt: number; summary: string; kind: "ai-reference" };
}

export interface AudioClip {
  id: string;
  blob: Blob;
  mime: string;
  durationMs: number;
  createdAt: number;
}

/* ───────── Activity & plans ───────── */

export type SessionKind = "sentences" | "speaking" | "lecture" | "review";

export interface StudySession {
  id: string;
  date: ISODate;
  kind: SessionKind;
  startedAt: number;
  durationSec: number;
  count: number;
}

export type PlanItemKind = "lecture" | "sentences" | "speaking" | "review";

export interface PlanItem {
  id: string;
  kind: PlanItemKind;
  title: string;
  detail: string;
  part?: PartNo;
  materialId?: string;
  target: number; // count needed to complete
  refs?: string[]; // review item: sentence / question ids to revisit
  carried: boolean; // carried over from an unfinished previous day
  estMinutes: number;
}

export interface DailyPlan {
  date: ISODate;
  items: PlanItem[];
  createdAt: number;
}

export interface ExportBundle {
  app: "speak-lab";
  version: 1;
  exportedAt: number;
  settings: Settings | null;
  materials: Material[];
  sentences: Sentence[];
  reviews: ReviewLog[];
  attempts: Attempt[];
  sessions: StudySession[];
  plans: DailyPlan[];
  audio?: { id: string; mime: string; durationMs: number; createdAt: number; dataUrl: string }[];
}
