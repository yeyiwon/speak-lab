"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Icon } from "@/components/Icon";
import { useData } from "@/lib/data/store";
import { PARTS, type PartNo, type Sentence } from "@/lib/types";

export function SentenceEditor({ initial, onClose, materialId }: { initial: Sentence | null; onClose: () => void; materialId?: string }) {
  const { data, actions } = useData();
  const [en, setEn] = useState(initial?.en ?? "");
  const [ko, setKo] = useState(initial?.ko ?? "");
  const [part, setPart] = useState<PartNo | "all">(initial?.part ?? "all");
  const [kw, setKw] = useState(initial?.keywords.join(", ") ?? "");
  const [mat, setMat] = useState(initial?.materialId ?? materialId ?? "");
  const [err, setErr] = useState("");

  async function save() {
    if (!en.trim() || !ko.trim()) {
      setErr("영어 문장과 한국어 뜻을 모두 입력하세요.");
      return;
    }
    const keywords = kw.split(",").map((k) => k.trim()).filter(Boolean);
    const missing = keywords.filter((k) => !en.toLowerCase().includes(k.toLowerCase()));
    if (missing.length) {
      setErr(`핵심 단어가 문장에 없어요: ${missing.join(", ")}`);
      return;
    }
    if (initial) await actions.saveSentence({ ...initial, en: en.trim(), ko: ko.trim(), part, keywords, materialId: mat || undefined });
    else await actions.addSentence({ en: en.trim(), ko: ko.trim(), part, keywords, materialId: mat || undefined });
    onClose();
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-graphite-900/30 p-3 sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.form
        role="dialog"
        aria-modal="true"
        aria-label={initial ? "문장 편집" : "문장 등록"}
        className="clay max-h-[92dvh] w-full max-w-lg overflow-y-auto p-6 sm:p-7"
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        exit={{ y: 30 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <p className="text-xl font-bold">{initial ? "문장 편집" : "내 만능문장 등록"}</p>
        <p className="mt-1 text-xs text-ink-muted">직접 정리한 문장만 등록하세요. 교재 전체를 옮겨 적는 용도가 아닙니다.</p>
        <label className="mt-5 block">
          <span className="text-sm font-semibold">영어 문장</span>
          <textarea autoFocus className="field mt-2 min-h-[80px]" value={en} onChange={(e) => setEn(e.target.value)} />
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-semibold">한국어 뜻 (힌트)</span>
          <input className="field mt-2" value={ko} onChange={(e) => setKo(e.target.value)} />
        </label>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-semibold">파트</span>
            <select className="field mt-2" value={String(part)} onChange={(e) => setPart(e.target.value === "all" ? "all" : (Number(e.target.value) as PartNo))}>
              <option value="all">공통</option>
              {PARTS.map((p) => (
                <option key={p} value={p}>Part {p}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold">연결 자료</span>
            <select className="field mt-2" value={mat} onChange={(e) => setMat(e.target.value)}>
              <option value="">없음</option>
              {data?.materials.map((m) => (
                <option key={m.id} value={m.id}>{m.title.slice(0, 30)}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="mt-4 block">
          <span className="text-sm font-semibold">빈칸 핵심 단어 <span className="font-semibold text-ink-muted">(쉼표로 구분)</span></span>
          <input className="field mt-2" value={kw} placeholder="main reason, relieve" onChange={(e) => setKw(e.target.value)} />
        </label>
        {err && <p role="alert" className="mt-3 text-sm font-bold text-rec">{err}</p>}
        <div className="mt-6 flex flex-wrap justify-between gap-3">
          {initial ? (
            <button
              type="button"
              className="btn btn-ghost text-rec"
              onClick={async () => {
                if (confirm("이 문장과 복습 일정을 삭제할까요?")) {
                  await actions.removeSentence(initial.id);
                  onClose();
                }
              }}
            >
              <Icon name="trash" size={16} /> 삭제
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-3">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn btn-primary">
              저장
            </button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}
