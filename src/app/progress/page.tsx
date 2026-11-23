"use client";

import { useMemo, useState } from "react";
import { Select } from "@/components/Select";
import { motion } from "motion/react";
import { findQuestion } from "@/content/questions";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Empty, Page, PageHeader, RollingNumber } from "@/components/ui";
import { useData } from "@/lib/data/store";
import { addDays, formatDuration, formatKDate, today } from "@/lib/date";
import { activeDates, partInsights, streak } from "@/lib/insights";
import { planProgress } from "@/lib/plan";
import { PARTS } from "@/lib/types";

export default function ProgressPage() {
  const { data } = useData();
  const [compareQ, setCompareQ] = useState<string | null>(null);

  const stats = useMemo(() => {
    if (!data) return null;
    const t = today();
    const days = Array.from({ length: 14 }, (_, i) => addDays(t, i - 13));
    const daily = days.map((d) => ({
      d,
      sec: data.sessions.filter((s) => s.date === d).reduce((a, s) => a + s.durationSec, 0),
    }));
    const dates = activeDates(data);
    // Longest streak ever.
    const sorted = [...dates].sort();
    let longest = 0;
    let run = 0;
    let prev = "";
    for (const d of sorted) {
      run = prev && addDays(prev, 1) === d ? run + 1 : 1;
      longest = Math.max(longest, run);
      prev = d;
    }
    const answeredSec = data.attempts.reduce((a, x) => a + (x.answeredMs ?? x.respSec * 1000) / 1000, 0);
    const spokenSec = data.attempts.reduce((a, x) => a + x.spokenMs / 1000, 0);
    const total = data.sentences.length;
    const mastered = data.sentences.filter((s) => s.status === "mastered").length;
    const familiar = data.sentences.filter((s) => s.status === "familiar").length;
    // Review completion = sentence/review plan targets met over the last 14 planned days.
    let target = 0;
    let doneN = 0;
    for (const p of data.plans.filter((p) => p.date >= days[0] && p.date <= t)) {
      for (const r of planProgress(p, data).rows) {
        if (r.item.kind === "sentences" || r.item.kind === "review") {
          target += r.item.target;
          doneN += r.progress;
        }
      }
    }
    const withAudio = new Map<string, number>();
    data.attempts.forEach((a) => a.audioId && withAudio.set(a.questionId, (withAudio.get(a.questionId) ?? 0) + 1));
    return {
      daily,
      streakNow: streak(dates),
      longest,
      answeredSec,
      spokenSec,
      total,
      mastered,
      familiar,
      reviewRate: target ? doneN / target : null,
      parts: partInsights(data.attempts),
      comparable: [...withAudio.entries()].filter(([, n]) => n >= 2).map(([q]) => q),
      sessionsSec: data.sessions.reduce((a, s) => a + s.durationSec, 0),
    };
  }, [data]);

  if (!data || !stats) return null;
  const maxDay = Math.max(60, ...stats.daily.map((d) => d.sec));
  const maxPart = Math.max(1, ...stats.parts.map((p) => p.attempts));
  const q = compareQ ?? stats.comparable[0] ?? null;
  const compareAttempts = q ? data.attempts.filter((a) => a.questionId === q && a.audioId).sort((a, b) => a.startedAt - b.startedAt) : [];
  const pair = compareAttempts.length >= 2 ? [compareAttempts[0], compareAttempts[compareAttempts.length - 1]] : [];

  return (
    <Page>
      <PageHeader eyebrow="Progress" title={"기록"} />

      <p className="clay-sunk mt-6 p-4 text-sm leading-relaxed text-ink-muted">
        <strong className="text-ink">측정값</strong>(학습 시간 · 문제 수 · 발화 감지 시간)과 <strong className="text-ink">자기 평가</strong>(내가 매긴 1–5)를 구분해 보여줍니다.
        SPEAK LAB은 토익스피킹 점수나 발음 정확도를 산출하지 않습니다.
      </p>

      <section className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="연속 학습" value={stats.streakNow} unit="일" sub={`최장 ${stats.longest}일`} />
        <Kpi label="누적 답변 시간" value={Math.round(stats.answeredSec / 60)} unit="분" sub={`발화 감지 ${formatDuration(stats.spokenSec)}`} />
        <Kpi label="문장 암기율" value={stats.total ? Math.round((stats.mastered / stats.total) * 100) : 0} unit="%" sub={`완전 암기 ${stats.mastered} · 익숙함 ${stats.familiar} / ${stats.total}`} />
        <Kpi label="복습 완료율" value={stats.reviewRate === null ? 0 : Math.round(stats.reviewRate * 100)} unit={stats.reviewRate === null ? "" : "%"} sub={stats.reviewRate === null ? "기록 부족" : "최근 14일 계획 기준"} />
      </section>

      <section className="clay mt-8 p-6 sm:p-7" aria-labelledby="daily-h">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 id="daily-h" className="text-lg font-bold">일별 학습 시간</h2>
          <span className="text-xs text-ink-muted">앱 안에서 측정한 문장·실전 훈련 시간 (외부 강의 시청 제외) · 전체 {formatDuration(stats.sessionsSec)}</span>
        </div>
        <div className="mt-6 flex h-44 items-end gap-1.5 sm:gap-2.5">
          {stats.daily.map(({ d, sec }, i) => (
            <div key={d} className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <span className="num text-[0.65rem] font-bold text-ink-muted opacity-0 transition group-hover:opacity-100">{sec ? `${Math.round(sec / 60)}m` : ""}</span>
              <motion.span
                className={`w-full rounded-lg ${d === today() ? "bg-graphite-900" : "bg-glacier-400"}`}
                style={{ boxShadow: "inset 2px 2px 3px rgba(255,255,255,.4), inset -2px -2px 4px rgba(0,0,0,.12)" }}
                initial={{ height: 4 }}
                animate={{ height: `${Math.max(3, (sec / maxDay) * 100)}%` }}
                transition={{ delay: i * 0.025, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                title={`${formatKDate(d)} · ${formatDuration(sec)}`}
              />
              <span className="num text-[0.6rem] text-ink-muted">{d.slice(8)}</span>
            </div>
          ))}
        </div>
        <table className="sr-only">
          <caption>일별 학습 시간</caption>
          <tbody>
            {stats.daily.map(({ d, sec }) => (
              <tr key={d}>
                <td>{d}</td>
                <td>{formatDuration(sec)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="clay p-6" aria-labelledby="part-h">
          <h2 id="part-h" className="text-lg font-bold">파트별 문제 풀이</h2>
          <ul className="mt-5 grid gap-4">
            {stats.parts.map((p) => (
              <li key={p.part}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-semibold">Part {p.part}</span>
                  <span className="num text-ink-muted">
                    <strong className="text-ink">{p.attempts}</strong>문항
                    {p.completedRate !== null && ` · 완주 ${Math.round(p.completedRate * 100)}%`}
                    {p.avgSelf !== null && ` · 자기 평가 ${p.avgSelf.toFixed(1)}`}
                  </span>
                </div>
                <div className="track mt-2 !h-3">
                  <span style={{ width: `${(p.attempts / maxPart) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="clay p-6" aria-labelledby="cmp-h">
          <h2 id="cmp-h" className="text-lg font-bold">과거 녹음 비교</h2>
          {stats.comparable.length ? (
            <>
              <Select className="mt-4" label="비교할 문제" value={q ?? ""} onChange={setCompareQ} options={stats.comparable.map((id) => { const f = findQuestion(id); return { value: id, label: `Part ${f?.set.part} · Q${f?.question.qNo} · ${f?.set.title}` }; })} />
              <div className="mt-4 grid gap-4">
                {pair.map((a, i) => (
                  <div key={a.id}>
                    <p className="mb-2 text-xs font-bold text-ink-muted">
                      {i === 0 ? "처음" : "가장 최근"} · {formatKDate(a.date)} · 발화 감지 {(a.spokenMs / 1000).toFixed(1)}초
                      {a.selfRating ? ` · 자기 평가 ${a.selfRating}/5` : ""}
                    </p>
                    <AudioPlayer audioId={a.audioId} label={i === 0 ? "처음 녹음" : "최근 녹음"} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-4">
              <Empty title="같은 문제를 두 번 이상 녹음하면 비교할 수 있어요">처음 답변과 최근 답변을 나란히 들어보세요.</Empty>
            </div>
          )}
        </div>
      </section>

      <section className="mt-8">
        <p className="text-xs text-ink-muted">
          파트별 PART {PARTS.join("·")} 기록은 Speaking Studio에서 저장된 답변만 집계합니다. AI 피드백이 추가되더라도 ‘AI 참고 피드백’으로 구분 표시되며 공식 점수와 섞이지 않습니다.
        </p>
      </section>
    </Page>
  );
}

function Kpi({ label, value, unit, sub }: { label: string; value: number; unit: string; sub: string }) {
  return (
    <div className="clay p-5">
      <p className="eyebrow">{label}</p>
      <p className="mt-3 text-[2.2rem] font-bold leading-none tracking-tight">
        <RollingNumber value={value} />
        <span className="ml-0.5 text-base font-semibold text-ink-muted">{unit}</span>
      </p>
      <p className="mt-2 text-xs text-ink-muted">{sub}</p>
    </div>
  );
}
