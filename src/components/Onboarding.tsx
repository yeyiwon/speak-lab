"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LEVELS, PART_SPECS } from "@/content/exam";
import { useData } from "@/lib/data/store";
import { DatePicker } from "./DatePicker";
import { PARTS, type PartNo } from "@/lib/types";

export function Onboarding() {
  const { data, actions } = useData();
  const s = data!.settings;
  const [level, setLevel] = useState(s.targetLevel);
  const [examDate, setExamDate] = useState(s.examDate ?? "");
  const [minutes, setMinutes] = useState(s.dailyMinutes);
  const [focus, setFocus] = useState<PartNo[]>(s.focusParts);
  const [busy, setBusy] = useState(false);

  async function finish(useDefaults: boolean) {
    setBusy(true);
    const patch = useDefaults
      ? { onboarded: true }
      : { onboarded: true, targetLevel: level, examDate: examDate || null, dailyMinutes: minutes, focusParts: focus };
    await actions.updateSettings(patch);
    // The plan depends on these settings, so rebuild today's plan with them.
    await actions.regeneratePlan(patch);
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center bg-graphite-900/30 p-3 backdrop-blur-[2px] sm:items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ob-title"
      >
        <motion.div
          className="clay max-h-[92dvh] w-full max-w-xl overflow-y-auto p-6 sm:p-8"
          initial={{ y: 40, scale: 0.97 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        >
          <p className="eyebrow">Welcome to SPEAK LAB</p>
          <h1 id="ob-title" className="mt-2 text-[1.7rem] font-bold leading-tight tracking-tight">
            목표만 알려주세요.
            <br />
            오늘 할 공부는 앱이 정할게요.
          </h1>

          <fieldset className="mt-7">
            <legend className="text-sm font-semibold">목표 레벨 <span className="font-semibold text-ink-muted">(ETS 공식 레벨 · 점수)</span></legend>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l.level}
                  type="button"
                  aria-pressed={level === l.level}
                  onClick={() => setLevel(l.level)}
                  className={`btn !min-h-[64px] flex-col !gap-0 !rounded-2xl !px-1 ${level === l.level ? "!bg-graphite-900 !text-glacier-50" : ""}`}
                >
                  <span className="text-lg font-bold">Lv{l.level}</span>
                  <span className="num text-[0.65rem] font-semibold opacity-75">{l.range}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="block">
              <span className="text-sm font-semibold">시험 예정일 <span className="font-semibold text-ink-muted">(선택)</span></span>
              <div className="mt-2">
                <DatePicker value={examDate || null} onChange={(v) => setExamDate(v ?? "")} label="시험 예정일" />
              </div>
            </div>
            <label className="block">
              <span className="text-sm font-semibold">
                하루 공부 시간 <span className="num text-glacier-600">{minutes}분</span>
              </span>
              <input
                type="range"
                min={10}
                max={90}
                step={5}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="mt-4 w-full accent-[#1c1d1f]"
              />
            </label>
          </div>

          <fieldset className="mt-6">
            <legend className="text-sm font-semibold">집중하고 싶은 파트 <span className="font-semibold text-ink-muted">(선택, 복수 가능)</span></legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {PARTS.map((p) => {
                const on = focus.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFocus(on ? focus.filter((x) => x !== p) : [...focus, p])}
                    className={`btn !min-h-[40px] !text-sm ${on ? "!bg-graphite-900 !text-glacier-50" : ""}`}
                  >
                    Part {p} · {PART_SPECS[p].nameKo}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => finish(true)}>
              기본값으로 바로 시작
            </button>
            <button type="button" className="btn btn-primary" disabled={busy} onClick={() => finish(false)}>
              내 학습 계획 만들기
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
