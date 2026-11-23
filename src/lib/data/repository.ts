import type {
  Attempt,
  AudioClip,
  DailyPlan,
  Material,
  ReviewLog,
  Sentence,
  Settings,
  StudySession,
} from "../types";

/**
 * Storage-agnostic contract. UI and domain code only talk to this interface.
 * `IndexedDBRepository` is the Phase 1 implementation; a future
 * `SupabaseRepository` (or a sync layer wrapping both) can implement the same shape.
 */
export interface StoreMap {
  materials: Material;
  sentences: Sentence;
  reviews: ReviewLog;
  attempts: Attempt;
  audio: AudioClip;
  sessions: StudySession;
  plans: DailyPlan;
}
export type StoreName = keyof StoreMap;

export interface Repository {
  getSettings(): Promise<Settings | null>;
  putSettings(s: Settings): Promise<void>;
  all<K extends StoreName>(store: K): Promise<StoreMap[K][]>;
  get<K extends StoreName>(store: K, key: string): Promise<StoreMap[K] | undefined>;
  put<K extends StoreName>(store: K, value: StoreMap[K]): Promise<void>;
  putMany<K extends StoreName>(store: K, values: StoreMap[K][]): Promise<void>;
  remove<K extends StoreName>(store: K, key: string): Promise<void>;
  clearAll(): Promise<void>;
  /** Subscribe to any write. Returns an unsubscribe function. */
  subscribe(fn: (store: StoreName | "settings") => void): () => void;
}
