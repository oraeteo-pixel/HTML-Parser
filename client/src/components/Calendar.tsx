import { useState, useMemo, useEffect } from "react";
import { format, getDay, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  getCalendarDayData, 
  getHwanggeukDate,
  getHwanggeukMonthData,
  getHwanggeukMonthDays,
  getHwanggeukYearGanZhi,
  getHwanggeukMonthGanZhi,
  getHwanggeukHourGanZhi,
  getHwanggeukDayGanZhi,
  getHwanggeuk28Mansion,
  getHwanggeukPosition,
  getDayGanZhi,
  getSeoncheonHourGanZhi,
  get28Mansion,
  get8Trigram,
  getJeolguk,
  getSogungDaegung,
  formatPositionDaegungHanja,
  get81PalaceName,
  getPositionDaegungForDate,
  get64HexagramName,
  getWeekdayHanja,
  hwanggeukToSolar,
  getKoreanTime,
  CalendarDayData,
  WEEKDAYS_HANJA as WEEKDAYS_HANJA_DATA,
  MANSION_GENERAL_IMAGES
} from "@/lib/calendarData";

const CAL_DESCRIPTIONS = {
  hw: "황극력(皇極曆)은 고대 동아시아 천문학을 기반으로 한 역법입니다. 동지를 한 해의 시작으로 하며, 23시를 자시(子時)의 시작으로 봅니다.",
  df: "선천력(先天曆)은 양력을 기준으로 하며, 복희의 선천팔괘를 기반으로 한 역법입니다."
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const WEEKDAYS_HANJA = ["日", "月", "火", "水", "木", "金", "土"];

function isTodayKorean(date: Date): boolean {
  const koreanNow = getKoreanTime();
  return date.getFullYear() === koreanNow.getFullYear() &&
         date.getMonth() === koreanNow.getMonth() &&
         date.getDate() === koreanNow.getDate();
}

export function Calendar() {
  const [currentTime, setCurrentTime] = useState(getKoreanTime());
  
  // 현재 시간 기준으로 황극력 날짜 계산 (23시 이후면 다음 날)
  const todayHw = useMemo(() => {
    return getHwanggeukDate(
      currentTime.getFullYear(), 
      currentTime.getMonth() + 1, 
      currentTime.getDate(), 
      currentTime.getHours()
    );
  }, [currentTime]);
  
  const [, navigate] = useLocation();
  
  const [calType, setCalType] = useState<"hw" | "df">("hw");
  const [hwYear, setHwYear] = useState(() => {
    const now = getKoreanTime();
    const hw = getHwanggeukDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours());
    return hw.year;
  });
  const [hwMonth, setHwMonth] = useState(() => {
    const now = getKoreanTime();
    const hw = getHwanggeukDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours());
    return hw.month;
  });
  const [solarYear, setSolarYear] = useState(() => getKoreanTime().getFullYear());
  const [solarMonth, setSolarMonth] = useState(() => getKoreanTime().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showDayDetail, setShowDayDetail] = useState(false);
  const [showTalisman, setShowTalisman] = useState(false);

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

  const displayDate = useMemo(() => {
    if (selectedDay) {
      return selectedDay;
    }
    if (calType === "hw" && hwMonthData.length > 0) {
      const todayHwInfo = getHwanggeukDate(currentTime.getFullYear(), currentTime.getMonth() + 1, currentTime.getDate(), currentTime.getHours());
      if (todayHwInfo.year === hwYear && todayHwInfo.month === hwMonth) {
        return currentTime;
      }
      return hwMonthData[0].solarDate;
    }
    return currentTime;
  }, [selectedDay, calType, hwYear, hwMonth, hwMonthData, currentTime]);
  
  const displayYear = displayDate.getFullYear();
  const displayMonth = displayDate.getMonth() + 1;
  const displayDay = displayDate.getDate();
  const displayData = getCalendarDayData(displayYear, displayMonth, displayDay);

  const hwYearGanZhi = getHwanggeukYearGanZhi(hwYear);
  const hwMonthGanZhi = getHwanggeukMonthGanZhi(hwYear, hwMonth);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getKoreanTime());
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    if (showDayDetail) {
      const element = document.getElementById('day-detail-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [showDayDetail]);
  
  const hwHourGanZhi = getHwanggeukHourGanZhi(
    displayYear, displayMonth, displayDay,
    currentTime.getHours(), currentTime.getMinutes()
  );
  
  const hwMansion = useMemo(() => {
    const hwDate = getHwanggeukDate(displayYear, displayMonth, displayDay);
    return getHwanggeuk28Mansion(hwDate.year, hwDate.month, hwDate.day);
  }, [displayYear, displayMonth, displayDay]);
  
  const trigram = get8Trigram(
    displayYear, 
    displayMonth, 
    displayDay
  );
  
  const liveHwanggeuk = useMemo(() => {
    return getHwanggeukDate(
      currentTime.getFullYear(),
      currentTime.getMonth() + 1,
      currentTime.getDate(),
      currentTime.getHours()
    );
  }, [currentTime]);
  
  const liveDayGanZhi = useMemo(() => {
    return getHwanggeukDayGanZhi(
      liveHwanggeuk.year,
      liveHwanggeuk.month,
      liveHwanggeuk.day
    );
  }, [liveHwanggeuk]);
  
  const liveHourGanZhi = useMemo(() => {
    return getHwanggeukHourGanZhi(
      currentTime.getFullYear(),
      currentTime.getMonth() + 1,
      currentTime.getDate(),
      currentTime.getHours(),
      currentTime.getMinutes()
    );
  }, [currentTime]);
  
  const liveSeoncheonHourGanZhi = useMemo(() => {
    return getSeoncheonHourGanZhi(
      currentTime.getFullYear(),
      currentTime.getMonth() + 1,
      currentTime.getDate(),
      currentTime.getHours(),
      currentTime.getMinutes()
    );
  }, [currentTime]);
  
  const liveJeolguk = useMemo(() => {
    return getJeolguk(
      liveHwanggeuk.year,
      liveHwanggeuk.month,
      liveHwanggeuk.day
    );
  }, [liveHwanggeuk]);
  
  const liveSogungDaegung = useMemo(() => {
    return getSogungDaegung(currentTime);
  }, [currentTime]);
  
  const liveSeoncheonData = useMemo(() => {
    return getCalendarDayData(
      currentTime.getFullYear(),
      currentTime.getMonth() + 1,
      currentTime.getDate()
    );
  }, [currentTime]);

  // Computed values for selected day (or live if no selection)
  const infoDate = selectedDay || currentTime;
  const infoYear = infoDate.getFullYear();
  const infoMonth = infoDate.getMonth() + 1;
  const infoDay = infoDate.getDate();

  const infoHwanggeuk = useMemo(() => {
    // 23시 이후면 다음 황극력 날짜로 전환
    return getHwanggeukDate(infoYear, infoMonth, infoDay, currentTime.getHours());
  }, [infoYear, infoMonth, infoDay, currentTime]);

  const infoDayGanZhi = useMemo(() => {
    // 황극력 기준 일진 사용
    return getHwanggeukDayGanZhi(infoHwanggeuk.year, infoHwanggeuk.month, infoHwanggeuk.day);
  }, [infoHwanggeuk]);

  const infoHourGanZhi = useMemo(() => {
    return getHwanggeukHourGanZhi(infoYear, infoMonth, infoDay, currentTime.getHours(), currentTime.getMinutes());
  }, [infoYear, infoMonth, infoDay, currentTime]);

  const infoSeoncheonHourGanZhi = useMemo(() => {
    return getSeoncheonHourGanZhi(infoYear, infoMonth, infoDay, currentTime.getHours(), currentTime.getMinutes());
  }, [infoYear, infoMonth, infoDay, currentTime]);

  const infoJeolguk = useMemo(() => {
    return getJeolguk(infoHwanggeuk.year, infoHwanggeuk.month, infoHwanggeuk.day);
  }, [infoHwanggeuk]);

  const infoSogungDaegung = useMemo(() => {
    return getSogungDaegung(infoDate);
  }, [infoDate]);

  const infoSeoncheonData = useMemo(() => {
    return getCalendarDayData(infoYear, infoMonth, infoDay);
  }, [infoYear, infoMonth, infoDay]);

  const infoMansion = useMemo(() => {
    return getHwanggeuk28Mansion(infoHwanggeuk.year, infoHwanggeuk.month, infoHwanggeuk.day);
  }, [infoHwanggeuk]);
  
  const jeolguk = getJeolguk(
    displayData.hwanggeuk.year,
    displayData.hwanggeuk.month,
    displayData.hwanggeuk.day
  );

  const handlePrevMonth = () => {
    setSelectedDay(null);
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
    setSelectedDay(null);
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
    setSelectedDay(null);
    if (calType === "hw") {
      if (hwYear > 1989) {
        setHwYear(hwYear - 1);
      }
    } else {
      setSolarYear(solarYear - 1);
    }
  };

  const handleNextYear = () => {
    setSelectedDay(null);
    if (calType === "hw") {
      setHwYear(hwYear + 1);
    } else {
      setSolarYear(solarYear + 1);
    }
  };

  const goToday = () => {
    const now = getKoreanTime();
    const todayHwNew = getHwanggeukDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours());
    setHwYear(todayHwNew.year);
    setHwMonth(todayHwNew.month);
    setSolarYear(now.getFullYear());
    setSolarMonth(now.getMonth() + 1);
    setSelectedDay(now);
    setShowDayDetail(true);
    setTimeout(() => {
      const todayCell = document.querySelector('.calendar-cell.today');
      if (todayCell) {
        todayCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleDayClick = (solarDate: Date) => {
    setSelectedDay(solarDate);
    setShowDayDetail(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const years = useMemo(() => {
    if (calType === "hw") {
      return Array.from({ length: 112 }, (_, i) => 1989 + i);
    }
    return Array.from({ length: 221 }, (_, i) => 1830 + i);
  }, [calType]);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div data-testid="calendar">
      <div className="space-y-2 mb-2">
        <div className="flex gap-2 ml-1 sm:ml-0">
          <Button 
            size="sm"
            onClick={() => setCalType("hw")}
            data-testid="button-hwanggeuk"
            className={calType === "hw" 
              ? "text-white border-0" 
              : "bg-white dark:bg-card text-foreground border border-border"
            }
            style={calType === "hw" ? { backgroundColor: 'hsl(210 20% 40%)' } : {}}
          >
            황극력
          </Button>
          <Button 
            size="sm"
            onClick={() => setCalType("df")}
            data-testid="button-seoncheon"
            className={calType === "df" 
              ? "text-white border-0" 
              : "bg-white dark:bg-card text-foreground border border-border"
            }
            style={calType === "df" ? { backgroundColor: 'hsl(210 20% 40%)' } : {}}
          >
            선천력
          </Button>
        </div>

        <div 
          id="calDate" 
          className="slim-info-bar cursor-pointer"
          data-testid="calendar-info"
          onClick={() => setShowDayDetail(true)}
        >
          {calType === "hw" ? (
            <>
              {/* Mobile: 2 lines */}
              <div className="sm:hidden flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-base whitespace-nowrap">
                  <span className="font-bold text-gray-700 dark:text-gray-200">
                    {infoHwanggeuk.year}.{infoHwanggeuk.month}.{infoHwanggeuk.day}
                  </span>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">
                    {WEEKDAYS_HANJA[infoDate.getDay()]}
                  </span>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">
                    {infoHwanggeuk.yearGanZhi} {infoHwanggeuk.monthGanZhi} {infoDayGanZhi} {infoHourGanZhi}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-base whitespace-nowrap">
                  <span className="font-bold text-gray-700 dark:text-gray-200">{infoJeolguk.name}</span>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">&lt;소궁,대궁&gt;{infoSogungDaegung.isZungung ? "존궁" : `${infoSogungDaegung.sogung},${infoSogungDaegung.daegung}`}{(() => { const hex = get64HexagramName(infoSogungDaegung.sogung, infoSogungDaegung.daegung); return hex ? ` ${hex.fullName}` : ""; })()}</span>
                  <button 
                    className="slim-badge-cyan cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); setShowTalisman(!showTalisman); }}
                    data-testid="button-mansion-toggle"
                  >
                    {infoMansion.isZunkong ? infoMansion.mansion : `${infoMansion.mansion}, ${infoMansion.general}`}
                  </button>
                </div>
              </div>
              {/* PC: 1 line */}
              <div className="hidden sm:flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-base">
                  <span className="font-bold text-gray-700 dark:text-gray-200">
                    {infoHwanggeuk.year}.{infoHwanggeuk.month}.{infoHwanggeuk.day}
                  </span>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">
                    {WEEKDAYS_HANJA[infoDate.getDay()]}
                  </span>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">
                    ({infoHwanggeuk.yearGanZhi}年 {infoHwanggeuk.monthGanZhi}月 {infoDayGanZhi}日 {infoHourGanZhi}時)
                  </span>
                  <span className="font-bold text-gray-700 dark:text-gray-200">{infoJeolguk.name}</span>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">&lt;소궁,대궁&gt;{infoSogungDaegung.isZungung ? "존궁" : `${infoSogungDaegung.sogung},${infoSogungDaegung.daegung}`}{(() => { const hex = get64HexagramName(infoSogungDaegung.sogung, infoSogungDaegung.daegung); return hex ? ` ${hex.fullName}` : ""; })()}</span>
                  <button 
                    className="slim-badge-cyan cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); setShowTalisman(!showTalisman); }}
                    data-testid="button-mansion-toggle-pc"
                  >
                    {infoMansion.isZunkong ? infoMansion.mansion : `${infoMansion.mansion}, ${infoMansion.general}`}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Mobile: 2 lines */}
              <div className="sm:hidden flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-base whitespace-nowrap">
                  <span className="font-bold text-gray-700 dark:text-gray-200">
                    {infoYear}.{infoMonth}.{infoDay}
                  </span>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">
                    {WEEKDAYS_HANJA[infoDate.getDay()]}
                  </span>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">
                    (음{infoSeoncheonData.lunarMonth}.{infoSeoncheonData.lunarDay})
                  </span>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">
                    {infoSeoncheonData.yearGanZhi} {infoSeoncheonData.monthGanZhi} {infoSeoncheonData.dayGanZhi} {infoSeoncheonHourGanZhi}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-base whitespace-nowrap">
                  <span className="font-bold text-gray-700 dark:text-gray-200">{infoSeoncheonData.currentTerm.hanja}</span>
                  <span className="slim-badge-navy">{infoSeoncheonData.currentTerm.general}</span>
                </div>
              </div>
              {/* PC: 1 line */}
              <div className="hidden sm:flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-base">
                  <span className="font-bold text-gray-700 dark:text-gray-200">
                    {infoYear}.{infoMonth}.{infoDay}
                  </span>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">
                    {WEEKDAYS_HANJA[infoDate.getDay()]}
                  </span>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">
                    (음력 {infoSeoncheonData.lunarMonth}.{infoSeoncheonData.lunarDay})
                  </span>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">
                    ({infoSeoncheonData.yearGanZhi}年 {infoSeoncheonData.monthGanZhi}月 {infoSeoncheonData.dayGanZhi}日 {infoSeoncheonHourGanZhi}時)
                  </span>
                  <span className="font-bold text-gray-700 dark:text-gray-200">{infoSeoncheonData.currentTerm.hanja}</span>
                  <span className="slim-badge-navy">{infoSeoncheonData.currentTerm.general}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Talisman slide-down - only for hwanggeuk */}
        {calType === "hw" && !infoMansion.isZunkong && (
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out bg-card border border-border rounded-lg ${showTalisman ? 'max-h-[400px] opacity-100 p-4 my-2' : 'max-h-0 opacity-0 p-0 my-0'}`}
          >
            <div className="flex flex-col items-center">
              <img 
                src={`/img/28j_${infoMansion.image}.jpg`}
                alt={`${infoMansion.mansion} 부적`}
                className="max-w-[200px] max-h-[280px] object-contain border border-border rounded-lg shadow-lg bg-white"
              />
              <div className="mt-3 text-center">
                <div className="font-bold text-lg">{infoMansion.mansion}{infoMansion.general}</div>
                <div className="text-muted-foreground">{infoMansion.description}</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap py-0.5 sm:py-2">
          <Button variant="ghost" size="icon" className="h-5 w-5 sm:h-8 sm:w-8" onClick={handlePrevYear} data-testid="button-prev-year">
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          
          <Select 
            value={String(calType === "hw" ? hwYear : solarYear)} 
            onValueChange={(v) => { setSelectedDay(null); calType === "hw" ? setHwYear(Number(v)) : setSolarYear(Number(v)); }}
          >
            <SelectTrigger className="w-[68px] sm:w-[100px] h-5 sm:h-8 text-xs sm:text-sm px-1.5" data-testid="select-year">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}년</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="ghost" size="icon" className="h-5 w-5 sm:h-8 sm:w-8" onClick={handleNextYear} data-testid="button-next-year">
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>

          <Button 
            size="sm" 
            onClick={goToday}
            className="mx-2 sm:mx-3 text-white border-0 h-5 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
            style={{ backgroundColor: 'hsl(210 20% 40%)' }}
            data-testid="button-today"
          >
            오늘
          </Button>

          <Button variant="ghost" size="icon" className="h-5 w-5 sm:h-8 sm:w-8" onClick={handlePrevMonth} data-testid="button-prev-month">
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>

          <Select 
            value={String(calType === "hw" ? hwMonth : solarMonth)} 
            onValueChange={(v) => { setSelectedDay(null); calType === "hw" ? setHwMonth(Number(v)) : setSolarMonth(Number(v)); }}
          >
            <SelectTrigger className="w-[56px] sm:w-[80px] h-5 sm:h-8 text-xs sm:text-sm px-1.5" data-testid="select-month">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m} value={String(m)}>{m}월</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="ghost" size="icon" className="h-5 w-5 sm:h-8 sm:w-8" onClick={handleNextMonth} data-testid="button-next-month">
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-card border-t border-l border-border">
        <div className="grid grid-cols-7 bg-gray-100 dark:bg-gray-800 text-center font-bold text-sm">
        {WEEKDAYS.map((day, i) => (
          <div 
            key={day} 
            className={`py-2 border-b border-r border-border ${i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : ""}`}
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
            // 황극력 기준 오늘 하이라이트 (23시 이후면 다음 날)
            const isCurrentDay = hwDay === todayHw.day && hwYear === todayHw.year && hwMonth === todayHw.month;
            const isSelected = selectedDay && isSameDay(solarDate, selectedDay);
            const hwDate = getHwanggeukDate(solarDate.getFullYear(), solarDate.getMonth() + 1, solarDate.getDate());
            const cellMansion = getHwanggeuk28Mansion(hwDate.year, hwDate.month, hwDate.day);
            const cellTrigram = get8Trigram(solarDate.getFullYear(), solarDate.getMonth() + 1, solarDate.getDate());
            const cell81 = getPositionDaegungForDate(solarDate.getFullYear(), solarDate.getMonth() + 1, solarDate.getDate());
            
            return (
              <div 
                key={`hw-${hwDay}`} 
                className={`calendar-cell group cursor-pointer ${isCurrentDay ? "today" : ""} ${isSelected ? "bg-slate-300 dark:bg-slate-600" : ""}`}
                data-testid={`calendar-day-${hwDay}`}
                onClick={() => handleDayClick(solarDate)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`day-number ${isSun ? "sunday" : isSat ? "saturday" : ""}`}>
                    {hwDay}
                  </span>
                  <span className="solar-day">
                    {solarDate.getDate()}
                  </span>
                </div>
                
                <div className="ganji-box mb-1">
                  {dayData.dayGanZhi}
                </div>
                
                <div className="flex-1 flex flex-col justify-end space-y-0.5">
                  <div className="trigram-text">{cellTrigram.trigram}</div>
                  <div className="mansion-info">{cellMansion.mansion},{cellMansion.general}</div>
                  {cell81.isTransitionDay ? (
                    <>
                      <div className="palace-81-name text-xs font-bold text-amber-600 dark:text-amber-400">
                        <span className="text-muted-foreground text-[9px]">오전</span>{cell81.isJongungAM ? "尊宮" : cell81.nameAM} <span className="text-muted-foreground text-[9px]">오후</span>{cell81.isJongungPM ? "尊宮" : cell81.namePM}
                      </div>
                      <div className="palace-81-notation text-[10px] text-muted-foreground">
                        {cell81.notationAM}/{cell81.notationPM}
                      </div>
                    </>
                  ) : cell81.isJongungAM && cell81.isJongungPM ? (
                    <>
                      <div className="palace-81-name text-xs font-bold text-amber-600 dark:text-amber-400">尊宮</div>
                      <div className="palace-81-notation text-[10px] text-muted-foreground">{cell81.notationAM}</div>
                    </>
                  ) : cell81.isJongungAM !== cell81.isJongungPM ? (
                    <>
                      <div className="palace-81-name text-xs font-bold text-amber-600 dark:text-amber-400">
                        <span className="text-muted-foreground text-[9px]">오전</span>{cell81.isJongungAM ? "尊宮" : cell81.nameAM} <span className="text-muted-foreground text-[9px]">오후</span>{cell81.isJongungPM ? "尊宮" : cell81.namePM}
                      </div>
                      <div className="palace-81-notation text-[10px] text-muted-foreground">{cell81.notationAM}</div>
                    </>
                  ) : (
                    <>
                      <div className="palace-81-name text-xs font-bold text-amber-600 dark:text-amber-400">{cell81.nameAM}</div>
                      <div className="palace-81-notation text-[10px] text-muted-foreground">{cell81.notationAM}</div>
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          solarMonthData.map((dayInfo) => {
            const { solarDate, dayData, solarDay } = dayInfo;
            const isSun = solarDate.getDay() === 0;
            const isSat = solarDate.getDay() === 6;
            const isCurrentDay = isTodayKorean(solarDate);
            const isSelected = selectedDay && isSameDay(solarDate, selectedDay);
            const isHwanggeukEpoch = solarDate.getFullYear() === 1989 && solarDate.getMonth() === 3 && solarDate.getDate() === 21;
            
            return (
              <div 
                key={`solar-${solarDay}`} 
                className={`calendar-cell group cursor-pointer ${isCurrentDay ? "today" : ""} ${isSelected ? "bg-slate-300 dark:bg-slate-600" : ""}`}
                data-testid={`calendar-day-${solarDay}`}
                onClick={() => handleDayClick(solarDate)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`day-number ${isSun ? "sunday" : isSat ? "saturday" : ""}`}>
                    {solarDay}
                  </span>
                  <span className="solar-day text-purple-500">
                    {dayData.lunarDay}{dayData.isLeapMonth ? "윤" : ""}
                  </span>
                </div>
                
                <div className="ganji-box mb-1">
                  {dayData.dayGanZhi}
                </div>
                
                {isHwanggeukEpoch ? (
                  <div className="flex-1 flex items-end">
                    <span className="text-xs px-1 py-0.5 rounded bg-amber-500 text-white font-bold">
                      황극력 원년
                    </span>
                  </div>
                ) : dayData.solarTerm && (
                  <div className="flex-1 flex items-end">
                    <span className="text-xs px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                      {dayData.solarTerm.korean}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
        </div>
      </div>

      {calType === "hw" && (
        <div className="mt-3 py-2 px-3 text-center text-sm text-muted-foreground border-t border-border">
          <span>
            {liveHwanggeuk.year}年 {liveHwanggeuk.month}月 {liveHwanggeuk.day}日 ({currentTime.getHours()}:{String(currentTime.getMinutes()).padStart(2, '0')}) - {liveHwanggeuk.yearGanZhi}年 {liveHwanggeuk.monthGanZhi}月 {liveDayGanZhi}日 {liveHourGanZhi}時
          </span>
        </div>
      )}

      {showDayDetail && (
        <div 
          id="day-detail-section" 
          className="mt-4 p-4 rounded-md border border-border bg-card animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg ganji-title">
              {calType === "hw" ? (
                `${infoHwanggeuk.yearGanZhi}年 ${infoHwanggeuk.monthGanZhi}月 ${infoDayGanZhi}日 ${infoHourGanZhi}時`
              ) : (
                `${displayYear}년 ${displayMonth}월 ${displayDay}일 (${WEEKDAYS[displayDate.getDay()]}요일)`
              )}
            </h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowDayDetail(false)}
              data-testid="button-close-detail"
            >
              <span className="text-lg">×</span>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {calType === "hw" ? "황극력" : "선천력"} 상세 정보
          </p>
          <div className="space-y-4">
            {calType === "hw" ? (
              <div className="grid grid-cols-2 gap-3 text-fluid-sm">
                <div className="info-card">
                  <div className="text-muted-foreground text-xs mb-1 uppercase tracking-wide">절기</div>
                  <div className="font-bold text-fluid-lg">{displayData.currentTerm.hanja}</div>
                  <div className="text-muted-foreground text-xs">{displayData.currentTerm.korean}</div>
                </div>
                <div className="info-card">
                  <div className="text-muted-foreground text-xs mb-1 uppercase tracking-wide">팔괘</div>
                  <div className="font-bold text-fluid-lg">{trigram.trigram}</div>
                </div>
                <div className="info-card">
                  <div className="text-muted-foreground text-xs mb-1 uppercase tracking-wide">節局</div>
                  <div className="font-bold text-fluid-lg">{jeolguk.name}</div>
                </div>
                <div className="info-card">
                  <div className="text-muted-foreground text-xs mb-1 uppercase tracking-wide">81궁 (X之Y)</div>
                  <div className="font-bold text-fluid-lg">
                    {liveSogungDaegung.isZungung ? "존궁" : formatPositionDaegungHanja(liveSogungDaegung.position, liveSogungDaegung.daegung)}
                  </div>
                  {!liveSogungDaegung.isZungung && (
                    <div className="text-muted-foreground text-sm">{get81PalaceName(liveSogungDaegung.position, liveSogungDaegung.daegung)}</div>
                  )}
                </div>
                <div className="info-card col-span-2">
                  <div className="text-muted-foreground text-xs mb-1 uppercase tracking-wide">28宿</div>
                  <div className="font-bold text-fluid-lg">
                    {hwMansion.isZunkong ? "존궁" : `${hwMansion.mansion}${hwMansion.general}`}
                  </div>
                  {!hwMansion.isZunkong && (
                    <div className="text-muted-foreground text-sm">{hwMansion.description}</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-fluid-sm">
                <div className="info-card col-span-2">
                  <div className="text-muted-foreground text-xs mb-1 uppercase tracking-wide">선천력 간지 (60갑자)</div>
                  <div className="font-bold text-fluid-lg">
                    {displayData.yearGanZhi}年 {displayData.monthGanZhi}月 {displayData.dayGanZhi}日
                  </div>
                </div>
                <div className="info-card">
                  <div className="text-muted-foreground text-xs mb-1 uppercase tracking-wide">양력 (陽曆)</div>
                  <div className="font-bold text-fluid-base">
                    {displayYear}年 {displayMonth}月 {displayDay}日
                  </div>
                </div>
                <div className="info-card">
                  <div className="text-muted-foreground text-xs mb-1 uppercase tracking-wide">음력 (陰曆)</div>
                  <div className="font-bold text-fluid-base">
                    {displayData.lunarYear}年 {displayData.lunarMonth}月 {displayData.lunarDay}日
                    {displayData.isLeapMonth && <span className="text-xs ml-1">(閏)</span>}
                  </div>
                </div>
                <div className="info-card col-span-2">
                  <div className="text-muted-foreground text-xs mb-1 uppercase tracking-wide">절기 (節氣)</div>
                  <div className="font-bold text-fluid-lg">{displayData.currentTerm.hanja} ({displayData.currentTerm.korean})</div>
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {CAL_DESCRIPTIONS[calType]}
            </p>
          </div>
        </div>
      )}
      
    </div>
  );
}
