import type { PartNo } from "@/lib/types";
import { PART_SPECS } from "./exam";

/**
 * All practice questions and model answers below were written independently
 * for SPEAK LAB as EXAMPLES. They are not official ETS items and are not taken
 * from any textbook or lecture.
 */

export type SceneId = "cafe" | "office" | "market" | "park";

export type SetContext =
  | { kind: "none" }
  | { kind: "scenario"; text: string }
  | { kind: "schedule"; intro: string; title: string; subtitle: string; columns: string[]; rows: string[][]; footnote?: string };

export interface Question {
  id: string;
  qNo: number;
  prompt: string; // passage (P1), scene caption (P2) or question text
  scene?: SceneId;
  prepSec: number;
  respSec: number;
  repeat?: boolean; // P4 Q10 is played twice in the real test
  sample: string;
  tip: string;
}

export interface QuestionSet {
  id: string;
  part: PartNo;
  title: string;
  context: SetContext;
  readSec?: number;
  questions: Question[];
}

function q(part: PartNo, idx: number, base: Omit<Question, "prepSec" | "respSec">): Question {
  const spec = PART_SPECS[part];
  return { ...base, prepSec: spec.prepSec[idx], respSec: spec.respSec[idx] };
}

const BASE_SETS: QuestionSet[] = [
  /* ───────── Part 1 ───────── */
  {
    id: "p1-a",
    part: 1,
    title: "자동 응답 안내 · 라디오 소개",
    context: { kind: "none" },
    questions: [
      q(1, 0, {
        id: "p1-a-1",
        qNo: 1,
        prompt:
          "Thank you for calling Riverside Dental Clinic. Our office is currently closed for the holiday weekend. If you need to schedule, change, or cancel an appointment, please press one. For billing questions, press two. In case of a dental emergency, please call our after-hours line, and a staff member will return your call shortly.",
        sample: "",
        tip: "나열(schedule, change, or cancel)은 앞 두 단어를 올리고 마지막을 내립니다. 고유명사 Riverside Dental Clinic은 또박또박.",
      }),
      q(1, 1, {
        id: "p1-a-2",
        qNo: 2,
        prompt:
          "Welcome to this week's episode of City Food Talk. Today, we'll visit three new restaurants downtown, sample their most popular dishes, and speak with the chefs behind them. Later in the show, our guest, food writer Maria Lopez, will share her tips for cooking healthy, affordable meals at home.",
        sample: "",
        tip: "삽입구(our guest, food writer Maria Lopez,) 앞뒤로 짧게 끊어 읽기. 숫자 three와 형용사 healthy, affordable에 강세.",
      }),
    ],
  },
  {
    id: "p1-b",
    part: 1,
    title: "매장 안내 방송 · 컨퍼런스 환영사",
    context: { kind: "none" },
    questions: [
      q(1, 0, {
        id: "p1-b-1",
        qNo: 1,
        prompt:
          "Attention, shoppers. For the next hour, all winter jackets, boots, and gloves in our clothing department are twenty percent off. In addition, members of our rewards program can receive free gift wrapping at the customer service desk. Thank you for shopping at Greenfield Mall.",
        sample: "",
        tip: "twenty percent off는 할인 정보의 핵심이므로 천천히 강조. In addition 뒤에서 한 번 쉬기.",
      }),
      q(1, 1, {
        id: "p1-b-2",
        qNo: 2,
        prompt:
          "Good morning, and welcome to the annual Harbor City Technology Conference. Before we begin, please make sure your mobile phones are switched to silent mode. Today's sessions will focus on online security, data management, and the future of remote work. Lunch will be served in the main hall at noon.",
        sample: "",
        tip: "annual[ǽnjuəl], security, management 강세 위치 확인. 세 항목 나열의 억양 패턴 유지.",
      }),
    ],
  },

  /* ───────── Part 2 ───────── */
  {
    id: "p2-a",
    part: 2,
    title: "카페 · 사무실",
    context: { kind: "none" },
    questions: [
      q(2, 0, {
        id: "p2-a-1",
        qNo: 3,
        scene: "cafe",
        prompt: "Describe the picture in as much detail as you can.",
        sample:
          "This is a picture of a busy café. The first thing I can see is a woman ordering a drink at the counter. She is wearing a yellow sweater. Behind the counter, a man in an apron is preparing coffee. On the right side of the picture, two people are sitting at a round table and talking with each other. It seems like a relaxing afternoon.",
        tip: "장소 → 가장 눈에 띄는 인물 → 주변 인물 → 느낌 순서. 현재진행형(is -ing)으로 동작 묘사.",
      }),
      q(2, 1, {
        id: "p2-a-2",
        qNo: 4,
        scene: "office",
        prompt: "Describe the picture in as much detail as you can.",
        sample:
          "This picture was taken in an office. In the middle of the picture, three people are having a meeting around a table. A man on the left is pointing at a chart on the screen. The woman next to him is taking notes on her laptop. In the background, I can see a large window and some plants. It seems like they are discussing an important project.",
        tip: "배경(background)과 사물(screen, laptop, plants)로 시간을 채우세요. 추측은 It seems like로 마무리.",
      }),
    ],
  },
  {
    id: "p2-b",
    part: 2,
    title: "시장 · 공원",
    context: { kind: "none" },
    questions: [
      q(2, 0, {
        id: "p2-b-1",
        qNo: 3,
        scene: "market",
        prompt: "Describe the picture in as much detail as you can.",
        sample:
          "This is a picture of an outdoor market. The first thing I can see is a vendor standing behind a fruit stand. He is wearing a cap and handing a bag to a customer. There are many boxes of apples and oranges on the table. On the left side, a woman with a shopping basket is looking at some vegetables. It looks like a sunny weekend morning.",
        tip: "There are + 복수명사로 사물을 묘사하면 문장이 쉽게 늘어납니다.",
      }),
      q(2, 1, {
        id: "p2-b-2",
        qNo: 4,
        scene: "park",
        prompt: "Describe the picture in as much detail as you can.",
        sample:
          "This picture was taken in a park. In the foreground, a man is walking his dog along a path. On the right side of the picture, a woman is sitting on a bench and reading a book. Behind her, there are tall trees with green leaves. In the background, I can see some buildings. It seems like a peaceful day.",
        tip: "foreground / background / on the right side 같은 위치 표현을 문장 시작에 두세요.",
      }),
    ],
  },

  /* ───────── Part 3 ───────── */
  {
    id: "p3-a",
    part: 3,
    title: "영화 관람 전화 인터뷰",
    context: {
      kind: "scenario",
      text: "Imagine that a marketing firm is doing research in your country. You have agreed to participate in a telephone interview about going to the movies.",
    },
    questions: [
      q(3, 0, {
        id: "p3-a-1",
        qNo: 5,
        prompt: "How often do you go to the movies, and who do you usually go with?",
        sample:
          "I go to the movies about once a month, and I usually go with my friends, because we like to talk about the movie over dinner afterward.",
        tip: "질문의 두 가지(빈도, 동행)를 한 문장에 모두 답하고, because로 이유 하나.",
      }),
      q(3, 1, {
        id: "p3-a-2",
        qNo: 6,
        prompt: "What kind of movies do you usually watch, and why?",
        sample:
          "I usually watch action movies. The main reason is that they help me relieve stress after a long week at work.",
        tip: "15초 = 두 문장. 답 + The main reason is that...",
      }),
      q(3, 2, {
        id: "p3-a-3",
        qNo: 7,
        prompt: "Do you prefer to watch movies at a theater or at home? Why?",
        sample:
          "I prefer to watch movies at a theater. First of all, the screen and the sound are much better, so I can really focus on the story. Also, it's a good way to spend time with my friends outside the house. For example, last weekend, I watched a new action movie with my friends, and it was much more exciting than watching it on my phone. That's why I prefer theaters.",
        tip: "30초 = 입장 → 이유1 → 이유2 → 예시 → 마무리.",
      }),
    ],
  },
  {
    id: "p3-b",
    part: 3,
    title: "이웃 친구와 장보기 통화",
    context: {
      kind: "scenario",
      text: "Imagine that a friend is moving to your neighborhood. You are having a telephone conversation about grocery shopping.",
    },
    questions: [
      q(3, 0, {
        id: "p3-b-1",
        qNo: 5,
        prompt: "Where is the nearest grocery store, and how do you usually get there?",
        sample:
          "The nearest grocery store is about five minutes away from my apartment, so I usually walk there. It's really convenient.",
        tip: "거리/위치 + 교통수단을 한 번에.",
      }),
      q(3, 1, {
        id: "p3-b-2",
        qNo: 6,
        prompt: "When do you usually go grocery shopping, and why?",
        sample:
          "I usually go grocery shopping on Sunday mornings, because the store isn't crowded and the vegetables are fresh.",
        tip: "시간 + because 이유 하나로 15초를 채웁니다.",
      }),
      q(3, 2, {
        id: "p3-b-3",
        qNo: 7,
        prompt: "What do you think is the most important thing when choosing a grocery store? Why?",
        sample:
          "I think the most important thing is the price. These days, food prices are going up, so I want to save money on groceries. Also, cheaper stores often have discounts and special events. For example, the store near my house has a big sale every weekend, so I can buy fruit and meat at lower prices. That's why I think price is the most important.",
        tip: "These days, ... 로 배경을 깔면 이유가 자연스럽게 길어집니다.",
      }),
    ],
  },

  /* ───────── Part 4 ───────── */
  {
    id: "p4-a",
    part: 4,
    title: "신입사원 오리엔테이션 일정",
    readSec: PART_SPECS[4].readSec,
    context: {
      kind: "schedule",
      intro: "Hello, this is Tom. I'm starting work next week, but I lost my copy of the orientation schedule. I'd like to ask you a few questions.",
      title: "Brightway Marketing — New Employee Orientation",
      subtitle: "Monday, March 9 · Room 302",
      columns: ["Time", "Session", "Leader"],
      rows: [
        ["9:00 – 9:30 a.m.", "Welcome & Company Overview", "Linda Park, HR Director"],
        ["9:30 – 10:30 a.m.", "Workplace Safety Training", "David Kim"],
        ["10:30 – 11:30 a.m.", "Introduction to Our Clients — CANCELED", "Sarah Moore"],
        ["11:30 a.m. – 12:30 p.m.", "Lunch (Cafeteria, 1st floor)", "—"],
        ["1:00 – 2:30 p.m.", "Computer System Setup", "IT Team"],
        ["2:30 – 3:30 p.m.", "Team Meeting: Meet Your Managers", "Department Heads"],
      ],
    },
    questions: [
      q(4, 0, {
        id: "p4-a-1",
        qNo: 8,
        prompt: "What time does the orientation begin, and where will it be held?",
        sample: "The orientation begins at 9 a.m. on Monday, March 9th, and it will be held in Room 302.",
        tip: "시간 + 장소를 한 문장으로. 날짜까지 덧붙이면 15초가 자연스럽게 찹니다.",
      }),
      q(4, 1, {
        id: "p4-a-2",
        qNo: 9,
        prompt: "I heard that we will learn about our clients in the morning. Is that right?",
        sample:
          "I'm sorry, but there seems to be a mistake. The session Introduction to Our Clients, which was scheduled from 10:30 to 11:30, has been canceled.",
        tip: "잘못된 정보 정정 패턴: I'm sorry, but... + 정확한 정보.",
      }),
      q(4, 2, {
        id: "p4-a-3",
        qNo: 10,
        repeat: true,
        prompt: "Could you give me all the details about the sessions after lunch?",
        sample:
          "Sure. There are two sessions after lunch. First, from 1 to 2:30 p.m., there will be a Computer System Setup session led by the IT team. After that, from 2:30 to 3:30, you will have a team meeting where you can meet your managers.",
        tip: "There are two sessions → First → After that. 숫자 개수를 먼저 말하면 구조가 잡힙니다.",
      }),
    ],
  },
  {
    id: "p4-b",
    part: 4,
    title: "커뮤니티 센터 봄 강좌",
    readSec: PART_SPECS[4].readSec,
    context: {
      kind: "schedule",
      intro: "Hi, I'm interested in taking some classes at the community center this spring. I have a few questions.",
      title: "Westside Community Center — Spring Classes",
      subtitle: "April 1 – May 27 · Register by March 25 (online or at the front desk)",
      columns: ["Class", "Day / Time", "Instructor", "Fee"],
      rows: [
        ["Yoga for Beginners", "Mon & Wed, 7:00 – 8:00 p.m.", "Emma Lee", "$60"],
        ["Watercolor Painting", "Tuesdays, 6:30 – 8:30 p.m.", "Jason Cho", "$80 (materials included)"],
        ["Healthy Cooking", "Saturdays, 10:00 a.m. – 12:00 p.m.", "Rachel Green", "$90"],
        ["Photography Basics", "Thursdays, 7:00 – 9:00 p.m.", "Mark Davis", "$75"],
      ],
    },
    questions: [
      q(4, 0, {
        id: "p4-b-1",
        qNo: 8,
        prompt: "When do the spring classes start, and how can I register?",
        sample: "The spring classes start on April 1st. You can register online or at the front desk by March 25th.",
        tip: "질문 두 개 → 답 두 문장.",
      }),
      q(4, 1, {
        id: "p4-b-2",
        qNo: 9,
        prompt: "I'd like to take the painting class, but do I need to buy the materials separately?",
        sample:
          "Don't worry. You don't need to buy them separately. The Watercolor Painting class costs 80 dollars, and the materials are included.",
        tip: "Don't worry. 로 시작해 안심시키고 근거 정보 제시.",
      }),
      q(4, 2, {
        id: "p4-b-3",
        qNo: 10,
        repeat: true,
        prompt: "I'm only free on weekday evenings. Could you tell me about all the classes I can take?",
        sample:
          "Sure. There are three classes you can take on weekday evenings. First, Yoga for Beginners is on Mondays and Wednesdays from 7 to 8 p.m. Second, Watercolor Painting is on Tuesdays from 6:30 to 8:30. Lastly, Photography Basics is on Thursdays from 7 to 9 p.m.",
        tip: "조건(평일 저녁)에 맞는 항목만 골라 개수 → 하나씩.",
      }),
    ],
  },

  /* ───────── Part 5 ───────── */
  {
    id: "p5-a",
    part: 5,
    title: "대기업 vs 중소기업",
    context: { kind: "none" },
    questions: [
      q(5, 0, {
        id: "p5-a-1",
        qNo: 11,
        prompt:
          "Do you agree or disagree with the following statement? It is better to work for a large company than for a small company. Use specific reasons and examples to support your opinion.",
        sample:
          "I agree that it is better to work for a large company, for two reasons. First of all, large companies usually offer higher salaries and better benefits. This means employees can feel more financially stable and focus on their work. On top of that, large companies provide many training programs, so workers can develop their skills. For example, my friend works for a big electronics company, and last year she took a free online course on data analysis. Thanks to this, she was able to lead a new project. For these reasons, I think working for a large company is better.",
        tip: "입장 → 이유1(+부연) → 이유2 → 예시(경험) → 결론. 60초는 6–8문장.",
      }),
    ],
  },
  {
    id: "p5-b",
    part: 5,
    title: "신입사원에게 더 중요한 능력",
    context: { kind: "none" },
    questions: [
      q(5, 0, {
        id: "p5-b-1",
        qNo: 11,
        prompt:
          "Which is more important for a new employee: good communication skills or technical knowledge? Give specific reasons and examples to support your opinion.",
        sample:
          "I think good communication skills are more important for a new employee. First of all, new employees need to ask a lot of questions and learn from their coworkers. If they communicate well, they can adapt to the company much faster. Also, most work is done in teams these days, so it is important to share ideas clearly. For example, when I started my first part-time job, I didn't know how to use the system, but I asked my manager politely and learned it in a day. For these reasons, I believe communication skills matter more.",
        tip: "선택형은 첫 문장에서 하나를 분명히 고르기.",
      }),
    ],
  },
  {
    id: "p5-c",
    part: 5,
    title: "학생 봉사활동 의무화",
    context: { kind: "none" },
    questions: [
      q(5, 0, {
        id: "p5-c-1",
        qNo: 11,
        prompt:
          "Some people think that high school students should be required to do volunteer work. What is your opinion? Give specific reasons and examples to support your opinion.",
        sample:
          "In my opinion, high school students should be required to do volunteer work. First, volunteering helps students learn responsibility. They have to arrive on time and finish their tasks, which is good practice for the future. Second, it gives them a chance to meet people from different backgrounds. For example, when I was in high school, I volunteered at a local library and taught children how to read. It made me more patient and confident. That's why I think volunteer work should be required.",
        tip: "In my opinion으로 열고, 이유마다 짧은 부연 한 문장.",
      }),
    ],
  },
];

const EXTRA_SETS: QuestionSet[] = [
  {
    id: "p1-c",
    part: 1,
    title: "공항 안내 · 박물관 투어",
    context: { kind: "none" },
    questions: [
      q(1, 0, { id: "p1-c-1", qNo: 1, prompt: "Attention, passengers on Flight 307 to Vancouver. Due to heavy snow, your departure has been delayed by approximately two hours. Please remain in the waiting area near Gate 14. Meal vouchers, snacks, and bottled water are available at the service counter. We apologize for the inconvenience and thank you for your patience.", sample: "", tip: "숫자(307, two hours, 14)는 또렷하게. apologize for the inconvenience는 한 호흡으로." }),
      q(1, 1, { id: "p1-c-2", qNo: 2, prompt: "Welcome to the Lakeside History Museum. On today's tour, you'll explore ancient tools, traditional clothing, and photographs from the early nineteen hundreds. Please do not touch the displays or use flash photography. At the end of the tour, feel free to visit our gift shop, café, and outdoor garden.", sample: "", tip: "연도 nineteen hundreds 읽기 주의. 금지 문장(Please do not…)은 단호한 톤으로." }),
    ],
  },
  {
    id: "p3-c",
    part: 3,
    title: "운동 습관 설문",
    context: { kind: "scenario", text: "Imagine that a health magazine is doing research in your area. You have agreed to participate in a telephone interview about exercise." },
    questions: [
      q(3, 0, { id: "p3-c-1", qNo: 5, prompt: "How often do you exercise, and where do you usually do it?", sample: "I exercise about three times a week, and I usually go to a gym near my office after work.", tip: "빈도 + 장소 한 문장." }),
      q(3, 1, { id: "p3-c-2", qNo: 6, prompt: "What kind of exercise do you enjoy the most? Why?", sample: "I enjoy running the most, because it's simple and I can do it anywhere without any equipment.", tip: "종류 + because 이유." }),
      q(3, 2, { id: "p3-c-3", qNo: 7, prompt: "Do you prefer to exercise alone or with other people? Why?", sample: "I prefer to exercise with other people. First, it's more fun, so I don't get bored easily. Also, my friends motivate me to keep going even when I'm tired. For example, last month I joined a running club, and now I run much longer than before. That's why I like exercising with others.", tip: "입장 → 이유 두 개 → 경험 → 마무리." }),
    ],
  },
  {
    id: "p3-d",
    part: 3,
    title: "친구와 휴대폰 사용 통화",
    context: { kind: "scenario", text: "Imagine that you are talking on the telephone with a friend. You are talking about using smartphones." },
    questions: [
      q(3, 0, { id: "p3-d-1", qNo: 5, prompt: "How many hours a day do you use your smartphone, and what do you mainly use it for?", sample: "I use my smartphone about four hours a day, and I mainly use it for watching videos and sending messages.", tip: "시간 + 용도." }),
      q(3, 1, { id: "p3-d-2", qNo: 6, prompt: "When was the last time you bought a new phone, and why did you buy it?", sample: "The last time I bought a new phone was last year, because my old phone's battery didn't last long.", tip: "The last time … was … 패턴." }),
      q(3, 2, { id: "p3-d-3", qNo: 7, prompt: "What do you think is the most important feature when buying a smartphone? Why?", sample: "I think the most important feature is the battery life. These days, I use my phone for almost everything, like banking, navigation, and work. If the battery dies, I can't do anything. For example, last month my phone died during a business trip, and I couldn't find my hotel. That's why battery life matters most to me.", tip: "These days로 배경 → 문제 상황 → 경험." }),
    ],
  },
  {
    id: "p4-c",
    part: 4,
    title: "출장 일정표",
    readSec: PART_SPECS[4].readSec,
    context: {
      kind: "schedule",
      intro: "Hi, this is Karen. I'm traveling to the Tokyo branch next week, but I don't have my itinerary with me. Could you help me with some information?",
      title: "Business Trip Itinerary — Karen Lee",
      subtitle: "Tokyo Branch Visit · October 14 – 16",
      columns: ["Date", "Time", "Details"],
      rows: [
        ["Mon, Oct 14", "8:30 a.m.", "Depart Seoul (Flight KE 703) — arrive 10:50 a.m."],
        ["Mon, Oct 14", "2:00 p.m.", "Meeting with Tokyo sales team (Room 5B)"],
        ["Tue, Oct 15", "10:00 a.m.", "Factory tour — CANCELED"],
        ["Tue, Oct 15", "1:00 p.m.", "Client lunch at Sakura Restaurant"],
        ["Tue, Oct 15", "4:00 p.m.", "Product presentation"],
        ["Wed, Oct 16", "3:00 p.m.", "Depart Tokyo (Flight KE 704)"],
      ],
      footnote: "Hotel: Grand Plaza Tokyo (3 nights)",
    },
    questions: [
      q(4, 0, { id: "p4-c-1", qNo: 8, prompt: "What time does my flight leave on Monday, and when does it arrive?", sample: "Your flight, KE 703, leaves Seoul at 8:30 a.m. on Monday, and it arrives in Tokyo at 10:50 a.m.", tip: "항공편명까지 붙이면 정보량이 늘어납니다." }),
      q(4, 1, { id: "p4-c-2", qNo: 9, prompt: "I remember I'm visiting the factory on Tuesday morning. Is that correct?", sample: "I'm sorry, but the factory tour on Tuesday at 10 a.m. has been canceled, so you don't need to go there.", tip: "취소 정정 패턴." }),
      q(4, 2, { id: "p4-c-3", qNo: 10, repeat: true, prompt: "Could you tell me all the details of my schedule on Tuesday afternoon?", sample: "Sure. There are two things scheduled for Tuesday afternoon. First, at 1 p.m., you will have lunch with a client at Sakura Restaurant. After that, at 4 p.m., you will give a product presentation.", tip: "개수 → First → After that." }),
    ],
  },
  {
    id: "p5-d",
    part: 5,
    title: "재택근무 vs 사무실 근무",
    context: { kind: "none" },
    questions: [
      q(5, 0, { id: "p5-d-1", qNo: 11, prompt: "Some people prefer to work from home, while others prefer to work at the office. Which do you prefer and why? Give specific reasons and examples to support your opinion.", sample: "I prefer to work from home for two reasons. First of all, I can save a lot of time because I don't have to commute. I used to spend almost two hours on the subway every day. On top of that, I can focus better in a quiet environment. For example, last month I worked from home for a week, and I finished my report two days earlier than planned. For these reasons, I think working from home is better for me.", tip: "used to로 과거 비교를 넣으면 설득력이 올라갑니다." }),
    ],
  },
  {
    id: "p5-e",
    part: 5,
    title: "온라인 수업의 장점",
    context: { kind: "none" },
    questions: [
      q(5, 0, { id: "p5-e-1", qNo: 11, prompt: "Do you agree or disagree with the following statement? Online classes are as effective as classes in a classroom. Give specific reasons and examples to support your opinion.", sample: "I agree that online classes are as effective as classroom classes. First, students can watch the lectures again and again, so they can review difficult parts. Second, they can study anytime and anywhere, which saves time. For example, I prepared for this test with online lectures. Whenever I didn't understand something, I just replayed the video. Thanks to this, I was able to study efficiently. That's why I agree with the statement.", tip: "again and again / anytime and anywhere 같은 반복 표현은 리듬이 좋아요." }),
    ],
  },
  {
    id: "p5-f",
    part: 5,
    title: "리더의 가장 중요한 자질",
    context: { kind: "none" },
    questions: [
      q(5, 0, { id: "p5-f-1", qNo: 11, prompt: "What is the most important quality of a good leader? Choose one of the following and explain why: good communication skills, honesty, or experience.", sample: "I think honesty is the most important quality of a good leader. If a leader is honest, team members can trust them. As a result, the team can work together more smoothly. Also, an honest leader admits mistakes, which creates a healthy work environment. For example, my former manager always explained the reasons behind her decisions, and everyone respected her. For these reasons, I believe honesty matters most.", tip: "선택지형은 하나만 고르고 끝까지 밀고 가기." }),
    ],
  },
];

export const QUESTION_SETS: QuestionSet[] = [...BASE_SETS, ...EXTRA_SETS].sort((a, b) => a.part - b.part);

export const SETS_BY_PART = (part: PartNo) => QUESTION_SETS.filter((s) => s.part === part);
export const findSet = (id: string) => QUESTION_SETS.find((s) => s.id === id);
export const findQuestion = (id: string) => {
  for (const s of QUESTION_SETS) {
    const qq = s.questions.find((x) => x.id === id);
    if (qq) return { set: s, question: qq };
  }
  return null;
};
