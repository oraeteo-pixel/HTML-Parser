import { getHwanggeukDate, getJeolguk, getDayGanZhi } from "@/lib/calendarData";

// 24 sectors - 亥 at 12 o'clock (top), going clockwise
// 28수 시계방향 순서: 기미심방 저항각 진익장성 유귀정 삼자필묘위루규벽실위허여우두
// 箕尾心房 氐亢角 軫翼張星 柳鬼井 參觜畢昴胃婁奎壁室危虛女牛斗
// 정해무 자리축 신인임 묘진진 계사갑 오감미 을신병 유손술 시계방향
// 4곳에 2개씩: 戌(角軫), 丑(井參), 辰(奎壁), 未(斗箕)
const SECTORS_DATA = [
  // Sector 1-2: 亥 (해) - 12시 TOP - 3月 - 丁亥戊 구역
  { sector: 1, stem: "丁", branch: "亥", month: "3月", jeolguk: "雷和", mansion: "星", ganji: "己未" },
  { sector: 2, stem: "戊", branch: "亥", month: "3月", jeolguk: "風化", mansion: "張", ganji: "甲戌" },
  // Sector 3-4: 子 (자) - 4月 - 子離丑 구역
  { sector: 3, stem: "", branch: "子", month: "4月", jeolguk: "立和", mansion: "翼", ganji: "己丑" },
  { sector: 4, stem: "", branch: "子", month: "4月", jeolguk: "行化", mansion: "軫", ganji: "甲辰" },
  // Sector 5-6: 丑 (축) - 5月 - 角軫 다음, 井參 (2개)
  { sector: 5, stem: "", branch: "丑", month: "5月", jeolguk: "建和", mansion: "角軫", ganji: "己未" },
  { sector: 6, stem: "", branch: "丑", month: "5月", jeolguk: "普化", mansion: "亢", ganji: "甲戌" },
  // Sector 7-8: 寅 (인) - 3시 RIGHT - 6月 - 辛寅壬 구역
  { sector: 7, stem: "辛", branch: "寅", month: "6月", jeolguk: "淸和", mansion: "氐", ganji: "己丑" },
  { sector: 8, stem: "壬", branch: "寅", month: "6月", jeolguk: "平和", mansion: "房", ganji: "甲辰" },
  // Sector 9-10: 卯 (묘) - 7月 - 卯辰震 구역
  { sector: 9, stem: "", branch: "卯", month: "7月", jeolguk: "成和", mansion: "心", ganji: "己未" },
  { sector: 10, stem: "", branch: "卯", month: "7月", jeolguk: "入化", mansion: "尾", ganji: "甲戌" },
  // Sector 11-12: 辰 (진) - 8月 - 斗箕 (2개)
  { sector: 11, stem: "", branch: "辰", month: "8月", jeolguk: "咸和", mansion: "箕", ganji: "己丑" },
  { sector: 12, stem: "", branch: "辰", month: "8月", jeolguk: "亨化", mansion: "斗箕", ganji: "甲辰" },
  // Sector 13-14: 巳 (사) - 6시 BOTTOM - 9月 - 癸巳甲 구역
  { sector: 13, stem: "癸", branch: "巳", month: "9月", jeolguk: "正和", mansion: "牛", ganji: "己未" },
  { sector: 14, stem: "甲", branch: "巳", month: "9月", jeolguk: "明和", mansion: "女", ganji: "甲戌" },
  // Sector 15-16: 午 (오) - 10月 - 午坎未 구역
  { sector: 15, stem: "", branch: "午", month: "10月", jeolguk: "至和", mansion: "虛", ganji: "己丑" },
  { sector: 16, stem: "", branch: "午", month: "10月", jeolguk: "貞和", mansion: "危", ganji: "甲辰" },
  // Sector 17-18: 未 (미) - 11月 - 奎壁 (2개)
  { sector: 17, stem: "", branch: "未", month: "11月", jeolguk: "太和", mansion: "室", ganji: "己未" },
  { sector: 18, stem: "", branch: "未", month: "11月", jeolguk: "體和", mansion: "奎壁", ganji: "甲戌" },
  // Sector 19-20: 申 (신) - 9시 LEFT - 12月 - 乙申丙 구역
  { sector: 19, stem: "乙", branch: "申", month: "12月", jeolguk: "仁和", mansion: "婁", ganji: "己丑" },
  { sector: 20, stem: "丙", branch: "申", month: "12月", jeolguk: "性和", mansion: "胃", ganji: "甲辰" },
  // Sector 21-22: 酉 (유) - 1月 - 酉巽戌 구역, 元和 시작
  { sector: 21, stem: "", branch: "酉", month: "1月", jeolguk: "元和", mansion: "昴", ganji: "己未" },
  { sector: 22, stem: "", branch: "酉", month: "1月", jeolguk: "中化", mansion: "畢", ganji: "甲戌" },
  // Sector 23-24: 戌 (술) - 2月 - 井參 (2개)
  { sector: 23, stem: "", branch: "戌", month: "2月", jeolguk: "大和", mansion: "觜", ganji: "己丑" },
  { sector: 24, stem: "", branch: "戌", month: "2月", jeolguk: "布化", mansion: "井參", ganji: "甲辰" },
];

// 8 Trigrams - 정해무 자리축 신인임 묘진진 계사갑 오감미 을신병 유손술
// 離(리) at 子, 震(진) at 卯辰, 坎(감) at 午, 巽(손) at 酉戌
const TRIGRAMS = [
  { symbol: "☲", name: "離", number: 2, angle: 30 },      // 子 area (1:00)
  { symbol: "☳", name: "震", number: 4, angle: 75 },      // 卯辰 area (2:30)
  { symbol: "☶", number: 5, angle: 135 },                 // 4:30
  { symbol: "☷", number: 10, angle: 180 },                // BOTTOM (6시)
  { symbol: "☵", name: "坎", number: 3, angle: 210 },     // 午 area (7:00)
  { symbol: "☰", number: 7, angle: 255 },                 // 8:30
  { symbol: "☴", name: "巽", number: 9, angle: 315 },     // 酉戌 area (10:30)
  { symbol: "☱", number: 8, angle: 345 },                 // 11:30
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
  
  // Ring radii - adjusted for better spacing
  const outerRing = 350;
  const stemRadius = 335;         // 천간 - moved slightly inward
  const branchRadius = 305;       // 지지
  const monthRadius = 278;        // 월
  const jeolgukRadius = 250;      // 절국명
  const ganjiRadius = 225;        // 간지
  const mansionRadius = 198;      // 28수
  const innerRing = 172;          // 내부 원
  const trigramRadius = 138;      // 팔괘
  const coreRadius = 95;          // 중심 10천간
  
  const sectorAngle = 360 / 24;   // 15° per sector
  
  const getTextPosition = (angle: number, radius: number) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
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
          {Array.from({ length: 24 }).map((_, i) => {
            const startOffset = -sectorAngle / 2;
            const angle = startOffset + i * sectorAngle;
            const rad = (angle - 90) * Math.PI / 180;
            const x1 = center + innerRing * Math.cos(rad);
            const y1 = center + innerRing * Math.sin(rad);
            const x2 = center + outerRing * Math.cos(rad);
            const y2 = center + outerRing * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#a0aec0" strokeWidth="0.5" />;
          })}
          
          {/* 24 Sector content */}
          {SECTORS_DATA.map((sector, index) => {
            const startOffset = -sectorAngle / 2;
            const midAngle = startOffset + index * sectorAngle + sectorAngle / 2;
            const isToday = todayJeolguk.name.includes(sector.jeolguk);
            
            // Text rotation - flip text on bottom half
            let textRotation = midAngle;
            if (midAngle > 90 && midAngle < 270) {
              textRotation = midAngle + 180;
            }
            
            // Double mansion handling
            const isDoubleMansion = sector.mansion.length === 2;
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
                
                {/* 1. Stem (천간) - adjusted position */}
                {sector.stem && (
                  <text
                    x={getTextPosition(midAngle, stemRadius).x}
                    y={getTextPosition(midAngle, stemRadius).y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="13"
                    fontWeight="bold"
                    fill="#1a365d"
                    transform={`rotate(${textRotation}, ${getTextPosition(midAngle, stemRadius).x}, ${getTextPosition(midAngle, stemRadius).y})`}
                  >
                    {sector.stem}
                  </text>
                )}
                
                {/* 2. Branch (지지) */}
                <text
                  x={getTextPosition(midAngle, branchRadius).x}
                  y={getTextPosition(midAngle, branchRadius).y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#1a365d"
                  transform={`rotate(${textRotation}, ${getTextPosition(midAngle, branchRadius).x}, ${getTextPosition(midAngle, branchRadius).y})`}
                >
                  {sector.branch}
                </text>
                
                {/* 3. Month (월) */}
                <text
                  x={getTextPosition(midAngle, monthRadius).x}
                  y={getTextPosition(midAngle, monthRadius).y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="9"
                  fill="#4a5568"
                  transform={`rotate(${textRotation}, ${getTextPosition(midAngle, monthRadius).x}, ${getTextPosition(midAngle, monthRadius).y})`}
                >
                  {sector.month}
                </text>
                
                {/* 4. Jeolguk (절국명) */}
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
                  {sector.jeolguk}
                </text>
                
                {/* 5. Ganji (간지) */}
                <text
                  x={getTextPosition(midAngle, ganjiRadius).x}
                  y={getTextPosition(midAngle, ganjiRadius).y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="8"
                  fill="#718096"
                  transform={`rotate(${textRotation}, ${getTextPosition(midAngle, ganjiRadius).x}, ${getTextPosition(midAngle, ganjiRadius).y})`}
                >
                  {sector.ganji}
                </text>
                
                {/* 6. Mansion (28수) */}
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
                  {sector.mansion}
                </text>
              </g>
            );
          })}
          
          {/* 8 Trigrams ring */}
          {TRIGRAMS.map((trigram, index) => {
            const pos = getTextPosition(trigram.angle, trigramRadius);
            return (
              <g key={index}>
                <text
                  x={pos.x}
                  y={pos.y - 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="26"
                  fill="#2d3748"
                >
                  {trigram.symbol}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 16}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="14"
                  fontWeight="600"
                  fill="#4a5568"
                >
                  {trigram.number}
                </text>
              </g>
            );
          })}
          
          {/* Center - 10 Heavenly Stems */}
          <g transform={`translate(${center}, ${center})`}>
            {/* Center: (1)己 甲6 */}
            <text x="-12" y="-6" textAnchor="middle" fontSize="11" fill="#718096">(1)</text>
            <text x="14" y="-6" textAnchor="middle" fontSize="11" fill="#718096">6</text>
            <text x="-12" y="12" textAnchor="middle" fontSize="15" fontWeight="600" fill="#2d3748">己</text>
            <text x="14" y="12" textAnchor="middle" fontSize="15" fontWeight={todayStem === '甲' ? "bold" : "600"} fill={todayStem === '甲' ? "#1a365d" : "#2d3748"}>甲</text>
            
            {/* Outer stems in octagon */}
            <text x="0" y="-60" textAnchor="middle" fontSize="16" fontWeight={todayStem === '庚' ? "bold" : "normal"} fill={todayStem === '庚' ? "#1a365d" : "#2d3748"}>庚</text>
            <text x="0" y="-75" textAnchor="middle" fontSize="12" fill="#718096">7</text>
            
            <text x="45" y="-36" textAnchor="middle" fontSize="16" fontWeight={todayStem === '丁' ? "bold" : "normal"} fill={todayStem === '丁' ? "#1a365d" : "#2d3748"}>丁</text>
            <text x="58" y="-44" textAnchor="middle" fontSize="12" fill="#718096">9</text>
            
            <text x="64" y="4" textAnchor="middle" fontSize="16" fontWeight={todayStem === '壬' ? "bold" : "normal"} fill={todayStem === '壬' ? "#1a365d" : "#2d3748"}>壬</text>
            <text x="78" y="4" textAnchor="middle" fontSize="12" fill="#718096">4</text>
            
            <text x="45" y="46" textAnchor="middle" fontSize="16" fontWeight={todayStem === '癸' ? "bold" : "normal"} fill={todayStem === '癸' ? "#1a365d" : "#2d3748"}>癸</text>
            <text x="58" y="56" textAnchor="middle" fontSize="12" fill="#718096">5</text>
            
            <text x="0" y="66" textAnchor="middle" fontSize="16" fontWeight={todayStem === '戊' ? "bold" : "normal"} fill={todayStem === '戊' ? "#1a365d" : "#2d3748"}>戊</text>
            <text x="0" y="80" textAnchor="middle" fontSize="12" fill="#718096">10</text>
            
            <text x="-45" y="46" textAnchor="middle" fontSize="16" fontWeight={todayStem === '辛' ? "bold" : "normal"} fill={todayStem === '辛' ? "#1a365d" : "#2d3748"}>辛</text>
            <text x="-58" y="56" textAnchor="middle" fontSize="12" fill="#718096">3</text>
            
            <text x="-64" y="4" textAnchor="middle" fontSize="16" fontWeight={todayStem === '丙' ? "bold" : "normal"} fill={todayStem === '丙' ? "#1a365d" : "#2d3748"}>丙</text>
            <text x="-78" y="4" textAnchor="middle" fontSize="12" fill="#718096">8</text>
            
            <text x="-45" y="-36" textAnchor="middle" fontSize="16" fontWeight={todayStem === '乙' ? "bold" : "normal"} fill={todayStem === '乙' ? "#1a365d" : "#2d3748"}>乙</text>
            <text x="-58" y="-44" textAnchor="middle" fontSize="12" fill="#718096">7</text>
            
            {/* Star pattern lines */}
            <line x1="0" y1="-55" x2="40" y2="-32" stroke="#718096" strokeWidth="0.8" strokeDasharray="4,3" />
            <line x1="40" y1="-32" x2="58" y2="0" stroke="#718096" strokeWidth="0.8" strokeDasharray="4,3" />
            <line x1="58" y1="0" x2="40" y2="40" stroke="#718096" strokeWidth="0.8" strokeDasharray="4,3" />
            <line x1="40" y1="40" x2="0" y2="60" stroke="#718096" strokeWidth="0.8" strokeDasharray="4,3" />
            <line x1="0" y1="60" x2="-40" y2="40" stroke="#718096" strokeWidth="0.8" strokeDasharray="4,3" />
            <line x1="-40" y1="40" x2="-58" y2="0" stroke="#718096" strokeWidth="0.8" strokeDasharray="4,3" />
            <line x1="-58" y1="0" x2="-40" y2="-32" stroke="#718096" strokeWidth="0.8" strokeDasharray="4,3" />
            <line x1="-40" y1="-32" x2="0" y2="-55" stroke="#718096" strokeWidth="0.8" strokeDasharray="4,3" />
            
            {/* Cross lines - green */}
            <line x1="0" y1="0" x2="0" y2="-55" stroke="#2f855a" strokeWidth="1.2" />
            <line x1="0" y1="0" x2="58" y2="0" stroke="#2f855a" strokeWidth="1.2" />
            <line x1="0" y1="0" x2="0" y2="60" stroke="#2f855a" strokeWidth="1.2" />
            <line x1="0" y1="0" x2="-58" y2="0" stroke="#2f855a" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
      
      <div className="text-center mt-4 text-base text-muted-foreground">
        용담도에 적용한 천간 (동지기준)
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
