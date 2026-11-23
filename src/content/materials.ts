import type { PartNo } from "@/lib/types";

/**
 * Public YouTube videos from the 시계토끼제니쌤 channel.
 * Each entry was verified on 2026-11-23 via YouTube's oEmbed endpoint
 * (title + author_name === "시계토끼제니쌤"). Titles are copied verbatim.
 * We only link out / embed through YouTube; no media is copied.
 * SPEAK LAB is an independent study tool and is not affiliated with 시계토끼.
 */
export const VERIFIED_AT = "2026-11-23";
export const CHANNEL_URL = "https://www.youtube.com/@%EC%8B%9C%EA%B3%84%ED%86%A0%EB%81%BC%EC%A0%9C%EB%8B%88%EC%8C%A4";
export const OFFICIAL_SITE = "https://www.rabbitlearn.com/";

export interface Chapter {
  part: PartNo;
  label: string;
  t: number; // seconds
}

export interface SeedMaterial {
  id: string;
  part: PartNo | "all";
  title: string;
  videoId: string;
  /** Public chapter timestamps copied from the video description (checked 2026-11-23). */
  chapters?: Chapter[];
}

const hms = (s: string) => s.split(":").map(Number).reduce((a, n) => a * 60 + n, 0);
const ch = (rows: [PartNo, string][]): Chapter[] => rows.map(([part, t]) => ({ part, label: `Part ${part}`, t: hms(t) }));

/** Free materials page on the official site (PDF downloads happen there, not in this app). */
export const FREE_MATERIALS_NOTE = "공식 홈페이지 ‘무료자료’ 메뉴에서 Part 3 만능문장 50 PDF 등을 직접 받을 수 있어요.";

export const SEED_MATERIALS: SeedMaterial[] = [
  {
    id: "yt-ZjD5JSezau8",
    part: "all",
    videoId: "ZjD5JSezau8",
    title: "토익스피킹 전 파트 총정리 강의🌟 초보 독학러들 3시간반만 빌려주시고 구원받으세요🐰📕",
    chapters: ch([[1, "00:00:27"], [2, "00:26:29"], [3, "01:12:16"], [4, "01:51:04"], [5, "02:55:57"]]),
  },
  {
    id: "yt-CHCq0vh6Frg",
    part: "all",
    videoId: "CHCq0vh6Frg",
    title: "토익스피킹 독학용 파트별 핵심 강의 🐰 노베이스 3시간 반 벼락치기",
    chapters: ch([[1, "00:00:34"], [2, "00:27:45"], [3, "00:55:06"], [4, "01:36:23"], [5, "02:43:38"]]),
  },
  { id: "yt-V-K8dpH9R-0", part: "all", videoId: "V-K8dpH9R-0", title: "시계토끼 토익스피킹 실전모의고사 파트별 핵심 이론 정리(파트1-5)" },
  { id: "yt-KOm-pm9CF5E", part: 2, videoId: "KOm-pm9CF5E", title: "토익스피킹 파트2 핵심 강의 [2023ver.] ㅣ초보 독학러도 영상 하나로 AL 완성" },
  { id: "yt-dlQ95wyC5kc", part: 3, videoId: "dlQ95wyC5kc", title: "토익스피킹 파트3 ㅣ 초보 독학러도 영상 하나로 레벨 7 완성하는 토스 핵심강의" },
  { id: "yt-jnqHrqBxw5E", part: 4, videoId: "jnqHrqBxw5E", title: "토익스피킹 파트4 핵심강의 초보 독학러도 영상하나로 누구나 만점 받자! [2023 ver.]" },
  { id: "yt-jOKqR72qFxk", part: 5, videoId: "jOKqR72qFxk", title: "토익스피킹 파트5 핵심강의  [최신개정판] ㅣ 초보 독학러도 영상 하나로 쉽고 빠르게!" },
  { id: "yt-D1n02j7vlRs", part: 5, videoId: "D1n02j7vlRs", title: "토익스피킹 파트5 핵심강의 🐰 초보 독학러도 23분만에 빠르고 쉽게" },
  { id: "yt-A14nJjAGqbY", part: "all", videoId: "A14nJjAGqbY", title: "토익스피킹 만능문장 모음.ZIP 2026 최신판 🎁  187개 문장 반복만 해도 AL로 껑충!" },
  { id: "yt-g0ZKs8SrCzI", part: "all", videoId: "g0ZKs8SrCzI", title: "[토익스피킹 모의고사] 반드시 출제되는 토스 예상문제 모의고사 해설강의" },
];

export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.hostname.endsWith("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const m = u.pathname.match(/^\/(embed|shorts|live)\/([\w-]{6,})/);
      if (m) return m[2];
    }
  } catch {
    /* not a URL */
  }
  return null;
}
