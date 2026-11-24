# SPEAK LAB — 토익스피킹 데일리 트레이닝

강의 복습 → 문장 암기 → 시험 시간 그대로 말하기 → 녹음 확인 → 약점 복습 → 기록 저장을 한 흐름으로 묶은 **로컬 우선(local-first)** 학습 웹앱입니다.
로그인 없이 동작하며 모든 기록·녹음은 브라우저(IndexedDB)에만 저장됩니다.

> 비공식 개인 학습 도구입니다. 시계토끼 · ETS · YBM과 제휴되지 않았습니다.

## 실행

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

마이크는 HTTPS 또는 localhost에서만 동작합니다.

## 화면 구성

| 경로 | 화면 | 주요 기능 |
| --- | --- | --- |
| `/` | Today | 상태 한 줄, 바로 시작(이어서 · 문장 연습 · 실전 연습 · 복습), 오늘 계획(실제 기록으로 자동 체크) |
| `/library` | Library | 파트별 답변 구조 가이드, 공개 강의(파트별 구간 바로 재생), 완료·북마크·메모·문장 연결, 자료 직접 등록 |
| `/sentences` | 문장 | 문장 연습 설정(출제 방식·문장 수 5/10/20/전체·파트·표시 방식, 마지막 설정 저장), 이어서 하기, 검색·선택·등록·일괄 붙여넣기 |
| `/studio` | Speaking Studio | Part 1–5 공식 시간, 자유 연습 시간 조절, 실제 녹음·파형, 일시정지·재생·다시 도전·메모·자기 평가·예시 답변 |
| `/review` | Review | 막힌 문장, 7일 복습 예정, 다시 도전할 문제, 이전 녹음 |
| `/progress` | Progress | 일별 학습 시간, 누적 답변·발화 감지 시간, 파트별 풀이 수, 암기율, 복습 완료율, 녹음 비교 |
| `/settings` | Settings | 목표·시험일(달력)·학습 시간·집중 파트, 알림음·자동 녹음·질문 음성(음성 선택/속도), 내보내기·가져오기·삭제 |

## 구조

```
src/
  app/                 각 화면 (App Router, 모두 client component)
  components/          AppShell, Onboarding, DatePicker, AudioPlayer, VoicePicker, studio/*, trainer/*
  content/             exam.ts(공식 시간), materials.ts(검증된 공개 강의), questions.ts, sentences.ts, guide.ts
  lib/
    data/              repository.ts(저장소 인터페이스) · indexeddb.ts(구현) · store.tsx(React 컨텍스트) · seed.ts
    audio/             useRecorder(MediaRecorder+AnalyserNode) · useCountdown · sound(beep, TTS 음성 선택)
    plan.ts            하루 계획 생성·이월·진행률(기록 기반)
    srs.ts             간격 반복(내부) + 단순 상태(새 문장/연습 중/외웠어요)
    insights.ts        연속 학습·약점·파트 통계
    ai/providers.ts    Phase 3 확장 인터페이스(미구현)
```

- **데이터 계층 분리**: UI는 `Repository` 인터페이스만 사용 → Supabase 등 동기화 구현으로 교체 가능.
- **콘텐츠 버전**: `CONTENT_VERSION`을 올리면 기존 사용자 브라우저에 새 예시 문장·강의 정보가 진행 기록을 건드리지 않고 병합됩니다.

## 문장 연습 출제 방식 (`src/lib/session.ts`)

- 기본값은 **전체 문장 랜덤**이고 ‘바로 시작’ 한 번으로 시작합니다(설정은 ‘설정 바꾸기’에 접혀 있음).
- 세션 시작 시 문제 순서를 한 번 만들고 끝날 때까지 고정합니다. 한 세션 안에서 같은 문장은 나오지 않습니다(‘어려워요’ 문장만 세션 끝에 1회 재출제).
- **랜덤**: 아직 안 본 문장 → 오래전에 본 문장 순으로 고른 뒤 섞습니다. 세션을 이어가면 전체 문장을 한 바퀴 돈 다음에야 반복됩니다.
- **틀린 문장 우선**: 다시 연습·어려움·복습 기한 지난 문장을 최대 70%까지, 나머지는 다른 문장으로 채워 특정 문장만 반복되지 않게 합니다.
- **새 문장 우선 / 선택한 문장만(문장 수 제한 없이 고른 문장 전부) / 파트 필터**를 지원하고, 보유 문장이 부족하면 있는 만큼만 출제합니다.
- 버튼 의미: 정답 보기·확인은 기록하지 않음 · 다음 = 복습 간격 늘림 · 어려워요 = 내일 복습 + 세션 내 1회 재출제.
- 오늘 계획의 ‘문장 연습’ 목표는 하루 10문장(설정한 출제 범위가 더 작으면 그만큼)이고, 진행률은 오늘 기록한 고유 문장 수입니다.
- 진행 중 세션은 이 기기(localStorage)에 저장되어 다른 화면 이동·새로고침 후 이어서 할 수 있습니다.
- 테스트: `npm test` (출제 수·중복·순환·오답 비중·필터 6개)

## 원어민 음성 (TTS)

- 기본 제공 문장(221) · Part 3/4 질문 · 예시 답변은 **Kokoro-82M**(Apache-2.0, 오픈소스 뉴럴 TTS, 미국 여성 음성 `af_heart`)으로 미리 합성해 `public/tts/*.mp3`(64kbps, 모든 브라우저 재생)로 포함했습니다. API 키·런타임 비용 없음, 모든 브라우저에서 동일한 음질.
- `src/content/tts-manifest.json`이 정규화 텍스트 → 파일 id를 매핑하고, 목록에 없는 문장(사용자 등록)은 브라우저 speechSynthesis로 대체합니다.
- 콘텐츠를 추가하면 음성을 다시 생성하세요: `cd scripts/tts && npm i && npx tsx dump.ts && node gen.mjs` (없는 파일만 생성, `ffmpeg` 필요). 현재 273개 녹음.

## 디자인

- 컬러: Graphite `#1C1D1F` · Glacier `#CFE3F5`(명도 대비 12.8:1) + 포인트 Lime `#C8F169` (완료·진행 강조에만)
- 스타일: 리퀴드 글래스 — 흐르는 색 필드 위 반투명 시트(1px 엣지 + 상단 반사광 + 부드러운 그림자). 입력창은 파인 느낌 없는 유리판. Studio는 다크 글래스. `prefers-reduced-transparency` 시 불투명 대체
- 목록은 한 패널 안 구분선, 스크롤바는 얇고 연하게(가로 칩 레일은 숨김)
- 서체: Pretendard Variable (CDN, 실패 시 시스템 서체)
- Speaking Studio는 Graphite 전용 몰입 화면, 남은 시간에 따라 숫자 굵기가 변하는 키네틱 타이머
- `prefers-reduced-motion` 대응

## 자료 출처 (2026-11-23 확인)

- 시험 구성: ETS, *About the TOEIC Speaking and Writing Test* — https://www.ets.org/toeic/about/speaking-writing.html
- 레벨 기준: ETS TOEIC Speaking Score Descriptors (Level 8: 190–200 … Level 4: 80–100)
- 공개 강의: 시계토끼제니쌤 YouTube 채널 영상 41개(파트별 핵심강의·모의고사 해설·템플릿/만능문장 강의, 쇼츠·오픽·광고 제외) — 각 영상 제목·채널을 YouTube oEmbed로 검증. 파트별 구간은 영상 설명란의 공개 타임스탬프 사용.
- 공식 학습 홈페이지: https://www.rabbitlearn.com/ (무료 PDF는 사용자가 직접 다운로드)

### 저작권 원칙
- 영상은 YouTube 링크·임베드(youtube-nocookie)로만 연결, 교재·PDF·유료 콘텐츠는 포함하지 않음.
- 제니쌤 만능문장(교재 수록 187문장)은 **복제하지 않음**. 앱의 예시 문장·문제·모범 답변·답변 구조 가이드는 모두 SPEAK LAB이 새로 작성했고 "예시"로 표시.
- 사용자가 직접 정리한 문장은 개별 등록/일괄 붙여넣기로 본인 브라우저에 저장 ("내가 등록"으로 구분).

## 검증 (실제 수행)

- `npm run lint` 0 문제, `npx tsc --noEmit` 통과, `npm run build` 성공 (Next.js 16.4.6)
- Playwright(Chromium 헤드리스, 가짜 마이크 장치) E2E — 데스크톱 1366×900 / 모바일 390×844 모두 통과, 콘솔 에러 0:
  - 온보딩 → 계획 생성(집중 파트·시험일 반영)
  - Studio: 실제 MediaRecorder 녹음(webm/opus, 약 8초 ≈ 125KB), 파형 캔버스가 입력에 반응, 일시정지/재개, 재생, 조기 종료·다시 도전, 자기 평가·메모·어려움 표시 저장
  - 문장 트레이너: 뒤집기·다음·다시 볼래요, 빈칸 채점, 직접 문장 등록
  - Library: 강의 완료 → Today 진행률 반영(74%), 파트 구간 재생(`?start=`), 자료 등록
  - Review/Progress 집계, JSON 내보내기, 새로고침 후 기록 유지
  - 모바일 가로 넘침 없음(scrollWidth 390)
- 앱 내 브라우저 패널: 마이크 권한 거부 시 안내 메시지·녹음 없이 타이머 진행 확인

## 알려진 제약

- 직접 등록한 문장은 브라우저 음성으로 읽으므로 기기에 따라 기계음일 수 있습니다(Chrome/Edge 권장). 원어민 녹음은 합성음이며 실제 시험은 성우 녹음입니다.
- 실제 사람 목소리 마이크 녹음은 자동화 테스트로 검증할 수 없어 가짜 장치(합성음)로 파이프라인을 검증했습니다. iOS Safari 실기기 테스트는 하지 않았습니다.
- 외부 강의 시청 시간은 측정하지 않습니다(완료 표시만 기록).
- 브라우저 저장소는 사용자가 사이트 데이터를 지우면 삭제됩니다 → 설정에서 정기 내보내기 권장, "영구 저장 요청" 제공.
- Pretendard는 CDN에서 로드합니다(오프라인 시 시스템 서체).
- Part 2 사진은 단순 일러스트 4종입니다.

## 다음 단계

- **Phase 2**: PWA(오프라인·홈 화면 설치), 주간 모의고사 세트, 녹음 파형 비교 시각화, 복습 알림
- **Phase 3**: `lib/ai/providers.ts` 인터페이스로 음성 전사·문법/구성 피드백·맞춤 문제(“AI 참고 피드백”으로 공식 점수·자기 평가와 분리 표시), 뉴럴 TTS로 문제 음성 생성
