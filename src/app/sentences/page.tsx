"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Icon } from "@/components/Icon";
import { MODES, Trainer } from "@/components/trainer/Trainer";
import { SentenceEditor } from "@/components/trainer/SentenceEditor";
import { BulkImport } from "@/components/trainer/BulkImport";
import { Empty, Page, PageHeader, SourceTag } from "@/components/ui";
import { useData } from "@/lib/data/store";
import { today } from "@/lib/date";
import { SIMPLE_LABEL, simpleStatus, type SimpleStatus } from "@/lib/srs";
import { PARTS, type PartNo, type Sentence, type TrainerMode } from "@/lib/types";

export default function SentencesPage() {
  return (
    <Suspense>
      <Sentences />
    </Suspense>
  );
}

const STATUSES: SimpleStatus[] = ["new", "learning", "known"];

function Sentences() {
  const { data } = useData();
  const params = useSearchParams();
  const router = useRouter();
  const [part, setPart] = useState<PartNo | "all" | "any">("any");
  const [status, setStatus] = useState<SimpleStatus | "any">("any");
  const [editing, setEditing] = useState<Sentence | "new" | null>(null);
  const [bulk, setBulk] = useState(false);
  const [scope, setScope] = useState<"today" | "filtered">("today");

  const t = today();
  const sentences = useMemo(() => data?.sentences ?? [], [data?.sentences]);
  const filtered = useMemo(
    () =>
      sentences
        .filter((s) => (part === "any" ? true : s.part === part))
        .filter((s) => (status === "any" ? true : simpleStatus(s) === status))
        .sort((a, b) => a.due.localeCompare(b.due) || a.createdAt - b.createdAt),
    [sentences, part, status],
  );
  if (!data) return null;
  // Today's queue: everything due for review + a handful of new sentences (not the whole bank at once).
  const newPerDay = (data.settings.dailyMinutes ?? 30) >= 30 ? 8 : 5;
  const dueToday = [
    ...sentences.filter((s) => s.status !== "new" && s.due <= t),
    ...sentences.filter((s) => s.status === "new").slice(0, newPerDay),
  ];
  const train = params.get("train") as TrainerMode | null;

  if (train && MODES.some((m) => m.id === train)) {
    // Today's queue = due (incl. new), falling back to the current filter if nothing is due.
    const base = scope === "today" && dueToday.length ? dueToday : filtered;
    const pool = train === "read" ? filtered : base;
    return <Trainer key={train} mode={train} pool={pool.length ? pool : sentences} onExit={() => router.push("/sentences")} />;
  }

  const counts = Object.fromEntries(STATUSES.map((s) => [s, sentences.filter((x) => simpleStatus(x) === s).length])) as Record<SimpleStatus, number>;
  const masteredRate = sentences.length ? Math.round((counts.known / sentences.length) * 100) : 0;

  return (
    <Page>
      <PageHeader eyebrow="Sentence Trainer" title={<>읽을 수 있는 문장을<br />말할 수 있는 문장으로.</>}>
        <button type="button" className="btn" onClick={() => setBulk(true)}>
          여러 문장 붙여넣기
        </button>
        <button type="button" className="btn btn-primary" onClick={() => setEditing("new")}>
          <Icon name="plus" size={18} /> 문장 등록
        </button>
      </PageHeader>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <div className="clay-graphite p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-glacier-300">오늘 연습할 문장</p>
          <p className="num mt-2 text-[4rem] font-bold leading-none">{dueToday.length}</p>
          <p className="mt-2 text-sm text-glacier-300">
            전체 {sentences.length}문장 · 외운 문장 {masteredRate}%
          </p>
          <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-graphite-700" aria-hidden>
            {STATUSES.map((s, i) => (
              <span key={s} style={{ width: `${(counts[s] / Math.max(1, sentences.length)) * 100}%`, background: ["#5a5f66", "#8fb2d5", "#c8f169"][i] }} />
            ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-glacier-300">
            {STATUSES.map((s) => (
              <li key={s}>
                {SIMPLE_LABEL[s]} <span className="num font-bold text-glacier-100">{counts[s]}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="clay p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-bold">학습 모드</p>
            <div className="clay-sunk flex gap-1 !rounded-full p-1 text-xs font-bold">
              {(["today", "filtered"] as const).map((s) => (
                <button key={s} type="button" aria-pressed={scope === s} onClick={() => setScope(s)} className={`min-h-[32px] rounded-full px-3 ${scope === s ? "bg-graphite-900 text-glacier-50" : ""}`}>
                  {s === "today" ? "오늘 복습분" : "현재 필터 전체"}
                </button>
              ))}
            </div>
          </div>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {MODES.map((m, i) => (
              <li key={m.id}>
                <button type="button" onClick={() => router.push(`/sentences?train=${m.id}`)} className="clay-sm flex w-full items-start gap-3 p-4 text-left transition-transform hover:-translate-y-0.5">
                  <span className="num grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-glacier-200 text-sm font-bold">{i + 1}</span>
                  <span>
                    <span className="block text-sm font-semibold">{m.label}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-ink-muted">{m.desc}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-center gap-2">
          <select aria-label="파트 필터" className="field !w-auto !min-h-[40px] !py-1.5 text-sm font-bold" value={String(part)} onChange={(e) => setPart(e.target.value === "any" || e.target.value === "all" ? (e.target.value as "any" | "all") : (Number(e.target.value) as PartNo))}>
            <option value="any">모든 파트</option>
            <option value="all">공통</option>
            {PARTS.map((p) => (
              <option key={p} value={p}>Part {p}</option>
            ))}
          </select>
          <select aria-label="상태 필터" className="field !w-auto !min-h-[40px] !py-1.5 text-sm font-bold" value={status} onChange={(e) => setStatus(e.target.value as SimpleStatus | "any")}>
            <option value="any">모든 상태</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{SIMPLE_LABEL[s]}</option>
            ))}
          </select>
          <span className="text-sm text-ink-muted">{filtered.length}문장</span>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-4">
            <Empty title="조건에 맞는 문장이 없어요">강의에서 배운 만능문장을 직접 등록해 보세요.</Empty>
          </div>
        ) : (
          <ul className="panel mt-4 grid grid-cols-[minmax(0,1fr)]">
            {filtered.map((s) => (
              <li key={s.id} className="row-hover flex items-center gap-4 px-5 py-4 sm:px-6">
                <div className="min-w-0 flex-1">
                  <p className="font-bold leading-snug">{s.en}</p>
                  <p className="mt-1 text-sm text-ink-muted">{s.ko}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <SourceTag origin={s.origin} />
                    <span className="chip">{s.part === "all" ? "공통" : `Part ${s.part}`}</span>
                    <span className={`chip ${simpleStatus(s) === "known" ? "chip-lime" : ""}`}>{SIMPLE_LABEL[simpleStatus(s)]}</span>
                    <span className="chip num">{s.due <= t ? "오늘 복습" : `다음 ${s.due.slice(5)}`}</span>
                  </div>
                </div>
                <button type="button" className="btn btn-ghost !min-h-[40px] !px-3 text-sm" onClick={() => setEditing(s)}>
                  편집
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <AnimatePresence>{bulk && <BulkImport key="bulk" onClose={() => setBulk(false)} />}</AnimatePresence>
      <AnimatePresence>{editing && <SentenceEditor key="ed" initial={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}</AnimatePresence>
    </Page>
  );
}

