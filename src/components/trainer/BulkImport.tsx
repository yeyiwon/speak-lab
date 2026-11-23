"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { useData } from "@/lib/data/store";
import { PARTS, type PartNo } from "@/lib/types";

/**
 * Paste many of YOUR OWN sentences at once (from notes you took while watching a lecture,
 * or a free PDF you downloaded yourself). Accepted formats, one item per line:
 *   English | 한국어      English<TAB>한국어      or alternating lines (English, then 한국어)
 */
export function parseBulk(text: string): { en: string; ko: string }[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const out: { en: string; ko: string }[] = [];
  const hasKo = (s: string) => /[가-힣]/.test(s);
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].replace(/^\s*(\d+[.)]|[-•·])\s*/, "");
    const split = l.split(/\s*[|\t]\s*/);
    if (split.length >= 2 && split[0] && split[1]) {
      out.push({ en: split[0], ko: split.slice(1).join(" ") });
    } else if (!hasKo(l) && lines[i + 1] && hasKo(lines[i + 1])) {
      out.push({ en: l, ko: lines[i + 1].replace(/^\s*(\d+[.)]|[-•·])\s*/, "") });
      i++;
    } else if (!hasKo(l)) {
      out.push({ en: l, ko: "" });
    }
  }
  return out.filter((x) => /[a-zA-Z]/.test(x.en));
}

export function BulkImport({ onClose }: { onClose: () => void }) {
  const { actions } = useData();
  const [text, setText] = useState("");
  const [part, setPart] = useState<PartNo | "all">("all");
  const [busy, setBusy] = useState(false);
  const items = useMemo(() => parseBulk(text), [text]);

  async function save() {
    setBusy(true);
    for (const it of items) await actions.addSentence({ en: it.en, ko: it.ko || "(뜻 미입력)", part, keywords: [] });
    onClose();
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-graphite-900/30 p-3 sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div role="dialog" aria-modal="true" aria-label="여러 문장 붙여넣기" className="clay max-h-[92dvh] w-full max-w-2xl overflow-y-auto p-6 sm:p-7" initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }} onClick={(e) => e.stopPropagation()}>
        <p className="text-xl font-bold">내 문장 한 번에 등록</p>
        <p className="mt-1 text-sm text-ink-muted">
          강의를 보며 정리한 노트, 직접 받은 무료 PDF에서 공부할 문장을 붙여넣으세요. 이 브라우저에만 저장되는 개인 학습용입니다.
        </p>
        <div className="clay-sunk mt-4 p-3 font-mono text-xs leading-relaxed text-ink-muted">
          I usually go there on weekends. | 저는 보통 주말에 거기 가요.
          <br />
          또는 영어 한 줄, 다음 줄에 한국어 — 엑셀에서 복사한 두 칸(탭)도 OK
        </div>
        <textarea autoFocus className="field mt-4 min-h-[200px] resize-y font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} aria-label="붙여넣을 문장" />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold">
            파트
            <select className="field !w-auto !min-h-[40px] !py-1.5" value={String(part)} onChange={(e) => setPart(e.target.value === "all" ? "all" : (Number(e.target.value) as PartNo))}>
              <option value="all">공통</option>
              {PARTS.map((p) => (
                <option key={p} value={p}>Part {p}</option>
              ))}
            </select>
          </label>
          <span className="text-sm text-ink-muted">
            인식된 문장 <strong className="num text-ink">{items.length}</strong>개{items.some((x) => !x.ko) && " · 일부는 한국어 뜻 없음"}
          </span>
        </div>
        {items.length > 0 && (
          <ul className="panel mt-4 max-h-56 overflow-y-auto text-sm">
            {items.slice(0, 50).map((it, i) => (
              <li key={i} className="px-4 py-2.5">
                <p className="font-semibold">{it.en}</p>
                <p className="text-xs text-ink-muted">{it.ko || "—"}</p>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="btn btn-ghost" onClick={onClose}>취소</button>
          <button type="button" className="btn btn-primary" disabled={!items.length || busy} onClick={save}>
            {items.length}문장 등록
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
