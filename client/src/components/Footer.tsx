import { format } from "date-fns";
import { getCalendarDayData } from "@/lib/calendarData";

export function Footer() {
  const today = new Date();
  const dateStr = format(today, "yyyy.M.d");
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  const dayName = dayNames[today.getDay()];
  
  const todayData = getCalendarDayData(today.getFullYear(), today.getMonth() + 1, today.getDate());

  return (
    <footer className="max-w-[990px] mx-auto py-4 text-center" data-testid="footer">
      <div className="text-sm mb-2" data-testid="footer-date">
        <span className="orae-pink font-bold">{dateStr} {dayName}</span>
        <span className="text-muted-foreground ml-2">
          (음{todayData.lunarMonth}.{todayData.lunarDay} {todayData.dayGanZhi}日)
        </span>
      </div>
      <p className="text-muted-foreground text-xs" data-testid="footer-copyright">
        © 2026 ORAE. All rights reserved.
      </p>
    </footer>
  );
}
