import { useMemo } from "react";
import { getHwanggeukDate, getJeolguk, getDayGanZhi } from "@/lib/calendarData";

// 24 sectors data - matching the diagram exactly
// Starting from TOP (12 o'clock position), going CLOCKWISE
// 寅申巳亥 are at the cross positions (top, right, bottom, left)
const SECTORS_DATA = [
  // TOP - 寅 (인) area - 2月
  { stem: "戊", branch: "", month: "2月", jeolguk: "布化", mansion: "角", ganji: "甲辰", position: 1 },
  { stem: "", branch: "寅", month: "", jeolguk: "大和", mansion: "亢", ganji: "己未", position: 2 },
  { stem: "丁", branch: "", month: "", jeolguk: "中化", mansion: "氐", ganji: "甲戌", position: 3 },
  // 卯 area - 3月
  { stem: "", branch: "", month: "3月", jeolguk: "元和", mansion: "房", ganji: "己丑", position: 4 },
  { stem: "", branch: "卯", month: "", jeolguk: "性和", mansion: "心", ganji: "甲辰", position: 5 },
  { stem: "丙", branch: "", month: "", jeolguk: "仁和", mansion: "尾", ganji: "己未", position: 6 },
  // RIGHT - 巳 (사) area - 4月  
  { stem: "", branch: "", month: "4月", jeolguk: "體和", mansion: "箕", ganji: "甲戌", position: 7 },
  { stem: "", branch: "巳", month: "", jeolguk: "太和", mansion: "斗", ganji: "己丑", position: 8 },
  { stem: "乙", branch: "", month: "", jeolguk: "貞和", mansion: "牛", ganji: "甲辰", position: 9 },
  // 午 area - 5月
  { stem: "", branch: "", month: "5月", jeolguk: "至和", mansion: "女", ganji: "己未", position: 10 },
  { stem: "", branch: "午", month: "", jeolguk: "明和", mansion: "虛", ganji: "甲戌", position: 11 },
  { stem: "", branch: "", month: "", jeolguk: "正和", mansion: "危", ganji: "己丑", position: 12 },
  // BOTTOM - 申 (신) area - 6月
  { stem: "", branch: "", month: "6月", jeolguk: "亨化", mansion: "室", ganji: "甲辰", position: 13 },
  { stem: "", branch: "申", month: "", jeolguk: "咸和", mansion: "壁", ganji: "己未", position: 14 },
  { stem: "", branch: "", month: "", jeolguk: "入化", mansion: "奎", ganji: "甲戌", position: 15 },
  // 酉 area - 7月
  { stem: "", branch: "", month: "7月", jeolguk: "成和", mansion: "婁", ganji: "己丑", position: 16 },
  { stem: "", branch: "酉", month: "", jeolguk: "平和", mansion: "胃", ganji: "甲辰", position: 17 },
  { stem: "", branch: "", month: "", jeolguk: "淸和", mansion: "昴", ganji: "己未", position: 18 },
  // LEFT - 亥 (해) area - 8月
  { stem: "", branch: "", month: "8月", jeolguk: "普化", mansion: "畢", ganji: "甲戌", position: 19 },
  { stem: "", branch: "亥", month: "", jeolguk: "建和", mansion: "觜", ganji: "己丑", position: 20 },
  { stem: "辛", branch: "", month: "", jeolguk: "行化", mansion: "參", ganji: "甲辰", position: 21 },
  // 子 area - 9月
  { stem: "", branch: "", month: "9月", jeolguk: "立和", mansion: "井", ganji: "己未", position: 22 },
  { stem: "", branch: "子", month: "", jeolguk: "風化", mansion: "鬼", ganji: "甲戌", position: 23 },
  { stem: "庚", branch: "", month: "", jeolguk: "雷和", mansion: "柳", ganji: "己丑", position: 24 },
];

// Outer ring - 12 earthly branches with stems (matching image exactly)
const OUTER_RING = [
  { stem: "戊", branch: "寅", month: "2月", angle: 0 },    // TOP
  { stem: "丁", branch: "卯", month: "3月", angle: 30 },
  { stem: "丙", branch: "辰", month: "4月", angle: 60 },
  { stem: "乙", branch: "巳", month: "5月", angle: 90 },   // RIGHT
  { stem: "", branch: "午", month: "6月", angle: 120 },
  { stem: "", branch: "未", month: "7月", angle: 150 },
  { stem: "", branch: "申", month: "8月", angle: 180 },    // BOTTOM
  { stem: "", branch: "酉", month: "9月", angle: 210 },
  { stem: "辛", branch: "戌", month: "10月", angle: 240 },
  { stem: "庚", branch: "亥", month: "11月", angle: 270 },  // LEFT
  { stem: "", branch: "子", month: "12月", angle: 300 },
  { stem: "", branch: "丑", month: "1月", angle: 330 },
];

// 8 Trigrams - positioned at 45 degree intervals, matching the image
// Image shows: 離(2) at top, then clockwise 巽, 震, 艮, 坤, 乾, 兌, 坎
const TRIGRAMS = [
  { name: "離", symbol: "☲", number: 2, angle: 0 },      // TOP
  { name: "巽", symbol: "☴", number: 9, angle: 45 },
  { name: "震", symbol: "☳", number: 4, angle: 90 },     // RIGHT  
  { name: "艮", symbol: "☶", number: 5, angle: 135 },
  { name: "坤", symbol: "☷", number: 10, angle: 180 },   // BOTTOM
  { name: "乾", symbol: "☰", number: 7, angle: 225 },
  { name: "兌", symbol: "☱", number: 8, angle: 270 },    // LEFT
  { name: "坎", symbol: "☵", number: 3, angle: 315 },
];

interface JeolgukCircularChartProps {
  date: Date;
}

export function JeolgukCircularChart({ date }: JeolgukCircularChartProps) {
  const todayGanZhi = getDayGanZhi(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const todayHwDate = getHwanggeukDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const todayJeolguk = getJeolguk(todayHwDate.year, todayHwDate.month, todayHwDate.day);
  const todayStem = todayGanZhi.charAt(0);
  
  const size = 520;
  const center = size / 2;
  const outerRadius = 240;
  const ring2Radius = 200;
  const ring3Radius = 160;
  const trigramRadius = 115;
  const coreRadius = 70;
  
  const sectorAngle = 360 / 24;
  
  // Get position for text along arc
  const getTextPosition = (angle: number, radius: number) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };

  return (
    <div className="mt-4 p-4 bg-[#f8f4ec] dark:bg-slate-900/50 rounded-lg" data-testid="jeolguk-circular-chart">
      <h2 className="text-lg font-bold text-center mb-4 orae-navy" data-testid="text-jeolguk-circular-title">
        [ 24節局 ]
      </h2>
      
      <div className="flex justify-center overflow-x-auto">
        <svg 
          viewBox={`0 0 ${size} ${size}`} 
          className="w-full max-w-[520px]"
          style={{ minWidth: "320px" }}
        >
          {/* Background */}
          <circle cx={center} cy={center} r={outerRadius + 5} fill="#f8f4ec" className="dark:fill-slate-800" />
          
          {/* Outer ring border */}
          <circle cx={center} cy={center} r={outerRadius} fill="none" stroke="#333" strokeWidth="1.5" />
          <circle cx={center} cy={center} r={ring2Radius} fill="none" stroke="#333" strokeWidth="1" />
          <circle cx={center} cy={center} r={ring3Radius} fill="none" stroke="#333" strokeWidth="1" />
          <circle cx={center} cy={center} r={trigramRadius} fill="none" stroke="#333" strokeWidth="1" />
          <circle cx={center} cy={center} r={coreRadius} fill="#f8f4ec" className="dark:fill-slate-800" stroke="#333" strokeWidth="1" />
          
          {/* Radial dividers for 24 sectors */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = i * sectorAngle;
            const rad = (angle - 90) * Math.PI / 180;
            const x1 = center + ring3Radius * Math.cos(rad);
            const y1 = center + ring3Radius * Math.sin(rad);
            const x2 = center + outerRadius * Math.cos(rad);
            const y2 = center + outerRadius * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#666" strokeWidth="0.5" />;
          })}
          
          {/* 24 Sector content */}
          {SECTORS_DATA.map((sector, index) => {
            const midAngle = index * sectorAngle + sectorAngle / 2;
            const isToday = todayJeolguk.name.includes(sector.jeolguk);
            
            // Outer ring positions
            const outerPos = getTextPosition(midAngle, outerRadius - 18);
            const ring2Pos = getTextPosition(midAngle, ring2Radius + 18);
            const ring3Pos = getTextPosition(midAngle, ring3Radius + 18);
            const ganjiPos = getTextPosition(midAngle, ring3Radius + 5);
            
            // Rotation for readable text
            let textRotation = midAngle;
            if (midAngle > 90 && midAngle < 270) {
              textRotation = midAngle + 180;
            }
            
            return (
              <g key={index}>
                {/* Highlight today's sector */}
                {isToday && (
                  <path 
                    d={`M ${center} ${center} L ${getTextPosition(index * sectorAngle, outerRadius).x} ${getTextPosition(index * sectorAngle, outerRadius).y} A ${outerRadius} ${outerRadius} 0 0 1 ${getTextPosition((index + 1) * sectorAngle, outerRadius).x} ${getTextPosition((index + 1) * sectorAngle, outerRadius).y} Z`}
                    fill="hsl(215 50% 35% / 0.15)"
                    className="dark:fill-blue-500/20"
                  />
                )}
                
                {/* Stem (천간) - outermost when present */}
                {sector.stem && (
                  <text
                    x={getTextPosition(midAngle, outerRadius - 8).x}
                    y={getTextPosition(midAngle, outerRadius - 8).y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[11px] font-bold"
                    style={{ fill: '#1a365d' }}
                    transform={`rotate(${textRotation}, ${getTextPosition(midAngle, outerRadius - 8).x}, ${getTextPosition(midAngle, outerRadius - 8).y})`}
                  >
                    {sector.stem}
                  </text>
                )}
                
                {/* Branch (지지) */}
                {sector.branch && (
                  <text
                    x={outerPos.x}
                    y={outerPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[13px] font-bold"
                    style={{ fill: '#1a365d' }}
                    transform={`rotate(${textRotation}, ${outerPos.x}, ${outerPos.y})`}
                  >
                    {sector.branch}
                  </text>
                )}
                
                {/* Month */}
                {sector.month && (
                  <text
                    x={getTextPosition(midAngle, outerRadius - 32).x}
                    y={getTextPosition(midAngle, outerRadius - 32).y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[8px]"
                    style={{ fill: '#4a5568' }}
                    transform={`rotate(${textRotation}, ${getTextPosition(midAngle, outerRadius - 32).x}, ${getTextPosition(midAngle, outerRadius - 32).y})`}
                  >
                    {sector.month}
                  </text>
                )}
                
                {/* Jeolguk name */}
                <text
                  x={ring2Pos.x}
                  y={ring2Pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-[9px] ${isToday ? 'font-bold' : ''}`}
                  style={{ fill: isToday ? '#1a365d' : '#2d3748' }}
                  transform={`rotate(${textRotation}, ${ring2Pos.x}, ${ring2Pos.y})`}
                >
                  {sector.jeolguk}
                </text>
                
                {/* Ganji pair */}
                <text
                  x={ganjiPos.x}
                  y={ganjiPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[7px]"
                  style={{ fill: '#718096' }}
                  transform={`rotate(${textRotation}, ${ganjiPos.x}, ${ganjiPos.y})`}
                >
                  {sector.ganji}
                </text>
                
                {/* Mansion */}
                <text
                  x={ring3Pos.x}
                  y={ring3Pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[11px] font-medium"
                  style={{ fill: '#2d3748' }}
                  transform={`rotate(${textRotation}, ${ring3Pos.x}, ${ring3Pos.y})`}
                >
                  {sector.mansion}
                </text>
              </g>
            );
          })}
          
          {/* 8 Trigrams ring */}
          {TRIGRAMS.map((trigram, index) => {
            const pos = getTextPosition(trigram.angle, trigramRadius - 22);
            return (
              <g key={index}>
                <text
                  x={pos.x}
                  y={pos.y - 6}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[16px]"
                  style={{ fill: '#2d3748' }}
                >
                  {trigram.symbol}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[10px] font-medium"
                  style={{ fill: '#4a5568' }}
                >
                  {trigram.number}
                </text>
              </g>
            );
          })}
          
          {/* Center - 10 Heavenly Stems with star pattern */}
          <g transform={`translate(${center}, ${center})`}>
            {/* Center labels: 己(6) and 甲(1) */}
            <text x="-8" y="-2" textAnchor="middle" className="text-[9px]" style={{ fill: '#718096' }}>(1)</text>
            <text x="8" y="-2" textAnchor="middle" className="text-[9px]" style={{ fill: '#718096' }}>6</text>
            <text x="-8" y="12" textAnchor="middle" className="text-[11px] font-medium" style={{ fill: '#2d3748' }}>己</text>
            <text x="8" y="12" textAnchor="middle" className={`text-[11px] font-medium ${todayStem === '甲' ? 'font-bold' : ''}`} style={{ fill: todayStem === '甲' ? '#1a365d' : '#2d3748' }}>甲</text>
            
            {/* Outer stems in star pattern */}
            {/* 庚 - top */}
            <text x="0" y="-42" textAnchor="middle" className={`text-[12px] ${todayStem === '庚' ? 'font-bold' : ''}`} style={{ fill: todayStem === '庚' ? '#1a365d' : '#2d3748' }}>庚</text>
            <text x="0" y="-52" textAnchor="middle" className="text-[8px]" style={{ fill: '#718096' }}>7</text>
            
            {/* 丁 - top right */}
            <text x="32" y="-28" textAnchor="middle" className={`text-[12px] ${todayStem === '丁' ? 'font-bold' : ''}`} style={{ fill: todayStem === '丁' ? '#1a365d' : '#2d3748' }}>丁</text>
            <text x="42" y="-32" textAnchor="middle" className="text-[8px]" style={{ fill: '#718096' }}>9</text>
            
            {/* 壬 - right */}
            <text x="45" y="5" textAnchor="middle" className={`text-[12px] ${todayStem === '壬' ? 'font-bold' : ''}`} style={{ fill: todayStem === '壬' ? '#1a365d' : '#2d3748' }}>壬</text>
            <text x="55" y="5" textAnchor="middle" className="text-[8px]" style={{ fill: '#718096' }}>4</text>
            
            {/* 癸 - bottom right */}
            <text x="32" y="35" textAnchor="middle" className={`text-[12px] ${todayStem === '癸' ? 'font-bold' : ''}`} style={{ fill: todayStem === '癸' ? '#1a365d' : '#2d3748' }}>癸</text>
            <text x="42" y="40" textAnchor="middle" className="text-[8px]" style={{ fill: '#718096' }}>5</text>
            
            {/* 戊 - bottom */}
            <text x="0" y="48" textAnchor="middle" className={`text-[12px] ${todayStem === '戊' ? 'font-bold' : ''}`} style={{ fill: todayStem === '戊' ? '#1a365d' : '#2d3748' }}>戊</text>
            <text x="0" y="58" textAnchor="middle" className="text-[8px]" style={{ fill: '#718096' }}>10</text>
            
            {/* 辛 - bottom left */}
            <text x="-32" y="35" textAnchor="middle" className={`text-[12px] ${todayStem === '辛' ? 'font-bold' : ''}`} style={{ fill: todayStem === '辛' ? '#1a365d' : '#2d3748' }}>辛</text>
            <text x="-42" y="40" textAnchor="middle" className="text-[8px]" style={{ fill: '#718096' }}>3</text>
            
            {/* 丙 - left */}
            <text x="-45" y="5" textAnchor="middle" className={`text-[12px] ${todayStem === '丙' ? 'font-bold' : ''}`} style={{ fill: todayStem === '丙' ? '#1a365d' : '#2d3748' }}>丙</text>
            <text x="-55" y="5" textAnchor="middle" className="text-[8px]" style={{ fill: '#718096' }}>8</text>
            
            {/* 乙 - top left */}
            <text x="-32" y="-28" textAnchor="middle" className={`text-[12px] ${todayStem === '乙' ? 'font-bold' : ''}`} style={{ fill: todayStem === '乙' ? '#1a365d' : '#2d3748' }}>乙</text>
            <text x="-42" y="-32" textAnchor="middle" className="text-[8px]" style={{ fill: '#718096' }}>7</text>
            
            {/* Connecting lines - star pattern */}
            <line x1="0" y1="-38" x2="28" y2="-25" stroke="#718096" strokeWidth="0.5" strokeDasharray="3,2" />
            <line x1="28" y1="-25" x2="40" y2="0" stroke="#718096" strokeWidth="0.5" strokeDasharray="3,2" />
            <line x1="40" y1="0" x2="28" y2="30" stroke="#718096" strokeWidth="0.5" strokeDasharray="3,2" />
            <line x1="28" y1="30" x2="0" y2="42" stroke="#718096" strokeWidth="0.5" strokeDasharray="3,2" />
            <line x1="0" y1="42" x2="-28" y2="30" stroke="#718096" strokeWidth="0.5" strokeDasharray="3,2" />
            <line x1="-28" y1="30" x2="-40" y2="0" stroke="#718096" strokeWidth="0.5" strokeDasharray="3,2" />
            <line x1="-40" y1="0" x2="-28" y2="-25" stroke="#718096" strokeWidth="0.5" strokeDasharray="3,2" />
            <line x1="-28" y1="-25" x2="0" y2="-38" stroke="#718096" strokeWidth="0.5" strokeDasharray="3,2" />
            
            {/* Cross lines through center - green */}
            <line x1="0" y1="0" x2="0" y2="-38" stroke="#2f855a" strokeWidth="0.8" />
            <line x1="0" y1="0" x2="40" y2="0" stroke="#2f855a" strokeWidth="0.8" />
            <line x1="0" y1="0" x2="0" y2="42" stroke="#2f855a" strokeWidth="0.8" />
            <line x1="0" y1="0" x2="-40" y2="0" stroke="#2f855a" strokeWidth="0.8" />
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
