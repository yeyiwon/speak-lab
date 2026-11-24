/**
 * Korean translations of the SPEAK LAB model answers, plus reusable phrases
 * (exact substrings of each answer) that are highlighted in the studio.
 * Highlights are the frames that transfer to other questions — not topic words.
 */
export interface AnswerNote {
  ko: string;
  key: string[];
}

export const ANSWER_NOTES: Record<string, AnswerNote> = {
  /* ───────── Part 2 ───────── */
  "p2-a-1": {
    ko: "이것은 붐비는 카페의 사진입니다. 가장 먼저 보이는 것은 카운터에서 음료를 주문하는 여자입니다. 그녀는 노란 스웨터를 입고 있습니다. 카운터 뒤에서는 앞치마를 두른 남자가 커피를 만들고 있습니다. 사진 오른쪽에는 두 사람이 원형 테이블에 앉아 이야기를 나누고 있습니다. 여유로운 오후인 것 같습니다.",
    key: ["This is a picture of", "The first thing I can see is", "She is wearing", "Behind the counter", "On the right side of the picture", "It seems like"],
  },
  "p2-a-2": {
    ko: "이 사진은 사무실에서 찍혔습니다. 사진 가운데에서 세 사람이 테이블에 둘러앉아 회의를 하고 있습니다. 왼쪽의 남자는 화면 속 차트를 가리키고 있습니다. 그 옆의 여자는 노트북으로 메모를 하고 있습니다. 배경에는 큰 창문과 화분 몇 개가 보입니다. 중요한 프로젝트를 논의하고 있는 것 같습니다.",
    key: ["This picture was taken in", "In the middle of the picture", "next to him", "In the background, I can see", "It seems like"],
  },
  "p2-b-1": {
    ko: "이것은 야외 시장의 사진입니다. 가장 먼저 보이는 것은 과일 가판대 뒤에 서 있는 상인입니다. 그는 모자를 쓰고 손님에게 봉투를 건네고 있습니다. 테이블 위에는 사과와 오렌지 상자가 많이 있습니다. 왼쪽에서는 장바구니를 든 여자가 채소를 보고 있습니다. 화창한 주말 아침처럼 보입니다.",
    key: ["This is a picture of", "The first thing I can see is", "He is wearing", "There are many", "On the left side", "It looks like"],
  },
  "p2-b-2": {
    ko: "이 사진은 공원에서 찍혔습니다. 앞쪽에서는 한 남자가 길을 따라 개를 산책시키고 있습니다. 사진 오른쪽에는 한 여자가 벤치에 앉아 책을 읽고 있습니다. 그녀 뒤로는 초록 잎이 달린 키 큰 나무들이 있습니다. 배경에는 건물 몇 채가 보입니다. 평화로운 하루인 것 같습니다.",
    key: ["This picture was taken in", "In the foreground", "On the right side of the picture", "Behind her, there are", "In the background, I can see", "It seems like"],
  },

  /* ───────── Part 3 ───────── */
  "p3-a-1": {
    ko: "저는 한 달에 한 번 정도 영화를 보러 가고, 보통 친구들과 함께 갑니다. 영화를 본 뒤 저녁을 먹으면서 영화 이야기를 하는 걸 좋아하기 때문입니다.",
    key: ["about once a month", "I usually go with", "because we like to"],
  },
  "p3-a-2": {
    ko: "저는 보통 액션 영화를 봅니다. 주된 이유는 긴 한 주의 업무가 끝난 뒤 스트레스를 푸는 데 도움이 되기 때문입니다.",
    key: ["I usually", "The main reason is that", "help me relieve stress"],
  },
  "p3-a-3": {
    ko: "저는 극장에서 영화 보는 것을 선호합니다. 우선 화면과 음향이 훨씬 좋아서 이야기에 정말 집중할 수 있습니다. 또한 집 밖에서 친구들과 시간을 보내기 좋은 방법입니다. 예를 들어 지난 주말에 친구들과 새 액션 영화를 봤는데, 휴대폰으로 보는 것보다 훨씬 신났습니다. 그래서 저는 극장을 선호합니다.",
    key: ["I prefer to", "First of all", "so I can really focus on", "Also, it's a good way to", "For example, last weekend", "much more exciting than", "That's why I prefer"],
  },
  "p3-b-1": {
    ko: "가장 가까운 식료품점은 제 아파트에서 5분 정도 거리라서 보통 걸어갑니다. 정말 편리합니다.",
    key: ["about five minutes away from", "so I usually", "It's really convenient"],
  },
  "p3-b-2": {
    ko: "저는 보통 일요일 아침에 장을 보러 갑니다. 가게가 붐비지 않고 채소가 신선하기 때문입니다.",
    key: ["I usually", "because the store isn't crowded"],
  },
  "p3-b-3": {
    ko: "가장 중요한 것은 가격이라고 생각합니다. 요즘 식품 가격이 오르고 있어서 장보기에서 돈을 아끼고 싶습니다. 또한 저렴한 가게는 할인과 특별 행사를 자주 합니다. 예를 들어 집 근처 가게는 주말마다 큰 세일을 해서 과일과 고기를 더 싼 가격에 살 수 있습니다. 그래서 저는 가격이 가장 중요하다고 생각합니다.",
    key: ["I think the most important thing is", "These days", "so I want to save money", "Also,", "For example,", "That's why I think"],
  },
  "p3-c-1": {
    ko: "저는 일주일에 세 번 정도 운동하고, 보통 퇴근 후 회사 근처 헬스장에 갑니다.",
    key: ["about three times a week", "I usually go to", "after work"],
  },
  "p3-c-2": {
    ko: "저는 달리기를 가장 좋아합니다. 간단하고 장비 없이 어디서든 할 수 있기 때문입니다.",
    key: ["I enjoy", "the most, because", "I can do it anywhere"],
  },
  "p3-c-3": {
    ko: "저는 다른 사람들과 함께 운동하는 것을 선호합니다. 우선 더 재미있어서 쉽게 지루해지지 않습니다. 또한 친구들이 제가 지쳤을 때도 계속하도록 동기를 줍니다. 예를 들어 지난달에 러닝 클럽에 가입했는데, 지금은 예전보다 훨씬 오래 달립니다. 그래서 저는 다른 사람들과 운동하는 걸 좋아합니다.",
    key: ["I prefer to", "First, it's more fun", "so I don't get bored easily", "Also,", "For example, last month", "much longer than before", "That's why I like"],
  },
  "p3-d-1": {
    ko: "저는 하루에 스마트폰을 네 시간 정도 사용하고, 주로 영상을 보고 메시지를 보내는 데 씁니다.",
    key: ["about four hours a day", "I mainly use it for"],
  },
  "p3-d-2": {
    ko: "마지막으로 새 휴대폰을 산 것은 작년이었고, 예전 휴대폰 배터리가 오래가지 않았기 때문입니다.",
    key: ["The last time I", "was last year", "because"],
  },
  "p3-d-3": {
    ko: "가장 중요한 기능은 배터리 수명이라고 생각합니다. 요즘 저는 은행 업무, 길 찾기, 업무 등 거의 모든 것을 휴대폰으로 합니다. 배터리가 꺼지면 아무것도 할 수 없습니다. 예를 들어 지난달 출장 중에 휴대폰이 꺼져서 호텔을 찾지 못했습니다. 그래서 저에게는 배터리 수명이 가장 중요합니다.",
    key: ["I think the most important", "These days", "for almost everything", "If the battery dies, I can't", "For example, last month", "That's why", "matters most to me"],
  },

  /* ───────── Part 4 ───────── */
  "p4-a-1": {
    ko: "오리엔테이션은 3월 9일 월요일 오전 9시에 시작하고, 302호에서 열릴 예정입니다.",
    key: ["begins at", "it will be held in"],
  },
  "p4-a-2": {
    ko: "죄송하지만 착오가 있는 것 같습니다. 10시 30분부터 11시 30분까지 예정되어 있던 '고객사 소개' 세션은 취소되었습니다.",
    key: ["I'm sorry, but there seems to be a mistake", "which was scheduled from", "has been canceled"],
  },
  "p4-a-3": {
    ko: "물론이죠. 점심 이후에는 세션이 두 개 있습니다. 먼저 오후 1시부터 2시 30분까지 IT팀이 진행하는 컴퓨터 시스템 설정 세션이 있습니다. 그다음 2시 30분부터 3시 30분까지 관리자들을 만날 수 있는 팀 미팅이 있습니다.",
    key: ["Sure. There are two sessions", "First, from", "there will be", "led by", "After that, from", "you will have"],
  },
  "p4-b-1": {
    ko: "봄 강좌는 4월 1일에 시작합니다. 3월 25일까지 온라인이나 안내 데스크에서 등록하실 수 있습니다.",
    key: ["start on", "You can register", "by March 25th"],
  },
  "p4-b-2": {
    ko: "걱정 마세요. 따로 구매하실 필요가 없습니다. 수채화 수업은 80달러이고 재료가 포함되어 있습니다.",
    key: ["Don't worry.", "You don't need to", "costs", "are included"],
  },
  "p4-b-3": {
    ko: "물론이죠. 평일 저녁에 들으실 수 있는 수업은 세 개입니다. 첫째, 초보자 요가는 월요일과 수요일 오후 7시부터 8시까지입니다. 둘째, 수채화는 화요일 6시 30분부터 8시 30분까지입니다. 마지막으로 사진 기초는 목요일 오후 7시부터 9시까지입니다.",
    key: ["Sure. There are three classes", "First,", "Second,", "Lastly,"],
  },
  "p4-c-1": {
    ko: "고객님의 항공편 KE 703은 월요일 오전 8시 30분에 서울을 출발해서 오전 10시 50분에 도쿄에 도착합니다.",
    key: ["leaves", "and it arrives in"],
  },
  "p4-c-2": {
    ko: "죄송하지만 화요일 오전 10시 공장 견학은 취소되어서 가실 필요가 없습니다.",
    key: ["I'm sorry, but", "has been canceled", "so you don't need to"],
  },
  "p4-c-3": {
    ko: "물론이죠. 화요일 오후에는 일정이 두 개 있습니다. 먼저 오후 1시에 사쿠라 레스토랑에서 고객과 점심을 드십니다. 그다음 오후 4시에 제품 발표를 하십니다.",
    key: ["Sure. There are two things scheduled for", "First, at", "you will have", "After that, at", "you will give"],
  },

  /* ───────── Part 5 ───────── */
  "p5-a-1": {
    ko: "저는 두 가지 이유로 대기업에서 일하는 것이 더 낫다는 데 동의합니다. 우선 대기업은 보통 더 높은 급여와 더 나은 복지를 제공합니다. 이는 직원들이 경제적으로 더 안정감을 느끼고 업무에 집중할 수 있다는 뜻입니다. 게다가 대기업은 교육 프로그램을 많이 제공해서 직원들이 역량을 키울 수 있습니다. 예를 들어 제 친구는 큰 전자 회사에 다니는데, 작년에 데이터 분석 무료 온라인 강의를 들었습니다. 덕분에 새 프로젝트를 이끌 수 있었습니다. 이러한 이유로 저는 대기업에서 일하는 것이 더 낫다고 생각합니다.",
    key: ["I agree that", "for two reasons", "First of all", "This means", "On top of that", "so workers can", "For example", "Thanks to this", "For these reasons, I think"],
  },
  "p5-b-1": {
    ko: "저는 신입사원에게는 좋은 의사소통 능력이 더 중요하다고 생각합니다. 우선 신입사원은 질문을 많이 하고 동료에게 배워야 합니다. 소통을 잘하면 회사에 훨씬 빨리 적응할 수 있습니다. 또한 요즘은 대부분의 일이 팀으로 이루어지기 때문에 생각을 명확하게 공유하는 것이 중요합니다. 예를 들어 처음 아르바이트를 시작했을 때 시스템 사용법을 몰랐지만, 매니저에게 정중하게 물어봐서 하루 만에 배웠습니다. 이러한 이유로 저는 의사소통 능력이 더 중요하다고 믿습니다.",
    key: ["I think", "are more important for", "First of all", "If they", "Also,", "these days", "it is important to", "For example, when I", "For these reasons, I believe"],
  },
  "p5-c-1": {
    ko: "제 생각에는 고등학생들에게 봉사활동을 의무화해야 합니다. 첫째, 봉사활동은 학생들이 책임감을 배우는 데 도움이 됩니다. 제시간에 도착하고 맡은 일을 끝내야 하는데, 이는 미래를 위한 좋은 연습입니다. 둘째, 다양한 배경의 사람들을 만날 기회를 줍니다. 예를 들어 저는 고등학생 때 지역 도서관에서 봉사하며 아이들에게 읽기를 가르쳤습니다. 그 경험으로 더 인내심 있고 자신감 있게 되었습니다. 그래서 저는 봉사활동이 의무여야 한다고 생각합니다.",
    key: ["In my opinion", "First,", "helps students learn", "which is good practice for", "Second, it gives them a chance to", "For example, when I was", "It made me more", "That's why I think"],
  },
  "p5-d-1": {
    ko: "저는 두 가지 이유로 재택근무를 선호합니다. 우선 출퇴근을 하지 않아도 되기 때문에 시간을 많이 아낄 수 있습니다. 예전에는 매일 지하철에서 거의 두 시간을 보냈습니다. 게다가 조용한 환경에서 더 잘 집중할 수 있습니다. 예를 들어 지난달 일주일간 재택근무를 했는데, 계획보다 이틀 일찍 보고서를 끝냈습니다. 이러한 이유로 저에게는 재택근무가 더 낫다고 생각합니다.",
    key: ["I prefer to", "for two reasons", "First of all", "I can save a lot of time because", "I used to", "On top of that", "For example, last month", "earlier than planned", "For these reasons, I think"],
  },
  "p5-e-1": {
    ko: "저는 온라인 수업이 교실 수업만큼 효과적이라는 데 동의합니다. 첫째, 학생들은 강의를 반복해서 볼 수 있어서 어려운 부분을 복습할 수 있습니다. 둘째, 언제 어디서나 공부할 수 있어서 시간이 절약됩니다. 예를 들어 저는 온라인 강의로 이 시험을 준비했습니다. 이해가 안 될 때마다 영상을 다시 재생했습니다. 덕분에 효율적으로 공부할 수 있었습니다. 그래서 저는 이 의견에 동의합니다.",
    key: ["I agree that", "as effective as", "First,", "again and again", "Second,", "anytime and anywhere", "which saves time", "For example,", "Whenever I", "Thanks to this", "That's why I agree with the statement"],
  },
  "p5-f-1": {
    ko: "저는 정직함이 좋은 리더의 가장 중요한 자질이라고 생각합니다. 리더가 정직하면 팀원들이 리더를 신뢰할 수 있습니다. 그 결과 팀이 더 원활하게 협력할 수 있습니다. 또한 정직한 리더는 실수를 인정하는데, 이는 건강한 업무 환경을 만듭니다. 예를 들어 예전 매니저는 항상 자신의 결정 이유를 설명했고, 모두가 그녀를 존중했습니다. 이러한 이유로 저는 정직함이 가장 중요하다고 믿습니다.",
    key: ["I think", "is the most important quality of", "If a leader is", "As a result", "Also,", "which creates", "For example, my former", "For these reasons, I believe", "matters most"],
  },
};

/** Splits an answer into plain / highlighted chunks for the given reusable phrases (first match wins, no overlaps). */
export function highlight(text: string, phrases: string[]): { t: string; hi: boolean }[] {
  const ranges: [number, number][] = [];
  for (const p of [...phrases].sort((a, b) => b.length - a.length)) {
    let from = 0;
    for (let i = text.indexOf(p, from); i !== -1; i = text.indexOf(p, from)) {
      const end = i + p.length;
      if (!ranges.some(([a, b]) => i < b && end > a)) ranges.push([i, end]);
      from = end;
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const out: { t: string; hi: boolean }[] = [];
  let pos = 0;
  for (const [a, b] of ranges) {
    if (a > pos) out.push({ t: text.slice(pos, a), hi: false });
    out.push({ t: text.slice(a, b), hi: true });
    pos = b;
  }
  if (pos < text.length) out.push({ t: text.slice(pos), hi: false });
  return out;
}
