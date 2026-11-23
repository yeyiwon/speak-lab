"use client";

import Link from "next/link";
import { Select } from "@/components/Select";
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
  const [viewer, setViewer] = useState<{ id: string; start: number } | null>(() => {
    const id = params.get("open");
    return id ? { id, start: 0 } : null;
  });
  const [adding, setAdding] = useState(false);

  if (!data) return null;
  const materials = data.materials
    .filter((m) => (filter === "any" ? true : filter === "bookmarked" ? m.bookmarked : m.part === filter))
    .sort((a, b) => Number(a.done) - Number(b.done) || a.order - b.order);
  const total = data.materials.length;
  const doneCount = data.materials.filter((m) => m.done).length;
  const viewing = viewer ? data.materials.find((m) => m.id === viewer.id) : undefined;

  return (
    <Page>
      <PageHeader eyebrow="Library" title={"자료"}>
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

      <Guide onJump={(t) => setViewer({ id: "yt-ZjD5JSezau8", start: t })} />

      <h2 className="mt-12 text-xl font-bold">강의 목록</h2>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2 pt-1" role="tablist" aria-label="자료 분류">
          {(["any", ...PARTS, "all", "bookmarked"] as Filter[]).map((f) => (
            <button
              key={String(f)}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`btn shrink-0 !min-h-[38px] !text-sm ${filter === f ? "!bg-graphite-900 !text-glacier-50" : ""}`}
            >
              {f === "any" ? "전체" : f === "all" ? "전 파트" : f === "bookmarked" ? "북마크" : `Part ${f}`}
            </button>
          ))}
        </div>
        <span className="num hidden shrink-0 text-sm font-semibold text-ink-muted sm:block">
          {doneCount}/{total} 완료
        </span>
      </div>

      {/* Fixed minimum height: switching to a short filter must not yank the page upward. */}
      <div className="mt-4 min-h-[560px]">
        {materials.length === 0 ? (
          <Empty title="이 분류에 자료가 없어요">자료 등록으로 직접 공부하는 강의 링크를 추가할 수 있어요.</Empty>
        ) : (
          <ul className="panel grid grid-cols-[minmax(0,1fr)]">
            {materials.map((m) => (
              <MaterialRow key={m.id} m={m} onOpen={() => setViewer({ id: m.id, start: 0 })} />
            ))}
          </ul>
        )}
      </div>

      <AnimatePresence>{viewing && <LectureSheet key={viewing.id + viewer!.start} m={viewing} start={viewer!.start} onClose={() => setViewer(null)} />}</AnimatePresence>
      <AnimatePresence>{adding && <AddMaterial onClose={() => setAdding(false)} />}</AnimatePresence>
    </Page>
  );
}

/** One quiet row: status, title, meta, and a single chevron — the details open in a sheet. */
function MaterialRow({ m, onOpen }: { m: Material; onOpen: () => void }) {
  const { data } = useData();
  const linked = (data?.sentences ?? []).filter((s) => m.sentenceIds.includes(s.id) || s.materialId === m.id).length;
  return (
    <li>
      <button type="button" onClick={onOpen} className="row-hover group flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6">
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${m.done ? "bg-graphite-900 text-lime" : "bg-glacier-100 text-glacier-600"}`}
          aria-label={m.done ? "공부 완료" : "아직 안 봄"}
        >
          <Icon name={m.done ? "check" : "play"} size={m.done ? 16 : 13} />
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block truncate font-semibold ${m.done ? "text-ink-muted" : ""}`}>{m.title}</span>
          <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
            <SourceTag origin={m.origin} />
            <span className="chip">{m.part === "all" ? "전 파트" : `Part ${m.part}`}</span>
            {m.chapters?.length ? <span className="chip">구간 {m.chapters.length}</span> : null}
            {linked > 0 && <span className="chip">문장 {linked}</span>}
            {m.bookmarked && <span className="chip chip-dark">북마크</span>}
          </span>
        </span>
        <Icon name="arrow" size={16} className="shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5" />
      </button>
    </li>
  );
}

/** Lecture viewer: solid sheet with video, chapter jumps, actions, memo and linked sentences. */
function LectureSheet({ m, start: initialStart, onClose }: { m: Material; start: number; onClose: () => void }) {
  const { data, actions } = useData();
  const [start, setStart] = useState(initialStart);
  const [addSentence, setAddSentence] = useState(false);
  const vid = youtubeId(m.url);
  const linked = (data?.sentences ?? []).filter((s) => m.sentenceIds.includes(s.id) || s.materialId === m.id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !addSentence && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, addSentence]);

  const fmt = (t: number) =>
    `${Math.floor(t / 3600) ? `${Math.floor(t / 3600)}:` : ""}${String(Math.floor((t % 3600) / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-graphite-900/45 backdrop-blur-[3px] sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={m.title}
        className="clay max-h-[94dvh] w-full max-w-4xl overflow-y-auto !rounded-b-none sm:!rounded-[26px]"
        initial={{ y: 24, opacity: 0.6 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 px-6 pb-4 pt-6 sm:px-8">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-1.5">
              <SourceTag origin={m.origin} />
              <span className="chip">{m.part === "all" ? "전 파트" : `Part ${m.part}`}</span>
            </div>
            <h2 className="mt-2 text-lg font-bold leading-snug sm:text-xl">{m.title}</h2>
            <p className="mt-1 text-xs text-ink-muted">
              {m.channel}
              {m.verifiedAt && ` · ${m.verifiedAt} 확인`}
              {m.studiedDates.length > 0 && ` · 마지막 공부 ${formatKDate(m.studiedDates[m.studiedDates.length - 1])}`}
            </p>
          </div>
          <button type="button" className="icon-btn" aria-label="닫기" onClick={onClose}>
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="grid gap-6 px-6 pb-7 sm:px-8 lg:grid-cols-[1.45fr_1fr]">
          <div>
            {vid ? (
              <iframe
                key={start}
                className="aspect-video w-full rounded-2xl bg-graphite-900"
                src={`https://www.youtube-nocookie.com/embed/${vid}${start ? `?start=${start}&autoplay=1` : ""}`}
                title={m.title}
                loading="lazy"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <p className="clay-sunk p-4 text-sm text-ink-muted">임베드할 수 없는 링크예요. 원본에서 열어주세요.</p>
            )}
            {m.chapters?.length ? (
              <div className="mt-4">
                <p className="text-xs font-semibold text-ink-muted">파트별 구간 바로 재생</p>
                <div className="mt-2 grid grid-cols-5 gap-1.5">
                  {m.chapters.map((c) => (
                    <button
                      key={c.t}
                      type="button"
                      aria-pressed={start === c.t}
                      onClick={() => setStart(c.t)}
                      className={`flex flex-col items-center rounded-xl py-2 text-xs transition-colors ${
                        start === c.t ? "bg-graphite-900 text-glacier-50" : "bg-glacier-100 text-ink hover:bg-glacier-200"
                      }`}
                    >
                      <span className="font-semibold">{c.label}</span>
                      <span className="num opacity-60">{fmt(c.t)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className={`btn !min-h-[42px] !text-sm ${m.done ? "" : "btn-primary"}`}
                onClick={() => actions.markStudied(m.id, !m.done)}
              >
                <Icon name="check" size={16} /> {m.done ? "완료 취소" : "오늘 공부 완료"}
              </button>
              <button
                type="button"
                className="btn !min-h-[42px] !text-sm"
                aria-pressed={m.bookmarked}
                onClick={() => actions.saveMaterial({ ...m, bookmarked: !m.bookmarked })}
              >
                <Icon name="bookmark" size={16} fill={m.bookmarked ? "currentColor" : "none"} /> {m.bookmarked ? "북마크됨" : "북마크"}
              </button>
              <a className="btn btn-ghost !min-h-[42px] !text-sm" href={m.url} target="_blank" rel="noreferrer">
                <Icon name="ext" size={16} /> 원본
              </a>
              {m.origin === "user" && (
                <button
                  type="button"
                  className="btn btn-ghost !min-h-[42px] !text-sm text-rec"
                  onClick={() => {
                    if (confirm("이 자료를 삭제할까요? 연결된 문장은 남습니다.")) {
                      actions.removeMaterial(m.id);
                      onClose();
                    }
                  }}
                >
                  <Icon name="trash" size={16} /> 삭제
                </button>
              )}
            </div>
            <p className="mt-2 text-[0.7rem] text-ink-muted">외부 영상 재생 시간은 측정하지 않아요. 완료 표시만 기록됩니다.</p>
          </div>

          <div className="flex flex-col gap-5">
            <label className="block">
              <span className="text-sm font-semibold">내 메모</span>
              <textarea
                className="field mt-2 min-h-[120px] resize-y text-sm"
                placeholder="핵심 포인트, 타임스탬프, 헷갈린 부분…"
                defaultValue={m.note}
                onBlur={(e) => e.target.value !== m.note && actions.saveMaterial({ ...m, note: e.target.value })}
              />
            </label>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">연결된 암기 문장</span>
                <button type="button" className="btn btn-ghost !min-h-[34px] !px-2.5 !text-xs" onClick={() => setAddSentence(true)}>
                  <Icon name="plus" size={14} /> 문장 추가
                </button>
              </div>
              {linked.length ? (
                <ul className="mt-2 grid gap-2">
                  {linked.map((s) => (
                    <li key={s.id} className="rounded-xl bg-glacier-100/70 px-3.5 py-2.5 text-sm">
                      <p className="font-semibold">{s.en}</p>
                      <p className="text-xs text-ink-muted">{s.ko}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-ink-muted">강의에서 배운 문장을 추가하면 문장 연습에 바로 들어가요.</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      <div onClick={(e) => e.stopPropagation()}>
        <AnimatePresence>{addSentence && <SentenceEditor initial={null} materialId={m.id} onClose={() => setAddSentence(false)} />}</AnimatePresence>
      </div>
    </motion.div>
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
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-graphite-900/45 p-3 backdrop-blur-[3px] sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
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
            <Select className="mt-2" label="파트" value={String(part)} onChange={(v) => setPart(v === "all" ? "all" : (Number(v) as PartNo))} options={[{ value: "all", label: "전 파트" }, ...PARTS.map((p) => ({ value: String(p), label: `Part ${p}` }))]} />
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
