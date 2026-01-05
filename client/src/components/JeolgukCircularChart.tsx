import { getHwanggeukDate, getJeolguk, getDayGanZhi } from "@/lib/calendarData";

// 24방 시계방향 배치: 정해무 자리축 신인임 묘진진 계사갑 오감미 을신병 유손술
// = 丁亥戊 子離丑 辛寅壬 卯辰震 癸巳甲 午坎未 乙申丙 酉巽戌
// 亥를 12시 정중앙에 배치, 시계방향으로 24개 요소
// 28수 시계방향: 기미심방 저항각 진익장성 유귀정 삼자필묘위루규벽실위허여우두
const OUTER_RING_24 = [
  // Group 1: 정해무 (丁亥戊) - 亥 at 12 o'clock
  { element: "丁", type: "stem" },      // Sector 1 (11:30)
  { element: "亥", type: "branch" },    // Sector 2 (12:00) - TOP
  { element: "戊", type: "stem" },      // Sector 3 (12:30)
  // Group 2: 자리축 (子離丑)
  { element: "子", type: "branch" },    // Sector 4 (1:00)
  { element: "離", type: "trigram" },   // Sector 5 (1:30)
  { element: "丑", type: "branch" },    // Sector 6 (2:00)
  // Group 3: 신인임 (辛寅壬)
  { element: "辛", type: "stem" },      // Sector 7 (2:30)
  { element: "寅", type: "branch" },    // Sector 8 (3:00) - RIGHT
  { element: "壬", type: "stem" },      // Sector 9 (3:30)
  // Group 4: 묘진진 (卯辰震)
  { element: "卯", type: "branch" },    // Sector 10 (4:00)
  { element: "辰", type: "branch" },    // Sector 11 (4:30)
  { element: "震", type: "trigram" },   // Sector 12 (5:00)
  // Group 5: 계사갑 (癸巳甲)
  { element: "癸", type: "stem" },      // Sector 13 (5:30)
  { element: "巳", type: "branch" },    // Sector 14 (6:00) - BOTTOM
  { element: "甲", type: "stem" },      // Sector 15 (6:30)
  // Group 6: 오감미 (午坎未)
  { element: "午", type: "branch" },    // Sector 16 (7:00)
  { element: "坎", type: "trigram" },   // Sector 17 (7:30)
  { element: "未", type: "branch" },    // Sector 18 (8:00)
  // Group 7: 을신병 (乙申丙)
  { element: "乙", type: "stem" },      // Sector 19 (8:30)
  { element: "申", type: "branch" },    // Sector 20 (9:00) - LEFT
  { element: "丙", type: "stem" },      // Sector 21 (9:30)
  // Group 8: 유손술 (酉巽戌)
  { element: "酉", type: "branch" },    // Sector 22 (10:00)
  { element: "巽", type: "trigram" },   // Sector 23 (10:30)
  { element: "戌", type: "branch" },    // Sector 24 (11:00)
];

// 28수 시계방향 순서: 기미심방 저항각 진익장성 유귀정 삼자필묘위루규벽실위허여우두
// 箕尾心房 氐亢角 軫翼張星 柳鬼井 參觜畢昴胃婁奎壁室危虛女牛斗
// 28개를 24칸에 배치 - 4곳에 2개씩:
// 손방(巽 index 22): 角軫, 리방(離 index 4): 井參, 진방(震 index 11): 奎壁, 감방(坎 index 16): 斗箕
const MANSIONS_24 = [
  "張",     // 0: 丁
  "星",     // 1: 亥
  "柳",     // 2: 戊
  "鬼",     // 3: 子
  "井參",   // 4: 離 (double) - 리방
  "觜",     // 5: 丑
  "畢",     // 6: 辛
  "昴",     // 7: 寅
  "胃",     // 8: 壬
  "婁",     // 9: 卯
  "室",     // 10: 辰
  "奎壁",   // 11: 震 (double) - 진방
  "危",     // 12: 癸
  "虛",     // 13: 巳
  "女",     // 14: 甲
  "牛",     // 15: 午
  "斗箕",   // 16: 坎 (double) - 감방
  "尾",     // 17: 未
  "心",     // 18: 乙
  "房",     // 19: 申
  "氐",     // 20: 丙
  "亢",     // 21: 酉
  "角軫",   // 22: 巽 (double) - 손방
  "翼",     // 23: 戌
];

// 24절국명 - 酉(元和)에서 시작, 12개 地支 각 2개씩
const JEOLGUK_NAMES = [
  "雷和", "風化",       // 亥 area (3月)
  "立和", "行化",       // 子 area
  "建和", "普化",       // 丑 area (5月)
  "淸和", "平和",       // 寅 area (6月)
  "成和", "入化",       // 卯 area
  "咸和", "亨化",       // 辰 area (8月)
  "正和", "明和",       // 巳 area (9月)
  "至和", "貞和",       // 午 area
  "太和", "體和",       // 未 area (11月)
  "仁和", "性和",       // 申 area (12月)
  "元和", "中化",       // 酉 area (1月) - 元和 starts here
  "大和", "布化",       // 戌 area (2月)
];

interface JeolgukCircularChartProps {
  date: Date;
}

export function JeolgukCircularChart({ date }: JeolgukCircularChartProps) {
  const todayGanZhi = getDayGanZhi(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const todayHwDate = getHwanggeukDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const todayJeolguk = getJeolguk(todayHwDate.year, todayHwDate.month, todayHwDate.day);
  const todayStem = todayGanZhi.charAt(0);
  
  const size = 720;
  const center = size / 2;
  
  // Ring radii
  const outerRing = 350;
  const outer24Radius = 332;      // 24방 (丁亥戊子離丑...)
  const jeolgukRadius = 295;      // 절국명
  const mansionRadius = 260;      // 28수
  const innerRing = 230;          // 내부 원
  const trigramRadius = 180;      // 팔괘 숫자
  const coreRadius = 120;         // 중심 10천간
  
  const sectorAngle = 360 / 24;   // 15° per sector
  
  const getTextPosition = (angle: number, radius: number) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };

  // Get color based on element type
  const getElementColor = (type: string) => {
    switch (type) {
      case "stem": return "#1e40af";     // Blue for stems
      case "branch": return "#1a365d";   // Dark blue for branches
      case "trigram": return "#7c3aed";  // Purple for trigrams
      default: return "#2d3748";
    }
  };

  return (
    <div className="mt-4 p-4 bg-[#f8f4ec] dark:bg-slate-900/50 rounded-lg" data-testid="jeolguk-circular-chart">
      <h2 className="text-xl font-bold text-center mb-4 orae-navy" data-testid="text-jeolguk-circular-title">
        [ 24節局 ]
      </h2>
      
      <div className="flex justify-center overflow-x-auto">
        <svg 
          viewBox={`0 0 ${size} ${size}`} 
          className="w-full"
          style={{ maxWidth: "720px", minWidth: "360px" }}
        >
          {/* Background */}
          <circle cx={center} cy={center} r={outerRing + 8} fill="#f8f4ec" className="dark:fill-slate-800" />
          
          {/* Ring borders */}
          <circle cx={center} cy={center} r={outerRing} fill="none" stroke="#2d3748" strokeWidth="2" />
          <circle cx={center} cy={center} r={innerRing} fill="none" stroke="#4a5568" strokeWidth="1.5" />
          <circle cx={center} cy={center} r={coreRadius} fill="#f8f4ec" className="dark:fill-slate-800" stroke="#2d3748" strokeWidth="1.5" />
          
          {/* Radial dividers for 24 sectors */}
          {/* 亥 at index 1 must be at 0 degrees (12 o'clock), so startOffset = -22.5 */}
          {Array.from({ length: 24 }).map((_, i) => {
            const startOffset = -sectorAngle * 1.5;  // -22.5 degrees
            const angle = startOffset + i * sectorAngle;
            const rad = (angle - 90) * Math.PI / 180;
            const x1 = center + innerRing * Math.cos(rad);
            const y1 = center + innerRing * Math.sin(rad);
            const x2 = center + outerRing * Math.cos(rad);
            const y2 = center + outerRing * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#a0aec0" strokeWidth="0.5" />;
          })}
          
          {/* 24 Sector content */}
          {/* 亥 at index 1 = 0 degrees, 寅 at index 7 = 90 degrees, 巳 at index 13 = 180 degrees, 申 at index 19 = 270 degrees */}
          {OUTER_RING_24.map((item, index) => {
            const startOffset = -sectorAngle * 1.5;  // -22.5 degrees for proper alignment
            const midAngle = startOffset + index * sectorAngle + sectorAngle / 2;
            const jeolgukName = JEOLGUK_NAMES[index] || "";
            const mansion = MANSIONS_24[index] || "";
            const isToday = jeolgukName && todayJeolguk.name.includes(jeolgukName);
            
            // Text rotation
            let textRotation = midAngle;
            if (midAngle > 90 && midAngle < 270) {
              textRotation = midAngle + 180;
            }
            
            // Double mansion handling
            const isDoubleMansion = mansion.length === 2;
            const mansionFontSize = isDoubleMansion ? "10" : "13";
            
            return (
              <g key={index}>
                {/* Highlight today's sector */}
                {isToday && (
                  <path 
                    d={`M ${center} ${center} L ${getTextPosition(startOffset + index * sectorAngle, outerRing).x} ${getTextPosition(startOffset + index * sectorAngle, outerRing).y} A ${outerRing} ${outerRing} 0 0 1 ${getTextPosition(startOffset + (index + 1) * sectorAngle, outerRing).x} ${getTextPosition(startOffset + (index + 1) * sectorAngle, outerRing).y} Z`}
                    fill="hsl(215 50% 35% / 0.12)"
                    className="dark:fill-blue-500/15"
                  />
                )}
                
                {/* 1. Outer 24방 (丁亥戊子離丑...) */}
                <text
                  x={getTextPosition(midAngle, outer24Radius).x}
                  y={getTextPosition(midAngle, outer24Radius).y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={getElementColor(item.type)}
                  transform={`rotate(${textRotation}, ${getTextPosition(midAngle, outer24Radius).x}, ${getTextPosition(midAngle, outer24Radius).y})`}
                >
                  {item.element}
                </text>
                
                {/* 2. Jeolguk (절국명) */}
                <text
                  x={getTextPosition(midAngle, jeolgukRadius).x}
                  y={getTextPosition(midAngle, jeolgukRadius).y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="11"
                  fontWeight={isToday ? "bold" : "normal"}
                  fill={isToday ? "#1a365d" : "#2d3748"}
                  transform={`rotate(${textRotation}, ${getTextPosition(midAngle, jeolgukRadius).x}, ${getTextPosition(midAngle, jeolgukRadius).y})`}
                >
                  {jeolgukName}
                </text>
                
                {/* 3. Mansion (28수) */}
                <text
                  x={getTextPosition(midAngle, mansionRadius).x}
                  y={getTextPosition(midAngle, mansionRadius).y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={mansionFontSize}
                  fontWeight="500"
                  fill="#2d3748"
                  transform={`rotate(${textRotation}, ${getTextPosition(midAngle, mansionRadius).x}, ${getTextPosition(midAngle, mansionRadius).y})`}
                >
                  {mansion}
                </text>
              </g>
            );
          })}
          
          
          {/* Second ring - 8 Trigrams with numbers, facing center */}
          <g transform={`translate(${center}, ${center})`}>
            {/* 12시: 곤괘 ☷ with 2 - rotated 180° to face center */}
            <g transform="translate(0, -155) rotate(180)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="24" fill="#2d3748">☷</text>
            </g>
            <text x="0" y="-175" textAnchor="middle" fontSize="14" fill="#718096">2</text>
            
            {/* 1시(1:30): 리괘 ☲ with 9 - rotated to face center */}
            <g transform="translate(110, -110) rotate(-135)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="24" fill="#2d3748">☲</text>
            </g>
            <text x="130" y="-130" textAnchor="middle" fontSize="14" fill="#718096">9</text>
            
            {/* 3시: 태괘 ☱ with 4 - rotated 270° to face center */}
            <g transform="translate(155, 0) rotate(-90)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="24" fill="#2d3748">☱</text>
            </g>
            <text x="178" y="0" textAnchor="middle" fontSize="14" fill="#718096">4</text>
            
            {/* 5시(4:30): 진괘 ☳ with 5 - rotated to face center */}
            <g transform="translate(110, 110) rotate(-45)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="24" fill="#2d3748">☳</text>
            </g>
            <text x="130" y="130" textAnchor="middle" fontSize="14" fill="#718096">5</text>
            
            {/* 6시: 건괘 ☰ with 10 - no rotation, faces center */}
            <g transform="translate(0, 160)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="24" fill="#2d3748">☰</text>
            </g>
            <text x="0" y="185" textAnchor="middle" fontSize="14" fill="#718096">10</text>
            
            {/* 7시(7:30): 감괘 ☵ with 3 - rotated to face center */}
            <g transform="translate(-110, 110) rotate(45)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="24" fill="#2d3748">☵</text>
            </g>
            <text x="-130" y="130" textAnchor="middle" fontSize="14" fill="#718096">3</text>
            
            {/* 9시: 간괘 ☶ with 8 - rotated 90° to face center */}
            <g transform="translate(-155, 0) rotate(90)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="24" fill="#2d3748">☶</text>
            </g>
            <text x="-178" y="0" textAnchor="middle" fontSize="14" fill="#718096">8</text>
            
            {/* 11시(10:30): 손괘 ☴ with 7 - rotated to face center */}
            <g transform="translate(-110, -110) rotate(135)">
              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="24" fill="#2d3748">☴</text>
            </g>
            <text x="-130" y="-130" textAnchor="middle" fontSize="14" fill="#718096">7</text>
            
            {/* Arrows connecting numbers in sequence: 1→2→3→4→5→6→7→8→9→10 */}
            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#718096" />
              </marker>
            </defs>
            
            {/* 1(center) → 2(12시) */}
            <line x1="0" y1="-25" x2="0" y2="-135" stroke="#718096" strokeWidth="1" markerEnd="url(#arrowhead)" />
            
            {/* 2(12시) → 3(7시) */}
            <line x1="-15" y1="-145" x2="-95" y2="95" stroke="#718096" strokeWidth="1" markerEnd="url(#arrowhead)" />
            
            {/* 3(7시) → 4(3시) */}
            <line x1="-95" y1="95" x2="135" y2="0" stroke="#718096" strokeWidth="1" markerEnd="url(#arrowhead)" />
            
            {/* 4(3시) → 5(5시) */}
            <line x1="140" y1="15" x2="110" y2="95" stroke="#718096" strokeWidth="1" markerEnd="url(#arrowhead)" />
            
            {/* 5(5시) → 6(center) */}
            <line x1="95" y1="95" x2="20" y2="15" stroke="#718096" strokeWidth="1" markerEnd="url(#arrowhead)" />
            
            {/* 6(center) → 7(11시) */}
            <line x1="-15" y1="-25" x2="-95" y2="-95" stroke="#718096" strokeWidth="1" markerEnd="url(#arrowhead)" />
            
            {/* 7(11시) → 8(9시) */}
            <line x1="-110" y1="-95" x2="-140" y2="-15" stroke="#718096" strokeWidth="1" markerEnd="url(#arrowhead)" />
            
            {/* 8(9시) → 9(1시) */}
            <line x1="-140" y1="0" x2="95" y2="-95" stroke="#718096" strokeWidth="1" markerEnd="url(#arrowhead)" />
            
            {/* 9(1시) → 10(6시) */}
            <line x1="95" y1="-95" x2="0" y2="140" stroke="#718096" strokeWidth="1" markerEnd="url(#arrowhead)" />
          </g>
          
          {/* Center - 10 Heavenly Stems with numbers */}
          <g transform={`translate(${center}, ${center})`}>
            {/* Center: (1)己 甲6 */}
            <text x="-15" y="-8" textAnchor="middle" fontSize="10" fill="#718096">(1)</text>
            <text x="-15" y="10" textAnchor="middle" fontSize="16" fontWeight="600" fill="#2d3748">己</text>
            <text x="15" y="-8" textAnchor="middle" fontSize="10" fill="#718096">6</text>
            <text x="15" y="10" textAnchor="middle" fontSize="16" fontWeight="600" fill="#2d3748">甲</text>
            
            {/* Outer stems in octagon - smaller radius */}
            <text x="0" y="-55" textAnchor="middle" fontSize="16" fontWeight={todayStem === '庚' ? "bold" : "normal"} fill={todayStem === '庚' ? "#1a365d" : "#2d3748"}>庚</text>
            <text x="15" y="-55" textAnchor="middle" fontSize="10" fill="#718096">7</text>
            
            <text x="40" y="-40" textAnchor="middle" fontSize="16" fontWeight={todayStem === '丁' ? "bold" : "normal"} fill={todayStem === '丁' ? "#1a365d" : "#2d3748"}>丁</text>
            <text x="55" y="-50" textAnchor="middle" fontSize="10" fill="#718096">9</text>
            
            <text x="58" y="5" textAnchor="middle" fontSize="16" fontWeight={todayStem === '壬' ? "bold" : "normal"} fill={todayStem === '壬' ? "#1a365d" : "#2d3748"}>壬</text>
            <text x="72" y="5" textAnchor="middle" fontSize="10" fill="#718096">4</text>
            
            <text x="40" y="45" textAnchor="middle" fontSize="16" fontWeight={todayStem === '癸' ? "bold" : "normal"} fill={todayStem === '癸' ? "#1a365d" : "#2d3748"}>癸</text>
            <text x="55" y="55" textAnchor="middle" fontSize="10" fill="#718096">5</text>
            
            <text x="0" y="60" textAnchor="middle" fontSize="16" fontWeight={todayStem === '戊' ? "bold" : "normal"} fill={todayStem === '戊' ? "#1a365d" : "#2d3748"}>戊</text>
            <text x="0" y="75" textAnchor="middle" fontSize="10" fill="#718096">10</text>
            
            <text x="-40" y="45" textAnchor="middle" fontSize="16" fontWeight={todayStem === '辛' ? "bold" : "normal"} fill={todayStem === '辛' ? "#1a365d" : "#2d3748"}>辛</text>
            <text x="-55" y="55" textAnchor="middle" fontSize="10" fill="#718096">3</text>
            
            <text x="-58" y="5" textAnchor="middle" fontSize="16" fontWeight={todayStem === '丙' ? "bold" : "normal"} fill={todayStem === '丙' ? "#1a365d" : "#2d3748"}>丙</text>
            <text x="-72" y="5" textAnchor="middle" fontSize="10" fill="#718096">8</text>
            
            <text x="-40" y="-40" textAnchor="middle" fontSize="16" fontWeight={todayStem === '乙' ? "bold" : "normal"} fill={todayStem === '乙' ? "#1a365d" : "#2d3748"}>乙</text>
            <text x="-55" y="-50" textAnchor="middle" fontSize="10" fill="#718096">7</text>
          </g>
        </svg>
      </div>
      
      <div className="text-center mt-4 text-base text-muted-foreground">
        24방: 정해무 자리축 신인임 묘진진 계사갑 오감미 을신병 유손술
      </div>
      
      {/* Today's info */}
      <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
        <span className="text-base px-3 py-1.5 rounded bg-[hsl(215_50%_35%)] text-white font-medium">
          오늘: {todayGanZhi}
        </span>
        <span className="text-base px-3 py-1.5 rounded bg-slate-200 dark:bg-slate-700 font-medium">
          천간: {todayStem}
        </span>
        <span className="text-base px-3 py-1.5 rounded bg-slate-200 dark:bg-slate-700 font-medium">
          {todayJeolguk.name}
        </span>
      </div>
    </div>
  );
}
