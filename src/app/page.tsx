"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { LEVELS } from "@/content/exam";
import { Icon, type IconName } from "@/components/Icon";
import { Page, RollingNumber } from "@/components/ui";
import { useData } from "@/lib/data/store";
import { diffDays, formatKDate, today } from "@/lib/date";
import { activeDates, streak, weaknesses } from "@/lib/insights";
import { planProgress } from "@/lib/plan";
import type { PlanItem } from "@/lib/types";

const KIND_ICON: Record<PlanItem["kind"], IconName> = { lecture: "library", sentences: "cards", speaking: "mic", review: "review" };

function hrefFor(it: PlanItem) {
  switch (it.kind) {
    case "lecture":
      return `/library?open=${it.materialId}`;
    case "sentences":
      return "/sentences?train=hint";
    case "speaking":
      return `/studio?part=${it.part}`;
    case "review":
      return "/review";
  }
}

export default function TodayPage() {
  const { data, todayPlan } = useData();
  if (!data) return null;
  const { settings, sentences } = data;
  const t = today();

  const progress = todayPlan ? planProgress(todayPlan, data) : null;
  const pct = progress ? Math.round(progress.ratio * 100) : 0;
  const next = progress?.rows.find((r) => !r.done);
  const dday = settings.examDate ? diffDays(t, settings.examDate) : null;
  const days = streak(activeDates(data));
  const dueCount = sentences.filter((s) => s.status !== "new" && s.due <= t).length;
  const weak = weaknesses(sentences, data.attempts);
  const level = LEVELS.find((l) => l.level === settings.targetLevel);
  const totalMin = todayPlan?.items.reduce((s, i) => s + i.estMinutes, 0) ?? 0;

  return (
    <Page>
      <div className="flex items-center justify-between">
        <p className="eyebrow">{formatKDate(t)}</p>
        <Link href="/settings" className="btn btn-ghost !min-h-[40px] !px-3 md:hidden" aria-label="설정">
          <Icon name="settings" />
        </Link>
      </div>

      <h1 className="mt-2 max-w-2xl text-[2.1rem] font-bold leading-[1.08] tracking-tight sm:text-[3rem]">
        {pct >= 100 ? (
          <>오늘 계획 완료.<br />내일도 이어서 말해봐요.</>
        ) : next ? (
          <>
            {next.item.kind === "speaking" ? `Part ${next.item.part}를` : next.item.kind === "lecture" ? "강의 하나를" : next.item.kind === "review" ? "막혔던 곳을" : "문장을"}
            <br />
            {next.item.kind === "speaking" ? "시간 안에 말해볼 차례예요." : next.item.kind === "lecture" ? "보고 정리할 차례예요." : next.item.kind === "review" ? "다시 풀어볼 차례예요." : "입으로 외울 차례예요."}
          </>
        ) : (
          "오늘의 학습을 준비하고 있어요."
        )}
      </h1>

      {/* Hero */}
      <section className="mt-8 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <div className="clay-graphite relative overflow-hidden p-6 sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-glacier-300">Today’s progress</p>
              <p className="mt-2 text-[4.5rem] font-bold leading-none tracking-tighter sm:text-[5.5rem]">
                <RollingNumber value={pct} suffix="%" />
              </p>
              <p className="mt-2 text-sm text-glacier-300">
                {progress ? `${progress.rows.filter((r) => r.done).length} / ${progress.rows.length} 항목 완료 · 예상 ${totalMin}분` : "—"}
              </p>
            </div>
            <ProgressRing value={progress?.ratio ?? 0} />
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            {next ? (
              <Link href={hrefFor(next.item)} className="btn btn-lime">
                {progress && progress.rows.some((r) => r.progress > 0) ? "이어서 하기" : "학습 시작"}
                <Icon name="arrow" size={18} />
              </Link>
            ) : (
              <Link href="/studio" className="btn btn-glacier !text-graphite-900">
                자유 연습 하기 <Icon name="arrow" size={18} />
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Stat label="목표" value={level ? `Lv${level.level}` : "—"} sub={level ? `${level.range}점` : "설정에서 지정"} />
          <Stat
            label="시험"
            value={dday === null ? "미정" : dday > 0 ? `D-${dday}` : dday === 0 ? "D-Day" : `D+${-dday}`}
            sub={settings.examDate ?? "날짜를 정하면 계획이 바뀌어요"}
          />
          <Stat label="연속 학습" value={`${days}일`} sub={days ? "기록이 이어지고 있어요" : "오늘 시작해요"} icon="flame" />
          <Stat label="복습 대기" value={`${dueCount}문장`} sub="간격 반복 일정 기준" icon="cards" />
        </div>
      </section>

      {/* Plan */}
      <section className="mt-12" aria-labelledby="plan-h">
        <div className="flex items-end justify-between gap-4">
          <h2 id="plan-h" className="text-xl font-bold">오늘의 계획</h2>
          <span className="text-xs font-semibold text-ink-muted">하루 {settings.dailyMinutes}분 기준 · 실제 기록으로 자동 체크</span>
        </div>
        <ol className="panel mt-4 grid grid-cols-[minmax(0,1fr)]">
          {progress?.rows.map(({ item, progress: p, done }, i) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={hrefFor(item)} className="row-hover group flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5">
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors ${
                    done ? "bg-graphite-900 text-lime" : "bg-glacier-200/70 text-glacier-700"
                  }`}
                >
                  {done ? (
                    <motion.span initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}>
                      <Icon name="check" size={18} />
                    </motion.span>
                  ) : (
                    <Icon name={KIND_ICON[item.kind]} size={18} />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className={`font-semibold ${done ? "text-ink-muted" : ""}`}>{item.title}</span>
                    {item.carried && <span className="chip">어제에서 이어짐</span>}
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-ink-muted">{item.detail}</span>
                </span>
                <span className="hidden w-28 shrink-0 sm:block" aria-hidden>
                  <span className="track block">
                    <span style={{ width: `${(p / item.target) * 100}%` }} />
                  </span>
                </span>
                <span className="w-14 shrink-0 text-right">
                  <span className={`num block font-semibold ${done ? "text-ink-muted" : ""}`}>
                    {p}/{item.target}
                  </span>
                  <span className="text-xs text-ink-muted">{item.estMinutes}분</span>
                </span>
                <Icon name="arrow" size={16} className="shrink-0 text-ink-muted opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* Weaknesses */}
      <section className="mt-12" aria-labelledby="weak-h">
        <h2 id="weak-h" className="text-xl font-bold">지난 학습에서 발견한 약점</h2>
        {weak.length ? (
          <ul className="panel mt-4 grid grid-cols-[minmax(0,1fr)]">
            {weak.map((w) => (
              <li key={w.id}>
                <Link href={w.href} className="row-hover flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                  <span className="min-w-0">
                  <span className="block font-semibold">{w.label}</span>
                  <span className="mt-0.5 block truncate text-sm text-ink-muted">{w.detail}</span>
                  </span>
                  <Icon name="arrow" size={16} className="shrink-0 text-ink-muted" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="clay-sunk mt-4 p-5 text-sm text-ink-muted">
            아직 기록이 충분하지 않아요. 문장 연습에서 ‘다시 볼래요’를 누르거나, 실전 답변을 시간 안에 끝내지 못하면 여기에 표시됩니다.
          </p>
        )}
      </section>
    </Page>
  );
}

function Stat({ label, value, sub, icon }: { label: string; value: string; sub: string; icon?: IconName }) {
  return (
    <div className="clay flex flex-col justify-between p-5">
      <p className="eyebrow flex items-center gap-1.5">
        {icon && <Icon name={icon} size={14} />}
        {label}
      </p>
      <p className="mt-3 text-[1.9rem] font-bold leading-none tracking-tight">{value}</p>
      <p className="mt-2 truncate text-xs text-ink-muted">{sub}</p>
    </div>
  );
}

function ProgressRing({ value }: { value: number }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" className="shrink-0" aria-hidden>
      <circle cx="48" cy="48" r={r} fill="none" stroke="#303337" strokeWidth="12" />
      <motion.circle
        cx="48"
        cy="48"
        r={r}
        fill="none"
        stroke="#c8f169"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - Math.min(1, value)) }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        transform="rotate(-90 48 48)"
      />
    </svg>
  );
}
