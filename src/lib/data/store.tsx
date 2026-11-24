"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { today, uid } from "../date";
import { buildPlan, syncSentencePlan } from "../plan";
import { schedule } from "../srs";
import type {
  Attempt,
  DailyPlan,
  ExportBundle,
  Material,
  Rating,
  ReviewLog,
  Sentence,
  SessionKind,
  Settings,
  StudySession,
  TrainerMode,
} from "../types";
import { getRepo, STORE_NAMES } from "./indexeddb";
import { CONTENT_VERSION, defaultSettings, newSentence, seedMaterials, seedSentences } from "./seed";

export interface AppData {
  settings: Settings;
  materials: Material[];
  sentences: Sentence[];
  reviews: ReviewLog[];
  attempts: Attempt[];
  sessions: StudySession[];
  plans: DailyPlan[];
}

interface Ctx {
  ready: boolean;
  error: string | null;
  data: AppData | null;
  todayPlan: DailyPlan | null;
  actions: ReturnType<typeof makeActions>;
}

const DataContext = createContext<Ctx | null>(null);

async function loadAll(): Promise<AppData> {
  if (typeof indexedDB === "undefined") throw new Error("이 브라우저는 IndexedDB를 지원하지 않아 학습 기록을 저장할 수 없습니다.");
  const repo = getRepo();
  let settings = await repo.getSettings();
  if (!settings) {
    // First visit: seed verified public lectures and example sentences.
    settings = defaultSettings();
    await repo.putSettings(settings);
    await repo.putMany("materials", seedMaterials());
    await repo.putMany("sentences", seedSentences());
  } else if ((settings.seedVersion ?? 1) < CONTENT_VERSION) {
    // Merge newly bundled content without touching the learner's progress, notes or own items.
    const [ms, ss] = await Promise.all([repo.all("materials"), repo.all("sentences")]);
    const haveS = new Set(ss.map((s) => s.id));
    await repo.putMany("sentences", seedSentences().filter((s) => !haveS.has(s.id)));
    const byId = new Map(ms.map((m) => [m.id, m]));
    await repo.putMany(
      "materials",
      seedMaterials().map((seed) => {
        const cur = byId.get(seed.id);
        return cur ? { ...cur, title: seed.title, chapters: seed.chapters } : seed;
      }),
    );
    settings = { ...settings, seedVersion: CONTENT_VERSION };
    await repo.putSettings(settings);
  }
  const [materials, sentences, reviews, attempts, sessions, plans] = await Promise.all([
    repo.all("materials"),
    repo.all("sentences"),
    repo.all("reviews"),
    repo.all("attempts"),
    repo.all("sessions"),
    repo.all("plans"),
  ]);
  return { settings, materials, sentences, reviews, attempts, sessions, plans };
}

function makeActions(get: () => AppData | null) {
  const repo = getRepo();
  const must = () => {
    const d = get();
    if (!d) throw new Error("data not ready");
    return d;
  };

  return {
    /* settings & plan */
    async updateSettings(patch: Partial<Settings>) {
      const d = must();
      // Merge into the stored copy, not the in-memory one: quick successive updates
      // (e.g. ticking several sentences) would otherwise overwrite each other's fields.
      const settings = { ...((await repo.getSettings()) ?? d.settings), ...patch };
      await repo.putSettings(settings);
      // Practice setup changed → today's 문장 연습 target follows it.
      const plan = d.plans.find((p) => p.date === today());
      const synced = plan && (patch.drill || patch.pickedSentenceIds) ? syncSentencePlan(plan, { settings, sentences: d.sentences }) : null;
      if (synced) await repo.put("plans", synced);
    },
    async regeneratePlan(settingsPatch?: Partial<Settings>) {
      const d = must();
      const date = today();
      const settings = { ...d.settings, ...settingsPatch };
      const plan = buildPlan({ ...d, settings, plans: d.plans.filter((p) => p.date !== date) }, date);
      await repo.put("plans", plan);
    },

    /* library */
    async saveMaterial(m: Material) {
      await repo.put("materials", m);
    },
    async addMaterial(p: Pick<Material, "title" | "url" | "part" | "channel" | "note">) {
      const d = must();
      const m: Material = {
        id: uid("m-"),
        origin: "user",
        ...p,
        done: false,
        bookmarked: false,
        studiedDates: [],
        sentenceIds: [],
        order: d.materials.length,
        createdAt: Date.now(),
      };
      await repo.put("materials", m);
      return m;
    },
    async removeMaterial(id: string) {
      await repo.remove("materials", id);
    },
    async markStudied(id: string, done: boolean) {
      const m = must().materials.find((x) => x.id === id);
      if (!m) return;
      const t = today();
      const studiedDates = done ? Array.from(new Set([...m.studiedDates, t])) : m.studiedDates.filter((x) => x !== t);
      await repo.put("materials", { ...m, done, doneAt: done ? Date.now() : undefined, studiedDates });
      if (done) await repo.put("sessions", { id: uid("ss-"), date: t, kind: "lecture", startedAt: Date.now(), durationSec: 0, count: 1 });
    },

    /* sentences */
    async addSentence(p: Pick<Sentence, "en" | "ko" | "part" | "keywords"> & { materialId?: string }) {
      const s = newSentence({ ...p, origin: "user" });
      await repo.put("sentences", s);
      if (p.materialId) {
        const m = must().materials.find((x) => x.id === p.materialId);
        if (m) await repo.put("materials", { ...m, sentenceIds: [...m.sentenceIds, s.id] });
      }
      return s;
    },
    async saveSentence(s: Sentence) {
      await repo.put("sentences", s);
    },
    async removeSentence(id: string) {
      await repo.remove("sentences", id);
      for (const m of must().materials.filter((x) => x.sentenceIds.includes(id))) {
        await repo.put("materials", { ...m, sentenceIds: m.sentenceIds.filter((x) => x !== id) });
      }
    },
    async reviewSentence(id: string, rating: Rating, mode: TrainerMode) {
      const s = must().sentences.find((x) => x.id === id);
      if (!s) return;
      const t = today();
      await repo.put("sentences", schedule(s, rating, t));
      await repo.put("reviews", { id: uid("r-"), sentenceId: id, date: t, at: Date.now(), rating, mode });
    },

    /* speaking */
    async saveAttempt(a: Attempt, audio?: { blob: Blob; mime: string; durationMs: number }) {
      if (audio && audio.blob.size > 0) {
        const audioId = uid("au-");
        await repo.put("audio", { id: audioId, blob: audio.blob, mime: audio.mime, durationMs: audio.durationMs, createdAt: Date.now() });
        a = { ...a, audioId };
      }
      await repo.put("attempts", a);
      return a;
    },
    async updateAttempt(a: Attempt) {
      await repo.put("attempts", a);
    },
    async removeAttempt(id: string) {
      const a = must().attempts.find((x) => x.id === id);
      if (a?.audioId) await repo.remove("audio", a.audioId);
      await repo.remove("attempts", id);
    },
    async getAudio(id: string) {
      return repo.get("audio", id);
    },

    async logSession(kind: SessionKind, durationSec: number, count: number) {
      if (durationSec < 5 && count === 0) return;
      await repo.put("sessions", { id: uid("ss-"), date: today(), kind, startedAt: Date.now() - durationSec * 1000, durationSec: Math.round(durationSec), count });
    },

    /* data management */
    async exportData(includeAudio: boolean): Promise<ExportBundle> {
      const d = must();
      const bundle: ExportBundle = {
        app: "speak-lab",
        version: 1,
        exportedAt: Date.now(),
        settings: d.settings,
        materials: d.materials,
        sentences: d.sentences,
        reviews: d.reviews,
        attempts: d.attempts,
        sessions: d.sessions,
        plans: d.plans,
      };
      if (includeAudio) {
        const clips = await repo.all("audio");
        bundle.audio = await Promise.all(
          clips.map(
            (c) =>
              new Promise<NonNullable<ExportBundle["audio"]>[number]>((res, rej) => {
                const fr = new FileReader();
                fr.onload = () => res({ id: c.id, mime: c.mime, durationMs: c.durationMs, createdAt: c.createdAt, dataUrl: String(fr.result) });
                fr.onerror = () => rej(fr.error);
                fr.readAsDataURL(c.blob);
              }),
          ),
        );
      }
      return bundle;
    },
    async importData(bundle: ExportBundle) {
      if (bundle?.app !== "speak-lab" || bundle.version !== 1) throw new Error("SPEAK LAB 내보내기 파일이 아닙니다.");
      await repo.clearAll();
      if (bundle.settings) await repo.putSettings(bundle.settings);
      await repo.putMany("materials", bundle.materials ?? []);
      await repo.putMany("sentences", bundle.sentences ?? []);
      await repo.putMany("reviews", bundle.reviews ?? []);
      await repo.putMany("sessions", bundle.sessions ?? []);
      await repo.putMany("plans", bundle.plans ?? []);
      const audioIds = new Set<string>();
      for (const c of bundle.audio ?? []) {
        const blob = await (await fetch(c.dataUrl)).blob();
        await repo.put("audio", { id: c.id, blob, mime: c.mime, durationMs: c.durationMs, createdAt: c.createdAt });
        audioIds.add(c.id);
      }
      // Attempts whose audio wasn't exported keep their record but lose the clip reference.
      await repo.putMany(
        "attempts",
        (bundle.attempts ?? []).map((a) => (a.audioId && !audioIds.has(a.audioId) ? { ...a, audioId: undefined } : a)),
      );
    },
    async clearAll() {
      await repo.clearAll();
    },
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<AppData | null>(null);
  useEffect(() => {
    ref.current = data;
  }, [data]);

  const reload = useCallback(async () => {
    try {
      const d = await loadAll();
      ref.current = d;
      setData(d);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    // Initial load is async (IndexedDB); state is only set once data arrives.
    void Promise.resolve().then(reload);
    let t: ReturnType<typeof setTimeout> | null = null;
    const unsub = getRepo().subscribe(() => {
      // Coalesce bursts of writes into one reload.
      if (t) clearTimeout(t);
      t = setTimeout(reload, 30);
    });
    return () => {
      unsub();
      if (t) clearTimeout(t);
    };
  }, [reload]);

  // The getter is only invoked from event handlers / async actions, never during render.
  // eslint-disable-next-line react-hooks/refs
  const actions = useMemo(() => makeActions(() => ref.current), []);

  // Make sure today's plan exists (also rolls over at midnight when the tab regains focus).
  const [date, setDate] = useState<string | null>(null);
  useEffect(() => {
    const onFocus = () => setDate(today());
    void Promise.resolve().then(onFocus);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, []);
  const todayPlan = (date && data?.plans.find((p) => p.date === date)) || null;
  const creating = useRef<string | null>(null);
  useEffect(() => {
    if (!data || !date || creating.current === date) return;
    creating.current = date;
    if (!todayPlan) getRepo().put("plans", buildPlan(data, date));
    else {
      // Plans made before the 문장 연습 setup existed used another sentence count — align once.
      const synced = syncSentencePlan(todayPlan, data);
      if (synced) getRepo().put("plans", synced);
    }
  }, [data, todayPlan, date]);

  return <DataContext.Provider value={{ ready: !!data, error, data, todayPlan, actions }}>{children}</DataContext.Provider>;
}

export function useData() {
  const c = useContext(DataContext);
  if (!c) throw new Error("useData outside DataProvider");
  return c;
}

export { STORE_NAMES };
