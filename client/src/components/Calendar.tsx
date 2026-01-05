import { useState, useMemo } from "react";
import { format, getDay, isToday, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { 
  getCalendarDayData, 
  getHwanggeukDate,
  getHwanggeukMonthData,
  getHwanggeukMonthDays,
  getHwanggeukYearGanZhi,
  getHwanggeukMonthGanZhi,
  hwanggeukToSolar,
  CalendarDayData
} from "@/lib/calendarData";

const CAL_DESCRIPTIONS = {
  hw: "황극력(皇極曆)은 고대 동아시아 천문학을 기반으로 한 역법입니다. 동지를 한 해의 시작으로 하며, 23시를 자시(子時)의 시작으로 봅니다.",
  df: "선천력(先天曆)은 양력을 기준으로 하며, 복희의 선천팔괘를 기반으로 한 역법입니다."
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const WEEKDAYS_HANJA = ["日", "月", "火", "水", "木", "金", "土"];

export function Calendar() {
  const today = new Date();
  const todayHw = getHwanggeukDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
  
  const [calType, setCalType] = useState<"hw" | "df">("hw");
  const [hwYear, setHwYear] = useState(todayHw.year);
  const [hwMonth, setHwMonth] = useState(todayHw.month);
  const [solarYear, setSolarYear] = useState(today.getFullYear());
  const [solarMonth, setSolarMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showDayDetail, setShowDayDetail] = useState(false);

  const hwMonthData = useMemo(() => {
    if (calType === "hw") {
      return getHwanggeukMonthData(hwYear, hwMonth);
    }
    return [];
  }, [hwYear, hwMonth, calType]);

  const solarMonthData = useMemo(() => {
    if (calType === "df") {
      const daysInMonth = new Date(solarYear, solarMonth, 0).getDate();
      const result = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const solarDate = new Date(solarYear, solarMonth - 1, d);
        const dayData = getCalendarDayData(solarYear, solarMonth, d);
        result.push({ solarDate, dayData, solarDay: d });
      }
      return result;
    }
    return [];
  }, [solarYear, solarMonth, calType]);

  const firstDayOfWeek = useMemo(() => {
    if (calType === "hw" && hwMonthData.length > 0) {
      return hwMonthData[0].solarDate.getDay();
    } else if (calType === "df") {
      return new Date(solarYear, solarMonth - 1, 1).getDay();
    }
    return 0;
  }, [calType, hwMonthData, solarYear, solarMonth]);

  const blanks = Array.from({ length: firstDayOfWeek });

  const displayDate = selectedDay || today;
  const displayYear = displayDate.getFullYear();
  const displayMonth = displayDate.getMonth() + 1;
  const displayDay = displayDate.getDate();
  const displayData = getCalendarDayData(displayYear, displayMonth, displayDay);

  const hwYearGanZhi = getHwanggeukYearGanZhi(hwYear);
  const hwMonthGanZhi = getHwanggeukMonthGanZhi(hwYear, hwMonth);

  const handlePrevMonth = () => {
    if (calType === "hw") {
      if (hwMonth === 1) {
        setHwYear(hwYear - 1);
        setHwMonth(12);
      } else {
        setHwMonth(hwMonth - 1);
      }
    } else {
      if (solarMonth === 1) {
        setSolarYear(solarYear - 1);
        setSolarMonth(12);
      } else {
        setSolarMonth(solarMonth - 1);
      }
    }
  };

  const handleNextMonth = () => {
    if (calType === "hw") {
      if (hwMonth === 12) {
        setHwYear(hwYear + 1);
        setHwMonth(1);
      } else {
        setHwMonth(hwMonth + 1);
      }
    } else {
      if (solarMonth === 12) {
        setSolarYear(solarYear + 1);
        setSolarMonth(1);
      } else {
        setSolarMonth(solarMonth + 1);
      }
    }
  };

  const handlePrevYear = () => {
    if (calType === "hw") {
      setHwYear(hwYear - 1);
    } else {
      setSolarYear(solarYear - 1);
    }
  };

  const handleNextYear = () => {
    if (calType === "hw") {
      setHwYear(hwYear + 1);
    } else {
      setSolarYear(solarYear + 1);
    }
  };

  const goToday = () => {
    const todayHwNew = getHwanggeukDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
    setHwYear(todayHwNew.year);
    setHwMonth(todayHwNew.month);
    setSolarYear(today.getFullYear());
    setSolarMonth(today.getMonth() + 1);
    setSelectedDay(null);
  };

  const handleDayClick = (solarDate: Date) => {
    setSelectedDay(solarDate);
    setShowDayDetail(true);
  };

  const years = Array.from({ length: 200 }, (_, i) => 1900 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="bg-white dark:bg-card border border-border" data-testid="calendar">
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
                {displayData.hwanggeuk.year}.{displayData.hwanggeuk.month}.{displayData.hwanggeuk.day} {WEEKDAYS_HANJA[displayDate.getDay()]}
              </>
            ) : (
              <>
                {format(displayDate, "yyyy.M.d")} {WEEKDAYS_HANJA[displayDate.getDay()]}
              </>
            )}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {calType === "hw" ? "황극력" : "선천력"}
            </span>
          </div>
          <div className="text-muted-foreground text-xs mt-1">
            ({displayData.hwanggeuk.yearGanZhi}年 {displayData.hwanggeuk.monthGanZhi}月 {displayData.dayGanZhi}日) {displayData.currentTerm.hanja}
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
          <Button variant="ghost" size="icon" onClick={handlePrevYear} data-testid="button-prev-year">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Select 
            value={String(calType === "hw" ? hwYear : solarYear)} 
            onValueChange={(v) => calType === "hw" ? setHwYear(Number(v)) : setSolarYear(Number(v))}
          >
            <SelectTrigger className="w-[100px]" data-testid="select-year">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}년</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="ghost" size="icon" onClick={handleNextYear} data-testid="button-next-year">
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

          <Button variant="ghost" size="icon" onClick={handlePrevMonth} data-testid="button-prev-month">
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Select 
            value={String(calType === "hw" ? hwMonth : solarMonth)} 
            onValueChange={(v) => calType === "hw" ? setHwMonth(Number(v)) : setSolarMonth(Number(v))}
          >
            <SelectTrigger className="w-[80px]" data-testid="select-month">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m} value={String(m)}>{m}월</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="ghost" size="icon" onClick={handleNextMonth} data-testid="button-next-month">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 bg-amber-100 dark:bg-amber-900/30 text-center font-bold text-sm border-t border-border">
        {WEEKDAYS.map((day, i) => (
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
        
        {calType === "hw" ? (
          hwMonthData.map((dayInfo) => {
            const { hwDay, solarDate, dayData } = dayInfo;
            const isSun = solarDate.getDay() === 0;
            const isSat = solarDate.getDay() === 6;
            const isCurrentDay = isToday(solarDate);
            const isSelected = selectedDay && isSameDay(solarDate, selectedDay);
            
            return (
              <div 
                key={`hw-${hwDay}`} 
                className={`calendar-cell group cursor-pointer ${isCurrentDay ? "today" : ""} ${isSelected ? "ring-2 ring-primary" : ""}`}
                data-testid={`calendar-day-${hwDay}`}
                onClick={() => handleDayClick(solarDate)}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-lg font-bold ${isSun ? "text-red-500" : isSat ? "text-blue-500" : "text-foreground"}`}>
                    {hwDay}
                  </span>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground bg-muted rounded px-1">
                      {solarDate.getDate()}
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
          })
        ) : (
          solarMonthData.map((dayInfo) => {
            const { solarDate, dayData, solarDay } = dayInfo;
            const isSun = solarDate.getDay() === 0;
            const isSat = solarDate.getDay() === 6;
            const isCurrentDay = isToday(solarDate);
            const isSelected = selectedDay && isSameDay(solarDate, selectedDay);
            
            return (
              <div 
                key={`solar-${solarDay}`} 
                className={`calendar-cell group cursor-pointer ${isCurrentDay ? "today" : ""} ${isSelected ? "ring-2 ring-primary" : ""}`}
                data-testid={`calendar-day-${solarDay}`}
                onClick={() => handleDayClick(solarDate)}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-lg font-bold ${isSun ? "text-red-500" : isSat ? "text-blue-500" : "text-foreground"}`}>
                    {solarDay}
                  </span>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground bg-muted rounded px-1">
                      {dayData.lunarMonth}.{dayData.lunarDay}
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
          })
        )}
      </div>

      <Dialog open={showDayDetail} onOpenChange={setShowDayDetail}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {calType === "hw" ? (
                `${displayData.hwanggeuk.year}년 ${displayData.hwanggeuk.month}월 ${displayData.hwanggeuk.day}일 (${WEEKDAYS[displayDate.getDay()]}요일)`
              ) : (
                `${displayYear}년 ${displayMonth}월 ${displayDay}일 (${WEEKDAYS[displayDate.getDay()]}요일)`
              )}
            </DialogTitle>
            <DialogDescription>
              {calType === "hw" ? "황극력" : "선천력"} 상세 정보
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-muted/50 rounded p-3">
                <div className="text-muted-foreground text-xs mb-1">간지</div>
                <div className="font-bold text-lg">
                  {displayData.hwanggeuk.yearGanZhi}年 {displayData.hwanggeuk.monthGanZhi}月 {displayData.dayGanZhi}日
                </div>
              </div>
              <div className="bg-muted/50 rounded p-3">
                <div className="text-muted-foreground text-xs mb-1">절기</div>
                <div className="font-bold text-lg">{displayData.currentTerm.hanja} ({displayData.currentTerm.korean})</div>
              </div>
              <div className="bg-muted/50 rounded p-3 col-span-2">
                <div className="text-muted-foreground text-xs mb-1">28수 (二十八宿)</div>
                <div className="flex gap-3">
                  <img 
                    src={`/img/28j_${displayData.mansionImage}.jpg`}
                    alt={displayData.mansionGeneral}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <div className="font-bold text-lg">{displayData.mansionDirection}{displayData.mansion}宿</div>
                    <div className="text-sm font-medium">{displayData.mansionGeneral}</div>
                    <div className="text-xs text-muted-foreground mt-1">{displayData.mansionDescription}</div>
                  </div>
                </div>
              </div>
              <div className="bg-muted/50 rounded p-3">
                <div className="text-muted-foreground text-xs mb-1">팔괘</div>
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
              </div>
              <div className="bg-muted/50 rounded p-3">
                <div className="text-muted-foreground text-xs mb-1">양력</div>
                <div className="font-bold text-lg">
                  {displayYear}.{displayMonth}.{displayDay}
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
