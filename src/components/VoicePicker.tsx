"use client";

import { useEffect, useState } from "react";
import { Select } from "./Select";
import { canSpeak, loadVoices, rankVoices, speak, voiceQualityLabel } from "@/lib/audio/sound";
import type { Settings } from "@/lib/types";
import { Icon } from "./Icon";

const SAMPLE = "This is how the sentences you add yourself will sound.";

export function VoicePicker({ settings, onChange }: { settings: Settings; onChange: (p: Partial<Settings>) => void }) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[] | null>(null);

  useEffect(() => {
    loadVoices().then((v) => setVoices(rankVoices(v)));
  }, []);

  if (!canSpeak()) return <p className="text-sm text-ink-muted">이 브라우저는 음성 합성을 지원하지 않아요.</p>;
  const rate = settings.speechRate ?? 1;
  const best = voices?.[0];
  const current = voices?.find((v) => v.voiceURI === settings.voiceURI) ?? best;
  const hasHQ = voices?.some((v) => voiceQualityLabel(v) === "고품질");

  return (
    <div className="clay-sm p-4">
      <p className="font-semibold">원어민 음성</p>
      <p className="text-xs text-ink-muted">
        기본 제공 문장·문제·예시 답변은 뉴럴 TTS(Kokoro)로 미리 녹음한 미국 영어 음성으로 재생돼요. 아래 음성은 <strong className="text-ink">직접 등록한 문장</strong>에만 쓰입니다.
      </p>
      {voices === null ? (
        <p className="mt-3 text-sm text-ink-muted">음성 목록 불러오는 중…</p>
      ) : voices.length === 0 ? (
        <p className="mt-3 text-sm text-ink-muted">설치된 영어 음성이 없어요.</p>
      ) : (
        <>
          <div className="mt-3 flex gap-2">
            <Select size="sm" label="음성 선택" value={settings.voiceURI ?? ""} onChange={(v) => onChange({ voiceURI: v || null })} options={[{ value: "", label: `자동 (추천: ${best?.name ?? "—"})` }, ...voices.map((v) => ({ value: v.voiceURI, label: `${v.name} · ${v.lang}`, hint: voiceQualityLabel(v) }))]} />
            <button type="button" className="btn shrink-0" onClick={() => speak(SAMPLE, { voiceURI: current?.voiceURI, rate })} aria-label="선택한 음성 미리 듣기">
              <Icon name="speaker" size={18} /> 듣기
            </button>
          </div>
          <label className="mt-4 block">
            <span className="flex justify-between text-sm font-semibold">
              말하기 속도 <span className="num text-glacier-600">{rate.toFixed(2)}×</span>
            </span>
            <input type="range" min={0.7} max={1.2} step={0.05} value={rate} onChange={(e) => onChange({ speechRate: Number(e.target.value) })} className="mt-2 w-full accent-[#1c1d1f]" />
          </label>
        </>
      )}
      {voices && !hasHQ && (
        <p className="clay-sunk mt-4 p-3 text-xs leading-relaxed text-ink-muted">
          지금 기기에는 고품질 영어 음성이 없어 기계음처럼 들릴 수 있어요. <strong className="text-ink">Mac</strong>: 시스템 설정 → 손쉬운 사용 → 읽기 및 말하기 → 시스템 음성 → 음성 관리 → 영어(미국)
          ‘Ava (프리미엄)’ 또는 ‘Zoe (프리미엄)’ 다운로드. <strong className="text-ink">Windows</strong>: Edge에서 ‘Microsoft Aria/Jenny Online (Natural)’ 음성이 기본 제공돼요.
          <strong className="text-ink"> Chrome</strong>은 ‘Google US English’를 제공합니다. 설치 후 이 페이지를 새로고침하세요.
        </p>
      )}
      <p className="mt-3 text-[0.7rem] text-ink-muted">실제 시험은 사람 성우 녹음입니다. 브라우저 음성은 질문 듣기 연습용 보조 수단이에요.</p>
    </div>
  );
}
