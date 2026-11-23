"use client";

import { useEffect, useRef, useState } from "react";
import { LEVELS, PART_SPECS } from "@/content/exam";
import { Icon } from "@/components/Icon";
import { Page, PageHeader } from "@/components/ui";
import { VoicePicker } from "@/components/VoicePicker";
import { DatePicker } from "@/components/DatePicker";
import { beep } from "@/lib/audio/sound";
import { useData } from "@/lib/data/store";
import { PARTS, type ExportBundle, type Settings } from "@/lib/types";

export default function SettingsPage() {
  const { data, actions } = useData();
  const [msg, setMsg] = useState<string | null>(null);
  const [storage, setStorage] = useState<{ usage: number; quota: number; persisted: boolean } | null>(null);
  const [withAudio, setWithAudio] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function refreshStorage() {
    if (!navigator.storage?.estimate) return;
    const e = await navigator.storage.estimate();
    const persisted = (await navigator.storage.persisted?.()) ?? false;
    setStorage({ usage: e.usage ?? 0, quota: e.quota ?? 0, persisted });
  }
  const attemptCount = data?.attempts.length;
  useEffect(() => {
    if (!navigator.storage?.estimate) return;
    Promise.all([navigator.storage.estimate(), navigator.storage.persisted?.() ?? Promise.resolve(false)]).then(([e, persisted]) =>
      setStorage({ usage: e.usage ?? 0, quota: e.quota ?? 0, persisted }),
    );
  }, [attemptCount]);

  if (!data) return null;
  const s = data.settings;
  const set = (p: Partial<Settings>) => actions.updateSettings(p);
  const mb = (n: number) => `${(n / 1024 / 1024).toFixed(1)}MB`;
  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 3500);
  };

  async function doExport() {
    const bundle = await actions.exportData(withAudio);
    const blob = new Blob([JSON.stringify(bundle)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `speak-lab-${new Date().toISOString().slice(0, 10)}${withAudio ? "-with-audio" : ""}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    flash(`내보내기 완료 (${mb(blob.size)})`);
  }

  async function doImport(file: File) {
    try {
      const bundle = JSON.parse(await file.text()) as ExportBundle;
      if (!confirm("가져오면 현재 브라우저의 학습 기록이 파일 내용으로 교체됩니다. 계속할까요?")) return;
      await actions.importData(bundle);
      flash("가져오기 완료");
    } catch (e) {
      flash(e instanceof Error ? `가져오기 실패: ${e.message}` : "가져오기 실패");
    }
  }

  return (
    <Page>
      <PageHeader eyebrow="Settings" title="맞춤 설정" />
      {msg && (
        <p role="status" className="clay-graphite fixed inset-x-4 bottom-28 z-50 mx-auto max-w-sm p-4 text-center text-sm font-bold md:bottom-8">
          {msg}
        </p>
      )}

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="clay p-6" aria-labelledby="goal-h">
          <h2 id="goal-h" className="text-lg font-bold">목표와 계획</h2>
          <p className="mt-4 text-sm font-semibold">목표 레벨</p>
          <div className="mt-2 grid grid-cols-5 gap-2">
            {LEVELS.map((l) => (
              <button key={l.level} type="button" aria-pressed={s.targetLevel === l.level} onClick={() => set({ targetLevel: l.level })} className={`btn !min-h-[56px] flex-col !gap-0 !rounded-2xl !px-1 ${s.targetLevel === l.level ? "!bg-graphite-900 !text-glacier-50" : ""}`}>
                <span className="font-bold">Lv{l.level}</span>
                <span className="num text-[0.6rem] opacity-70">{l.range}</span>
              </button>
            ))}
          </div>
          <div className="mt-5">
            <span className="text-sm font-semibold">시험 예정일</span>
            <div className="mt-2">
              <DatePicker value={s.examDate} onChange={(v) => set({ examDate: v })} label="시험 예정일" />
            </div>
          </div>
          <label className="mt-5 block">
            <span className="text-sm font-semibold">
              하루 학습 가능 시간 <span className="num text-glacier-600">{s.dailyMinutes}분</span>
            </span>
            <input type="range" min={10} max={90} step={5} value={s.dailyMinutes} onChange={(e) => set({ dailyMinutes: Number(e.target.value) })} className="mt-3 w-full accent-[#1c1d1f]" />
          </label>
          <p className="mt-5 text-sm font-semibold">집중 훈련 파트</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {PARTS.map((p) => {
              const on = s.focusParts.includes(p);
              return (
                <button key={p} type="button" aria-pressed={on} onClick={() => set({ focusParts: on ? s.focusParts.filter((x) => x !== p) : [...s.focusParts, p] })} className={`btn !min-h-[40px] !text-sm ${on ? "!bg-graphite-900 !text-glacier-50" : ""}`}>
                  Part {p} <span className="text-xs opacity-70">{PART_SPECS[p].nameKo}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="btn btn-primary mt-6"
            onClick={async () => {
              await actions.regeneratePlan();
              flash("오늘의 계획을 새 설정으로 다시 만들었어요.");
            }}
          >
            <Icon name="retry" size={16} /> 오늘 계획 다시 만들기
          </button>
        </section>

        <section className="clay p-6" aria-labelledby="train-h">
          <h2 id="train-h" className="text-lg font-bold">훈련 환경</h2>
          <ul className="mt-4 grid gap-3">
            <Toggle label="타이머 알림음" desc="답변 시작·종료 신호음" on={s.timerSound} set={(v) => { set({ timerSound: v }); if (v) beep(); }} />
            <Toggle label="자동 녹음" desc="답변 시간이 시작되면 바로 녹음" on={s.autoRecord} set={(v) => set({ autoRecord: v })} />
            <Toggle label="질문 읽어주기" desc="Part 3·4 질문을 브라우저 음성으로 재생" on={s.speakQuestions} set={(v) => set({ speakQuestions: v })} />
          </ul>
          <div className="mt-4">
            <VoicePicker settings={s} onChange={set} />
          </div>
          <button type="button" className="btn btn-ghost mt-4 !text-sm" onClick={() => set({ onboarded: false })}>
            온보딩 다시 보기
          </button>
        </section>

        <section className="clay p-6 lg:col-span-2" aria-labelledby="data-h">
          <h2 id="data-h" className="text-lg font-bold">학습 데이터</h2>
          <div className="clay-sunk mt-4 p-4 text-sm leading-relaxed text-ink-muted">
            모든 기록과 녹음은 <strong className="text-ink">이 브라우저(IndexedDB)에만</strong> 저장되고 서버로 전송되지 않습니다. 브라우저 데이터 삭제, 시크릿 모드 종료, 저장공간 부족 시
            브라우저가 데이터를 지울 수 있어요 (특히 iOS Safari는 오래 방문하지 않으면 삭제할 수 있음). 정기적으로 내보내기 파일을 보관하세요.
            {storage && (
              <span className="mt-2 block num">
                사용 중 {mb(storage.usage)} / 할당 {storage.quota ? mb(storage.quota) : "알 수 없음"} · 영구 저장 {storage.persisted ? "허용됨" : "미허용"}
                {!storage.persisted && navigator.storage?.persist && (
                  <button
                    type="button"
                    className="ml-2 font-bold text-glacier-700 underline underline-offset-2"
                    onClick={async () => {
                      const ok = await navigator.storage.persist();
                      flash(ok ? "영구 저장이 허용됐어요." : "브라우저가 영구 저장 요청을 거절했어요.");
                      refreshStorage();
                    }}
                  >
                    영구 저장 요청
                  </button>
                )}
              </span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="button" className="btn btn-primary" onClick={doExport}>
              JSON 내보내기
            </button>
            <label className="flex items-center gap-2 text-sm font-bold">
              <input type="checkbox" checked={withAudio} onChange={(e) => setWithAudio(e.target.checked)} className="h-4 w-4 accent-[#1c1d1f]" />
              녹음 포함 (용량 큼)
            </label>
            <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
              가져오기
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) doImport(f);
                e.target.value = "";
              }}
            />
          </div>

          <div className="mt-8 border-t border-glacier-300/50 pt-6">
            <p className="font-bold text-rec">모든 학습 데이터 삭제</p>
            <p className="mt-1 text-sm text-ink-muted">문장, 자료 메모, 답변 기록, 녹음, 설정이 모두 영구 삭제됩니다. 되돌릴 수 없어요. 확인을 위해 ‘삭제’를 입력하세요.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <input className="field !w-40" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} aria-label="삭제 확인 입력" placeholder="삭제" />
              <button
                type="button"
                className="btn !bg-rec !text-white"
                disabled={confirmText !== "삭제"}
                onClick={async () => {
                  await actions.clearAll();
                  window.location.assign(window.location.origin);
                }}
              >
                <Icon name="trash" size={16} /> 영구 삭제
              </button>
            </div>
          </div>
        </section>
      </div>
    </Page>
  );
}

function Toggle({ label, desc, on, set }: { label: string; desc: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <li>
      <button type="button" role="switch" aria-checked={on} onClick={() => set(!on)} className="clay-sm flex w-full items-center justify-between gap-4 p-4 text-left">
        <span>
          <span className="block font-semibold">{label}</span>
          <span className="text-xs text-ink-muted">{desc}</span>
        </span>
        <span className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${on ? "bg-graphite-900" : "bg-sunk"}`} style={{ boxShadow: "inset 3px 3px 6px rgba(0,0,0,.18), inset -2px -2px 4px rgba(255,255,255,.6)" }}>
          <span className={`absolute top-1 h-6 w-6 rounded-full bg-glacier-50 shadow-md transition-all ${on ? "left-7" : "left-1"}`} />
        </span>
      </button>
    </li>
  );
}
