import type { SceneId } from "@/content/questions";

/**
 * Original clay-style illustrations for Part 2 practice (SPEAK LAB 예시).
 * Simplified on purpose: every element mentioned in the model answer is visible.
 */
const SKIN = ["#f1c7a5", "#d9a47c", "#a8714f", "#f5d3b8"];

function Person({ x, y, s = 1, shirt, skin = SKIN[0], hair = "#1c1d1f", sit = false, armUp = false, longHair = false, cap }: {
  x: number; y: number; s?: number; shirt: string; skin?: string; hair?: string; sit?: boolean; armUp?: boolean; longHair?: boolean; cap?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {!sit && (
        <>
          <rect x={-9} y={30} width={8} height={34} rx={4} fill="#303337" />
          <rect x={1} y={30} width={8} height={34} rx={4} fill="#303337" />
        </>
      )}
      {sit && <rect x={-10} y={28} width={30} height={9} rx={4.5} fill="#303337" />}
      {longHair && <rect x={-12} y={-30} width={24} height={34} rx={11} fill={hair} />}
      <rect x={-13} y={-6} width={26} height={40} rx={12} fill={shirt} />
      <rect x={armUp ? 8 : 9} y={armUp ? -14 : 0} width={7} height={26} rx={3.5} fill={shirt} transform={armUp ? "rotate(-50 12 0)" : undefined} />
      <circle cx={0} cy={-18} r={12} fill={skin} />
      {!longHair && <path d="M-12 -20a12 12 0 0 1 24 0q-12-7-24 0z" fill={hair} />}
      {cap && <path d="M-13 -21a13 11 0 0 1 26 0h6v3h-32z" fill={cap} />}
    </g>
  );
}

function Frame({ children, label, bg }: { children: React.ReactNode; label: string; bg: string }) {
  return (
    <svg viewBox="0 0 400 260" className="h-auto w-full rounded-[22px]" role="img" aria-label={label}>
      <rect width="400" height="260" fill={bg} />
      {children}
    </svg>
  );
}

export function Scene({ id }: { id: SceneId }) {
  switch (id) {
    case "cafe":
      return (
        <Frame bg="#e7f0f9" label="카페 사진 예시: 카운터에서 주문하는 노란 스웨터의 여자, 앞치마를 두른 남자 바리스타, 오른쪽 원형 테이블에 앉아 대화하는 두 사람">
          <rect x="0" y="190" width="400" height="70" fill="#b4d0ea" />
          <rect x="20" y="40" width="150" height="60" rx="10" fill="#cfe3f5" />
          <text x="95" y="76" textAnchor="middle" fontSize="16" fontWeight="800" fill="#3a5675">MENU</text>
          <Person x={80} y={118} shirt="#f2f6fb" skin={SKIN[1]} />
          <rect x="66" y="110" width="28" height="40" rx="8" fill="#4c6f93" />
          <rect x="20" y="150" width="180" height="60" rx="14" fill="#5a5f66" />
          <rect x="140" y="128" width="26" height="22" rx="6" fill="#303337" />
          <Person x={150} y={150} shirt="#f2c94c" longHair hair="#5b3a29" armUp />
          <rect x="250" y="170" width="110" height="12" rx="6" fill="#42464b" />
          <rect x="300" y="182" width="10" height="40" fill="#42464b" />
          <Person x={250} y={160} shirt="#8fb2d5" sit skin={SKIN[2]} />
          <Person x={362} y={160} shirt="#303337" sit skin={SKIN[3]} longHair hair="#1c1d1f" />
          <rect x="285" y="158" width="12" height="12" rx="3" fill="#f2f6fb" />
          <rect x="315" y="158" width="12" height="12" rx="3" fill="#f2f6fb" />
        </Frame>
      );
    case "office":
      return (
        <Frame bg="#f4f8fc" label="사무실 사진 예시: 테이블에서 회의하는 세 사람, 화면의 차트를 가리키는 왼쪽 남자, 노트북으로 메모하는 여자, 뒤쪽의 큰 창문과 화분">
          <rect x="230" y="20" width="150" height="110" rx="8" fill="#cfe3f5" stroke="#b4d0ea" strokeWidth="6" />
          <line x1="305" y1="20" x2="305" y2="130" stroke="#b4d0ea" strokeWidth="4" />
          <rect x="30" y="30" width="150" height="90" rx="8" fill="#303337" />
          <rect x="50" y="85" width="18" height="25" fill="#8fb2d5" />
          <rect x="78" y="65" width="18" height="45" fill="#cfe3f5" />
          <rect x="106" y="50" width="18" height="60" fill="#8fb2d5" />
          <rect x="134" y="72" width="18" height="38" fill="#cfe3f5" />
          <rect x="0" y="200" width="400" height="60" fill="#cfe3f5" />
          <ellipse cx="370" cy="170" rx="22" ry="30" fill="#3f8a6b" />
          <rect x="358" y="190" width="24" height="24" rx="5" fill="#5a5f66" />
          <Person x={70} y={150} shirt="#4c6f93" armUp skin={SKIN[0]} />
          <Person x={150} y={165} shirt="#f2f6fb" sit longHair hair="#5b3a29" skin={SKIN[3]} />
          <Person x={290} y={165} shirt="#303337" sit skin={SKIN[2]} />
          <rect x="110" y="190" width="220" height="14" rx="7" fill="#5a5f66" />
          <rect x="150" y="176" width="40" height="14" rx="3" fill="#9aa1a9" />
        </Frame>
      );
    case "market":
      return (
        <Frame bg="#cfe3f5" label="야외 시장 사진 예시: 모자를 쓰고 과일 가판대 뒤에서 손님에게 봉투를 건네는 상인, 사과와 오렌지 상자, 왼쪽에서 바구니를 들고 채소를 보는 여자">
          <circle cx="350" cy="40" r="22" fill="#f4f8fc" />
          <path d="M150 60h230l-15 30H165z" fill="#4c6f93" />
          <path d="M150 90h230" stroke="#f4f8fc" strokeWidth="4" strokeDasharray="20 10" />
          <Person x={265} y={135} shirt="#5a5f66" cap="#1c1d1f" skin={SKIN[1]} armUp />
          <rect x="160" y="170" width="220" height="50" rx="10" fill="#8a6a4f" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x={170 + i * 52} y={150} width={44} height={24} rx={6} fill="#a8865f" />
              {[0, 1, 2].map((j) => (
                <circle key={j} cx={181 + i * 52 + j * 11} cy={152} r={6} fill={i % 2 ? "#f0a23b" : "#d9534f"} />
              ))}
            </g>
          ))}
          <Person x={355} y={140} shirt="#f2f6fb" longHair hair="#1c1d1f" skin={SKIN[0]} />
          <rect x="320" y="128" width="16" height="20" rx="4" fill="#f4f8fc" stroke="#9aa1a9" />
          <rect x="20" y="175" width="100" height="40" rx="10" fill="#8a6a4f" />
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse key={i} cx={34 + i * 18} cy={172} rx={9} ry={7} fill="#3f8a6b" />
          ))}
          <Person x={70} y={130} shirt="#8fb2d5" longHair hair="#5b3a29" skin={SKIN[3]} />
          <path d="M84 150h22l-4 18H88z" fill="#a8865f" />
          <rect x="0" y="220" width="400" height="40" fill="#9aa1a9" />
        </Frame>
      );
    case "park":
      return (
        <Frame bg="#e7f0f9" label="공원 사진 예시: 앞쪽 길에서 개를 산책시키는 남자, 오른쪽 벤치에서 책을 읽는 여자, 그 뒤의 큰 나무들, 배경의 건물들">
          {[20, 70, 115, 300, 345].map((x, i) => (
            <rect key={x} x={x} y={40 + (i % 3) * 14} width={40} height={110} rx={4} fill="#b4d0ea" />
          ))}
          <rect x="0" y="140" width="400" height="120" fill="#a9c9a0" />
          <path d="M0 230C120 190 260 200 400 175V215C270 235 130 230 0 260z" fill="#e7dccb" />
          {[230, 290, 350].map((x) => (
            <g key={x}>
              <rect x={x - 5} y={110} width={10} height={50} fill="#6b4f3a" />
              <circle cx={x} cy={100} r={30} fill="#3f8a6b" />
            </g>
          ))}
          <rect x="250" y="178" width="110" height="10" rx="5" fill="#6b4f3a" />
          <rect x="250" y="160" width="110" height="8" rx="4" fill="#6b4f3a" />
          <Person x={305} y={152} shirt="#cfe3f5" sit longHair hair="#1c1d1f" skin={SKIN[0]} />
          <rect x="314" y="150" width="16" height="12" rx="2" fill="#4c6f93" />
          <Person x={110} y={172} s={1.15} shirt="#303337" skin={SKIN[2]} />
          <path d="M128 176q20 10 32 30" stroke="#1c1d1f" strokeWidth="2" fill="none" />
          <g transform="translate(168 212)">
            <ellipse cx="0" cy="0" rx="16" ry="9" fill="#c8945c" />
            <circle cx="14" cy="-8" r="7" fill="#c8945c" />
            <rect x="-12" y="4" width="4" height="10" fill="#c8945c" />
            <rect x="8" y="4" width="4" height="10" fill="#c8945c" />
          </g>
        </Frame>
      );
  }
}
