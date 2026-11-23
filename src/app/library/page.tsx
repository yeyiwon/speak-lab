"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CHANNEL_URL, FREE_MATERIALS_NOTE, OFFICIAL_SITE, youtubeId } from "@/content/materials";
import { GUIDE } from "@/content/guide";
import { PART_SPECS } from "@/content/exam";
import { Icon } from "@/components/Icon";
import { SentenceEditor } from "@/components/trainer/SentenceEditor";
import { Empty, Page, PageHeader, SourceTag } from "@/components/ui";
import { useData } from "@/lib/data/store";
import { formatKDate } from "@/lib/date";
import { PARTS, type Material, type PartNo } from "@/lib/types";

export default function LibraryPage() {
  return (
    <Suspense>
      <Library />
    </Suspense>
  );
}

type Filter = PartNo | "all" | "any" | "bookmarked";

function Library() {
  const { data } = useData();
  const params = useSearchParams();
  const [filter, setFilter] = useState<Filter>("any");
  const [openId, setOpenId] = useState<string | null>(params.get("open"));
  const [adding, setAdding] = useState(false);
  const [jump, setJump] = useState(0);

  useEffect(() => {
    const id = params.get("open");
    if (id) {
      setTimeout(() => document.getElementById(`m-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
    }
  }, [params]);

  if (!data) return null;
  const materials = (data?.materials ?? [])
    .filter((m) => (filter === "any" ? true : filter === "bookmarked" ? m.bookmarked : m.part === filter))
    .sort((a, b) => Number(a.done) - Number(b.done) || a.order - b.order);
  const total = data?.materials.length ?? 0;
  const doneCount = data?.materials.filter((m) => m.done).length ?? 0;

  return (
    <Page>
      <PageHeader eyebrow="Library" title={<>강의를 보고,<br />바로 내 문장으로.</>}>
        <button type="button" className="btn btn-primary" onClick={() => setAdding(true)}>
          <Icon name="plus" size={18} /> 자료 등록
        </button>
      </PageHeader>

      <div className="clay-sunk mt-6 p-4 text-sm leading-relaxed text-ink-muted">
        <strong className="text-ink">공개 강의</strong>는 시계토끼제니쌤 YouTube 채널에 공개된 영상을 링크·임베드로만 연결합니다 (제목·채널을 2026-11-23에 확인).
        교재·PDF·유료 강의는 포함하지 않으며, SPEAK LAB은 시계토끼와 제휴되지 않은 개인 학습 도구입니다.{" "}
        <a className="font-bold text-glacier-700 underline underline-offset-2" href={CHANNEL_URL} target="_blank" rel="noreferrer">
          채널 바로가기
        </a>{" "}
        ·{" "}
        <a className="font-bold text-glacier-700 underline underline-offset-2" href={OFFICIAL_SITE} target="_blank" rel="noreferrer">
          공식 학습 홈페이지
        </a>
      </div>

      <p className="mt-2 px-1 text-xs text-ink-muted">{FREE_MATERIALS_NOTE}</p>

      <Guide
        onJump={(t) => {
          setJump(t);
          setOpenId("yt-ZjD5JSezau8");
          setTimeout(() => document.getElementById("m-yt-ZjD5JSezau8")?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
        }}
      />

      <h2 className="mt-12 text-xl font-bold">강의 목록</h2>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 pt-1" role="tablist" aria-label="자료 분류">
          {(["any", ...PARTS, "all", "bookmarked"] as Filter[]).map((f) => (
            <button
              key={String(f)}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`btn shrink-0 !min-h-[40px] !text-sm ${filter === f ? "!bg-graphite-900 !text-glacier-50" : ""}`}
            >
              {f === "any" ? "전체" : f === "all" ? "전 파트" : f === "bookmarked" ? "북마크" : `Part ${f}`}
            </button>
          ))}
        </div>
        <span className="num hidden shrink-0 text-sm font-bold text-ink-muted sm:block">
          {doneCount}/{total} 완료
        </span>
      </div>

      {materials.length === 0 ? (
        <div className="mt-4">
          <Empty title="이 분류에 자료가 없어요">자료 등록으로 직접 공부하는 강의 링크를 추가할 수 있어요.</Empty>
        </div>
      ) : (
        <ul className="panel mt-4 grid grid-cols-[minmax(0,1fr)]">
          {materials.map((m) => (
            <MaterialRow
              key={m.id === "yt-ZjD5JSezau8" ? `${m.id}-${jump}` : m.id}
              m={m}
              initialStart={m.id === "yt-ZjD5JSezau8" ? jump : 0}
              open={openId === m.id}
              onToggle={() => setOpenId(openId === m.id ? null : m.id)}
            />
          ))}
        </ul>
      )}

      <AnimatePresence>{adding && <AddMaterial onClose={() => setAdding(false)} />}</AnimatePresence>
    </Page>
  );
}

function MaterialRow({ m, open, onToggle, initialStart = 0 }: { m: Material; open: boolean; onToggle: () => void; initialStart?: number }) {
  const { data, actions } = useData();
  const [addSentence, setAddSentence] = useState(false);
  const [start, setStart] = useState(initialStart);
  const vid = youtubeId(m.url);
  const linked = (data?.sentences ?? []).filter((s) => m.sentenceIds.includes(s.id) || s.materialId === m.id);

  return (
    <li id={`m-${m.id}`}>
      <div className={`row-hover flex items-center gap-3 py-4 pl-4 pr-4 sm:gap-5 sm:pl-6 sm:pr-8 ${open ? "bg-white/40" : ""}`}>
        <button
          type="button"
          role="checkbox"
          aria-checked={m.done}
          aria-label={m.done ? "공부 완료 취소" : "오늘 공부 완료로 표시"}
          onClick={() => actions.markStudied(m.id, !m.done)}
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors ${m.done ? "bg-graphite-900 text-lime" : "text-glacier-400 ring-[1.5px] ring-inset ring-glacier-300 hover:ring-glacier-600"}`}
        >
          {m.done && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 16 }}>
              <Icon name="check" size={18} />
            </motion.span>
          )}
        </button>
        <button type="button" className="min-w-0 flex-1 text-left" aria-expanded={open} onClick={onToggle}>
          <span className={`block font-semibold leading-snug ${m.done ? "text-ink-muted" : ""}`}>{m.title}</span>
          <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-muted">
            <SourceTag origin={m.origin} />
            <span className="chip">{m.part === "all" ? "전 파트" : `Part ${m.part}`}</span>
            {linked.length > 0 && <span className="chip">문장 {linked.length}</span>}
            <span className="hidden sm:inline">
            {m.channel}
            {m.verifiedAt && ` · ${m.verifiedAt} 확인`}
            {m.studiedDates.length > 0 && ` · 마지막 공부 ${formatKDate(m.studiedDates[m.studiedDates.length - 1])}`}
            </span>
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-0.5 rounded-full bg-white/50 p-0.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)]">
        <button
          type="button"
          className={`icon-btn !h-9 !w-9 !rounded-full ${m.bookmarked ? "text-graphite-900" : "text-glacier-600"}`}
          aria-pressed={m.bookmarked}
          aria-label="북마크"
          onClick={() => actions.saveMaterial({ ...m, bookmarked: !m.bookmarked })}
        >
          <Icon name="bookmark" size={18} fill={m.bookmarked ? "currentColor" : "none"} />
        </button>
        <button type="button" className="icon-btn !h-9 !w-9 !rounded-full text-ink-muted" aria-label={open ? "접기" : "펼치기"} aria-expanded={open} onClick={onToggle}>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <Icon name="chev" size={18} />
          </motion.span>
        </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
            <div className="grid gap-6 bg-white/40 px-4 pb-6 pt-2 sm:px-8 lg:grid-cols-[1.3fr_1fr]">
              <div>
                {vid ? (
                  <div className="clay-sunk overflow-hidden !rounded-[20px] p-1.5">
                    <iframe
                      className="aspect-video w-full rounded-[16px]"
                      key={start}
                      src={`https://www.youtube-nocookie.com/embed/${vid}${start ? `?start=${start}&autoplay=1` : ""}`}
                      title={m.title}
                      loading="lazy"
                      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <p className="clay-sunk p-4 text-sm text-ink-muted">임베드할 수 없는 링크예요. 아래 버튼으로 원본에서 열어주세요.</p>
                )}
                {m.chapters?.length ? (
                  <div className="mt-3">
                    <p className="text-xs font-bold text-ink-muted">파트별 구간 바로 재생 (영상 설명란 타임스탬프)</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.chapters.map((c) => (
                        <button key={c.t} type="button" aria-pressed={start === c.t} className={`btn !min-h-[36px] !px-3 !text-xs ${start === c.t ? "!bg-graphite-900 !text-glacier-50" : ""}`} onClick={() => setStart(c.t)}>
                          {c.label}
                          <span className="num font-semibold opacity-60">
                            {Math.floor(c.t / 3600) ? `${Math.floor(c.t / 3600)}:` : ""}
                            {String(Math.floor((c.t % 3600) / 60)).padStart(2, "0")}:{String(c.t % 60).padStart(2, "0")}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  <a className="btn !min-h-[40px] !text-sm" href={m.url} target="_blank" rel="noreferrer">
                    <Icon name="ext" size={16} /> 원본에서 보기
                  </a>
                  {!m.done && (
                    <button type="button" className="btn btn-primary !min-h-[40px] !text-sm" onClick={() => actions.markStudied(m.id, true)}>
                      <Icon name="check" size={16} /> 오늘 공부 완료
                    </button>
                  )}
                  {m.origin === "user" && (
                    <button
                      type="button"
                      className="btn btn-ghost !min-h-[40px] !text-sm text-rec"
                      onClick={() => confirm("이 자료를 삭제할까요? 연결된 문장은 남습니다.") && actions.removeMaterial(m.id)}
                    >
                      <Icon name="trash" size={16} /> 삭제
                    </button>
                  )}
                </div>
                <p className="mt-2 text-[0.7rem] text-ink-muted">외부 영상 재생 시간은 측정하지 않아요. 완료 표시만 기록됩니다.</p>
              </div>

              <div className="flex flex-col gap-4">
                <label className="block">
                  <span className="text-sm font-semibold">내 메모</span>
                  <textarea
                    className="field mt-2 min-h-[110px] resize-y text-sm"
                    placeholder="핵심 포인트, 타임스탬프, 헷갈린 부분…"
                    defaultValue={m.note}
                    onBlur={(e) => e.target.value !== m.note && actions.saveMaterial({ ...m, note: e.target.value })}
                  />
                </label>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">연결된 암기 문장</span>
                    <button type="button" className="btn btn-ghost !min-h-[36px] !px-2 !text-xs" onClick={() => setAddSentence(true)}>
                      <Icon name="plus" size={14} /> 이 강의에서 문장 추가
                    </button>
                  </div>
                  {linked.length ? (
                    <ul className="mt-2 grid gap-2">
                      {linked.map((s) => (
                        <li key={s.id} className="clay-sunk p-3 text-sm">
                          <p className="font-bold">{s.en}</p>
                          <p className="text-xs text-ink-muted">{s.ko}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-xs text-ink-muted">강의에서 배운 문장을 연결하면 문장 트레이너에서 바로 복습돼요.</p>
                  )}
                </div>
                {m.studiedDates.length > 0 && (
                  <p className="text-xs text-ink-muted">공부한 날: {m.studiedDates.map((d) => d.slice(5)).join(", ")}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>{addSentence && <SentenceEditor initial={null} materialId={m.id} onClose={() => setAddSentence(false)} />}</AnimatePresence>
    </li>
  );
}

function AddMaterial({ onClose }: { onClose: () => void }) {
  const { actions } = useData();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [part, setPart] = useState<PartNo | "all">("all");
  const [channel, setChannel] = useState("");
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");

  async function save() {
    if (!title.trim()) return setErr("제목을 입력하세요.");
    try {
      const u = new URL(url);
      if (!/^https?:$/.test(u.protocol)) throw new Error();
    } catch {
      return setErr("http(s)로 시작하는 올바른 링크를 입력하세요.");
    }
    await actions.addMaterial({ title: title.trim(), url: url.trim(), part, channel: channel.trim() || "직접 등록", note });
    onClose();
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-graphite-900/30 p-3 sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.form
        role="dialog"
        aria-modal="true"
        aria-label="자료 등록"
        className="clay w-full max-w-lg p-6 sm:p-7"
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        exit={{ y: 30 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <p className="text-xl font-bold">자료 직접 등록</p>
        <p className="mt-1 text-xs text-ink-muted">공개 링크만 등록하세요. ‘내가 등록’ 표시로 공개 강의와 구분됩니다.</p>
        <label className="mt-5 block">
          <span className="text-sm font-semibold">제목</span>
          <input autoFocus className="field mt-2" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-semibold">링크</span>
          <input className="field mt-2" type="url" inputMode="url" placeholder="https://www.youtube.com/watch?v=…" value={url} onChange={(e) => setUrl(e.target.value)} />
        </label>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-semibold">파트</span>
            <select className="field mt-2" value={String(part)} onChange={(e) => setPart(e.target.value === "all" ? "all" : (Number(e.target.value) as PartNo))}>
              <option value="all">전 파트</option>
              {PARTS.map((p) => (
                <option key={p} value={p}>Part {p}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold">출처</span>
            <input className="field mt-2" placeholder="예: YouTube · 채널명" value={channel} onChange={(e) => setChannel(e.target.value)} />
          </label>
        </div>
        <label className="mt-4 block">
          <span className="text-sm font-semibold">메모</span>
          <textarea className="field mt-2 min-h-[70px]" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        {err && <p role="alert" className="mt-3 text-sm font-bold text-rec">{err}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="btn btn-ghost" onClick={onClose}>취소</button>
          <button type="submit" className="btn btn-primary">등록</button>
        </div>
      </motion.form>
    </motion.div>
  );
}

function Guide({ onJump }: { onJump: (t: number) => void }) {
  const { data } = useData();
  const [part, setPart] = useState<PartNo>(1);
  const g = GUIDE.find((x) => x.part === part)!;
  return (
    <section className="mt-10" aria-labelledby="guide-h">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 id="guide-h" className="text-xl font-bold">파트별 답변 구조</h2>
        <span className="text-xs text-ink-muted">SPEAK LAB이 정리한 일반적인 답변 틀 · 강의 내용 복제 아님</span>
      </div>
      <div className="mt-4 grid gap-5 lg:grid-cols-[200px_1fr]">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 lg:flex-col" role="tablist" aria-label="파트">
          {PARTS.map((p) => (
            <button key={p} role="tab" aria-selected={part === p} onClick={() => setPart(p)} className={`btn shrink-0 !justify-start !rounded-2xl !text-sm ${part === p ? "!bg-graphite-900 !text-glacier-50" : ""}`}>
              Part {p} <span className="text-xs font-semibold opacity-70">{PART_SPECS[p].nameKo}</span>
            </button>
          ))}
        </div>
        <motion.div key={part} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="clay p-6 sm:p-7">
          <p className="text-lg font-bold leading-snug">{g.goal}</p>
          <ol className="mt-5 grid gap-3">
            {g.steps.map((s, i) => (
              <li key={s.label} className="flex gap-3">
                <span className="num grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-glacier-200 text-xs font-bold">{i + 1}</span>
                <span>
                  <span className="block font-semibold">{s.label}</span>
                  <span className="text-sm text-ink-muted">{s.detail}</span>
                  {s.example && <span className="mt-1 block font-mono text-[0.82rem] text-glacier-700">{s.example}</span>}
                </span>
              </li>
            ))}
          </ol>
          <p className="clay-sunk mt-5 p-3.5 text-sm"><strong>시간 배분 · </strong>{g.timing}</p>
          <ul className="mt-3 grid gap-1 text-sm text-ink-muted">
            {g.pitfalls.map((x) => (
              <li key={x}>✕ {x}</li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            {(() => {
              const c = data?.materials.find((m) => m.id === "yt-ZjD5JSezau8")?.chapters?.find((x) => x.part === part);
              return c ? (
                <button type="button" className="btn !min-h-[40px] !text-sm" onClick={() => onJump(c.t)}>
                  <Icon name="play" size={14} /> 강의에서 Part {part} 구간 보기
                </button>
              ) : null;
            })()}
            <Link href={`/studio?part=${part}`} className="btn btn-primary !min-h-[40px] !text-sm">
              Part {part} 바로 연습
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
