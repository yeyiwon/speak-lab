"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Icon } from "@/components/Icon";
import { Select } from "@/components/Select";
import { Trainer } from "@/components/trainer/Trainer";
import { SentenceEditor } from "@/components/trainer/SentenceEditor";
import { BulkImport } from "@/components/trainer/BulkImport";
import { Empty, Page, PageHeader, SourceTag } from "@/components/ui";
import { useData } from "@/lib/data/store";
import { today } from "@/lib/date";
import { SIMPLE_LABEL, simpleStatus, type SimpleStatus } from "@/lib/srs";
import {
  buildSession,
  DEFAULT_DRILL,
  DISPLAY_LABEL,
  drillCount,
  loadSession,
  newSession,
  ORDER_LABEL,
  saveSession,
  SIZES,
  type DrillConfig,
  type DrillDisplay,
  type DrillOrder,
  type DrillSession,
} from "@/lib/session";
import { PARTS, type PartNo, type Sentence } from "@/lib/types";

export default function SentencesPage() {
  return (
    <Suspense>
      <Sentences />
    </Suspense>
  );
}

const STATUSES: SimpleStatus[] = ["new", "learning", "known"];
const PART_OPTS = [{ value: "any", label: "모든 파트" }, ...PARTS.map((p) => ({ value: String(p), label: `Part ${p}` })), { value: "all", label: "공통" }];
const parsePart = (v: string): DrillConfig["part"] => (v === "any" || v === "all" ? v : (Number(v) as PartNo));

function Sentences() {
  const { data, actions } = useData();
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<SimpleStatus | "any">("any");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Sentence | "new" | null>(null);
  const [bulk, setBulk] = useState(false);
  // Resume a session left mid-way (navigation / reload) — read once on mount.
  const [saved, setSaved] = useState<DrillSession | null>(() => (typeof window === "undefined" ? null : loadSession()));
  const [active, setActive] = useState<DrillSession | null>(null);
  const [autoStarted, setAutoStarted] = useState(false);

  // Local copies make taps feel instant; the same values are persisted to settings in the background.
  const [localCfg, setLocalCfg] = useState<DrillConfig | null>(null);
  const [localPicked, setLocalPicked] = useState<string[] | null>(null);
  const sentences = useMemo(() => data?.sentences ?? [], [data?.sentences]);
  const cfg: DrillConfig = localCfg ?? { ...DEFAULT_DRILL, ...data?.settings.drill };
  const savedPicked = data?.settings.pickedSentenceIds;
  const picked = useMemo(() => localPicked ?? savedPicked ?? [], [localPicked, savedPicked]);
  const listed = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sentences
      .filter((s) => (cfg.part === "any" ? true : s.part === cfg.part))
      .filter((s) => (status === "any" ? true : simpleStatus(s) === status))
      .filter((s) => !q || s.en.toLowerCase().includes(q) || s.ko.includes(q))
      .sort((a, b) => a.createdAt - b.createdAt);
  }, [sentences, cfg.part, status, query]);

  if (!data) return null;
  const t = today();
  const count = drillCount(sentences, cfg, picked);
  const setCfg = (p: Partial<DrillConfig>) => {
    const next = { ...cfg, ...p };
    setLocalCfg(next);
    actions.updateSettings({ drill: next });
  };
  const togglePick = (id: string) => {
    const next = picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id];
    setLocalPicked(next);
    actions.updateSettings({ pickedSentenceIds: next });
  };

  const start = () => {
    if (!count) return;
    const s = newSession(buildSession(sentences, cfg, picked, t), cfg.display);
    saveSession(s);
    setSaved(null);
    setActive(s);
  };
  const exit = () => {
    setSaved(loadSession());
    setActive(null);
    if (params.get("start")) router.replace("/sentences");
  };

  // Deep link from 오늘 (?start=1): runs once — resume if possible, otherwise start with the saved setup.
  if (!autoStarted && params.get("start") && count) {
    const s = loadSession() ?? newSession(buildSession(sentences, cfg, picked, t), cfg.display);
    saveSession(s);
    setAutoStarted(true);
    setActive(s);
  }
  if (active) return <Trainer key={active.startedAt} session={active} persist onExit={exit} onRestart={start} />;

  const counts = Object.fromEntries(STATUSES.map((s) => [s, sentences.filter((x) => simpleStatus(x) === s).length])) as Record<SimpleStatus, number>;
  const userCount = sentences.filter((s) => s.origin === "user").length;

  return (
    <Page>
      <PageHeader eyebrow="Sentences" title="문장">
        <button type="button" className="btn" onClick={() => setBulk(true)}>
          여러 문장 붙여넣기
        </button>
        <button type="button" className="btn btn-primary" onClick={() => setEditing("new")}>
          <Icon name="plus" size={18} /> 문장 등록
        </button>
      </PageHeader>

      {saved && (
        <div className="clay-sunk mt-6 flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <p className="text-sm">
            진행 중인 연습 <strong className="num">{saved.idx} / {saved.ids.length}</strong>
          </p>
          <div className="flex gap-2">
            <button type="button" className="btn btn-ghost !min-h-[40px] !text-sm" onClick={() => { saveSession(null); setSaved(null); }}>
              버리기
            </button>
            <button type="button" className="btn btn-primary !min-h-[40px] !text-sm" onClick={() => setActive(saved)}>
              이어서 하기
            </button>
          </div>
        </div>
      )}

      {/* Practice setup — the last choice is remembered */}
      <section className="clay mt-6 p-5 sm:p-6" aria-labelledby="drill-h">
        <h2 id="drill-h" className="font-bold">문장 연습</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="출제 방식">
            <Segment<DrillOrder> value={cfg.order} options={(Object.keys(ORDER_LABEL) as DrillOrder[]).map((k) => [k, ORDER_LABEL[k]])} onChange={(order) => setCfg({ order })} />
          </Field>
          <Field label="문장 수">
            <Segment value={String(cfg.size)} options={SIZES.map((n) => [String(n), n === "all" ? "전체" : `${n}`])} onChange={(v) => setCfg({ size: v === "all" ? "all" : (Number(v) as 5 | 10 | 20) })} />
          </Field>
          <Field label="파트">
            <Select size="sm" label="파트" value={String(cfg.part)} onChange={(v) => setCfg({ part: parsePart(v) })} options={PART_OPTS} />
          </Field>
          <Field label="표시 방식">
            <Segment<DrillDisplay> value={cfg.display} options={(Object.keys(DISPLAY_LABEL) as DrillDisplay[]).map((k) => [k, DISPLAY_LABEL[k]])} onChange={(display) => setCfg({ display })} />
          </Field>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-muted">
            {cfg.order === "picked" && !picked.length
              ? "아래 목록에서 연습할 문장을 체크하세요."
              : count
                ? `${count}문장을 무작위 순서로 출제합니다.`
                : "조건에 맞는 문장이 없어요."}
          </p>
          <button type="button" className="btn btn-primary !min-h-[48px] !px-6" disabled={!count} onClick={start}>
            연습 시작 <span className="num">({count})</span>
          </button>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-center gap-2">
          <input className="field !w-56 !min-h-[38px] !py-1.5 text-sm" type="search" placeholder="문장 검색" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="문장 검색" />
          <Select size="sm" className="!w-32" label="상태 필터" value={status} onChange={(v) => setStatus(v as SimpleStatus | "any")} options={[{ value: "any", label: "모든 상태" }, ...STATUSES.map((s) => ({ value: s, label: SIMPLE_LABEL[s] }))]} />
          <span className="text-sm text-ink-muted">
            {listed.length}문장 · {STATUSES.map((s) => `${SIMPLE_LABEL[s]} ${counts[s]}`).join(" · ")} · 직접 등록 {userCount}
          </span>
        </div>
        <p className="mt-2 text-xs text-ink-muted">목록은 위 파트 선택을 따릅니다. 체크한 문장은 ‘선택한 문장만’ 연습에 쓰여요 ({picked.length}개 선택).</p>

        {listed.length === 0 ? (
          <div className="mt-4">
            <Empty title="조건에 맞는 문장이 없어요">강의에서 배운 문장을 등록하거나 필터를 바꿔 보세요.</Empty>
          </div>
        ) : (
          <ul className="panel mt-4 grid grid-cols-[minmax(0,1fr)]">
            {listed.map((s) => (
              <li key={s.id} className="row-hover flex items-center gap-4 px-5 py-4 sm:px-6">
                <input type="checkbox" className="h-5 w-5 shrink-0 accent-[#1c1d1f]" checked={picked.includes(s.id)} onChange={() => togglePick(s.id)} aria-label={`연습할 문장으로 선택: ${s.en}`} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-snug">{s.en}</p>
                  <p className="mt-1 text-sm text-ink-muted">{s.ko}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <SourceTag origin={s.origin} />
                    <span className="chip">{s.part === "all" ? "공통" : `Part ${s.part}`}</span>
                    <span className={`chip ${simpleStatus(s) === "known" ? "chip-lime" : ""}`}>{SIMPLE_LABEL[simpleStatus(s)]}</span>
                    {s.status !== "new" && <span className="chip num">{s.due <= t ? "복습 대기" : `다음 복습 ${s.due.slice(5)}`}</span>}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-ink-muted">{label}</p>
      {children}
    </div>
  );
}

function Segment<T extends string>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="radiogroup">
      {options.map(([k, label]) => (
        <button
          key={k}
          type="button"
          role="radio"
          aria-checked={value === k}
          onClick={() => onChange(k)}
          className={`btn !min-h-[36px] !px-3 !text-sm ${value === k ? "!bg-graphite-900 !text-glacier-50" : ""}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
