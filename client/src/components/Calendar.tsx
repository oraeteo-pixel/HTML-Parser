import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameMonth, isToday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const MOCK_LUNAR_TERMS = [
  "中, 星宿尊空", "風化節局", "天徳合", "月徳合", "天恩", "母倉", "月恩",
  "六合", "三合", "天喜", "天医", "天赦", "神在", "大安", "赤口",
  "先勝", "友引", "先負", "仏滅", "大安", "赤口", "神吉", "大明日"
];

function getRandomTerm(seed: number) {
  return MOCK_LUNAR_TERMS[seed % MOCK_LUNAR_TERMS.length];
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = monthStart; 
  const endDate = monthEnd;

  // Generate calendar grid days (filling empty start/end cells for visual completeness)
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Calculate leading empty cells
  const startDay = getDay(startDate); // 0 = Sunday
  const blanks = Array.from({ length: startDay });

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="border-2 border-primary bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
      {/* Calendar Header */}
      <div className="bg-muted p-4 border-b border-primary flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
          <span className="text-accent text-3xl">🝖</span>
          황극력 (Hwang-geuk-ryeok)
        </h2>
        <div className="flex items-center gap-4 bg-white px-4 py-1 rounded border border-input shadow-sm">
          <button onClick={prevMonth} className="hover:text-accent p-1 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-xl font-bold font-mono tracking-wider min-w-[120px] text-center">
            {format(currentDate, "yyyy.MM")}
          </span>
          <button onClick={nextMonth} className="hover:text-accent p-1 transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 bg-primary text-primary-foreground font-display font-bold text-center border-b border-primary">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day, i) => (
          <div key={day} className={`py-2 ${i === 0 ? "text-accent" : i === 6 ? "text-blue-300" : ""}`}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="calendar-cell bg-muted/20" />
        ))}
        
        {daysInMonth.map((day) => {
          const dayNum = day.getDate();
          const isSun = getDay(day) === 0;
          const isSat = getDay(day) === 6;
          
          return (
            <div 
              key={day.toISOString()} 
              className={`calendar-cell group ${isToday(day) ? "today" : ""}`}
            >
              <span className={`
                text-2xl font-display font-bold leading-none
                ${isSun ? "text-destructive" : isSat ? "text-blue-600" : "text-primary"}
              `}>
                {dayNum}
              </span>
              
              {/* Decorative Lunar/Ganji text simulation */}
              <div className="lunar-text group-hover:opacity-100 transition-opacity">
                {getRandomTerm(dayNum + currentDate.getMonth())}
              </div>
              
              <div className="mt-auto text-[10px] text-muted-foreground font-mono opacity-50">
                Data {dayNum * 12}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
