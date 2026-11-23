"use client";

import Link from "next/link";
import { useState } from "react";
import { findQuestion } from "@/content/questions";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Icon } from "@/components/Icon";
import { Trainer } from "@/components/trainer/Trainer";
import { Empty, Page, PageHeader } from "@/components/ui";
import { useData } from "@/lib/data/store";
import { addDays, formatKDate, today } from "@/lib/date";
import { weakAttempts, weakSentences } from "@/lib/insights";
import type { Attempt } from "@/lib/types";

export default function ReviewPage() {
  const { data } = useData();
  const [training, setTraining] = useState<string[] | null>(null);
  if (!data) return null;

  const t = today();
  const weakS = weakSentences(data.sentences);
  const due = data.sentences.filter((s) => s.status !== "new" && s.due <= t);
  const upcoming = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(t, i + 1);
    return { d, n: data.sentences.filter((s) => s.due === d).length };
  });
  const weakQ = weakAttempts(data.attempts);
  const recordings = [...data.attempts].filter((a) => a.audioId).sort((a, b) => b.startedAt - a.startedAt).slice(0, 8);

  if (training) {
    const pool = data.sentences.filter((s) => training.includes(s.id));
    return <Trainer mode="hint" pool={pool} onExit={() => setTraining(null)} />;
  }

  return (
    <Page>
      <PageHeader eyebrow="Review" title={"복습"} />

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {/* Failed sentences */}
        <section className="clay p-6" aria-labelledby="ws-h">
          <div className="flex items-center justify-between gap-3">
            <h2 id="ws-h" className="text-lg font-bold">막혔던 문장</h2>
            <span className="chip num">{weakS.length}</span>
          </div>
          {weakS.length ? (
            <>
              <ul className="mt-4 grid gap-2">
                {weakS.slice(0, 5).map((s) => (
                  <li key={s.id} className="clay-sunk p-3">
                    <p className="text-sm font-bold">{s.en}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">{s.ko} · 다시 본 횟수 {s.lapses}</p>
                  </li>
                ))}
              </ul>
              <button type="button" className="btn btn-primary mt-5" onClick={() => setTraining(weakS.map((s) => s.id))}>
                막힌 문장 {weakS.length}개 훈련
              </button>
            </>
          ) : (
            <p className="mt-4 text-sm text-ink-muted">문장 연습에서 ‘다시 볼래요’를 누른 문장이 여기에 모여요.</p>
          )}
        </section>

        {/* Due schedule */}
        <section className="clay p-6" aria-labelledby="due-h">
          <div className="flex items-center justify-between gap-3">
            <h2 id="due-h" className="text-lg font-bold">복습 예정 문장</h2>
            <span className="chip num">오늘 {due.length}</span>
          </div>
          <div className="mt-5 flex h-28 items-end gap-2" role="img" aria-label="다음 7일 복습 예정 문장 수">
            {upcoming.map(({ d, n }) => {
              const max = Math.max(1, ...upcoming.map((u) => u.n));
              return (
                <div key={d} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="num text-xs font-bold">{n || ""}</span>
                  <span className="w-full rounded-xl bg-glacier-300" style={{ height: `${Math.max(6, (n / max) * 72)}px`, boxShadow: "inset 2px 2px 3px rgba(255,255,255,.6), inset -2px -2px 4px rgba(76,111,147,.25)" }} />
                  <span className="num text-[0.65rem] text-ink-muted">{d.slice(8)}일</span>
                </div>
              );
            })}
          </div>
          <Link href="/sentences?train=hint" className="btn mt-5">
            오늘 복습분 시작 <Icon name="arrow" size={16} />
          </Link>
        </section>
      </div>

      {/* Questions to retry */}
      <section className="mt-10" aria-labelledby="wq-h">
        <h2 id="wq-h" className="text-xl font-bold">다시 도전할 문제</h2>
        <p className="mt-1 text-sm text-ink-muted">가장 최근 답변이 시간 전에 끝났거나, 어렵다고 표시했거나, 자기 평가가 2 이하인 문제</p>
        {weakQ.length ? (
          <ul className="mt-4 grid gap-4">
            {weakQ.map((a) => (
              <AttemptCard key={a.id} a={a} retry />
            ))}
          </ul>
        ) : (
          <div className="mt-4">
            <Empty title="다시 할 문제가 없어요">실전 훈련 후 ‘어려운 문제로 표시’하면 여기로 모입니다.</Empty>
          </div>
        )}
      </section>

      <section className="mt-10" aria-labelledby="rec-h">
        <h2 id="rec-h" className="text-xl font-bold">이전 녹음 다시 듣기</h2>
        {recordings.length ? (
          <ul className="mt-4 grid gap-4 lg:grid-cols-2">
            {recordings.map((a) => (
              <AttemptCard key={a.id} a={a} />
            ))}
          </ul>
        ) : (
          <div className="mt-4">
            <Empty title="아직 녹음이 없어요">Speaking Studio에서 답변하면 녹음이 자동 저장돼요.</Empty>
          </div>
        )}
      </section>
    </Page>
  );
}

function AttemptCard({ a, retry = false }: { a: Attempt; retry?: boolean }) {
  const { actions } = useData();
  const found = findQuestion(a.questionId);
  return (
    <li className="clay-sm p-5">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="chip">Part {a.part}{found ? ` · Q${found.question.qNo}` : ""}</span>
        <span className="chip">{formatKDate(a.date)}</span>
        {!a.completed && <span className="chip chip-dark">시간 전 종료</span>}
        {a.flagged && <span className="chip chip-dark">어려움 표시</span>}
        {a.selfRating && <span className="chip">자기 평가 {a.selfRating}/5</span>}
        {a.mode === "free" && <span className="chip">자유 연습</span>}
      </div>
      <p className="mt-3 line-clamp-2 text-sm font-bold">{found?.question.prompt ?? "삭제된 문제"}</p>
      {a.note && <p className="mt-1 text-xs text-ink-muted">메모: {a.note}</p>}
      {a.audioId && (
        <div className="mt-3">
          <AudioPlayer audioId={a.audioId} />
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {retry && found && (
          <Link href={`/studio?set=${found.set.id}&mode=exam`} className="btn btn-primary !min-h-[40px] !text-sm">
            <Icon name="retry" size={16} /> 세트 다시 도전
          </Link>
        )}
        {a.flagged && (
          <button type="button" className="btn !min-h-[40px] !text-sm" onClick={() => actions.updateAttempt({ ...a, flagged: false })}>
            어려움 표시 해제
          </button>
        )}
        <button
          type="button"
          className="btn btn-ghost !min-h-[40px] !text-sm text-rec"
          onClick={() => confirm("이 답변 기록과 녹음을 삭제할까요? 되돌릴 수 없어요.") && actions.removeAttempt(a.id)}
        >
          <Icon name="trash" size={16} /> 삭제
        </button>
      </div>
    </li>
  );
}
