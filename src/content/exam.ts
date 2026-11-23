import type { PartNo } from "@/lib/types";

/**
 * Official TOEIC Speaking structure (11 questions, ~20 min, 0–200 scale).
 * Source: ETS, "About the TOEIC Speaking and Writing Test"
 * https://www.ets.org/toeic/about/speaking-writing.html — checked 2026-11-23.
 */
export interface PartSpec {
  part: PartNo;
  questions: string;
  nameKo: string;
  nameEn: string;
  readSec?: number; // reading time before questions (Part 4 info)
  prepSec: number[]; // per question in the set
  respSec: number[];
  summary: string;
}

export const PART_SPECS: Record<PartNo, PartSpec> = {
  1: { part: 1, questions: "Q1–2", nameKo: "지문 읽기", nameEn: "Read a text aloud", prepSec: [45, 45], respSec: [45, 45], summary: "준비 45초 · 답변 45초" },
  2: { part: 2, questions: "Q3–4", nameKo: "사진 묘사", nameEn: "Describe a picture", prepSec: [45, 45], respSec: [30, 30], summary: "준비 45초 · 답변 30초" },
  3: { part: 3, questions: "Q5–7", nameKo: "듣고 질문에 답하기", nameEn: "Respond to questions", prepSec: [3, 3, 3], respSec: [15, 15, 30], summary: "준비 각 3초 · 답변 15/15/30초" },
  4: { part: 4, questions: "Q8–10", nameKo: "제공된 정보로 답하기", nameEn: "Respond using information provided", readSec: 45, prepSec: [3, 3, 3], respSec: [15, 15, 30], summary: "자료 읽기 45초 · 준비 각 3초 · 답변 15/15/30초" },
  5: { part: 5, questions: "Q11", nameKo: "의견 제시하기", nameEn: "Express an opinion", prepSec: [45], respSec: [60], summary: "준비 45초 · 답변 60초" },
};

export const ETS_SOURCE = {
  title: "About the TOEIC Speaking and Writing Test",
  url: "https://www.ets.org/toeic/about/speaking-writing.html",
  publisher: "ETS",
  checkedAt: "2026-11-23",
};

/** ETS TOEIC Speaking proficiency levels (score descriptors). */
export const LEVELS: { level: number; range: string }[] = [
  { level: 8, range: "190–200" },
  { level: 7, range: "160–180" },
  { level: 6, range: "130–150" },
  { level: 5, range: "110–120" },
  { level: 4, range: "80–100" },
];
