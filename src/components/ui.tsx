"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, type ReactNode } from "react";

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-1.5 text-[2rem] font-bold leading-[1.1] tracking-tight sm:text-[2.5rem]">{title}</h1>
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </header>
  );
}

export function Page({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`mx-auto w-full px-4 pt-6 sm:px-8 sm:pt-10 ${wide ? "max-w-6xl" : "max-w-5xl"}`}
    >
      {children}
    </motion.div>
  );
}

/** Number that rolls to its new value. */
export function RollingNumber({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `${v.toFixed(decimals)}${suffix}`);
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [mv, value]);
  return <motion.span className="num">{text}</motion.span>;
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="clay-sunk px-6 py-10 text-center">
      <p className="font-semibold">{title}</p>
      {children && <div className="mt-2 text-sm text-ink-muted">{children}</div>}
    </div>
  );
}

export function Badge({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <span className={`chip ${dark ? "chip-dark" : ""}`}>{children}</span>;
}

export function SourceTag({ origin }: { origin: "official" | "user" | "sample" }) {
  const label = origin === "official" ? "공개 강의" : origin === "user" ? "내가 등록" : "예시 · SPEAK LAB 작성";
  return <span className={`chip ${origin === "user" ? "chip-dark" : ""}`}>{label}</span>;
}
