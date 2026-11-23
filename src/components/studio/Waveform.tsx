"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Live input meter: each frame takes the RMS of the analyser's time-domain
 * signal and pushes it into a scrolling bar strip. Bars only move when the mic
 * actually picks up sound. `onFrame` lets the parent measure voiced time.
 */
export function Waveform({
  analyser,
  active,
  onFrame,
  height = 120,
  color = "#cfe3f5",
  idleColor = "#42464b",
}: {
  analyser: RefObject<AnalyserNode | null>;
  active: boolean;
  onFrame?: (rms: number, dtMs: number) => void;
  height?: number;
  color?: string;
  idleColor?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bars = useRef<number[]>([]);
  const onFrameRef = useRef(onFrame);
  useEffect(() => {
    onFrameRef.current = onFrame;
  });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const g = canvas.getContext("2d")!;
    let raf = 0;
    let last = performance.now();
    let buf: Float32Array<ArrayBuffer> | null = null;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = height * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = (now: number) => {
      const dt = now - last;
      last = now;
      const w = canvas.clientWidth;
      const gap = 3;
      const bw = 4;
      const count = Math.floor(w / (bw + gap));

      let rms = 0;
      const a = analyser.current;
      if (a && active) {
        if (!buf || buf.length !== a.fftSize) buf = new Float32Array(a.fftSize);
        a.getFloatTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
        rms = Math.sqrt(sum / buf.length);
        onFrameRef.current?.(rms, dt);
      }
      // Perceptual scaling: quiet speech (~0.02 RMS) should still be visible.
      const level = active ? Math.min(1, Math.pow(rms * 7, 0.7)) : 0;
      bars.current.push(level);
      if (bars.current.length > count) bars.current.splice(0, bars.current.length - count);

      g.clearRect(0, 0, w, height);
      const mid = height / 2;
      const start = w - bars.current.length * (bw + gap);
      for (let i = 0; i < bars.current.length; i++) {
        const v = bars.current[i];
        const h = Math.max(4, v * (height - 8));
        const x = start + i * (bw + gap);
        const age = i / bars.current.length;
        g.globalAlpha = 0.25 + age * 0.75;
        g.fillStyle = v > 0.04 ? color : idleColor;
        g.beginPath();
        g.roundRect(x, mid - h / 2, bw, h, 2);
        g.fill();
      }
      g.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [analyser, active, height, color, idleColor]);

  return <canvas ref={canvasRef} style={{ width: "100%", height }} role="img" aria-label={active ? "실시간 마이크 입력 레벨" : "마이크 입력 대기"} />;
}
