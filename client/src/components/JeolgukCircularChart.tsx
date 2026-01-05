import { useMemo } from "react";
import { getHwanggeukDate, getJeolguk, getDayGanZhi, SIXTY_GANJI } from "@/lib/calendarData";

// 24 sectors data - matching the diagram exactly (starting from top, going clockwise)
const SECTORS_DATA = [
  // Top section (亥 - 3月)
  { branch: "亥", month: "3月", jeolguk: "雷和", mansion: "氐", ganji: "己未", stem: "丁" },
  { branch: "", month: "", jeolguk: "風化", mansion: "房", ganji: "甲戌", stem: "戊" },
  { branch: "戊", month: "", jeolguk: "立和", mansion: "心", ganji: "己丑", stem: "" },
  { branch: "", month: "", jeolguk: "行化", mansion: "尾", ganji: "甲辰", stem: "" },
  // Right-top section (子 - 4月)
  { branch: "子", month: "4月", jeolguk: "建和", mansion: "尾", ganji: "己丑", stem: "" },
  { branch: "", month: "", jeolguk: "普化", mansion: "箕", ganji: "甲戌", stem: "辛" },
  // Right section (丑 - 5月)
  { branch: "丑", month: "5月", jeolguk: "淸化", mansion: "斗", ganji: "己未", stem: "" },
  { branch: "", month: "", jeolguk: "平化", mansion: "牛", ganji: "甲辰", stem: "" },
  // Right-bottom section (寅 - 6月)
  { branch: "寅", month: "6月", jeolguk: "成和", mansion: "女", ganji: "己丑", stem: "王" },
  { branch: "", month: "", jeolguk: "入化", mansion: "虛", ganji: "甲戌", stem: "" },
  // Bottom-right section (卯 - 7月)
  { branch: "卯", month: "7月", jeolguk: "咸和", mansion: "危", ganji: "己未", stem: "" },
  { branch: "", month: "", jeolguk: "亨化", mansion: "室", ganji: "甲辰", stem: "癸" },
  // Bottom section (辰 - 8月)
  { branch: "辰", month: "8月", jeolguk: "正和", mansion: "壁", ganji: "己丑", stem: "" },
  { branch: "", month: "", jeolguk: "明和", mansion: "奎", ganji: "甲戌", stem: "" },
  // Bottom-left section (巳 - 9月)
  { branch: "巳", month: "9月", jeolguk: "至和", mansion: "婁", ganji: "己未", stem: "" },
  { branch: "", month: "", jeolguk: "貞和", mansion: "胃", ganji: "甲辰", stem: "" },
  // Left-bottom section (午 - 10月)
  { branch: "午", month: "10月", jeolguk: "太和", mansion: "昴", ganji: "己丑", stem: "" },
  { branch: "", month: "", jeolguk: "體和", mansion: "畢", ganji: "甲戌", stem: "" },
  // Left section (未 - 11月)
  { branch: "未", month: "11月", jeolguk: "仁和", mansion: "觜", ganji: "己未", stem: "乙" },
  { branch: "", month: "", jeolguk: "性和", mansion: "參", ganji: "甲辰", stem: "" },
  // Left-top section (申 - 12月)  
  { branch: "申", month: "12月", jeolguk: "元和", mansion: "井", ganji: "己丑", stem: "" },
  { branch: "", month: "", jeolguk: "中和", mansion: "鬼", ganji: "甲戌", stem: "丙" },
  // Top-left section (酉 - 1月)
  { branch: "酉", month: "1月", jeolguk: "大和", mansion: "柳", ganji: "己未", stem: "" },
  { branch: "", month: "", jeolguk: "布化", mansion: "星", ganji: "甲辰", stem: "" },
];

// 8 Trigrams positioned around the inner circle
const TRIGRAMS = [
  { name: "離", symbol: "☲", angle: 0, number: 2 },
  { name: "巽", symbol: "☴", angle: 45, number: 9 },
  { name: "震", symbol: "☳", angle: 90, number: 4 },
  { name: "艮", symbol: "☶", angle: 135, number: 5 },
  { name: "坤", symbol: "☷", angle: 180, number: 10 },
  { name: "乾", symbol: "☰", angle: 225, number: 7 },
  { name: "兌", symbol: "☱", angle: 270, number: 8 },
  { name: "坎", symbol: "☵", angle: 315, number: 3 },
];

// 10 Heavenly Stems with positions
const STEMS_POSITIONS = [
  { stem: "甲", x: 0, y: 0, number: 1 },
  { stem: "己", x: 0, y: 0, number: 6 },
  { stem: "庚", x: 0, y: -50, number: 7 },
  { stem: "丁", x: 40, y: -30, number: 9 },
  { stem: "壬", x: 50, y: 0, number: 4 },
  { stem: "癸", x: 30, y: 35, number: 5 },
  { stem: "戊", x: 0, y: 50, number: 10 },
  { stem: "辛", x: -30, y: 35, number: 3 },
  { stem: "丙", x: -50, y: 0, number: 8 },
  { stem: "乙", x: -40, y: -30, number: 7 },
];

interface JeolgukCircularChartProps {
  date: Date;
}

export function JeolgukCircularChart({ date }: JeolgukCircularChartProps) {
  const todayGanZhi = getDayGanZhi(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const todayHwDate = getHwanggeukDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const todayJeolguk = getJeolguk(todayHwDate.year, todayHwDate.month, todayHwDate.day);
  const todayStem = todayGanZhi.charAt(0);
  
  const size = 500;
  const center = size / 2;
  const outerRadius = 230;
  const midRadius = 180;
  const innerRadius = 130;
  const coreRadius = 80;
  
  // Calculate arc path for a sector
  const getArcPath = (startAngle: number, endAngle: number, r1: number, r2: number) => {
    const startRad1 = (startAngle - 90) * Math.PI / 180;
    const endRad1 = (endAngle - 90) * Math.PI / 180;
    const startRad2 = (startAngle - 90) * Math.PI / 180;
    const endRad2 = (endAngle - 90) * Math.PI / 180;
    
    const x1 = center + r1 * Math.cos(startRad1);
    const y1 = center + r1 * Math.sin(startRad1);
    const x2 = center + r1 * Math.cos(endRad1);
    const y2 = center + r1 * Math.sin(endRad1);
    const x3 = center + r2 * Math.cos(endRad2);
    const y3 = center + r2 * Math.sin(endRad2);
    const x4 = center + r2 * Math.cos(startRad2);
    const y4 = center + r2 * Math.sin(startRad2);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M ${x1} ${y1} A ${r1} ${r1} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${r2} ${r2} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };
  
  // Get position for text along arc
  const getTextPosition = (angle: number, radius: number) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };
  
  const sectorAngle = 360 / 24;

  return (
    <div className="mt-4 p-4 bg-[#f5f0e8] dark:bg-slate-900/50 rounded-lg" data-testid="jeolguk-circular-chart">
      <h2 className="text-lg font-bold text-center mb-4 orae-navy" data-testid="text-jeolguk-circular-title">
        [ 24節局 ]
      </h2>
      
      <div className="flex justify-center overflow-x-auto">
        <svg 
          viewBox={`0 0 ${size} ${size}`} 
          className="w-full max-w-[500px]"
          style={{ minWidth: "320px" }}
        >
          {/* Background circles */}
          <circle cx={center} cy={center} r={outerRadius} fill="none" stroke="#333" strokeWidth="1" />
          <circle cx={center} cy={center} r={midRadius} fill="none" stroke="#333" strokeWidth="1" />
          <circle cx={center} cy={center} r={innerRadius} fill="none" stroke="#333" strokeWidth="1" />
          <circle cx={center} cy={center} r={coreRadius} fill="#f5f0e8" className="dark:fill-slate-800" stroke="#333" strokeWidth="1" />
          
          {/* Outer ring - 24 sectors */}
          {SECTORS_DATA.map((sector, index) => {
            const startAngle = index * sectorAngle;
            const endAngle = (index + 1) * sectorAngle;
            const midAngle = startAngle + sectorAngle / 2;
            
            // Check if this is today's jeolguk
            const isToday = todayJeolguk.name.includes(sector.jeolguk);
            
            // Outer sector (branch + month)
            const outerPos = getTextPosition(midAngle, outerRadius - 15);
            const midPos = getTextPosition(midAngle, midRadius + 25);
            const innerPos = getTextPosition(midAngle, innerRadius + 25);
            
            return (
              <g key={index}>
                {/* Sector divider lines */}
                {(() => {
                  const rad = (startAngle - 90) * Math.PI / 180;
                  const x1 = center + innerRadius * Math.cos(rad);
                  const y1 = center + innerRadius * Math.sin(rad);
                  const x2 = center + outerRadius * Math.cos(rad);
                  const y2 = center + outerRadius * Math.sin(rad);
                  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#666" strokeWidth="0.5" />;
                })()}
                
                {/* Highlight today's sector */}
                {isToday && (
                  <path 
                    d={getArcPath(startAngle, endAngle, outerRadius, innerRadius)}
                    fill="hsl(215 50% 35% / 0.2)"
                    className="dark:fill-blue-500/20"
                  />
                )}
                
                {/* Branch text (outermost) */}
                {sector.branch && (
                  <text
                    x={outerPos.x}
                    y={outerPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-sm font-bold fill-current"
                    transform={`rotate(${midAngle}, ${outerPos.x}, ${outerPos.y})`}
                  >
                    {sector.branch}
                  </text>
                )}
                
                {/* Month text */}
                {sector.month && (
                  <text
                    x={getTextPosition(midAngle, outerRadius - 35).x}
                    y={getTextPosition(midAngle, outerRadius - 35).y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[8px] fill-current"
                    transform={`rotate(${midAngle}, ${getTextPosition(midAngle, outerRadius - 35).x}, ${getTextPosition(midAngle, outerRadius - 35).y})`}
                  >
                    {sector.month}
                  </text>
                )}
                
                {/* Jeolguk name */}
                <text
                  x={midPos.x}
                  y={midPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-[9px] fill-current ${isToday ? 'font-bold' : ''}`}
                  style={{ fill: isToday ? 'hsl(215 50% 35%)' : 'currentColor' }}
                  transform={`rotate(${midAngle}, ${midPos.x}, ${midPos.y})`}
                >
                  {sector.jeolguk}
                </text>
                
                {/* Mansion */}
                <text
                  x={innerPos.x}
                  y={innerPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[10px] font-medium fill-current"
                  transform={`rotate(${midAngle}, ${innerPos.x}, ${innerPos.y})`}
                >
                  {sector.mansion}
                </text>
                
                {/* Ganji */}
                <text
                  x={getTextPosition(midAngle, innerRadius + 10).x}
                  y={getTextPosition(midAngle, innerRadius + 10).y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[7px] fill-muted-foreground"
                  transform={`rotate(${midAngle}, ${getTextPosition(midAngle, innerRadius + 10).x}, ${getTextPosition(midAngle, innerRadius + 10).y})`}
                >
                  {sector.ganji}
                </text>
              </g>
            );
          })}
          
          {/* Inner circle - 8 Trigrams */}
          {TRIGRAMS.map((trigram, index) => {
            const pos = getTextPosition(trigram.angle, coreRadius + 25);
            return (
              <g key={index}>
                <text
                  x={pos.x}
                  y={pos.y - 8}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-lg"
                >
                  {trigram.symbol}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 8}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[9px] fill-current"
                >
                  {trigram.number}
                </text>
              </g>
            );
          })}
          
          {/* Center - 10 Heavenly Stems */}
          <g transform={`translate(${center}, ${center})`}>
            {/* Center stem labels */}
            <text x="0" y="-5" textAnchor="middle" className="text-[10px] fill-muted-foreground">(1)</text>
            <text x="-10" y="8" textAnchor="middle" className="text-[10px] fill-muted-foreground">己</text>
            <text x="10" y="8" textAnchor="middle" className="text-[10px] fill-muted-foreground">甲</text>
            <text x="5" y="20" textAnchor="middle" className="text-[8px] fill-muted-foreground">6</text>
            
            {/* Stems around center */}
            <text x="0" y="-45" textAnchor="middle" className={`text-sm ${todayStem === '庚' ? 'font-bold fill-[hsl(215_50%_35%)]' : 'fill-current'}`}>庚</text>
            <text x="-5" y="-55" textAnchor="middle" className="text-[8px] fill-muted-foreground">7</text>
            
            <text x="35" y="-25" textAnchor="middle" className={`text-sm ${todayStem === '丁' ? 'font-bold fill-[hsl(215_50%_35%)]' : 'fill-current'}`}>丁</text>
            <text x="45" y="-30" textAnchor="middle" className="text-[8px] fill-muted-foreground">9</text>
            
            <text x="45" y="5" textAnchor="middle" className={`text-sm ${todayStem === '壬' ? 'font-bold fill-[hsl(215_50%_35%)]' : 'fill-current'}`}>壬</text>
            <text x="55" y="5" textAnchor="middle" className="text-[8px] fill-muted-foreground">4</text>
            
            <text x="30" y="35" textAnchor="middle" className={`text-sm ${todayStem === '癸' ? 'font-bold fill-[hsl(215_50%_35%)]' : 'fill-current'}`}>癸</text>
            <text x="40" y="40" textAnchor="middle" className="text-[8px] fill-muted-foreground">5</text>
            
            <text x="0" y="50" textAnchor="middle" className={`text-sm ${todayStem === '戊' ? 'font-bold fill-[hsl(215_50%_35%)]' : 'fill-current'}`}>戊</text>
            <text x="0" y="62" textAnchor="middle" className="text-[8px] fill-muted-foreground">10</text>
            
            <text x="-30" y="35" textAnchor="middle" className={`text-sm ${todayStem === '辛' ? 'font-bold fill-[hsl(215_50%_35%)]' : 'fill-current'}`}>辛</text>
            <text x="-40" y="40" textAnchor="middle" className="text-[8px] fill-muted-foreground">3</text>
            
            <text x="-45" y="5" textAnchor="middle" className={`text-sm ${todayStem === '丙' ? 'font-bold fill-[hsl(215_50%_35%)]' : 'fill-current'}`}>丙</text>
            <text x="-55" y="5" textAnchor="middle" className="text-[8px] fill-muted-foreground">8</text>
            
            <text x="-35" y="-25" textAnchor="middle" className={`text-sm ${todayStem === '乙' ? 'font-bold fill-[hsl(215_50%_35%)]' : 'fill-current'}`}>乙</text>
            <text x="-45" y="-30" textAnchor="middle" className="text-[8px] fill-muted-foreground">7</text>
            
            {/* Connecting lines between stems */}
            <line x1="0" y1="-45" x2="35" y2="-25" stroke="#666" strokeWidth="0.5" strokeDasharray="2,2" />
            <line x1="35" y1="-25" x2="45" y2="0" stroke="#666" strokeWidth="0.5" strokeDasharray="2,2" />
            <line x1="45" y1="0" x2="30" y2="30" stroke="#666" strokeWidth="0.5" strokeDasharray="2,2" />
            <line x1="30" y1="30" x2="0" y2="45" stroke="#666" strokeWidth="0.5" strokeDasharray="2,2" />
            <line x1="0" y1="45" x2="-30" y2="30" stroke="#666" strokeWidth="0.5" strokeDasharray="2,2" />
            <line x1="-30" y1="30" x2="-45" y2="0" stroke="#666" strokeWidth="0.5" strokeDasharray="2,2" />
            <line x1="-45" y1="0" x2="-35" y2="-25" stroke="#666" strokeWidth="0.5" strokeDasharray="2,2" />
            <line x1="-35" y1="-25" x2="0" y2="-45" stroke="#666" strokeWidth="0.5" strokeDasharray="2,2" />
            
            {/* Cross lines through center */}
            <line x1="0" y1="0" x2="0" y2="-45" stroke="#2a5" strokeWidth="0.5" />
            <line x1="0" y1="0" x2="45" y2="0" stroke="#2a5" strokeWidth="0.5" />
            <line x1="0" y1="0" x2="0" y2="45" stroke="#2a5" strokeWidth="0.5" />
            <line x1="0" y1="0" x2="-45" y2="0" stroke="#2a5" strokeWidth="0.5" />
          </g>
        </svg>
      </div>
      
      <div className="text-center mt-3 text-sm text-muted-foreground">
        용담도에 적용한 천간 (동지기준)
      </div>
      
      {/* Today's info */}
      <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
        <span className="text-sm px-2 py-1 rounded bg-[hsl(215_50%_35%)] text-white">
          오늘: {todayGanZhi}
        </span>
        <span className="text-sm px-2 py-1 rounded bg-slate-200 dark:bg-slate-700">
          천간: {todayStem}
        </span>
        <span className="text-sm px-2 py-1 rounded bg-slate-200 dark:bg-slate-700">
          {todayJeolguk.name}
        </span>
      </div>
    </div>
  );
}
