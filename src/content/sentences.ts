import type { PartNo } from "@/lib/types";

/**
 * Example sentences written for SPEAK LAB (origin: "sample").
 * They are generic answer frames, not copied from any lecture or textbook.
 * Learners are expected to add their own 만능문장 from the materials they study.
 */
export const SEED_SENTENCES: { id: string; part: PartNo | "all"; en: string; ko: string; keywords: string[] }[] = [
  { id: "s-p2-1", part: 2, en: "This is a picture of a busy café.", ko: "이것은 붐비는 카페의 사진입니다.", keywords: ["picture", "busy"] },
  { id: "s-p2-2", part: 2, en: "The first thing I can see is a woman ordering a drink at the counter.", ko: "가장 먼저 보이는 것은 카운터에서 음료를 주문하는 여자입니다.", keywords: ["first thing", "ordering"] },
  { id: "s-p2-3", part: 2, en: "On the right side of the picture, two people are sitting at a table.", ko: "사진 오른쪽에는 두 사람이 테이블에 앉아 있습니다.", keywords: ["right side", "sitting"] },
  { id: "s-p2-4", part: 2, en: "In the background, I can see some tall buildings.", ko: "배경에는 높은 건물 몇 채가 보입니다.", keywords: ["background", "tall"] },
  { id: "s-p2-5", part: 2, en: "It seems like a peaceful afternoon.", ko: "평화로운 오후인 것 같습니다.", keywords: ["seems", "peaceful"] },
  { id: "s-p3-1", part: 3, en: "I usually do it about once a week, because it's convenient and saves me a lot of time.", ko: "보통 일주일에 한 번 정도 하는데, 편리하고 시간을 많이 아껴주기 때문입니다.", keywords: ["once a week", "convenient", "saves"] },
  { id: "s-p3-2", part: 3, en: "The main reason is that it helps me relieve stress.", ko: "주된 이유는 그것이 스트레스를 푸는 데 도움이 되기 때문입니다.", keywords: ["main reason", "relieve"] },
  { id: "s-p3-3", part: 3, en: "To be honest, I don't do that very often.", ko: "솔직히 말하면, 저는 그것을 자주 하지 않습니다.", keywords: ["honest", "often"] },
  { id: "s-p3-4", part: 3, en: "For example, last weekend, I went there with my friends and had a great time.", ko: "예를 들어, 지난 주말에 친구들과 거기에 갔는데 정말 즐거웠습니다.", keywords: ["For example", "last weekend"] },
  { id: "s-p4-1", part: 4, en: "I'm sorry, but there seems to be a mistake. That session has been canceled.", ko: "죄송하지만 착오가 있는 것 같습니다. 그 세션은 취소되었습니다.", keywords: ["mistake", "canceled"] },
  { id: "s-p4-2", part: 4, en: "There are two sessions you might be interested in.", ko: "관심 가지실 만한 세션이 두 개 있습니다.", keywords: ["two sessions", "interested"] },
  { id: "s-p4-3", part: 4, en: "First, from 1 to 2:30 p.m., there will be a workshop led by the IT team.", ko: "먼저, 오후 1시부터 2시 30분까지 IT팀이 진행하는 워크숍이 있습니다.", keywords: ["First", "led by"] },
  { id: "s-p4-4", part: 4, en: "Don't worry. You don't need to buy them separately.", ko: "걱정 마세요. 따로 구매하실 필요가 없습니다.", keywords: ["worry", "separately"] },
  { id: "s-p5-1", part: 5, en: "I agree with the statement for two reasons.", ko: "저는 두 가지 이유로 그 의견에 동의합니다.", keywords: ["agree", "two reasons"] },
  { id: "s-p5-2", part: 5, en: "First of all, it gives people more opportunities to develop their skills.", ko: "우선, 그것은 사람들에게 능력을 개발할 더 많은 기회를 줍니다.", keywords: ["First of all", "opportunities", "develop"] },
  { id: "s-p5-3", part: 5, en: "On top of that, it helps people save both time and money.", ko: "게다가, 그것은 사람들이 시간과 돈을 모두 아끼도록 도와줍니다.", keywords: ["On top of that", "save"] },
  { id: "s-p5-4", part: 5, en: "For these reasons, I believe it is the better choice.", ko: "이러한 이유로, 저는 그것이 더 나은 선택이라고 생각합니다.", keywords: ["For these reasons", "better choice"] },
  { id: "s-p1-1", part: 1, en: "Please make sure your mobile phones are switched to silent mode.", ko: "휴대폰을 무음 모드로 바꿔 주시기 바랍니다. (끊어 읽기·연음 연습)", keywords: ["make sure", "silent mode"] },
];

/** v2 — expanded bank, also original SPEAK LAB writing. */
export const SEED_SENTENCES_V2: typeof SEED_SENTENCES = [
  // Part 1 — read-aloud phrasing & linking practice
  { id: "s2-p1-1", part: 1, en: "Thank you for calling. Our office is currently closed.", ko: "전화 주셔서 감사합니다. 저희 사무실은 현재 영업이 종료되었습니다.", keywords: ["currently closed"] },
  { id: "s2-p1-2", part: 1, en: "If you need to schedule, change, or cancel an appointment, please press one.", ko: "예약을 잡거나, 변경하거나, 취소하시려면 1번을 눌러 주세요. (나열 억양: ↗ ↗ ↘)", keywords: ["schedule", "cancel"] },
  { id: "s2-p1-3", part: 1, en: "Later in the show, our guest will share some useful tips.", ko: "방송 후반에 게스트가 유용한 팁을 공유할 예정입니다.", keywords: ["Later in the show", "useful tips"] },
  { id: "s2-p1-4", part: 1, en: "For more information, please visit our website.", ko: "더 자세한 정보는 저희 웹사이트를 방문해 주세요.", keywords: ["more information", "visit"] },
  // Part 2 — describing pictures
  { id: "s2-p2-1", part: 2, en: "This picture was taken in a crowded street.", ko: "이 사진은 붐비는 거리에서 찍혔습니다.", keywords: ["was taken", "crowded"] },
  { id: "s2-p2-2", part: 2, en: "In the middle of the picture, a man is holding a cup of coffee.", ko: "사진 가운데에서 한 남자가 커피 한 잔을 들고 있습니다.", keywords: ["In the middle", "holding"] },
  { id: "s2-p2-3", part: 2, en: "Next to him, a woman with short hair is looking at her phone.", ko: "그 옆에는 짧은 머리의 여자가 휴대폰을 보고 있습니다.", keywords: ["Next to him", "looking at"] },
  { id: "s2-p2-4", part: 2, en: "In the foreground, there are some bicycles parked along the road.", ko: "앞쪽에는 길을 따라 자전거 몇 대가 세워져 있습니다.", keywords: ["foreground", "parked"] },
  { id: "s2-p2-5", part: 2, en: "He is wearing a white shirt and black pants.", ko: "그는 흰 셔츠와 검은 바지를 입고 있습니다.", keywords: ["wearing"] },
  { id: "s2-p2-6", part: 2, en: "They seem to be enjoying their time together.", ko: "그들은 함께하는 시간을 즐기고 있는 것 같습니다.", keywords: ["seem to be", "enjoying"] },
  { id: "s2-p2-7", part: 2, en: "Behind them, I can see a row of shops.", ko: "그들 뒤로 가게들이 줄지어 있는 것이 보입니다.", keywords: ["Behind them", "a row of"] },
  { id: "s2-p2-8", part: 2, en: "Some people are waiting in line to buy tickets.", ko: "몇몇 사람들이 표를 사기 위해 줄을 서서 기다리고 있습니다.", keywords: ["waiting in line"] },
  // Part 3 — personal answers
  { id: "s2-p3-1", part: 3, en: "I usually go there with my family on weekends.", ko: "저는 보통 주말에 가족과 함께 그곳에 갑니다.", keywords: ["usually", "on weekends"] },
  { id: "s2-p3-2", part: 3, en: "The last time I did it was about two weeks ago.", ko: "마지막으로 그것을 한 건 2주 전쯤이었습니다.", keywords: ["The last time", "ago"] },
  { id: "s2-p3-3", part: 3, en: "It's close to my house, so I can get there in ten minutes.", ko: "집에서 가까워서 10분 만에 갈 수 있습니다.", keywords: ["close to", "get there"] },
  { id: "s2-p3-4", part: 3, en: "These days, many people prefer to do it online.", ko: "요즘에는 많은 사람들이 그것을 온라인으로 하는 것을 선호합니다.", keywords: ["These days", "prefer"] },
  { id: "s2-p3-5", part: 3, en: "It's much cheaper, and I can compare prices easily.", ko: "훨씬 저렴하고 가격을 쉽게 비교할 수 있습니다.", keywords: ["cheaper", "compare"] },
  { id: "s2-p3-6", part: 3, en: "I would definitely recommend it to my friends.", ko: "저는 친구들에게 그것을 꼭 추천하고 싶습니다.", keywords: ["definitely", "recommend"] },
  { id: "s2-p3-7", part: 3, en: "When I have free time, I like to watch videos on my phone.", ko: "여가 시간이 있을 때 저는 휴대폰으로 영상 보는 것을 좋아합니다.", keywords: ["free time", "like to"] },
  { id: "s2-p3-8", part: 3, en: "It helps me stay healthy and feel refreshed.", ko: "그것은 제가 건강을 유지하고 기분 전환하는 데 도움이 됩니다.", keywords: ["stay healthy", "refreshed"] },
  { id: "s2-p3-9", part: 3, en: "I think the most important thing is the location.", ko: "가장 중요한 것은 위치라고 생각합니다.", keywords: ["most important", "location"] },
  { id: "s2-p3-10", part: 3, en: "That's why I always check reviews before I decide.", ko: "그래서 저는 결정하기 전에 항상 후기를 확인합니다.", keywords: ["That's why", "reviews"] },
  // Part 4 — information answers
  { id: "s2-p4-1", part: 4, en: "Let me check the schedule for you.", ko: "일정을 확인해 드리겠습니다.", keywords: ["check the schedule"] },
  { id: "s2-p4-2", part: 4, en: "The event will be held on Friday, May 3rd, in the main hall.", ko: "행사는 5월 3일 금요일에 메인 홀에서 열릴 예정입니다.", keywords: ["will be held", "main hall"] },
  { id: "s2-p4-3", part: 4, en: "It starts at 9 a.m. and ends at 5 p.m.", ko: "오전 9시에 시작해서 오후 5시에 끝납니다.", keywords: ["starts at", "ends at"] },
  { id: "s2-p4-4", part: 4, en: "Actually, that session has been moved to the afternoon.", ko: "사실 그 세션은 오후로 옮겨졌습니다.", keywords: ["Actually", "moved"] },
  { id: "s2-p4-5", part: 4, en: "You need to register by March 25th.", ko: "3월 25일까지 등록하셔야 합니다.", keywords: ["register by"] },
  { id: "s2-p4-6", part: 4, en: "After that, you will have a lunch break from noon to 1 p.m.", ko: "그다음, 정오부터 오후 1시까지 점심시간이 있습니다.", keywords: ["After that", "lunch break"] },
  { id: "s2-p4-7", part: 4, en: "Lastly, the day will end with a closing speech by the CEO.", ko: "마지막으로, 하루는 CEO의 폐회사로 마무리됩니다.", keywords: ["Lastly", "closing speech"] },
  { id: "s2-p4-8", part: 4, en: "The fee is 50 dollars, and it includes lunch.", ko: "참가비는 50달러이며 점심이 포함되어 있습니다.", keywords: ["fee", "includes"] },
  // Part 5 — opinion structure
  { id: "s2-p5-1", part: 5, en: "In my opinion, it is better to work in a team.", ko: "제 생각에는 팀으로 일하는 것이 더 낫습니다.", keywords: ["In my opinion", "better"] },
  { id: "s2-p5-2", part: 5, en: "I disagree with the statement for the following reasons.", ko: "저는 다음과 같은 이유로 그 의견에 반대합니다.", keywords: ["disagree", "following reasons"] },
  { id: "s2-p5-3", part: 5, en: "This is because people can share ideas and learn from each other.", ko: "왜냐하면 사람들이 아이디어를 공유하고 서로에게서 배울 수 있기 때문입니다.", keywords: ["This is because", "each other"] },
  { id: "s2-p5-4", part: 5, en: "As a result, they can finish their work more efficiently.", ko: "그 결과, 그들은 일을 더 효율적으로 끝낼 수 있습니다.", keywords: ["As a result", "efficiently"] },
  { id: "s2-p5-5", part: 5, en: "For example, when I was in college, I worked on a group project.", ko: "예를 들어, 대학생 때 저는 팀 프로젝트를 했습니다.", keywords: ["For example", "group project"] },
  { id: "s2-p5-6", part: 5, en: "Thanks to my teammates, we got a good grade.", ko: "팀원들 덕분에 우리는 좋은 점수를 받았습니다.", keywords: ["Thanks to", "good grade"] },
  { id: "s2-p5-7", part: 5, en: "On the other hand, it can be stressful at times.", ko: "반면에 때로는 스트레스를 받을 수도 있습니다.", keywords: ["On the other hand", "at times"] },
  { id: "s2-p5-8", part: 5, en: "It can save a lot of time and reduce costs.", ko: "그것은 많은 시간을 아끼고 비용을 줄일 수 있습니다.", keywords: ["save", "reduce costs"] },
  { id: "s2-p5-9", part: 5, en: "That's why I strongly believe that this is the right choice.", ko: "그래서 저는 이것이 옳은 선택이라고 강하게 믿습니다.", keywords: ["strongly believe", "right choice"] },
  { id: "s2-p5-10", part: 5, en: "Nowadays, technology plays an important role in our daily lives.", ko: "요즘 기술은 우리 일상생활에서 중요한 역할을 합니다.", keywords: ["Nowadays", "plays an important role"] },
  // Common fillers to buy time naturally
  { id: "s2-all-1", part: "all", en: "That's a good question. Let me think about it for a second.", ko: "좋은 질문이네요. 잠깐 생각해 볼게요. (시간 벌기)", keywords: ["good question", "for a second"] },
  { id: "s2-all-2", part: "all", en: "To be more specific, I mean that it's very convenient.", ko: "좀 더 구체적으로 말하면, 그게 아주 편리하다는 뜻입니다.", keywords: ["To be more specific"] },
  { id: "s2-all-3", part: "all", en: "Overall, I'm very satisfied with it.", ko: "전반적으로 저는 그것에 매우 만족합니다.", keywords: ["Overall", "satisfied"] },
];
