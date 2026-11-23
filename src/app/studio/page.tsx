"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { motion } from "motion/react";
import { ETS_SOURCE, PART_SPECS } from "@/content/exam";
import { findSet, SETS_BY_PART } from "@/content/questions";
import { Icon } from "@/components/Icon";
import { Page, PageHeader } from "@/components/ui";
import { Session, type SessionOptions } from "@/components/studio/Session";
import { useData } from "@/lib/data/store";
import { PARTS, type PartNo } from "@/lib/types";

export default function StudioPage() {
  return (
    <Suspense>
      <Studio />
    </Suspense>
  );
}

function Studio() {
  const params = useSearchParams();
  const router = useRouter();
  const { data } = useData();
  const [mode, setMode] = useState<"exam" | "free">("exam");
  const [prep, setPrep] = useState(30);
  const [resp, setResp] = useState(45);

  const setId = params.get("set");
  const active = setId ? findSet(setId) : null;
  const partParam = Number(params.get("part")) as PartNo;
  const [part, setPart] = useState<PartNo>(PARTS.includes(partParam) ? partParam : 1);

  if (!data) return null;
  if (active) {
    const opts: SessionOptions = {
      mode: params.get("mode") === "free" ? "free" : "exam",
      prepOverride: Number(params.get("prep")) || undefined,
      respOverride: Number(params.get("resp")) || undefined,
    };
    return <Session key={active.id + params.toString()} set={active} opts={opts} onExit={() => router.push(`/studio?part=${active.part}`)} />;
  }

  const attempts = data?.attempts ?? [];
  const sets = SETS_BY_PART(part);
  const spec = PART_SPECS[part];

  function launch(id: string) {
    const q = new URLSearchParams({ set: id, mode });
    if (mode === "free") {
      q.set("prep", String(prep));
      q.set("resp", String(resp));
    }
    router.push(`/studio?${q}`);
  }

  return (
    <Page>
      <PageHeader eyebrow="Speaking Studio" title={"실전"} />

      <div role="tablist" aria-label="파트 선택" className="mt-8 flex gap-2 overflow-x-auto no-scrollbar pb-3 pt-1">
        {PARTS.map((p) => (
          <button
            key={p}
            role="tab"
            aria-selected={part === p}
            onClick={() => {
              setPart(p);
              router.replace(`/studio?part=${p}`, { scroll: false });
            }}
            className={`btn shrink-0 !rounded-2xl ${part === p ? "!bg-graphite-900 !text-glacier-50" : ""}`}
          >
            Part {p}
            <span className="text-xs font-semibold opacity-70">{PART_SPECS[p].questions}</span>
          </button>
        ))}
      </div>

      <motion.section key={part} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="clay-graphite p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-glacier-300">{spec.nameEn}</p>
            <p className="mt-1 text-[1.8rem] font-bold">{spec.nameKo}</p>
            <div className="mt-5 flex flex-wrap gap-6">
              {spec.readSec && <Timing label="자료 읽기" sec={[spec.readSec]} />}
              <Timing label="준비" sec={spec.prepSec} />
              <Timing label="답변" sec={spec.respSec} />
            </div>
            <p className="mt-5 text-xs text-glacier-300">
              출처: {ETS_SOURCE.publisher},{" "}
              <a href={ETS_SOURCE.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                {ETS_SOURCE.title}
              </a>{" "}
              · {ETS_SOURCE.checkedAt} 확인
            </p>
          </div>

          <h2 className="mt-10 text-xl font-bold">문제 세트</h2>
          <p className="mt-1 text-sm text-ink-muted">모든 문제와 예시 답변은 SPEAK LAB이 직접 작성한 연습용 예시입니다.</p>
          <ul className="mt-4 grid gap-4">
            {sets.map((s) => {
              const n = attempts.filter((a) => a.setId === s.id).length;
              return (
                <li key={s.id}>
                  <button type="button" onClick={() => launch(s.id)} className="clay-sm group flex w-full items-center gap-4 p-5 text-left">
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{s.title}</span>
                        <span className="chip">예시</span>
                      </span>
                      <span className="mt-1 block text-sm text-ink-muted">
                        {s.questions.length}문항 · 지금까지 {n}회 답변
                      </span>
                    </span>
                    <span className="btn btn-primary !h-12 !w-12 !min-h-0 !px-0" aria-hidden>
                      <Icon name="play" size={18} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="clay h-fit p-6">
          <p className="eyebrow">훈련 모드</p>
          <div className="clay-sunk mt-3 grid grid-cols-2 gap-1 !rounded-full p-1">
            {(["exam", "free"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
                className={`min-h-[40px] rounded-full text-sm font-bold transition ${mode === m ? "bg-graphite-900 text-glacier-50 shadow-md" : ""}`}
              >
                {m === "exam" ? "시험 시간" : "자유 연습"}
              </button>
            ))}
          </div>
          {mode === "exam" ? (
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">공식 준비·답변 시간을 그대로 적용합니다.</p>
          ) : (
            <div className="mt-5 grid gap-5">
              <Slider label="준비 시간" value={prep} set={setPrep} min={3} max={90} />
              <Slider label="답변 시간" value={resp} set={setResp} min={10} max={120} />
              <p className="text-xs text-ink-muted">자유 연습 기록은 ‘자유 연습’으로 따로 표시됩니다.</p>
            </div>
          )}
        </aside>
      </motion.section>
    </Page>
  );
}

function Timing({ label, sec }: { label: string; sec: number[] }) {
  const uniq = Array.from(new Set(sec));
  return (
    <div>
      <p className="text-xs font-bold text-glacier-300">{label}</p>
      <p className="num mt-1 text-2xl font-bold">{uniq.length === 1 ? `${uniq[0]}초` : sec.join(" / ") + "초"}</p>
    </div>
  );
}

function Slider({ label, value, set, min, max }: { label: string; value: number; set: (n: number) => void; min: number; max: number }) {
  return (
    <label className="block">
      <span className="flex justify-between text-sm font-semibold">
        {label} <span className="num text-glacier-600">{value}초</span>
      </span>
      <input type="range" min={min} max={max} step={1} value={value} onChange={(e) => set(Number(e.target.value))} className="mt-3 w-full accent-[#1c1d1f]" />
    </label>
  );
}
