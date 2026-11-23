/**
 * Phase 3 extension points (NOT implemented in Phase 1).
 *
 * The UI never calls these yet. When an AI backend is added (e.g. a Next.js
 * route handler calling a speech-to-text and an LLM through a gateway),
 * implement these interfaces and write results to `Attempt.transcript` and
 * `Attempt.aiFeedback` (kind: "ai-reference"). AI output must always be shown
 * as reference feedback and never mixed with self-assessment or presented as
 * an official TOEIC Speaking score.
 */
import type { Attempt, PartNo } from "../types";

export interface TranscriptionProvider {
  transcribe(audio: Blob, opts: { language: "en" }): Promise<{ text: string; words?: { w: string; start: number; end: number }[] }>;
}

export interface FeedbackProvider {
  /** Grammar / structure / relevance notes for one answer. */
  review(input: { part: PartNo; question: string; transcript: string }): Promise<{
    summary: string;
    grammar: { original: string; suggestion: string; why: string }[];
    relevance: "on-topic" | "partial" | "off-topic";
    betterAnswer?: string;
  }>;
}

export interface WeaknessExtractor {
  extract(attempts: Attempt[]): Promise<{ phrase: string; count: number }[]>;
}

export const AI_ENABLED = false;
