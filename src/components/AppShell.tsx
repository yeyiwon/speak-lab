"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { useData } from "@/lib/data/store";
import { Icon, type IconName } from "./Icon";
import { Onboarding } from "./Onboarding";

const NAV: { href: string; label: string; en: string; icon: IconName }[] = [
  { href: "/", label: "오늘", en: "Today", icon: "today" },
  { href: "/library", label: "자료", en: "Library", icon: "library" },
  { href: "/sentences", label: "문장", en: "Sentences", icon: "cards" },
  { href: "/studio", label: "실전", en: "Studio", icon: "mic" },
  { href: "/review", label: "복습", en: "Review", icon: "review" },
  { href: "/progress", label: "기록", en: "Progress", icon: "chart" },
  { href: "/settings", label: "설정", en: "Settings", icon: "settings" },
];

const FocusCtx = createContext<(on: boolean) => void>(() => {});
/** Hide all chrome while the learner is speaking. */
export const useFocusMode = () => useContext(FocusCtx);

export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [focus, setFocus] = useState(false);
  const { ready, error, data } = useData();
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <FocusCtx.Provider value={setFocus}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 btn">
        본문으로 건너뛰기
      </a>
      <div className="liquid-bg" aria-hidden>
        <i />
        <i />
        <i />
      </div>
      <div className="min-h-dvh md:grid md:grid-cols-[232px_1fr]">
        {!focus && (
          <aside className="hidden md:block">
            <div className="sticky top-0 flex h-dvh flex-col gap-6 p-5">
              <Link href="/" className="flex items-center gap-3 px-2 pt-2">
                <span className="clay-graphite grid h-11 w-11 place-items-center !rounded-2xl">
                  <Icon name="mic" size={20} />
                </span>
                <span className="leading-none">
                  <span className="block text-[1.05rem] font-bold tracking-tight">SPEAK LAB</span>
                  <span className="text-[0.7rem] font-bold text-ink-muted">토익스피킹 데일리 트레이닝</span>
                </span>
              </Link>
              <nav aria-label="주요 메뉴" className="flex flex-col gap-0.5">
                {NAV.map((n) => {
                  const active = isActive(n.href);
                  return (
                    <Link
                      key={n.href}
                      href={n.href}
                      aria-current={active ? "page" : undefined}
                      className="relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-[0.95rem] font-bold"
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-2xl bg-glacier-50"
                          style={{ boxShadow: "var(--clay-sm)" }}
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span className="relative flex items-center gap-3">
                        <Icon name={n.icon} size={19} />
                        {n.label}
                        <span className="text-[0.68rem] font-semibold text-ink-muted">{n.en}</span>
                      </span>
                    </Link>
                  );
                })}
              </nav>
              <p className="mt-auto px-2 text-[0.7rem] leading-relaxed text-ink-muted">
                개인 학습 도구입니다. 시계토끼 · ETS · YBM과 제휴되지 않은 비공식 서비스입니다.
              </p>
            </div>
          </aside>
        )}

        <main id="main" className={focus ? "min-h-dvh md:col-span-2" : "min-h-dvh pb-32 md:pb-10"}>
          {error ? (
            <div className="mx-auto max-w-lg p-8">
              <div className="clay p-6">
                <h1 className="text-xl font-bold">저장소를 열 수 없어요</h1>
                <p className="mt-2 text-ink-muted">{error}</p>
                <p className="mt-2 text-sm text-ink-muted">시크릿 모드나 저장공간 차단 설정에서는 학습 기록이 저장되지 않을 수 있습니다.</p>
              </div>
            </div>
          ) : (
            <>
              {!ready && (
                <div className="grid min-h-[60dvh] place-items-center" role="status" aria-live="polite">
                  <div className="clay-sm flex items-center gap-3 px-5 py-3 text-sm font-bold">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-graphite-900" />
                    학습 기록 불러오는 중
                  </div>
                </div>
              )}
              {/* Pages render nothing until local data is loaded; keeping them mounted lets Next validate navigation. */}
              {children}
            </>
          )}
        </main>
      </div>

      {!focus && (
        <nav
          aria-label="주요 메뉴"
          className="fixed inset-x-3 bottom-3 z-40 md:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="glass flex items-center justify-between gap-1 rounded-[30px] p-1.5">
            {NAV.filter((n) => n.href !== "/settings").map((n) => {
              const active = isActive(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={active ? "page" : undefined}
                  className="relative flex min-h-[52px] flex-1 flex-col items-center justify-center rounded-[24px] text-[0.66rem] font-bold"
                >
                  {active && (
                    <motion.span
                      layoutId="dock-pill"
                      className="absolute inset-0 rounded-[24px] bg-graphite-900"
                      style={{ boxShadow: "inset 2px 2px 4px rgba(255,255,255,.12), inset -3px -3px 6px rgba(0,0,0,.5)" }}
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className={`relative flex flex-col items-center gap-0.5 ${active ? "text-lime" : ""}`}>
                    <Icon name={n.icon} size={20} />
                    {n.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {ready && data && !data.settings.onboarded && <Onboarding />}
    </FocusCtx.Provider>
  );
}
