import { getHwanggeukDate, getJeolguk, getDayGanZhi } from "@/lib/calendarData";

// 24 sectors - 亥(해) at 12 o'clock (top), going clockwise
// 亥(12시) → 寅(3시) → 巳(6시) → 申(9시)
const SECTORS_DATA = [
  // 12시 방향 - 亥 area (11月)
  { stem: "", branch: "亥", month: "11月", jeolguk: "建和", mansion: "觜", ganji: "己丑" },
  { stem: "庚", branch: "", month: "", jeolguk: "行化", mansion: "參", ganji: "甲辰" },
  // 子 area (12月)
  { stem: "", branch: "", month: "12月", jeolguk: "立和", mansion: "井", ganji: "己未" },
  { stem: "", branch: "子", month: "", jeolguk: "風化", mansion: "鬼", ganji: "甲戌" },
  { stem: "", branch: "", month: "", jeolguk: "雷和", mansion: "柳", ganji: "己丑" },
  // 丑 area (1月)
  { stem: "", branch: "", month: "1月", jeolguk: "元和", mansion: "星", ganji: "甲辰" },
  { stem: "", branch: "丑", month: "", jeolguk: "中化", mansion: "張", ganji: "己未" },
  { stem: "辛", branch: "", month: "", jeolguk: "大和", mansion: "翼", ganji: "甲戌" },
  // 3시 방향 - 寅 area (2月)
  { stem: "", branch: "", month: "2月", jeolguk: "布化", mansion: "軫", ganji: "己丑" },
  { stem: "", branch: "寅", month: "", jeolguk: "性和", mansion: "角", ganji: "甲辰" },
  { stem: "", branch: "", month: "", jeolguk: "仁和", mansion: "亢", ganji: "己未" },
  // 卯 area (3月)
  { stem: "", branch: "", month: "3月", jeolguk: "體和", mansion: "氐", ganji: "甲戌" },
  { stem: "", branch: "卯", month: "", jeolguk: "太和", mansion: "房", ganji: "己丑" },
  { stem: "壬", branch: "", month: "", jeolguk: "貞和", mansion: "心", ganji: "甲辰" },
  // 6시 방향 - 巳 area (4月, 5月)
  { stem: "", branch: "", month: "4月", jeolguk: "至和", mansion: "尾", ganji: "己未" },
  { stem: "", branch: "巳", month: "", jeolguk: "明和", mansion: "箕", ganji: "甲戌" },
  { stem: "", branch: "", month: "5月", jeolguk: "正和", mansion: "斗", ganji: "己丑" },
  // 午 area (6月)
  { stem: "", branch: "", month: "6月", jeolguk: "亨化", mansion: "牛", ganji: "甲辰" },
  { stem: "", branch: "午", month: "", jeolguk: "咸和", mansion: "女", ganji: "己未" },
  { stem: "癸", branch: "", month: "", jeolguk: "入化", mansion: "虛", ganji: "甲戌" },
  // 9시 방향 - 申 area (7月, 8月)
  { stem: "", branch: "", month: "7月", jeolguk: "成和", mansion: "危", ganji: "己丑" },
  { stem: "", branch: "申", month: "", jeolguk: "平和", mansion: "室", ganji: "甲辰" },
  { stem: "", branch: "", month: "8月", jeolguk: "淸和", mansion: "壁", ganji: "己未" },
  // 酉 area (9月, 10月)
  { stem: "", branch: "", month: "9月", jeolguk: "普化", mansion: "奎", ganji: "甲戌" },
  { stem: "", branch: "酉", month: "", jeolguk: "", mansion: "婁", ganji: "己丑" },
  { stem: "", branch: "", month: "10月", jeolguk: "", mansion: "胃", ganji: "甲辰" },
];

// Correct 24 sectors matching image - 亥 at top (12시)
const CORRECT_SECTORS = [
  // 12시 - 亥 (해) TOP
  { outerStem: "戊", branch: "亥", month: "3月", jeolguk: "雷和", mansion: "氐", ganji: "己未" },
  { outerStem: "", branch: "", month: "", jeolguk: "風化", mansion: "房", ganji: "甲戌" },
  // 1시 방향
  { outerStem: "", branch: "", month: "", jeolguk: "立和", mansion: "心", ganji: "己丑" },
  { outerStem: "丁", branch: "子", month: "4月", jeolguk: "行化", mansion: "尾", ganji: "甲辰" },
  { outerStem: "", branch: "", month: "", jeolguk: "建和", mansion: "箕", ganji: "己未" },
  { outerStem: "", branch: "", month: "", jeolguk: "普化", mansion: "斗", ganji: "甲戌" },
  // 3시 - 寅 (인) RIGHT
  { outerStem: "丙", branch: "寅", month: "5月", jeolguk: "淸和", mansion: "牛", ganji: "己丑" },
  { outerStem: "", branch: "", month: "", jeolguk: "平和", mansion: "女", ganji: "甲辰" },
  { outerStem: "", branch: "", month: "", jeolguk: "成和", mansion: "虛", ganji: "己未" },
  { outerStem: "乙", branch: "卯", month: "6月", jeolguk: "入化", mansion: "危", ganji: "甲戌" },
  { outerStem: "", branch: "", month: "", jeolguk: "咸和", mansion: "室", ganji: "己丑" },
  { outerStem: "", branch: "", month: "", jeolguk: "亨化", mansion: "壁", ganji: "甲辰" },
  // 6시 - 巳 (사) BOTTOM
  { outerStem: "", branch: "巳", month: "7月", jeolguk: "正和", mansion: "奎", ganji: "己未" },
  { outerStem: "", branch: "", month: "", jeolguk: "明和", mansion: "婁", ganji: "甲戌" },
  { outerStem: "", branch: "", month: "", jeolguk: "至和", mansion: "胃", ganji: "己丑" },
  { outerStem: "", branch: "午", month: "8月", jeolguk: "貞和", mansion: "昴", ganji: "甲辰" },
  { outerStem: "", branch: "", month: "", jeolguk: "太和", mansion: "畢", ganji: "己未" },
  { outerStem: "", branch: "", month: "", jeolguk: "體和", mansion: "觜", ganji: "甲戌" },
  // 9시 - 申 (신) LEFT
  { outerStem: "辛", branch: "申", month: "9月", jeolguk: "仁和", mansion: "參", ganji: "己丑" },
  { outerStem: "", branch: "", month: "", jeolguk: "性和", mansion: "井", ganji: "甲辰" },
  { outerStem: "", branch: "", month: "", jeolguk: "布化", mansion: "鬼", ganji: "己未" },
  { outerStem: "庚", branch: "酉", month: "10月", jeolguk: "大和", mansion: "柳", ganji: "甲戌" },
  { outerStem: "", branch: "", month: "", jeolguk: "中化", mansion: "星", ganji: "己丑" },
  { outerStem: "", branch: "", month: "", jeolguk: "元和", mansion: "張", ganji: "甲辰" },
];

// 8 Trigrams
const TRIGRAMS = [
  { symbol: "☲", number: 2, angle: 0 },      // TOP (12시)
  { symbol: "☴", number: 9, angle: 45 },
  { symbol: "☳", number: 4, angle: 90 },     // RIGHT (3시)
  { symbol: "☶", number: 5, angle: 135 },
  { symbol: "☷", number: 10, angle: 180 },   // BOTTOM (6시)
  { symbol: "☰", number: 7, angle: 225 },
  { symbol: "☱", number: 8, angle: 270 },    // LEFT (9시)
  { symbol: "☵", number: 3, angle: 315 },
];

interface JeolgukCircularChartProps {
  date: Date;
}

export function JeolgukCircularChart({ date }: JeolgukCircularChartProps) {
  const todayGanZhi = getDayGanZhi(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const todayHwDate = getHwanggeukDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const todayJeolguk = getJeolguk(todayHwDate.year, todayHwDate.month, todayHwDate.day);
  const todayStem = todayGanZhi.charAt(0);
  
  const size = 700;
  const center = size / 2;
  
  // Ring radii with proper spacing (outside to inside)
  const outerStemRadius = 340;    // 최외곽 - 천간
  const branchRadius = 310;       // 지지 + 월
  const jeolgukRadius = 270;      // 절국명
  const mansionRadius = 230;      // 28수
  const trigramRadius = 170;      // 팔괘
  const coreRadius = 100;         // 중심 10천간
  
  const sectorAngle = 360 / 24;
  
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
          style={{ maxWidth: "700px", minWidth: "360px" }}
        >
          {/* Background */}
          <circle cx={center} cy={center} r={outerStemRadius + 10} fill="#f8f4ec" className="dark:fill-slate-800" />
          
          {/* Ring borders */}
          <circle cx={center} cy={center} r={outerStemRadius} fill="none" stroke="#2d3748" strokeWidth="2" />
          <circle cx={center} cy={center} r={branchRadius - 15} fill="none" stroke="#4a5568" strokeWidth="1.5" />
          <circle cx={center} cy={center} r={jeolgukRadius - 10} fill="none" stroke="#4a5568" strokeWidth="1" />
          <circle cx={center} cy={center} r={mansionRadius - 10} fill="none" stroke="#4a5568" strokeWidth="1" />
          <circle cx={center} cy={center} r={trigramRadius + 15} fill="none" stroke="#4a5568" strokeWidth="1.5" />
          <circle cx={center} cy={center} r={coreRadius} fill="#f8f4ec" className="dark:fill-slate-800" stroke="#2d3748" strokeWidth="1.5" />
          
          {/* Radial dividers for 24 sectors */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = i * sectorAngle;
            const rad = (angle - 90) * Math.PI / 180;
            const x1 = center + (mansionRadius - 10) * Math.cos(rad);
            const y1 = center + (mansionRadius - 10) * Math.sin(rad);
            const x2 = center + outerStemRadius * Math.cos(rad);
            const y2 = center + outerStemRadius * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#a0aec0" strokeWidth="0.5" />;
          })}
          
          {/* 24 Sector content */}
          {CORRECT_SECTORS.map((sector, index) => {
            const midAngle = index * sectorAngle + sectorAngle / 2;
            const isToday = sector.jeolguk && todayJeolguk.name.includes(sector.jeolguk);
            
            let textRotation = midAngle;
            if (midAngle > 90 && midAngle < 270) {
              textRotation = midAngle + 180;
            }
            
            return (
              <g key={index}>
                {isToday && (
                  <path 
                    d={`M ${center} ${center} L ${getTextPosition(index * sectorAngle, outerStemRadius).x} ${getTextPosition(index * sectorAngle, outerStemRadius).y} A ${outerStemRadius} ${outerStemRadius} 0 0 1 ${getTextPosition((index + 1) * sectorAngle, outerStemRadius).x} ${getTextPosition((index + 1) * sectorAngle, outerStemRadius).y} Z`}
                    fill="hsl(215 50% 35% / 0.12)"
                    className="dark:fill-blue-500/15"
                  />
                )}
                
                {/* Outermost - Stem (천간) */}
                {sector.outerStem && (
                  <text
                    x={getTextPosition(midAngle, outerStemRadius - 15).x}
                    y={getTextPosition(midAngle, outerStemRadius - 15).y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="16"
                    fontWeight="bold"
                    fill="#1a365d"
                    transform={`rotate(${textRotation}, ${getTextPosition(midAngle, outerStemRadius - 15).x}, ${getTextPosition(midAngle, outerStemRadius - 15).y})`}
                  >
                    {sector.outerStem}
                  </text>
                )}
                
                {/* Branch (지지) */}
                {sector.branch && (
                  <text
                    x={getTextPosition(midAngle, branchRadius).x}
                    y={getTextPosition(midAngle, branchRadius).y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="18"
                    fontWeight="bold"
                    fill="#1a365d"
                    transform={`rotate(${textRotation}, ${getTextPosition(midAngle, branchRadius).x}, ${getTextPosition(midAngle, branchRadius).y})`}
                  >
                    {sector.branch}
                  </text>
                )}
                
                {/* Month */}
                {sector.month && (
                  <text
                    x={getTextPosition(midAngle, branchRadius - 22).x}
                    y={getTextPosition(midAngle, branchRadius - 22).y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="11"
                    fill="#4a5568"
                    transform={`rotate(${textRotation}, ${getTextPosition(midAngle, branchRadius - 22).x}, ${getTextPosition(midAngle, branchRadius - 22).y})`}
                  >
                    {sector.month}
                  </text>
                )}
                
                {/* Jeolguk name */}
                {sector.jeolguk && (
                  <text
                    x={getTextPosition(midAngle, jeolgukRadius).x}
                    y={getTextPosition(midAngle, jeolgukRadius).y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="12"
                    fontWeight={isToday ? "bold" : "normal"}
                    fill={isToday ? "#1a365d" : "#2d3748"}
                    transform={`rotate(${textRotation}, ${getTextPosition(midAngle, jeolgukRadius).x}, ${getTextPosition(midAngle, jeolgukRadius).y})`}
                  >
                    {sector.jeolguk}
                  </text>
                )}
                
                {/* Ganji */}
                <text
                  x={getTextPosition(midAngle, jeolgukRadius - 18).x}
                  y={getTextPosition(midAngle, jeolgukRadius - 18).y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="9"
                  fill="#718096"
                  transform={`rotate(${textRotation}, ${getTextPosition(midAngle, jeolgukRadius - 18).x}, ${getTextPosition(midAngle, jeolgukRadius - 18).y})`}
                >
                  {sector.ganji}
                </text>
                
                {/* Mansion */}
                <text
                  x={getTextPosition(midAngle, mansionRadius).x}
                  y={getTextPosition(midAngle, mansionRadius).y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="14"
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
                  fontSize="28"
                  fill="#2d3748"
                >
                  {trigram.symbol}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 18}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="16"
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
            {/* Center: 己(1) 甲(6) */}
            <text x="-12" y="-6" textAnchor="middle" fontSize="12" fill="#718096">(1)</text>
            <text x="14" y="-6" textAnchor="middle" fontSize="12" fill="#718096">6</text>
            <text x="-12" y="14" textAnchor="middle" fontSize="16" fontWeight="600" fill="#2d3748">己</text>
            <text x="14" y="14" textAnchor="middle" fontSize="16" fontWeight={todayStem === '甲' ? "bold" : "600"} fill={todayStem === '甲' ? "#1a365d" : "#2d3748"}>甲</text>
            
            {/* Outer stems in octagon */}
            <text x="0" y="-62" textAnchor="middle" fontSize="18" fontWeight={todayStem === '庚' ? "bold" : "normal"} fill={todayStem === '庚' ? "#1a365d" : "#2d3748"}>庚</text>
            <text x="0" y="-78" textAnchor="middle" fontSize="13" fill="#718096">7</text>
            
            <text x="48" y="-38" textAnchor="middle" fontSize="18" fontWeight={todayStem === '丁' ? "bold" : "normal"} fill={todayStem === '丁' ? "#1a365d" : "#2d3748"}>丁</text>
            <text x="62" y="-46" textAnchor="middle" fontSize="13" fill="#718096">9</text>
            
            <text x="68" y="6" textAnchor="middle" fontSize="18" fontWeight={todayStem === '壬' ? "bold" : "normal"} fill={todayStem === '壬' ? "#1a365d" : "#2d3748"}>壬</text>
            <text x="84" y="6" textAnchor="middle" fontSize="13" fill="#718096">4</text>
            
            <text x="48" y="50" textAnchor="middle" fontSize="18" fontWeight={todayStem === '癸' ? "bold" : "normal"} fill={todayStem === '癸' ? "#1a365d" : "#2d3748"}>癸</text>
            <text x="62" y="62" textAnchor="middle" fontSize="13" fill="#718096">5</text>
            
            <text x="0" y="70" textAnchor="middle" fontSize="18" fontWeight={todayStem === '戊' ? "bold" : "normal"} fill={todayStem === '戊' ? "#1a365d" : "#2d3748"}>戊</text>
            <text x="0" y="86" textAnchor="middle" fontSize="13" fill="#718096">10</text>
            
            <text x="-48" y="50" textAnchor="middle" fontSize="18" fontWeight={todayStem === '辛' ? "bold" : "normal"} fill={todayStem === '辛' ? "#1a365d" : "#2d3748"}>辛</text>
            <text x="-62" y="62" textAnchor="middle" fontSize="13" fill="#718096">3</text>
            
            <text x="-68" y="6" textAnchor="middle" fontSize="18" fontWeight={todayStem === '丙' ? "bold" : "normal"} fill={todayStem === '丙' ? "#1a365d" : "#2d3748"}>丙</text>
            <text x="-84" y="6" textAnchor="middle" fontSize="13" fill="#718096">8</text>
            
            <text x="-48" y="-38" textAnchor="middle" fontSize="18" fontWeight={todayStem === '乙' ? "bold" : "normal"} fill={todayStem === '乙' ? "#1a365d" : "#2d3748"}>乙</text>
            <text x="-62" y="-46" textAnchor="middle" fontSize="13" fill="#718096">7</text>
            
            {/* Star pattern lines */}
            <line x1="0" y1="-58" x2="42" y2="-34" stroke="#718096" strokeWidth="0.8" strokeDasharray="4,3" />
            <line x1="42" y1="-34" x2="62" y2="0" stroke="#718096" strokeWidth="0.8" strokeDasharray="4,3" />
            <line x1="62" y1="0" x2="42" y2="44" stroke="#718096" strokeWidth="0.8" strokeDasharray="4,3" />
            <line x1="42" y1="44" x2="0" y2="64" stroke="#718096" strokeWidth="0.8" strokeDasharray="4,3" />
            <line x1="0" y1="64" x2="-42" y2="44" stroke="#718096" strokeWidth="0.8" strokeDasharray="4,3" />
            <line x1="-42" y1="44" x2="-62" y2="0" stroke="#718096" strokeWidth="0.8" strokeDasharray="4,3" />
            <line x1="-62" y1="0" x2="-42" y2="-34" stroke="#718096" strokeWidth="0.8" strokeDasharray="4,3" />
            <line x1="-42" y1="-34" x2="0" y2="-58" stroke="#718096" strokeWidth="0.8" strokeDasharray="4,3" />
            
            {/* Cross lines - green */}
            <line x1="0" y1="0" x2="0" y2="-58" stroke="#2f855a" strokeWidth="1.2" />
            <line x1="0" y1="0" x2="62" y2="0" stroke="#2f855a" strokeWidth="1.2" />
            <line x1="0" y1="0" x2="0" y2="64" stroke="#2f855a" strokeWidth="1.2" />
            <line x1="0" y1="0" x2="-62" y2="0" stroke="#2f855a" strokeWidth="1.2" />
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
