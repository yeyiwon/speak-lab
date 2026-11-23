"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { addDays, diffDays, parseISODate, toISODate, today } from "@/lib/date";
import { Icon } from "./Icon";

const WEEK = ["일", "월", "화", "수", "목", "금", "토"];

/**
 * Exam-date picker: clay trigger + liquid-glass calendar popover.
 * Keyboard: arrows move by day/week, PageUp/PageDown by month, Enter selects, Esc closes.
 */
export function DatePicker({
  value,
  onChange,
  label = "날짜 선택",
  minToday = true,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  label?: string;
  minToday?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => (value ? parseISODate(value) : new Date()));
  const [focus, setFocus] = useState<string>(() => value ?? today());
  const wrap = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const t = today();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focus}"]`)?.focus();
  }, [open, focus]);

  const y = view.getFullYear();
  const m = view.getMonth();
  const first = new Date(y, m, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array.from({ length: startPad }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => toISODate(new Date(y, m, i + 1))),
  ];
  while (cells.length % 7) cells.push(null);

  const disabled = (d: string) => minToday && d < t;
  const pick = (d: string) => {
    if (disabled(d)) return;
    onChange(d);
    setOpen(false);
  };
  const moveFocus = (d: string) => {
    setFocus(d);
    const nd = parseISODate(d);
    if (nd.getMonth() !== m || nd.getFullYear() !== y) setView(new Date(nd.getFullYear(), nd.getMonth(), 1));
  };
  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (map[e.key] !== undefined) {
      e.preventDefault();
      moveFocus(addDays(focus, map[e.key]));
    } else if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      const nd = parseISODate(focus);
      nd.setMonth(nd.getMonth() + (e.key === "PageUp" ? -1 : 1));
      moveFocus(toISODate(nd));
    } else if (e.key === "Escape") setOpen(false);
  };

  const dday = value ? diffDays(t, value) : null;
  const display = value
    ? `${parseISODate(value).getFullYear()}. ${parseISODate(value).getMonth() + 1}. ${parseISODate(value).getDate()} (${WEEK[parseISODate(value).getDay()]})`
    : "날짜를 정하지 않았어요";

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        className="field flex items-center justify-between gap-3 text-left"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          setOpen((o) => !o);
          setView(value ? parseISODate(value) : new Date());
          setFocus(value ?? t);
        }}
      >
        <span className={value ? "font-semibold" : "text-ink-muted"}>{display}</span>
        <span className="flex items-center gap-2">
          {dday !== null && <span className="chip chip-lime num">{dday > 0 ? `D-${dday}` : dday === 0 ? "D-Day" : `D+${-dday}`}</span>}
          <Icon name="calendar" size={17} className="text-ink-muted" />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={id}
            role="dialog"
            aria-label={label}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="glass absolute left-0 right-0 z-50 mt-2 rounded-[24px] p-4 sm:right-auto sm:w-[340px]"
          >
            <div className="flex items-center justify-between">
              <button type="button" className="icon-btn" aria-label="이전 달" onClick={() => setView(new Date(y, m - 1, 1))}>
                <Icon name="back" size={16} />
              </button>
              <p className="num font-semibold" aria-live="polite">
                {y}년 {m + 1}월
              </p>
              <button type="button" className="icon-btn" aria-label="다음 달" onClick={() => setView(new Date(y, m + 1, 1))}>
                <Icon name="arrow" size={16} />
              </button>
            </div>

            <div className="mt-2 grid grid-cols-7 text-center text-[0.7rem] font-semibold text-ink-muted">
              {WEEK.map((w, i) => (
                <span key={w} className={`py-1.5 ${i === 0 ? "text-rec/80" : ""}`}>
                  {w}
                </span>
              ))}
            </div>
            <div ref={gridRef} role="grid" className="grid grid-cols-7 gap-1" onKeyDown={onKey}>
              {cells.map((d, i) =>
                d ? (
                  <button
                    key={d}
                    type="button"
                    data-date={d}
                    tabIndex={d === focus ? 0 : -1}
                    disabled={disabled(d)}
                    aria-pressed={d === value}
                    aria-label={d}
                    onClick={() => pick(d)}
                    className={`num relative grid aspect-square place-items-center rounded-xl text-sm transition ${
                      d === value
                        ? "bg-graphite-900 font-semibold text-lime"
                        : d === t
                          ? "font-semibold ring-[1.5px] ring-inset ring-glacier-600"
                          : "hover:bg-white/70"
                    } ${disabled(d) ? "opacity-25" : ""} ${i % 7 === 0 && d !== value ? "text-rec/90" : ""}`}
                  >
                    {Number(d.slice(8))}
                  </button>
                ) : (
                  <span key={`p${i}`} />
                ),
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5 border-t border-white/60 pt-3">
              {[14, 28, 56].map((n) => (
                <button key={n} type="button" className="chip !cursor-pointer !py-1.5 hover:!bg-white" onClick={() => pick(addDays(t, n))}>
                  +{n / 7}주
                </button>
              ))}
              {value && (
                <button
                  type="button"
                  className="chip ml-auto !cursor-pointer !bg-transparent !py-1.5 text-ink-muted"
                  onClick={() => {
                    onChange(null);
                    setOpen(false);
                  }}
                >
                  지우기
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
