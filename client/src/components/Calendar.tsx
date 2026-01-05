import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, addYears, subYears, isToday, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { 
  getCalendarDayData, 
  getYearGanZhi, 
  getMonthGanZhi, 
  getDayGanZhi,
  get28Mansion,
  get8Trigram,
  solarToLunar,
  getCurrentSolarTerm,
  getHwanggeukDate,
  CalendarDayData
} from "@/lib/calendarData";

const ELEMENTS = ["木", "火", "土", "金", "水"];
const CAL_DESCRIPTIONS = {
  hw: "황극력(皇極曆)은 고대 동아시아 천문학을 기반으로 한 역법입니다. 동지를 한 해의 시작으로 하며, 23시를 자시(子時)의 시작으로 봅니다.",
  df: "선천력(先天曆)은 양력을 기준으로 하며, 복희의 선천팔괘를 기반으로 한 역법입니다."
};

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calType, setCalType] = useState<"hw" | "df">("hw");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showDayDetail, setShowDayDetail] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);
  const blanks = Array.from({ length: startDay });

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevYear = () => setCurrentDate(subYears(currentDate, 1));
  const nextYear = () => setCurrentDate(addYears(currentDate, 1));
  const goToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(null);
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const years = Array.from({ length: 200 }, (_, i) => 1900 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const displayDate = selectedDay || new Date();
  const displayYear = displayDate.getFullYear();
  const displayMonth = displayDate.getMonth() + 1;
  const displayDay = displayDate.getDate();
  
  const displayData = getCalendarDayData(displayYear, displayMonth, displayDay);
  const displayElement = ELEMENTS[(displayYear + displayMonth + displayDay) % 5];

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setShowDayDetail(true);
  };

  return (
    <div className="bg-white border border-border" data-testid="calendar">
      <div className="p-2 space-y-2">
        <div className="flex gap-2">
          <Button 
            variant={calType === "hw" ? "default" : "secondary"}
            size="sm"
            onClick={() => setCalType("hw")}
            data-testid="button-hwanggeuk"
          >
            황극력
          </Button>
          <Button 
            variant={calType === "df" ? "default" : "secondary"}
            size="sm"
            onClick={() => setCalType("df")}
            data-testid="button-seoncheon"
          >
            선천력
          </Button>
        </div>

        <div 
          id="calDate" 
          className="bg-muted/50 rounded p-3 text-sm cursor-pointer hover:bg-muted transition-colors"
          data-testid="calendar-info"
          onClick={() => setShowDayDetail(true)}
        >
          <div className="font-bold">
            {calType === "hw" ? (
              <>
                {displayData.hwanggeuk.year}.{displayData.hwanggeuk.month}.{displayData.hwanggeuk.day} {["日", "月", "火", "水", "木", "金", "土"][displayDate.getDay()]}
              </>
            ) : (
              <>
                {format(displayDate, "yyyy.M.d")} {["日", "月", "火", "水", "木", "金", "土"][displayDate.getDay()]}
              </>
            )}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {calType === "hw" ? "황극력" : "선천력"}
            </span>
          </div>
          <div className="text-muted-foreground text-xs mt-1">
            {calType === "hw" ? (
              <>({displayData.hwanggeuk.yearGanZhi}年 {displayData.hwanggeuk.monthGanZhi}月 {displayData.dayGanZhi}日) {displayData.currentTerm.hanja}</>
            ) : (
              <>({displayData.yearGanZhi}年 {displayData.monthGanZhi}月 {displayData.dayGanZhi}日) {displayData.currentTerm.hanja}</>
            )}
          </div>
          <div className="mt-2 flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" data-testid="button-28mansions">
              {displayData.trigram}, {displayData.mansion}宿 ({displayData.mansionGeneral})
            </Button>
            <Button variant="outline" size="sm" data-testid="button-lunar">
              음{displayData.lunarMonth}.{displayData.lunarDay}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 flex-wrap">
          <Button variant="ghost" size="icon" onClick={prevYear} className="h-8 w-8" data-testid="button-prev-year">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Select 
            value={String(currentYear)} 
            onValueChange={(v) => setCurrentDate(new Date(Number(v), currentMonth - 1, 1))}
          >
            <SelectTrigger className="w-[100px] h-8" data-testid="select-year">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}년</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="ghost" size="icon" onClick={nextYear} className="h-8 w-8" data-testid="button-next-year">
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button 
            variant="default" 
            size="sm" 
            onClick={goToday}
            className="mx-2"
            data-testid="button-today"
          >
            오늘
          </Button>

          <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8" data-testid="button-prev-month">
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Select 
            value={String(currentMonth)} 
            onValueChange={(v) => setCurrentDate(new Date(currentYear, Number(v) - 1, 1))}
          >
            <SelectTrigger className="w-[80px] h-8" data-testid="select-month">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m} value={String(m)}>{m}월</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8" data-testid="button-next-month">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 bg-amber-100 dark:bg-amber-900/30 text-center font-bold text-sm border-t border-border">
        {["일", "월", "화", "수", "목", "금", "토"].map((day, i) => (
          <div 
            key={day} 
            className={`py-2 border-b border-border ${i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : ""}`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="calendar-cell inactive" />
        ))}
        
        {daysInMonth.map((day) => {
          const dayNum = day.getDate();
          const dayMonth = day.getMonth() + 1;
          const dayYear = day.getFullYear();
          const isSun = getDay(day) === 0;
          const isSat = getDay(day) === 6;
          
          const dayData = getCalendarDayData(dayYear, dayMonth, dayNum);
          
          return (
            <div 
              key={day.toISOString()} 
              className={`calendar-cell group cursor-pointer ${isToday(day) ? "today" : ""} ${selectedDay && isSameDay(day, selectedDay) ? "ring-2 ring-primary" : ""}`}
              data-testid={`calendar-day-${dayNum}`}
              onClick={() => handleDayClick(day)}
            >
              <div className="flex justify-between items-start">
                <span className={`text-lg font-bold ${isSun ? "text-red-500" : isSat ? "text-blue-500" : "text-foreground"}`}>
                  {dayNum}
                </span>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground bg-muted rounded px-1">
                    {calType === "hw" 
                      ? `${dayData.hwanggeuk.month}.${dayData.hwanggeuk.day}` 
                      : `${dayData.lunarMonth}.${dayData.lunarDay}`}
                  </div>
                </div>
              </div>
              
              <div className="ganji-text mt-1 text-center">
                {dayData.dayGanZhi}
              </div>
              
              <div className="mansions-text mt-auto space-y-0.5 text-right">
                <div><strong className="text-primary">{dayData.trigram}</strong></div>
                <div>{dayData.mansion}, {dayData.mansionGeneral}</div>
              </div>
              
              {dayData.solarTerm && (
                <div className="absolute top-0 left-0 text-xs text-red-500 font-bold">
                  {dayData.solarTerm.korean}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Dialog open={showDayDetail} onOpenChange={setShowDayDetail}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {format(displayDate, "yyyy년 M월 d일")} ({["일", "월", "화", "수", "목", "금", "토"][displayDate.getDay()]}요일)
            </DialogTitle>
            <DialogDescription>
              {calType === "hw" ? "황극력" : "선천력"} 상세 정보
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-muted/50 rounded p-3">
                <div className="text-muted-foreground text-xs mb-1">
                  {calType === "hw" ? "황극력 간지" : "선천력 간지"}
                </div>
                <div className="font-bold text-lg">
                  {calType === "hw" 
                    ? `${displayData.hwanggeuk.yearGanZhi}年 ${displayData.hwanggeuk.monthGanZhi}月 ${displayData.dayGanZhi}日`
                    : `${displayData.yearGanZhi}年 ${displayData.monthGanZhi}月 ${displayData.dayGanZhi}日`
                  }
                </div>
              </div>
              <div className="bg-muted/50 rounded p-3">
                <div className="text-muted-foreground text-xs mb-1">절기 (節氣)</div>
                <div className="font-bold text-lg">{displayData.currentTerm.hanja} ({displayData.currentTerm.korean})</div>
              </div>
              <div className="bg-muted/50 rounded p-3">
                <div className="text-muted-foreground text-xs mb-1">28수 (二十八宿)</div>
                <div className="font-bold text-lg">{displayData.mansionDirection}{displayData.mansion}宿</div>
                <div className="text-xs text-muted-foreground">{displayData.mansionGeneral}</div>
              </div>
              <div className="bg-muted/50 rounded p-3">
                <div className="text-muted-foreground text-xs mb-1">팔괘 (八卦)</div>
                <div className="font-bold text-lg">{displayData.trigram}卦</div>
                <div className="text-xs text-muted-foreground">{displayData.trigramDirection}</div>
              </div>
              <div className="bg-muted/50 rounded p-3">
                <div className="text-muted-foreground text-xs mb-1">음력</div>
                <div className="font-bold text-lg">
                  {displayData.lunarMonth}월 {displayData.lunarDay}일
                  {displayData.isLeapMonth && <span className="text-xs ml-1">(윤)</span>}
                </div>
              </div>
              <div className="bg-muted/50 rounded p-3">
                <div className="text-muted-foreground text-xs mb-1">황극력</div>
                <div className="font-bold text-lg">
                  {displayData.hwanggeuk.year}.{displayData.hwanggeuk.month}.{displayData.hwanggeuk.day}
                </div>
                <div className="text-xs text-muted-foreground">
                  {displayData.hwanggeuk.yearGanZhi}年 {displayData.hwanggeuk.monthGanZhi}月
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {CAL_DESCRIPTIONS[calType]}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
