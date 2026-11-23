"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PART_SPECS } from "@/content/exam";
import type { QuestionSet } from "@/content/questions";
import { useFocusMode } from "@/components/AppShell";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Icon } from "@/components/Icon";
import { beep, canSpeak, speak } from "@/lib/audio/sound";
import { useCountdown } from "@/lib/audio/useCountdown";
import { useRecorder, type RecResult } from "@/lib/audio/useRecorder";
import { useData } from "@/lib/data/store";
import { today, uid } from "@/lib/date";
import type { Attempt } from "@/lib/types";
import { Scene } from "./Scene";
import { Waveform } from "./Waveform";

type Phase = "intro" | "read" | "question" | "prep" | "answer" | "review" | "finished";

export interface SessionOptions {
  mode: "exam" | "free";
  prepOverride?: number;
  respOverride?: number;
}

const SELF = ["거의 못 말함", "많이 막힘", "보통", "대체로 매끄러움", "막힘 없이"];
const VOICE_RMS = 0.02;

export function Session({ set, opts, onExit }: { set: QuestionSet; opts: SessionOptions; onExit: () => void }) {
  const { data, actions } = useData();
  const settings = data!.settings;
  const setFocus = useFocusMode();
  const rec = useRecorder();

  const [qi, setQi] = useState(0);
  const [phase, setPhase] = useState<Phase>("intro");
  const [paused, setPaused] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [lastBlob, setLastBlob] = useState<Blob | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [showSample, setShowSample] = useState(false);
  const spoken = useRef(0);
  const savedRef = useRef<string[]>([]);
  useEffect(() => {
    savedRef.current = savedIds;
  }, [savedIds]);

  const q = set.questions[qi];
  const spec = PART_SPECS[set.part];
  const prepSec = opts.mode === "free" && opts.prepOverride ? opts.prepOverride : q.prepSec;
  const respSec = opts.mode === "free" && opts.respOverride ? opts.respOverride : q.respSec;
  const readSec = set.readSec ?? 0;

  // Hide app chrome during the session.
  useEffect(() => {
    setFocus(true);
    return () => setFocus(false);
  }, [setFocus]);

  // Log total practice time when leaving.
  useEffect(() => {
    const sessionStart = Date.now();
    return () => {
      const secs = (Date.now() - sessionStart) / 1000;
      if (savedRef.current.length) actions.logSession("speaking", secs, savedRef.current.length);
      if (canSpeak()) window.speechSynthesis.cancel();
    };
  }, [actions]);

  const timerSec = phase === "read" ? readSec : phase === "prep" ? prepSec : phase === "answer" ? respSec : 0;
  const timerKey = `${qi}-${phase}-${runKey}`;

  const finishAnswer = useCallback(
    async (early: boolean, remainingMs: number) => {
      if (phase !== "answer") return;
      setPhase("review");
      if (settings.timerSound) beep(520, 260);
      const result: RecResult | null = await rec.stop();
      const a: Attempt = {
        id: uid("at-"),
        questionId: q.id,
        setId: set.id,
        part: set.part,
        date: today(),
        startedAt: Date.now() - (respSec * 1000 - remainingMs),
        mode: opts.mode,
        prepSec,
        respSec,
        completed: !early || remainingMs <= 3000,
        spokenMs: Math.round(spoken.current),
        answeredMs: Math.round(respSec * 1000 - remainingMs),
        note: "",
        flagged: false,
      };
      // Saved immediately — nothing is lost if the learner closes the tab during review.
      const saved = await actions.saveAttempt(a, result ?? undefined);
      setAttempt(saved);
      setLastBlob(result?.blob ?? null);
      setSavedIds((s) => [...s, saved.id]);
    },
    [phase, rec, q.id, set.id, set.part, respSec, prepSec, opts.mode, actions, settings.timerSound],
  );

  const startAnswer = useCallback(async () => {
    spoken.current = 0;
    setShowSample(false);
    setPhase("answer");
    if (settings.timerSound) beep(880, 220);
    if (settings.autoRecord && rec.state !== "denied" && rec.state !== "unsupported") await rec.start();
  }, [settings.timerSound, settings.autoRecord, rec]);

  const onTimerDone = useCallback(() => {
    if (phase === "read") setPhase("question");
    else if (phase === "prep") startAnswer();
    else if (phase === "answer") finishAnswer(false, 0);
  }, [phase, startAnswer, finishAnswer]);

  const remaining = useCountdown(timerSec, timerSec > 0 && !paused && ["read", "prep", "answer"].includes(phase), onTimerDone, timerKey);

  // Question phase: read the question aloud (Part 3/4), then move to preparation.
  useEffect(() => {
    if (phase !== "question") return;
    const text = set.part === 3 || set.part === 4 ? q.prompt : "";
    if (text && settings.speakQuestions && canSpeak()) {
      let advanced = false;
      const go = () => {
        if (advanced) return;
        advanced = true;
        setPhase("prep");
      };
      // Some browsers never fire onend (no voices installed) — never let that block the session.
      const words = text.split(/\s+/).length;
      const guard = setTimeout(go, (words * 450 + 2500) * (q.repeat ? 2 : 1));
      const voice = { voiceURI: settings.voiceURI, rate: settings.speechRate };
      let stop = speak(text, {
        ...voice,
        onend: () => {
          if (q.repeat) stop = speak(text, { ...voice, onend: go });
          else go();
        },
      });
      return () => {
        clearTimeout(guard);
        stop();
      };
    }
    const t = setTimeout(() => setPhase("prep"), set.part === 3 || set.part === 4 ? 2500 : 0);
    return () => clearTimeout(t);
  }, [phase, q, set.part, settings.speakQuestions, settings.voiceURI, settings.speechRate]);

  function begin() {
    rec.prepare();
    setPhase(set.part === 4 && qi === 0 && readSec ? "read" : "question");
  }

  function retry() {
    setAttempt(null);
    setLastBlob(null);
    setRunKey((k) => k + 1);
    setPaused(false);
    setPhase("prep");
  }

  function next() {
    setAttempt(null);
    setLastBlob(null);
    setPaused(false);
    if (qi + 1 < set.questions.length) {
      setQi(qi + 1);
      setPhase("question");
    } else setPhase("finished");
  }

  function togglePause() {
    if (phase === "answer") {
      if (paused) rec.resume();
      else rec.pause();
    }
    setPaused((p) => !p);
  }

  async function patchAttempt(p: Partial<Attempt>) {
    if (!attempt) return;
    const a = { ...attempt, ...p };
    setAttempt(a);
    await actions.updateAttempt(a);
  }

  const secLeft = Math.ceil(remaining / 1000);
  const ratio = timerSec ? remaining / (timerSec * 1000) : 0;
  const urgent = phase === "answer" && secLeft <= 5;
  // Kinetic numerals: weight grows as time runs out.
  const weight = Math.round(300 + (1 - ratio) * 600);

  const showContext = set.context.kind === "schedule" && (phase !== "intro" || qi > 0);
  const showQuestionText = set.part === 3 || set.part === 4 ? phase !== "intro" && phase !== "read" : true;

  return (
    <div className="studio fixed inset-0 z-40 flex flex-col overflow-y-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-8 sm:pt-6" style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}>
        <button type="button" className="btn btn-ghost !min-h-[40px] !px-3" onClick={onExit}>
          <Icon name="back" size={18} /> 나가기
        </button>
        <div className="flex items-center gap-2 text-sm font-bold text-graphite-300">
          <span className="chip">Part {set.part}</span>
          <span className="num">
            Q{q.qNo} · {qi + 1}/{set.questions.length}
          </span>
          {opts.mode === "free" && <span className="chip">자유 연습</span>}
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-4 pb-10 pt-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        {/* Left: material */}
        <section className="flex flex-col gap-5" aria-label="문제">
          <p className="eyebrow !text-graphite-300">
            {spec.nameEn} · {spec.nameKo}
          </p>

          {set.context.kind === "scenario" && phase !== "intro" && (
            <p className="clay-sunk p-5 text-[1.02rem] leading-relaxed text-glacier-200">{set.context.text}</p>
          )}

          {showContext && set.context.kind === "schedule" && (
            <div className="clay overflow-hidden p-5 sm:p-6">
              <p className="text-lg font-bold text-glacier-100">{set.context.title}</p>
              <p className="mt-1 text-sm text-graphite-300">{set.context.subtitle}</p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead>
                    <tr className="text-graphite-300">
                      {set.context.columns.map((c) => (
                        <th key={c} className="pb-2 pr-3 font-bold">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {set.context.rows.map((r, i) => (
                      <tr key={i} className="border-t border-white/5">
                        {r.map((c, j) => (
                          <td key={j} className={`py-2 pr-3 ${c.includes("CANCELED") ? "text-rec" : "text-glacier-100"}`}>{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {set.context.footnote && <p className="mt-3 text-sm text-graphite-300">{set.context.footnote}</p>}
            </div>
          )}

          {phase === "intro" ? (
            <div className="clay p-6 sm:p-8">
              <p className="text-2xl font-bold text-glacier-100">{set.title}</p>
              <p className="mt-3 text-graphite-300">
                {spec.questions} · {spec.summary}
                {opts.mode === "free" && ` (자유 연습: 준비 ${prepSec}초 · 답변 ${respSec}초)`}
              </p>
              <ul className="mt-5 space-y-2 text-sm leading-relaxed text-glacier-200">
                <li>· 준비 시간이 끝나면 신호음과 함께 답변 시간이 시작돼요.</li>
                <li>· {settings.autoRecord ? "답변 시간에 자동으로 녹음됩니다." : "답변 시간에 녹음 버튼을 눌러 녹음하세요."}</li>
                {(set.part === 3 || set.part === 4) && <li>· 질문은 브라우저 음성으로 읽어드려요{q.repeat ? " (Q10은 두 번)" : ""}. 설정에서 끌 수 있어요.</li>}
                <li>· 이 문제와 예시 답변은 SPEAK LAB이 작성한 연습용 예시입니다.</li>
              </ul>
              {rec.error && <MicNotice message={rec.error} />}
              <div className="mt-7 flex flex-wrap gap-3">
                <button type="button" className="btn btn-primary" onClick={begin}>
                  <Icon name="play" size={16} /> 시작하기
                </button>
                {rec.state === "idle" && (
                  <button type="button" className="btn" onClick={() => rec.prepare()}>
                    <Icon name="mic" size={18} /> 마이크 먼저 확인
                  </button>
                )}
                {rec.state === "ready" && <span className="chip self-center">마이크 준비됨</span>}
              </div>
            </div>
          ) : phase === "read" ? (
            <p className="text-sm text-graphite-300">자료를 읽고 내용을 파악하세요. 곧 질문이 시작됩니다.</p>
          ) : (
            showQuestionText && (
              <motion.div key={q.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                {q.scene && (
                  <div className="clay p-3">
                    <Scene id={q.scene} />
                  </div>
                )}
                <p
                  className={`text-glacier-100 ${
                    set.part === 1 ? "clay p-6 text-[1.28rem] leading-[1.75] sm:p-8 sm:text-[1.42rem]" : q.scene ? "mt-4 text-sm text-graphite-300" : "clay p-6 text-[1.35rem] font-bold leading-snug sm:p-8"
                  }`}
                >
                  {set.part === 4 && <span className="mb-2 block text-sm font-semibold text-graphite-300">{set.context.kind === "schedule" && qi === 0 ? set.context.intro : ""}</span>}
                  {q.prompt}
                </p>
              </motion.div>
            )
          )}
        </section>

        {/* Right: timer / recorder / review */}
        <section className="flex flex-col gap-5" aria-label="타이머와 녹음">
          {(phase === "read" || phase === "prep" || phase === "answer" || phase === "question") && (
            <div className="clay relative overflow-hidden p-6 sm:p-8">
              <p className="eyebrow !text-graphite-300" aria-live="polite">
                {phase === "read" ? "Reading time" : phase === "question" ? "Listen" : phase === "prep" ? "Preparation time" : "Response time"}
                {paused && " · 일시정지"}
              </p>
              <div className="mt-3 flex items-end justify-between gap-4">
                <motion.span
                  className="num block leading-[0.85] tracking-tighter"
                  style={{
                    fontSize: "clamp(5.5rem, 16vw, 9rem)",
                    fontVariationSettings: `"wght" ${phase === "question" ? 500 : weight}`,
                    color: urgent ? "var(--rec)" : phase === "prep" || phase === "read" ? "var(--glacier-300)" : "var(--glacier-100)",
                  }}
                  animate={urgent ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                  transition={urgent ? { duration: 1, repeat: Infinity } : {}}
                  aria-label={`${secLeft}초 남음`}
                >
                  {phase === "question" ? "—" : secLeft}
                </motion.span>
                {phase !== "question" && <span className="pb-3 text-sm font-bold text-graphite-300">/ {timerSec}s</span>}
              </div>
              <div className="track mt-6 !h-3.5" aria-hidden>
                <span
                  style={{
                    width: `${phase === "question" ? 100 : ratio * 100}%`,
                    background: urgent ? "var(--rec)" : "var(--glacier-200)",
                    transition: "background 300ms",
                  }}
                />
              </div>

              {phase === "answer" && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-graphite-300">
                    {rec.state === "recording" ? (
                      <>
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-rec" /> REC · 실시간 입력
                      </>
                    ) : rec.state === "paused" ? (
                      "녹음 일시정지"
                    ) : (
                      "녹음 꺼짐 · 타이머만 진행 중"
                    )}
                  </div>
                  <div className="clay-sunk mt-2 px-3 py-2">
                    <Waveform
                      analyser={rec.analyser}
                      active={rec.state === "recording"}
                      height={96}
                      color={urgent ? "#e0664f" : "#cfe3f5"}
                      onFrame={(rms, dt) => {
                        if (rms > VOICE_RMS) spoken.current += dt;
                      }}
                    />
                  </div>
                  {rec.error && <MicNotice message={rec.error} />}
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                {phase === "prep" && (
                  <button type="button" className="btn btn-primary" onClick={startAnswer}>
                    바로 답변 시작
                  </button>
                )}
                {phase === "answer" && rec.state !== "recording" && rec.state !== "paused" && rec.state !== "denied" && rec.state !== "unsupported" && (
                  <button type="button" className="btn btn-primary" onClick={() => rec.start()}>
                    <Icon name="mic" size={18} /> 녹음 시작
                  </button>
                )}
                {phase === "answer" && (
                  <button type="button" className="btn btn-primary" onClick={() => finishAnswer(true, remaining)}>
                    <Icon name="stop" size={14} /> 답변 종료
                  </button>
                )}
                {(phase === "prep" || phase === "answer" || phase === "read") && (
                  <button type="button" className="btn" onClick={togglePause} aria-pressed={paused}>
                    <Icon name={paused ? "play" : "pause"} size={16} /> {paused ? "계속" : "일시정지"}
                  </button>
                )}
                {phase === "read" && (
                  <button type="button" className="btn" onClick={() => setPhase("question")}>
                    읽기 완료
                  </button>
                )}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {phase === "review" && (
              <motion.div
                key={`review-${q.id}-${runKey}`}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className="clay p-6 sm:p-7"
              >
                {!attempt ? (
                  <p className="text-graphite-300" role="status">저장 중…</p>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <motion.span
                        className="grid h-9 w-9 place-items-center rounded-full bg-glacier-200 text-graphite-900"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 16 }}
                      >
                        <Icon name="check" size={18} />
                      </motion.span>
                      <p className="font-bold text-glacier-100">기록 저장됨</p>
                      <span className="chip">{attempt.completed ? "시간 끝까지 답변" : "시간 전에 종료"}</span>
                      <span className="chip num">발화 감지 {(attempt.spokenMs / 1000).toFixed(1)}초</span>
                    </div>

                    <div className="mt-5">
                      {lastBlob && lastBlob.size > 0 ? (
                        <AudioPlayer blob={lastBlob} />
                      ) : (
                        <p className="text-sm text-graphite-300">이번 답변은 녹음되지 않았어요.</p>
                      )}
                    </div>

                    <fieldset className="mt-6">
                      <legend className="text-sm font-semibold text-glacier-100">
                        자기 평가 <span className="font-semibold text-graphite-300">— 점수가 아니라 내가 느낀 정도</span>
                      </legend>
                      <div className="mt-3 grid grid-cols-5 gap-2">
                        {SELF.map((label, i) => (
                          <button
                            key={label}
                            type="button"
                            aria-pressed={attempt.selfRating === i + 1}
                            onClick={() => patchAttempt({ selfRating: i + 1 })}
                            className={`btn !min-h-[58px] flex-col !gap-0 !rounded-2xl !px-1 !text-[0.68rem] ${attempt.selfRating === i + 1 ? "!bg-glacier-200 !text-graphite-900" : ""}`}
                          >
                            <span className="text-lg font-bold">{i + 1}</span>
                            <span className="leading-tight">{label}</span>
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <label className="mt-5 block">
                      <span className="text-sm font-semibold text-glacier-100">내 답변 메모</span>
                      <textarea
                        className="field mt-2 min-h-[84px] resize-y"
                        placeholder="막힌 표현, 다음에 쓸 문장…"
                        defaultValue={attempt.note}
                        onBlur={(e) => e.target.value !== attempt.note && patchAttempt({ note: e.target.value })}
                      />
                    </label>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button type="button" className="btn" aria-pressed={attempt.flagged} onClick={() => patchAttempt({ flagged: !attempt.flagged })}>
                        <Icon name="flag" size={16} /> {attempt.flagged ? "어려운 문제로 표시됨" : "어려운 문제로 표시"}
                      </button>
                      <button type="button" className="btn" aria-expanded={showSample} onClick={() => setShowSample((v) => !v)}>
                        <Icon name="eye" size={16} /> {set.part === 1 ? "읽기 팁" : "예시 답변"}
                      </button>
                    </div>

                    <AnimatePresence>
                      {showSample && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="clay-sunk mt-4 p-5">
                            {q.sample && <p className="leading-relaxed text-glacier-100">{q.sample}</p>}
                            <p className="mt-3 text-sm text-glacier-300">💡 {q.tip}</p>
                            <p className="mt-3 text-[0.7rem] text-graphite-300">SPEAK LAB이 작성한 예시입니다. 공식 모범 답안이 아닙니다.</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="mt-7 flex flex-wrap gap-3 border-t border-white/5 pt-5">
                      <button type="button" className="btn" onClick={retry}>
                        <Icon name="retry" size={16} /> 다시 도전
                      </button>
                      <button type="button" className="btn btn-primary" onClick={next}>
                        {qi + 1 < set.questions.length ? "다음 문제" : "세트 마치기"} <Icon name="arrow" size={16} />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {phase === "finished" && (
              <motion.div key="finished" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="clay p-7 text-center">
                <motion.div
                  className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-glacier-200 text-graphite-900"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 14 }}
                >
                  <Icon name="check" size={30} />
                </motion.div>
                <p className="mt-4 text-2xl font-bold text-glacier-100">세트 완료</p>
                <p className="mt-2 text-sm text-graphite-300">답변 {savedIds.length}개가 기록에 저장되었어요. 오늘의 계획에 바로 반영됩니다.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button type="button" className="btn" onClick={() => { setQi(0); setSavedIds([]); setPhase("intro"); }}>
                    처음부터 다시
                  </button>
                  <button type="button" className="btn btn-primary" onClick={onExit}>
                    목록으로
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}

function MicNotice({ message }: { message: string }) {
  return (
    <p role="alert" className="clay-sunk mt-4 p-4 text-sm leading-relaxed text-glacier-200">
      <strong className="text-rec">마이크 사용 불가 · </strong>
      {message} 녹음 없이 타이머 훈련은 계속할 수 있어요.
    </p>
  );
}
