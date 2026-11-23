"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type RecState = "idle" | "requesting" | "ready" | "recording" | "paused" | "stopped" | "denied" | "unsupported" | "error";

export interface RecResult {
  blob: Blob;
  mime: string;
  durationMs: number;
}

function pickMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const prefs = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4;codecs=mp4a.40.2", "audio/mp4", "audio/ogg;codecs=opus"];
  return prefs.find((m) => MediaRecorder.isTypeSupported?.(m)) ?? "";
}

/**
 * Real microphone recording via MediaRecorder + a live AnalyserNode for level metering.
 * The analyser is exposed so the waveform reads actual input, not a decorative loop.
 */
export function useRecorder() {
  const [state, setState] = useState<RecState>("idle");
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const startedAt = useRef(0);
  const pausedTotal = useRef(0);
  const pausedAt = useRef(0);
  const resolveStop = useRef<((r: RecResult | null) => void) | null>(null);

  const supported =
    typeof window !== "undefined" && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== "undefined";

  /** Ask for the mic once; keeps the stream open for the session so retries are instant. */
  const prepare = useCallback(async (): Promise<boolean> => {
    if (streamRef.current) return true;
    if (!supported) {
      setState("unsupported");
      setError(
        window.isSecureContext === false
          ? "마이크는 HTTPS 또는 localhost에서만 사용할 수 있어요."
          : "이 브라우저는 녹음(MediaRecorder)을 지원하지 않아요.",
      );
      return false;
    }
    setState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.6;
      src.connect(analyser);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      setError(null);
      setState("ready");
      return true;
    } catch (e) {
      const name = e instanceof DOMException ? e.name : "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        setState("denied");
        setError("마이크 권한이 거부되었어요. 주소창의 자물쇠 아이콘에서 마이크를 ‘허용’으로 바꾼 뒤 다시 시도하세요.");
      } else if (name === "NotFoundError" || name === "OverconstrainedError") {
        setState("error");
        setError("연결된 마이크를 찾지 못했어요.");
      } else if (name === "NotReadableError") {
        setState("error");
        setError("다른 앱이 마이크를 사용 중이에요.");
      } else {
        setState("error");
        setError("마이크를 시작하지 못했어요.");
      }
      return false;
    }
  }, [supported]);

  const start = useCallback(async () => {
    if (!(await prepare())) return false;
    await ctxRef.current?.resume();
    const mime = pickMime();
    const rec = new MediaRecorder(streamRef.current!, mime ? { mimeType: mime } : undefined);
    chunks.current = [];
    rec.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
    rec.onstop = () => {
      const type = rec.mimeType || mime || "audio/webm";
      const now = performance.now();
      const durationMs = Math.max(0, now - startedAt.current - pausedTotal.current);
      const blob = new Blob(chunks.current, { type });
      setState("stopped");
      resolveStop.current?.({ blob, mime: type, durationMs });
      resolveStop.current = null;
    };
    rec.start(250);
    recRef.current = rec;
    startedAt.current = performance.now();
    pausedTotal.current = 0;
    setState("recording");
    return true;
  }, [prepare]);

  const pause = useCallback(() => {
    if (recRef.current?.state === "recording") {
      recRef.current.pause();
      pausedAt.current = performance.now();
      setState("paused");
    }
  }, []);

  const resume = useCallback(() => {
    if (recRef.current?.state === "paused") {
      recRef.current.resume();
      pausedTotal.current += performance.now() - pausedAt.current;
      setState("recording");
    }
  }, []);

  const stop = useCallback((): Promise<RecResult | null> => {
    const rec = recRef.current;
    if (!rec || rec.state === "inactive") return Promise.resolve(null);
    if (rec.state === "paused") pausedTotal.current += performance.now() - pausedAt.current;
    return new Promise((res) => {
      resolveStop.current = res;
      rec.stop();
    });
  }, []);

  /** Release the mic entirely (leaving the studio). */
  const release = useCallback(() => {
    if (recRef.current && recRef.current.state !== "inactive") recRef.current.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    analyserRef.current = null;
    setState("idle");
  }, []);

  useEffect(() => release, [release]);

  return { state, error, supported, prepare, start, pause, resume, stop, release, analyser: analyserRef };
}
