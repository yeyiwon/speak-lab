"use client";

let ctx: AudioContext | null = null;

/** Short sine beep like the test's start tone. Uses Web Audio; no audio files needed. */
export function beep(freq = 880, ms = 220, volume = 0.18) {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx ??= new Ctx();
    if (ctx.state === "suspended") ctx.resume();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(volume, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + ms / 1000);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + ms / 1000 + 0.02);
  } catch {
    /* audio unavailable — silently skip */
  }
}

/* ───────── Speech synthesis ─────────
 * Quality depends entirely on the voices installed in the OS/browser.
 * Common failure: calling speak() before voices load → the system default
 * voice (often Korean on a Korean OS) reads English with a foreign accent.
 * We wait for the voice list, then rank English voices by quality.
 */

export const canSpeak = () => typeof window !== "undefined" && "speechSynthesis" in window;

let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;

export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!canSpeak()) return Promise.resolve([]);
  const now = window.speechSynthesis.getVoices();
  if (now.length) return Promise.resolve(now);
  if (!voicesPromise) {
    const p = new Promise<SpeechSynthesisVoice[]>((res) => {
      const synth = window.speechSynthesis;
      const done = () => {
        synth.removeEventListener("voiceschanged", done);
        res(synth.getVoices());
      };
      synth.addEventListener("voiceschanged", done);
      setTimeout(done, 2000); // some browsers never fire the event
    }).then((v) => {
      if (!v.length) voicesPromise = null; // allow retry later
      return v;
    });
    voicesPromise = p;
  }
  return voicesPromise;
}

// macOS novelty voices that sound robotic or comedic.
const NOVELTY = /\b(Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Fred|Junior|Ralph|Kathy|Grandma|Grandpa|Eddy|Flo|Reed|Rocko|Sandy|Shelley)\b/i;
const PREFERRED = /\b(Ava|Samantha|Allison|Susan|Zoe|Evan|Nathan|Tom|Joelle|Noelle|Aria|Jenny|Guy|Michelle|Christopher|Eric|Emma|Brian|Andrew|Ana)\b/i;
const HIGH_QUALITY = /(Premium|Enhanced|Natural|Neural|Online)/i;

export function voiceScore(v: SpeechSynthesisVoice): number {
  if (!v.lang.toLowerCase().startsWith("en")) return -1000;
  if (NOVELTY.test(v.name)) return -500;
  let s = 0;
  if (HIGH_QUALITY.test(v.name)) s += 60;
  if (/Google/i.test(v.name)) s += 35;
  if (PREFERRED.test(v.name)) s += 20;
  if (/en[-_]US/i.test(v.lang)) s += 12;
  else if (/en[-_](GB|AU|CA)/i.test(v.lang)) s += 6;
  if (!v.localService) s += 4;
  return s;
}

export function rankVoices(voices: SpeechSynthesisVoice[]) {
  return voices.filter((v) => voiceScore(v) > -500).sort((a, b) => voiceScore(b) - voiceScore(a));
}

export function voiceQualityLabel(v: SpeechSynthesisVoice) {
  const s = voiceScore(v);
  return s >= 60 ? "고품질" : s >= 30 ? "좋음" : "기본";
}

export interface SpeakOptions {
  rate?: number;
  voiceURI?: string | null;
  onend?: () => void;
}

/** Read text aloud with the best available English voice (no network cost). Returns a cancel function. */
/* ───────── Pre-recorded native voice (Kokoro-82M, Apache-2.0) ─────────
 * Bundled sentences/questions were synthesized ahead of time with a neural
 * American-English voice (public/tts/*.mp3). The manifest maps normalized
 * text → file id. Anything not in the manifest (e.g. the learner's own
 * sentences) falls back to the browser's speech synthesis.
 */
let manifest: Record<string, string> | null = null;
let manifestP: Promise<Record<string, string>> | null = null;
let currentAudio: HTMLAudioElement | null = null;

export const normTTS = (t: string) => t.replace(/[\[\]]/g, "").replace(/\s+/g, " ").trim();

function loadManifest() {
  manifestP ??= import("@/content/tts-manifest.json")
    .then((m) => (manifest = (m.default ?? m) as Record<string, string>))
    .catch(() => (manifest = {}));
  return manifestP;
}

export function hasNativeAudio(text: string) {
  return !!manifest?.[normTTS(text)];
}

export function stopSpeaking() {
  currentAudio?.pause();
  currentAudio = null;
  if (canSpeak()) window.speechSynthesis.cancel();
}

/**
 * Speak text.
 * - Bundled sentences/questions/answers: always the pre-recorded Kokoro voice (MP3).
 *   Never falls back to the device's robotic voice. If the browser blocks autoplay
 *   before the first user gesture, the clip plays on the next tap/keypress instead.
 * - Learner-added sentences (no recording): best installed English voice.
 * Returns a cancel function.
 */
export function speak(text: string, opts: SpeakOptions = {}) {
  let cancelled = false;
  let removeGestureWait: (() => void) | null = null;
  stopSpeaking();
  loadManifest().then((m) => {
    if (cancelled) return;
    const id = m[normTTS(text)];
    if (!id) {
      synthSpeak(text, opts, () => cancelled);
      return;
    }
    const a = new Audio(`/tts/${id}.mp3`);
    a.preload = "auto";
    a.onended = () => !cancelled && opts.onend?.();
    a.onerror = () => !cancelled && opts.onend?.(); // keep the flow moving; no robot fallback
    currentAudio = a;
    a.play().catch((e: DOMException) => {
      if (cancelled) return;
      if (e?.name === "NotAllowedError") {
        // Autoplay blocked: play on the user's next interaction.
        const retry = () => {
          removeGestureWait?.();
          if (!cancelled && currentAudio === a) a.play().catch(() => opts.onend?.());
        };
        window.addEventListener("pointerdown", retry, { once: true, capture: true });
        window.addEventListener("keydown", retry, { once: true, capture: true });
        removeGestureWait = () => {
          window.removeEventListener("pointerdown", retry, { capture: true });
          window.removeEventListener("keydown", retry, { capture: true });
        };
      } else if (e?.name !== "AbortError") {
        opts.onend?.();
      }
    });
  });
  return () => {
    cancelled = true;
    removeGestureWait?.();
    stopSpeaking();
  };
}

function synthSpeak(text: string, opts: SpeakOptions, isCancelled: () => boolean) {
  if (!canSpeak()) {
    opts.onend?.();
    return;
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  loadVoices().then((voices) => {
    if (isCancelled()) return;
    const ranked = rankVoices(voices);
    const voice = (opts.voiceURI && voices.find((v) => v.voiceURI === opts.voiceURI)) || ranked[0];
    const u = new SpeechSynthesisUtterance(normTTS(text));
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    } else u.lang = "en-US";
    u.rate = opts.rate ?? 1;
    u.onend = () => !isCancelled() && opts.onend?.();
    u.onerror = () => !isCancelled() && opts.onend?.();
    synth.speak(u);
  });
}
