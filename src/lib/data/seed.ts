import { SEED_MATERIALS, VERIFIED_AT } from "@/content/materials";
import { SEED_SENTENCES, SEED_SENTENCES_V2, SEED_SENTENCES_V3, SEED_SENTENCES_V4, SEED_SENTENCES_V5 } from "@/content/sentences";

import { today } from "../date";
import type { Material, Sentence, Settings } from "../types";

/** Bump when bundled content changes; existing browsers merge new items on next load. */
export const CONTENT_VERSION = 5;

export function defaultSettings(): Settings {
  return {
    id: "settings",
    onboarded: false,
    targetLevel: 6,
    examDate: null,
    dailyMinutes: 30,
    focusParts: [],
    timerSound: true,
    autoRecord: true,
    speakQuestions: true,
    seedVersion: CONTENT_VERSION,
    createdAt: Date.now(),
  };
}

export function seedMaterials(): Material[] {
  return SEED_MATERIALS.map((m, i) => ({
    id: m.id,
    origin: "official",
    part: m.part,
    title: m.title,
    url: `https://www.youtube.com/watch?v=${m.videoId}`,
    channel: "YouTube · 시계토끼제니쌤",
    verifiedAt: VERIFIED_AT,
    done: false,
    bookmarked: false,
    note: "",
    studiedDates: [],
    sentenceIds: [],
    chapters: m.chapters,
    order: i,
    createdAt: Date.now(),
  }));
}

export function newSentence(p: Pick<Sentence, "en" | "ko" | "part" | "keywords"> & Partial<Sentence>): Sentence {
  return {
    id: p.id ?? `s-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    origin: p.origin ?? "user",
    en: p.en,
    ko: p.ko,
    part: p.part,
    keywords: p.keywords,
    materialId: p.materialId,
    status: "new",
    ease: 2.5,
    interval: 0,
    reps: 0,
    lapses: 0,
    due: today(),
    createdAt: Date.now(),
  };
}

export function seedSentences(): Sentence[] {
  return [...SEED_SENTENCES, ...SEED_SENTENCES_V2, ...SEED_SENTENCES_V3, ...SEED_SENTENCES_V4, ...SEED_SENTENCES_V5].map((s) => newSentence({ ...s, origin: "sample" }));
}
