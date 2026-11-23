import type { PartNo } from "@/lib/types";

/**
 * Answer-structure guide written by SPEAK LAB in its own words.
 * These are general TOEIC Speaking answer frameworks, NOT a transcription of any
 * lecture or textbook. Learners should watch the linked lectures and register the
 * exact sentences they want to memorize themselves.
 */
export interface PartGuide {
  part: PartNo;
  goal: string;
  steps: { label: string; detail: string; example?: string }[];
  timing: string;
  pitfalls: string[];
}

export const GUIDE: PartGuide[] = [
  {
    part: 1,
    goal: "의미 단위로 끊어 읽고, 강세·억양으로 내용을 전달하기",
    steps: [
      { label: "준비 45초", detail: "소리 내어 한 번 끝까지 읽기 — 고유명사·숫자·어려운 단어 발음을 먼저 확인" },
      { label: "끊어 읽기", detail: "쉼표·접속사·전치사구 앞에서 짧게 끊기. 한 덩어리는 한 호흡으로", example: "Before we begin, / please make sure / your phones are switched off." },
      { label: "나열 억양", detail: "A, B, and C → 앞 항목은 올리고(↗) 마지막은 내리기(↘)" },
      { label: "강세", detail: "숫자·형용사·핵심 명사에 힘을 주고 기능어(a, the, of)는 약하게" },
    ],
    timing: "45초 안에 여유 있게 끝나는 속도. 서두르지 말고 또박또박.",
    pitfalls: ["모르는 단어에서 멈추고 다시 읽기 — 틀려도 그대로 이어가기", "문장 끝마다 억양이 올라가는 습관"],
  },
  {
    part: 2,
    goal: "정해진 순서로 사진을 훑어 30초를 빈틈없이 채우기",
    steps: [
      { label: "① 장소", detail: "어디서 찍은 사진인지 한 문장", example: "This picture was taken in ___." },
      { label: "② 메인 인물", detail: "가장 눈에 띄는 사람의 동작(현재진행형) + 옷차림" },
      { label: "③ 주변", detail: "위치 표현(on the left / in the background)으로 다른 사람·사물 2개" },
      { label: "④ 느낌", detail: "분위기 추측 한 문장으로 마무리", example: "It seems like ___." },
    ],
    timing: "준비 45초에 ①~④ 대상을 정해두고, 답변은 6~7문장.",
    pitfalls: ["사물 이름이 생각 안 날 때 멈추기 → some items / a machine 같은 쉬운 말로 대체", "현재진행형 대신 단순 현재형 남발"],
  },
  {
    part: 3,
    goal: "질문 그대로 받아서 답 → 이유 → (필요하면) 예시",
    steps: [
      { label: "Q5·Q6 (15초)", detail: "질문의 의문사 두 개에 모두 답하는 한 문장 + because 이유 한 줄" },
      { label: "Q7 (30초)", detail: "입장 한 문장 → 이유 두 개 → 짧은 경험 예시 → 마무리 한 문장" },
      { label: "질문 재활용", detail: "질문 속 표현을 그대로 가져와 첫 문장을 만들면 준비 3초로도 시작할 수 있음" },
    ],
    timing: "Q5·6: 2문장 / Q7: 5문장 내외",
    pitfalls: ["두 개를 묻는데 하나만 답하기", "Q7에서 이유 없이 경험담만 길게"],
  },
  {
    part: 4,
    goal: "표에서 정확한 정보를 찾아 정돈된 순서로 전달하기",
    steps: [
      { label: "읽기 45초", detail: "제목·날짜·장소 → 취소/변경 표시 → 시간순 항목 순서로 훑기" },
      { label: "Q8", detail: "기본 정보(시간·장소·날짜) — 질문 두 개면 두 정보 모두" },
      { label: "Q9", detail: "잘못 알고 있는 정보 정정 or 조건 확인 — I'm sorry, but… / Don't worry…" },
      { label: "Q10 (30초)", detail: "조건에 맞는 항목 개수 먼저 → First / After that / Lastly 로 하나씩" },
    ],
    timing: "Q10은 두 번 들려주므로 첫 번째에 조건을 잡고 두 번째에 항목을 표에서 찾기",
    pitfalls: ["표의 문구를 문장으로 바꾸지 않고 단어만 나열", "CANCELED·변경 표시 놓치기"],
  },
  {
    part: 5,
    goal: "60초 동안 한 입장을 끝까지 밀고 가는 논리 구조",
    steps: [
      { label: "① 입장", detail: "동의/반대 또는 선택지 하나를 첫 문장에 분명히" },
      { label: "② 이유 1 + 부연", detail: "이유 한 문장 + 그래서 어떤 결과가 생기는지 한 문장" },
      { label: "③ 이유 2", detail: "다른 측면의 이유 한 문장" },
      { label: "④ 경험 예시", detail: "내 경험 or 지인 경험 2~3문장 — 구체적일수록 시간이 잘 찬다" },
      { label: "⑤ 결론", detail: "입장을 한 번 더 정리" },
    ],
    timing: "준비 45초: 입장·이유 2개·예시 키워드만 메모. 답변 7~9문장.",
    pitfalls: ["양쪽 장점을 다 말하다가 입장이 흐려짐", "예시 없이 이유만 반복"],
  },
];
