"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Drift-free countdown driven by performance.now(). Pausable.
 * Changing `key` restarts it from `totalSec`.
 */
export function useCountdown(totalSec: number, running: boolean, onDone: () => void, key: string) {
  const [tick, setTick] = useState<{ key: string; ms: number } | null>(null);
  const elapsed = useRef<{ key: string; ms: number; fired: boolean }>({ key: "", ms: 0, fired: false });
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  });

  useEffect(() => {
    if (elapsed.current.key !== key) elapsed.current = { key, ms: 0, fired: false };
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const e = elapsed.current;
      e.ms += now - last;
      last = now;
      const left = Math.max(0, totalSec * 1000 - e.ms);
      setTick({ key, ms: left });
      if (left <= 0) {
        if (!e.fired) {
          e.fired = true;
          doneRef.current();
        }
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, totalSec, key]);

  return tick && tick.key === key ? tick.ms : totalSec * 1000;
}
