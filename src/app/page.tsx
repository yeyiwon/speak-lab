"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { Page } from "@/components/ui";
import { useData } from "@/lib/data/store";
import { diffDays, formatKDate, today } from "@/lib/date";
import { activeDates, streak } from "@/lib/insights";
import { planProgress } from "@/lib/plan";
import { DEFAULT_DRILL, drillCount, loadSession, ORDER_LABEL } from "@/lib/session";
import type { PlanItem } from "@/lib/types";

const KIND_ICON: Record<PlanItem["kind"], IconName> = { lecture: "library", sentences: "cards", speaking: "mic", review: "review" };

function hrefFor(it: PlanItem) {
  switch (it.kind) {
    case "lecture":
      return `/library?open=${it.materialId}`;
    case "sentences":
      return "/sentences?start=1";
    case "speaking":
      return `/studio?part=${it.part}`;
    case "review":
      return "/review";
  }
}

export default function TodayPage() {
  const { data, todayPlan } = useData();
  const [saved] = useState(() => (typeof window === "undefined" ? null : loadSession()));
  if (!data) return null;
  const { settings, sentences } = data;
  const t = today();

  const progress = todayPlan ? planProgress(todayPlan, data) : null;
  const pct = progress ? Math.round(progress.ratio * 100) : 0;
  const next = progress?.rows.find((r) => !r.done);
  const dday = settings.examDate ? diffDays(t, settings.examDate) : null;
  const days = streak(activeDates(data));
  const dueCount = sentences.filter((s) => s.status !== "new" && s.due <= t).length;
  const drill = { ...DEFAULT_DRILL, ...settings.drill };
  const drillN = drillCount(sentences, drill, settings.pickedSentenceIds ?? []);
  const nextSpeaking = progress?.rows.find((r) => !r.done && r.item.kind === "speaking")?.item.part;

  const status = [
    progress && `오늘 ${pct}% · ${progress.rows.filter((r) => r.done).length}/${progress.rows.length} 완료`,
    `연속 ${days}일`,
    dday !== null && (dday > 0 ? `시험 D-${dday}` : dday === 0 ? "시험 D-Day" : null),
  ].filter(Boolean);

  // Continue = an unfinished sentence session first, otherwise the next unfinished plan item.
  const resume = saved
    ? { href: "/sentences?start=1", label: "문장 연습 이어서", sub: `${saved.idx} / ${saved.ids.length}` }
    : next
      ? { href: hrefFor(next.item), label: next.item.title, sub: next.item.detail }
      : null;

  return (
    <Page>
      <div className="flex items-center justify-between">
        <p className="eyebrow">{formatKDate(t)}</p>
        <Link href="/settings" className="btn btn-ghost !min-h-[40px] !px-3 md:hidden" aria-label="설정">
          <Icon name="settings" />
        </Link>
      </div>
      <h1 className="mt-1.5 text-[2rem] font-bold tracking-tight">오늘</h1>
      <p className="num mt-1 text-sm text-ink-muted">{status.join(" · ")}</p>

      <section className="mt-7 grid gap-3 sm:grid-cols-2" aria-label="바로 시작">
        {resume && <Action href={resume.href} icon="arrow" label={resume.label === "문장 연습 이어서" ? resume.label : `이어서: ${resume.label}`} sub={resume.sub} primary />}
        <Action href="/sentences?start=1" icon="cards" label="문장 연습" sub={drillN ? `${ORDER_LABEL[drill.order]} ${drillN}문장` : "문장을 먼저 등록하세요"} />
        <Action href={nextSpeaking ? `/studio?part=${nextSpeaking}` : "/studio"} icon="mic" label="실전 연습" sub={nextSpeaking ? `오늘 계획: Part ${nextSpeaking}` : "파트를 골라 시험 시간으로"} />
        <Action href="/review" icon="review" label="복습" sub={dueCount ? `복습 대기 ${dueCount}문장` : "복습 대기 없음"} />
      </section>

      <section className="mt-10" aria-labelledby="plan-h">
        <div className="flex items-end justify-between gap-4">
          <h2 id="plan-h" className="text-lg font-bold">오늘 계획</h2>
          <span className="text-xs text-ink-muted">학습 기록으로 자동 체크</span>
        </div>
        <ol className="panel mt-3 grid grid-cols-[minmax(0,1fr)]">
          {progress?.rows.map(({ item, progress: p, done }) => (
            <li key={item.id}>
              <Link href={hrefFor(item)} className="row-hover group flex items-center gap-4 px-5 py-3.5 sm:px-6">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${done ? "bg-graphite-900 text-lime" : "bg-glacier-200/70 text-glacier-700"}`}>
                  <Icon name={done ? "check" : KIND_ICON[item.kind]} size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block font-semibold ${done ? "text-ink-muted" : ""}`}>
                    {item.title}
                    {item.carried && <span className="chip ml-2 align-middle">어제에서 이어짐</span>}
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-ink-muted">{item.detail}</span>
                </span>
                <span className={`num w-14 shrink-0 text-right font-semibold ${done ? "text-ink-muted" : ""}`}>
                  {p}/{item.target}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </Page>
  );
}

function Action({ href, icon, label, sub, primary = false }: { href: string; icon: IconName; label: string; sub: string; primary?: boolean }) {
  return (
    <Link href={href} className={`group flex items-center gap-4 rounded-2xl px-5 py-4 ${primary ? "clay-graphite sm:col-span-2" : "clay-sm"}`}>
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${primary ? "bg-lime text-graphite-900" : "bg-glacier-200/70 text-glacier-700"}`}>
        <Icon name={icon} size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{label}</span>
        <span className={`mt-0.5 block truncate text-sm ${primary ? "text-glacier-300" : "text-ink-muted"}`}>{sub}</span>
      </span>
      <Icon name="arrow" size={16} className={`shrink-0 ${primary ? "text-glacier-300" : "text-ink-muted"}`} />
    </Link>
  );
}
