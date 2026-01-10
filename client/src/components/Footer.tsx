import { format } from "date-fns";
import { getCalendarDayData } from "@/lib/calendarData";

export function Footer() {
  const today = new Date();
  const dateStr = format(today, "yyyy.M.d");
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  const dayName = dayNames[today.getDay()];
  
  const todayData = getCalendarDayData(today.getFullYear(), today.getMonth() + 1, today.getDate());

  // 60갑자 시간 (황극력 기준: 23:00 시작)
  // 오전: 乙巳(23시)~丙戌(09시) / 오후: 丁亥(11시)~戊辰(21시)
  const amHours = ["乙巳", "丙午", "丁未", "戊申", "己酉", "庚戌"];
  const pmHours = ["丁亥", "戊子", "己丑", "庚寅", "辛卯", "壬辰"];

  return (
    <footer className="max-w-[990px] mx-auto py-4 text-center" data-testid="footer">
      <div className="text-sm mb-2" data-testid="footer-date">
        <span className="orae-navy font-bold">{dateStr} {dayName}</span>
        <span className="text-muted-foreground ml-2">
          (음{todayData.lunarMonth}.{todayData.lunarDay} {todayData.dayGanZhi}日)
        </span>
      </div>
      
      {/* 60갑자 시간표 */}
      <div className="mt-3 mb-2" data-testid="footer-60ganzi">
        <div className="text-xs text-muted-foreground mb-1">황극력 시간</div>
        <div className="flex justify-center gap-0.5 text-xs">
          <span className="text-muted-foreground mr-1">오전</span>
          {amHours.map((h, i) => (
            <span key={`am-${i}`} className="px-1 py-0.5 border border-border bg-muted/30">{h}</span>
          ))}
        </div>
        <div className="flex justify-center gap-0.5 text-xs mt-0.5">
          <span className="text-muted-foreground mr-1">오후</span>
          {pmHours.map((h, i) => (
            <span key={`pm-${i}`} className="px-1 py-0.5 border border-border bg-muted/30">{h}</span>
          ))}
        </div>
      </div>
      
      <p className="text-muted-foreground text-xs" data-testid="footer-copyright">
        © 2026 ORAE. All rights reserved.
      </p>
    </footer>
  );
}
