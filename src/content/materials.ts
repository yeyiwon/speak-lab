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
  // v4 — more verified public lectures (oEmbed author check 2026-11-23)
  { id: "yt-1BwanYaRKAQ", part: 1, videoId: "1BwanYaRKAQ", title: "토익스피킹 파트1 핵심강의 l 초보 독학러도 25분만에 빠르고 쉽게 🐰" },
  { id: "yt-PTfhKogBpQA", part: 1, videoId: "PTfhKogBpQA", title: "토익스피킹 파트1 ㅣ 초보독학러도 영상 하나로 AL 완성하는 핵심 강의" },
  { id: "yt-GoMAdWkyOcE", part: 1, videoId: "GoMAdWkyOcE", title: "토익스피킹 파트1, 한국인 90%가 모르는 AL 꿀팁  (만점 답 무료 공개)" },
  { id: "yt-5iG99SwLrhc", part: 1, videoId: "5iG99SwLrhc", title: "토익스피킹 파트1 발음 어려운 토익스피킹 기출 단어 300개 쉐도잉 연습용 영상" },
  { id: "yt-8B1UE6Hs3rQ", part: 2, videoId: "8B1UE6Hs3rQ", title: "토익스피킹 파트2 핵심강의 ㅣ 독학러도 쉽고 빠르게 25분 컷" },
  { id: "yt-1LMvFv7OABo", part: 2, videoId: "1LMvFv7OABo", title: "토익스피킹 파트2, 시계토끼만의 템플릿으로 쉽게 AL 졸업!(답변 무료 공개)" },
  { id: "yt-4Ng0f7ZwT8I", part: 2, videoId: "4Ng0f7ZwT8I", title: "토익스피킹 파트2, 템플릿으로 AL 달성!" },
  { id: "yt-ql-XQ0walBY", part: 2, videoId: "ql-XQ0walBY", title: "토익스피킹 파트2 다수의 사람 묘사 유형, 절대 현혹되지 마쇼 🥶" },
  { id: "yt-EX0oUWzx76A", part: 2, videoId: "EX0oUWzx76A", title: "[토익스피킹 파트 2] 2인 묘사, 한 명씩 시작해 봐요!" },
  { id: "yt-9BjiiEh8HAM", part: 3, videoId: "9BjiiEh8HAM", title: "토익스피킹 파트3 핵심강의 🐰 초보 독학러도 27분만에 빠르고 쉽게" },
  { id: "yt-tdGCKI48Sjk", part: 3, videoId: "tdGCKI48Sjk", title: "토익스피킹 템플릿 만능문장 50개 영어회화까지 15분만에 끝내자 [PART3편]" },
  { id: "yt-b-pe3IkI6BY", part: 3, videoId: "b-pe3IkI6BY", title: "토익스피킹에서 자주 쓰는 만능 '이유' 문장 6가지" },
  { id: "yt-riYlxpbbae0", part: 4, videoId: "riYlxpbbae0", title: "토익스피킹 파트4 핵심강의 🐰 초보 독학러도 47분만에 빠르고 쉽게" },
  { id: "yt-hvDzu30pPKQ", part: 5, videoId: "hvDzu30pPKQ", title: "토익스피킹 파트5, 만능문장으로 1분 꽉 채우기!" },
  { id: "yt-B5PKsMxufGI", part: 5, videoId: "B5PKsMxufGI", title: "토익스피킹 파트6 (현 파트5) ㅣ초보 독학러도 영상하나로 레벨 7 끝내는 파트5 무료 강의 #토익스피킹 part6" },
  { id: "yt-R2bUAUHRBHs", part: "all", videoId: "R2bUAUHRBHs", title: "토익스피킹 모의고사 🐰 2026 최신 경향 반영 적중 모의 1회" },
  { id: "yt-y5ddNWqe9ug", part: "all", videoId: "y5ddNWqe9ug", title: "토익스피킹 모의고사 🐰 2026 최신 경향 반영 적중 해설 강의 2회" },
  { id: "yt-VGJbC050a3E", part: "all", videoId: "VGJbC050a3E", title: "토익스피킹 모의고사 1회 & 해설 ㅣ 2022년 최신 개정판" },
  { id: "yt-x_m7OFkJSDk", part: "all", videoId: "x_m7OFkJSDk", title: "🎀토익스피킹 11월 적중 모의고사 무료 해설강의 + PDF 다운받는 꿀팁" },
  { id: "yt-hLikHcdVEkY", part: "all", videoId: "hLikHcdVEkY", title: "🌟토익스피킹 10월 적중 모의고사 무료 해설강의 + PDF 다운받는 꿀팁" },
  { id: "yt-tZdykXt797Y", part: "all", videoId: "tZdykXt797Y", title: "🎉토익스피킹 9월 적중 모의고사 무료 해설강의 + PDF 다운받는 꿀팁" },
  { id: "yt-GiuTWglNB5A", part: "all", videoId: "GiuTWglNB5A", title: "🎉토익스피킹 8월 적중 모의고사 무료 해설강의 + PDF 다운받는 꿀팁" },
  { id: "yt-ZzyolBABSIw", part: "all", videoId: "ZzyolBABSIw", title: "토익스피킹 만능문장 모음집 🏆 반복만 해도 AL 받는 공부법 (2025 최신판 PDF 제공)" },
  { id: "yt-EagZpG49D1w", part: "all", videoId: "EagZpG49D1w", title: "토익스피킹 만능문장, 이것만 알면 됩니다｜노베이스 단기간 IH/AL 공부법" },
  { id: "yt-DVVmoWI0gs8", part: "all", videoId: "DVVmoWI0gs8", title: "토익스피킹이 처음이라면 반드시 알아야 할 필수정보 요약!" },
  { id: "yt-x6a8X6mWAoU", part: "all", videoId: "x6a8X6mWAoU", title: "토익스피킹 왕초보, 영포자, 노베이스를 위한 초단기 IH 달성 공부법 (레벨6)" },
  { id: "yt-wsWlhoSQrOc", part: "all", videoId: "wsWlhoSQrOc", title: "토익스피킹 7일 만에 끝내는 계획법" },
  { id: "yt-21wQyMjKs6s", part: "all", videoId: "21wQyMjKs6s", title: "토익스피킹 벼락치기 공부 플랜, 7일·14일·30일 뭐가 맞을까?" },
  { id: "yt-drusPfa5t5Q", part: "all", videoId: "drusPfa5t5Q", title: "토익스피킹 시험을 앞두고 있다면 필수 시청! 제니쌤이 말아주는 시험장 주의사항 10가지" },
  { id: "yt-l5AVKfAExB4", part: "all", videoId: "l5AVKfAExB4", title: "토익스피킹 노베이스 교재 추천 + 유튜브 무료강의 공부법 가이드" },
  { id: "yt-CWicNa7GjhY", part: "all", videoId: "CWicNa7GjhY", title: "영어 포기자 구원 영상! 토익 800 말고 토익스피킹 IH가 갓성비인 이유 (시험장 긴급 대처법 포함)" },
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
