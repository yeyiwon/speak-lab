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

/**
 * v3 — answer templates (slot in your own words: [ ]) + multi-purpose sentences.
 * Written for SPEAK LAB; not taken from any lecture or textbook.
 */
type Seed = (typeof SEED_SENTENCES)[number];
const T = (id: string, part: Seed["part"], en: string, ko: string, keywords: string[]): Seed => ({ id, part, en, ko, keywords });

export const SEED_SENTENCES_V3: Seed[] = [
  // ── Part 2 template: 장소 → 메인 인물 → 주변 → 배경 → 느낌
  T("s3-p2-t1", 2, "This picture was taken in [an office].", "[템플릿·장소] 이 사진은 [사무실]에서 찍혔습니다.", ["was taken in"]),
  T("s3-p2-t2", 2, "The first thing I can see is [a man] who is [talking on the phone].", "[템플릿·메인] 가장 먼저 보이는 것은 [통화 중인] [남자]입니다.", ["The first thing I can see", "who is"]),
  T("s3-p2-t3", 2, "He has [short dark hair] and he is wearing [a gray suit].", "[템플릿·외모] 그는 [짧은 검은 머리]이고 [회색 정장]을 입고 있습니다.", ["has", "is wearing"]),
  T("s3-p2-t4", 2, "To his right, [a woman] is [typing something on her laptop].", "[템플릿·주변] 그의 오른쪽에서 [여자]가 [노트북에 무언가 입력하고] 있습니다.", ["To his right"]),
  T("s3-p2-t5", 2, "On the table, there are [some documents and a cup of coffee].", "[템플릿·사물] 테이블 위에는 [서류 몇 장과 커피 한 잔]이 있습니다.", ["On the table", "there are"]),
  T("s3-p2-t6", 2, "In the background, I can see [a large window and some plants].", "[템플릿·배경] 배경에는 [큰 창문과 화분 몇 개]가 보입니다.", ["In the background", "I can see"]),
  T("s3-p2-t7", 2, "Overall, it seems like [a busy morning at work].", "[템플릿·마무리] 전반적으로 [바쁜 업무 아침]인 것 같습니다.", ["Overall", "it seems like"]),
  T("s3-p2-1", 2, "Both of them are looking at the same direction.", "두 사람 모두 같은 방향을 보고 있습니다.", ["Both of them", "direction"]),
  T("s3-p2-2", 2, "A few people are walking across the street.", "몇몇 사람들이 길을 건너고 있습니다.", ["walking across"]),
  T("s3-p2-3", 2, "Some items are displayed on the shelves.", "몇몇 물건들이 선반에 진열되어 있습니다.", ["displayed", "shelves"]),
  T("s3-p2-4", 2, "It looks like they are having a meeting.", "그들은 회의를 하고 있는 것 같아 보입니다.", ["It looks like", "having a meeting"]),
  T("s3-p2-5", 2, "The weather looks sunny and warm.", "날씨가 화창하고 따뜻해 보입니다.", ["looks", "sunny"]),

  // ── Part 3 template: 답 + 이유 (+ 예시)
  T("s3-p3-t1", 3, "I [go to the gym] [about twice a week], and I usually go [with my coworkers].", "[템플릿·빈도+동행] 저는 [주 2회 정도] [헬스장에 가고], 보통 [동료들과] 갑니다.", ["about twice a week", "usually go"]),
  T("s3-p3-t2", 3, "The last time I [went shopping] was [last Saturday], and I [bought a jacket].", "[템플릿·마지막 경험] 마지막으로 [쇼핑한] 건 [지난 토요일]이었고, [재킷을 샀습니다].", ["The last time", "was"]),
  T("s3-p3-t3", 3, "I prefer [A] to [B], because it is much more [convenient].", "[템플릿·선호] 저는 [B]보다 [A]를 선호하는데, 훨씬 더 [편리]하기 때문입니다.", ["I prefer", "because"]),
  T("s3-p3-t4", 3, "I think [the price] is the most important factor when choosing [a hotel].", "[템플릿·중요 요소] [호텔]을 고를 때 [가격]이 가장 중요한 요소라고 생각합니다.", ["most important factor", "when choosing"]),
  T("s3-p3-t5", 3, "If I had the chance, I would like to [try it again].", "[템플릿·의향] 기회가 된다면 [다시 해보고] 싶습니다.", ["If I had the chance", "would like to"]),
  T("s3-p3-1", 3, "It depends on the situation, but I usually choose the cheaper one.", "상황에 따라 다르지만, 보통은 더 저렴한 것을 고릅니다.", ["It depends on", "usually choose"]),
  T("s3-p3-2", 3, "Honestly, I'm not really interested in that.", "솔직히 저는 그것에 별로 관심이 없습니다.", ["Honestly", "interested in"]),
  T("s3-p3-3", 3, "There are several reasons, but the biggest one is time.", "여러 이유가 있지만 가장 큰 이유는 시간입니다.", ["several reasons", "the biggest one"]),
  T("s3-p3-4", 3, "It's a great way to spend time with my family.", "가족과 시간을 보내기에 아주 좋은 방법입니다.", ["great way to", "spend time"]),
  T("s3-p3-5", 3, "I can easily find what I want, and it saves me a lot of money.", "원하는 것을 쉽게 찾을 수 있고, 돈도 많이 아낄 수 있습니다.", ["easily find", "saves me"]),
  T("s3-p3-6", 3, "Since I'm very busy on weekdays, I usually do it on weekends.", "평일엔 너무 바빠서 보통 주말에 합니다.", ["Since", "on weekdays"]),
  T("s3-p3-7", 3, "It used to be difficult, but now it's much easier thanks to technology.", "예전엔 어려웠지만 지금은 기술 덕분에 훨씬 쉬워졌습니다.", ["used to be", "thanks to"]),
  T("s3-p3-8", 3, "I would say about thirty minutes, more or less.", "대략 30분 정도라고 할 수 있습니다.", ["I would say", "more or less"]),

  // ── Part 4 template: 정보 전달 · 정정 · 나열
  T("s3-p4-t1", 4, "According to the schedule, [the meeting] will be held on [Monday] at [10 a.m.] in [Room 302].", "[템플릿·기본 정보] 일정에 따르면 [회의]는 [월요일] [오전 10시]에 [302호]에서 열립니다.", ["According to the schedule", "will be held"]),
  T("s3-p4-t2", 4, "I'm afraid you have the wrong information. [The workshop] is actually scheduled for [Thursday].", "[템플릿·정정] 잘못 알고 계신 것 같아요. [워크숍]은 사실 [목요일]로 예정되어 있습니다.", ["wrong information", "scheduled for"]),
  T("s3-p4-t3", 4, "There are [two] sessions related to [marketing].", "[템플릿·개수] [마케팅]과 관련된 세션이 [두 개] 있습니다.", ["related to"]),
  T("s3-p4-t4", 4, "The first one is [Social Media Strategy], which will be led by [Ms. Park] at [11 a.m.].", "[템플릿·나열1] 첫 번째는 [소셜 미디어 전략]으로, [오전 11시]에 [박 씨]가 진행합니다.", ["The first one", "led by"]),
  T("s3-p4-t5", 4, "The second one is [Brand Design], and it starts at [3 p.m.].", "[템플릿·나열2] 두 번째는 [브랜드 디자인]이고, [오후 3시]에 시작합니다.", ["The second one", "starts at"]),
  T("s3-p4-1", 4, "Don't worry, it has been rescheduled to next Tuesday.", "걱정 마세요, 다음 주 화요일로 일정이 변경되었습니다.", ["rescheduled"]),
  T("s3-p4-2", 4, "The registration fee is 30 dollars per person.", "등록비는 1인당 30달러입니다.", ["registration fee", "per person"]),
  T("s3-p4-3", 4, "Lunch will be provided, so you don't need to bring anything.", "점심이 제공되니 아무것도 가져오실 필요 없습니다.", ["will be provided", "don't need to"]),
  T("s3-p4-4", 4, "You will be staying at the Grand Hotel for three nights.", "그랜드 호텔에서 3박 머무르실 예정입니다.", ["will be staying", "three nights"]),
  T("s3-p4-5", 4, "Your flight departs at 8:30 a.m. and arrives at 10:50 a.m.", "비행기는 오전 8시 30분에 출발해서 오전 10시 50분에 도착합니다.", ["departs", "arrives"]),
  T("s3-p4-6", 4, "Unfortunately, that session is no longer available.", "안타깝게도 그 세션은 더 이상 진행되지 않습니다.", ["Unfortunately", "no longer available"]),

  // ── Part 5 template: 입장 → 이유1(+결과) → 이유2 → 예시 → 결론
  T("s3-p5-t1", 5, "I [agree] that [it is better to work for a large company], for two main reasons.", "[템플릿·입장] 저는 두 가지 주된 이유로 [대기업에서 일하는 것이 낫다]는 데 [동의]합니다.", ["for two main reasons"]),
  T("s3-p5-t2", 5, "First of all, [large companies offer better benefits].", "[템플릿·이유1] 우선, [대기업은 더 나은 복지를 제공합니다].", ["First of all"]),
  T("s3-p5-t3", 5, "This means that [employees can feel more secure about their future].", "[템플릿·부연] 이는 [직원들이 미래에 대해 더 안정감을 느낄 수 있다]는 뜻입니다.", ["This means that"]),
  T("s3-p5-t4", 5, "In addition, [there are more opportunities to learn new skills].", "[템플릿·이유2] 게다가 [새로운 기술을 배울 기회가 더 많습니다].", ["In addition"]),
  T("s3-p5-t5", 5, "Let me give you an example. When I was [in college], I [did an internship at a big company].", "[템플릿·예시] 예를 들어볼게요. 제가 [대학생]일 때, [대기업에서 인턴을 했습니다].", ["Let me give you an example", "When I was"]),
  T("s3-p5-t6", 5, "Because of this experience, I [learned a lot about teamwork].", "[템플릿·예시 결과] 이 경험 덕분에 저는 [팀워크에 대해 많이 배웠습니다].", ["Because of this experience"]),
  T("s3-p5-t7", 5, "Therefore, I believe that [working for a large company is the better choice].", "[템플릿·결론] 그러므로 저는 [대기업에서 일하는 것이 더 나은 선택]이라고 믿습니다.", ["Therefore", "I believe that"]),
  T("s3-p5-1", 5, "It helps people become more independent and responsible.", "그것은 사람들이 더 독립적이고 책임감 있게 되도록 돕습니다.", ["independent", "responsible"]),
  T("s3-p5-2", 5, "People can communicate more effectively with each other.", "사람들이 서로 더 효과적으로 소통할 수 있습니다.", ["communicate", "effectively"]),
  T("s3-p5-3", 5, "It allows people to focus on what really matters.", "그것은 사람들이 정말 중요한 것에 집중하게 해줍니다.", ["allows people to", "what really matters"]),
  T("s3-p5-4", 5, "It is a good chance to gain practical experience.", "실무 경험을 쌓을 좋은 기회입니다.", ["good chance", "practical experience"]),
  T("s3-p5-5", 5, "In the long run, it can lead to better results.", "장기적으로 그것은 더 좋은 결과로 이어질 수 있습니다.", ["In the long run", "lead to"]),
  T("s3-p5-6", 5, "Of course, there are some disadvantages, but the advantages are much bigger.", "물론 단점도 있지만, 장점이 훨씬 큽니다.", ["disadvantages", "advantages"]),
  T("s3-p5-7", 5, "Not only does it save time, but it also reduces stress.", "그것은 시간을 아낄 뿐만 아니라 스트레스도 줄여줍니다.", ["Not only", "but it also"]),
  T("s3-p5-8", 5, "Young people these days are very familiar with technology.", "요즘 젊은 사람들은 기술에 매우 익숙합니다.", ["these days", "familiar with"]),

  // ── Common / any part
  T("s3-all-1", "all", "Let me put it this way.", "이렇게 말해볼게요. (말 다시 시작할 때)", ["put it this way"]),
  T("s3-all-2", "all", "What I mean is that it's really helpful.", "제 말은 그게 정말 도움이 된다는 거예요.", ["What I mean is"]),
  T("s3-all-3", "all", "I've never thought about it before, but I think it's a good idea.", "전에 생각해본 적은 없지만, 좋은 생각인 것 같아요.", ["never thought about it", "good idea"]),
  T("s3-all-4", "all", "As far as I know, it's very popular in Korea.", "제가 알기로는 한국에서 매우 인기가 많습니다.", ["As far as I know", "popular"]),
  T("s3-all-5", "all", "That's pretty much it.", "대략 그 정도입니다. (답변 마무리)", ["pretty much it"]),
];

/** v4 — topic-based expressions for frequent TOEIC Speaking themes (original SPEAK LAB writing). */
export const SEED_SENTENCES_V4: Seed[] = [
  // Shopping · 쇼핑
  T("s4-shop-1", 3, "I usually shop online because I can compare prices in just a few minutes.", "몇 분 만에 가격을 비교할 수 있어서 보통 온라인으로 쇼핑해요.", ["shop online", "compare prices"]),
  T("s4-shop-2", 3, "I prefer to buy clothes in person, so I can try them on first.", "먼저 입어볼 수 있어서 옷은 직접 가서 사는 걸 선호해요.", ["in person", "try them on"]),
  T("s4-shop-3", 3, "There is a big shopping mall near my office, so I go there after work.", "회사 근처에 큰 쇼핑몰이 있어서 퇴근 후에 가요.", ["near my office", "after work"]),
  T("s4-shop-4", 3, "I always read customer reviews before I make a purchase.", "구매하기 전에 항상 고객 후기를 읽어요.", ["customer reviews", "make a purchase"]),
  // Travel · 여행
  T("s4-trav-1", 3, "The last trip I took was to Jeju Island with my family last summer.", "마지막 여행은 작년 여름 가족과 간 제주도였어요.", ["The last trip", "last summer"]),
  T("s4-trav-2", 3, "When I travel, I usually book a hotel that is close to the main attractions.", "여행할 때는 보통 주요 관광지와 가까운 호텔을 예약해요.", ["book a hotel", "close to"]),
  T("s4-trav-3", 3, "I like to plan everything in advance so that I don't waste any time.", "시간을 낭비하지 않으려고 모든 걸 미리 계획하는 걸 좋아해요.", ["in advance", "waste any time"]),
  T("s4-trav-4", 5, "Traveling abroad helps people understand different cultures.", "해외여행은 사람들이 다른 문화를 이해하는 데 도움이 됩니다.", ["abroad", "different cultures"]),
  // Transportation · 교통
  T("s4-tran-1", 3, "I take the subway to work because it's fast and never gets stuck in traffic.", "빠르고 교통 체증이 없어서 지하철로 출근해요.", ["take the subway", "stuck in traffic"]),
  T("s4-tran-2", 3, "It takes about forty minutes to get to my office from my house.", "집에서 회사까지 약 40분 걸려요.", ["It takes about", "get to"]),
  T("s4-tran-3", 5, "If public transportation were cheaper, more people would leave their cars at home.", "대중교통이 더 저렴하다면 더 많은 사람들이 차를 두고 다닐 거예요.", ["public transportation", "leave their cars"]),
  // Work · 직장
  T("s4-work-1", 5, "Working in a team teaches people how to solve problems together.", "팀으로 일하면 함께 문제를 해결하는 법을 배워요.", ["Working in a team", "solve problems"]),
  T("s4-work-2", 5, "A flexible schedule allows employees to balance work and personal life.", "유연한 근무 일정은 직원들이 일과 개인 생활의 균형을 맞추게 해줍니다.", ["flexible schedule", "balance"]),
  T("s4-work-3", 5, "Regular feedback from a manager can help new employees improve quickly.", "관리자의 정기적인 피드백은 신입 직원이 빠르게 성장하도록 도울 수 있어요.", ["Regular feedback", "improve quickly"]),
  T("s4-work-4", 5, "Companies should provide training programs for their employees.", "회사는 직원들을 위한 교육 프로그램을 제공해야 합니다.", ["provide", "training programs"]),
  T("s4-work-5", 4, "The orientation will take place in the main conference room on the second floor.", "오리엔테이션은 2층 대회의실에서 진행될 예정입니다.", ["take place", "conference room"]),
  // Technology · 기술
  T("s4-tech-1", 3, "I use my smartphone for almost everything, from banking to shopping.", "은행 업무부터 쇼핑까지 거의 모든 걸 스마트폰으로 해요.", ["almost everything", "from banking to shopping"]),
  T("s4-tech-2", 5, "Technology has made our lives much more convenient than before.", "기술은 우리 삶을 예전보다 훨씬 편리하게 만들었어요.", ["has made", "convenient"]),
  T("s4-tech-3", 5, "However, spending too much time on screens can be bad for our health.", "하지만 화면 앞에서 너무 많은 시간을 보내는 건 건강에 나쁠 수 있어요.", ["However", "on screens"]),
  T("s4-tech-4", 5, "Online meetings save time because people don't have to travel.", "이동할 필요가 없어서 온라인 회의는 시간을 아껴줘요.", ["Online meetings", "don't have to travel"]),
  // Health · 건강
  T("s4-heal-1", 3, "I try to walk at least thirty minutes a day to stay in shape.", "건강을 유지하려고 하루에 최소 30분은 걸으려고 해요.", ["at least", "stay in shape"]),
  T("s4-heal-2", 3, "Getting enough sleep is the most important thing for my health.", "충분히 자는 것이 제 건강에 가장 중요해요.", ["enough sleep", "most important"]),
  T("s4-heal-3", 5, "People who exercise regularly tend to be more productive at work.", "규칙적으로 운동하는 사람들은 업무 생산성이 더 높은 경향이 있어요.", ["exercise regularly", "tend to be"]),
  // Free time · 여가
  T("s4-free-1", 3, "On weekends, I usually relax at home and watch movies.", "주말에는 보통 집에서 쉬면서 영화를 봐요.", ["On weekends", "relax at home"]),
  T("s4-free-2", 3, "I recently started learning how to cook, and it's a lot of fun.", "최근에 요리를 배우기 시작했는데 정말 재미있어요.", ["recently started", "a lot of fun"]),
  T("s4-free-3", 3, "Reading books is a great way to relieve stress after a long day.", "긴 하루 끝에 책 읽기는 스트레스를 풀기 좋은 방법이에요.", ["great way to", "after a long day"]),
  // Education · 교육
  T("s4-edu-1", 5, "Students can learn practical skills through internships.", "학생들은 인턴십을 통해 실무 능력을 배울 수 있어요.", ["practical skills", "through internships"]),
  T("s4-edu-2", 5, "Learning a foreign language opens up more job opportunities.", "외국어를 배우면 더 많은 취업 기회가 열려요.", ["foreign language", "job opportunities"]),
  T("s4-edu-3", 5, "Teachers play an important role in shaping students' future.", "선생님은 학생들의 미래를 만드는 데 중요한 역할을 해요.", ["play an important role", "shaping"]),
  // Picture extras · 사진 묘사
  T("s4-pic-1", 2, "A woman in a long coat is pushing a shopping cart.", "긴 코트를 입은 여자가 쇼핑 카트를 밀고 있어요.", ["in a long coat", "pushing"]),
  T("s4-pic-2", 2, "Two men are shaking hands in front of a building.", "두 남자가 건물 앞에서 악수하고 있어요.", ["shaking hands", "in front of"]),
  T("s4-pic-3", 2, "A man is reaching for a book on the top shelf.", "한 남자가 맨 위 선반의 책을 집으려고 손을 뻗고 있어요.", ["reaching for", "top shelf"]),
  T("s4-pic-4", 2, "Several cars are parked on the side of the road.", "여러 대의 차가 길가에 주차되어 있어요.", ["Several cars", "side of the road"]),
  T("s4-pic-5", 2, "A group of people are sitting around a table and having lunch.", "한 무리의 사람들이 테이블에 둘러앉아 점심을 먹고 있어요.", ["sitting around", "having lunch"]),
  T("s4-pic-6", 2, "The sky is clear, so it seems like a nice day to go outside.", "하늘이 맑아서 밖에 나가기 좋은 날 같아요.", ["The sky is clear", "nice day"]),
  // Info table extras · 정보 제공
  T("s4-info-1", 4, "The keynote speech will be given by Dr. Kim at 9:30 a.m.", "기조연설은 오전 9시 30분에 김 박사님이 하실 예정입니다.", ["keynote speech", "will be given by"]),
  T("s4-info-2", 4, "Participants can sign up on our website until Friday.", "참가자는 금요일까지 웹사이트에서 신청할 수 있습니다.", ["sign up", "until Friday"]),
  T("s4-info-3", 4, "Coffee and snacks will be served during the break.", "쉬는 시간에 커피와 간식이 제공됩니다.", ["will be served", "during the break"]),
  T("s4-info-4", 4, "Your interview is scheduled for 2 p.m. with the HR manager.", "면접은 오후 2시에 인사 담당자와 예정되어 있습니다.", ["is scheduled for", "HR manager"]),
  T("s4-info-5", 4, "Please note that the room has been changed to 305.", "회의실이 305호로 변경된 점 참고해 주세요.", ["Please note", "has been changed"]),
  // Opinion connectors · 의견 연결
  T("s4-op-1", 5, "To begin with, it gives people more freedom.", "우선, 그것은 사람들에게 더 많은 자유를 줘요.", ["To begin with", "freedom"]),
  T("s4-op-2", 5, "Another reason is that it helps people build good habits.", "또 다른 이유는 좋은 습관을 만드는 데 도움이 된다는 거예요.", ["Another reason is that", "good habits"]),
  T("s4-op-3", 5, "From my experience, it really makes a big difference.", "제 경험상 그것은 정말 큰 차이를 만들어요.", ["From my experience", "big difference"]),
  T("s4-op-4", 5, "That is why I strongly agree with this idea.", "그래서 저는 이 생각에 강하게 동의합니다.", ["That is why", "strongly agree"]),
  T("s4-op-5", 5, "Some people may disagree, but I still think it's worth it.", "반대하는 사람도 있겠지만 저는 여전히 그럴 가치가 있다고 생각해요.", ["may disagree", "worth it"]),
  T("s4-op-6", 5, "In conclusion, the benefits clearly outweigh the drawbacks.", "결론적으로 장점이 단점보다 확실히 더 큽니다.", ["In conclusion", "outweigh"]),
  T("s4-op-7", 5, "It not only saves money but also protects the environment.", "그것은 돈을 아낄 뿐 아니라 환경도 보호해요.", ["not only", "but also"]),
  T("s4-op-8", 5, "As a result, people can enjoy a better quality of life.", "그 결과, 사람들은 더 나은 삶의 질을 누릴 수 있어요.", ["As a result", "quality of life"]),
];
