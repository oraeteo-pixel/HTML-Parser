import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, addYears, subYears, isToday, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const TWENTY_EIGHT_MANSIONS = [
  "角", "亢", "氐", "房", "心", "尾", "箕",
  "斗", "牛", "女", "虛", "危", "室", "壁",
  "奎", "婁", "胃", "昴", "畢", "觜", "參",
  "井", "鬼", "柳", "星", "張", "翼", "軫"
];
const EIGHT_TRIGRAMS = ["乾", "兌", "離", "震", "巽", "坎", "艮", "坤", "中"];
const GENERALS = ["劉植", "銚期", "邳肜", "蓋延", "万修", "景丹", "李忠", "祭遵", "耿純", "臧宮", "馬武", "劉隆"];

function getGanJi(dayIndex: number) {
  const stemIndex = dayIndex % 10;
  const branchIndex = dayIndex % 12;
  return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[branchIndex];
}

function getMansion(dayIndex: number) {
  return TWENTY_EIGHT_MANSIONS[dayIndex % 28];
}

function getTrigram(dayIndex: number) {
  return EIGHT_TRIGRAMS[dayIndex % 9];
}

function getGeneral(dayIndex: number) {
  return GENERALS[dayIndex % 12];
}

function getLunarDay(solarDay: number, month: number) {
  const offset = (month * 2 + solarDay) % 30;
  return offset === 0 ? 30 : offset;
}

const SEASONS = ["立春", "雨水", "驚蟄", "春分", "清明", "穀雨", "立夏", "小滿", "芒種", "夏至", "小暑", "大暑", "立秋", "處暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至", "小寒", "大寒"];
const ELEMENTS = ["木", "火", "土", "金", "水"];
const CAL_DESCRIPTIONS = {
  hw: "황극력(皇極曆)은 고대 동아시아 천문학을 기반으로 한 역법입니다.",
  df: "선천력(先天曆)은 복희의 선천팔괘를 기반으로 한 역법입니다."
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
  const goToday = () => setCurrentDate(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const years = Array.from({ length: 120 }, (_, i) => 1989 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const displayDate = selectedDay || new Date();
  const displayDayIndex = displayDate.getDate() + displayDate.getMonth() * 30;
  const displayGanJi = getGanJi(displayDayIndex);
  const displayMansion = getMansion(displayDayIndex);
  const displayTrigram = getTrigram(displayDayIndex);
  const displayElement = ELEMENTS[displayDayIndex % 5];
  const displaySeason = SEASONS[displayDate.getMonth() * 2 + (displayDate.getDate() > 15 ? 1 : 0)];
  const displayYearGanJi = getGanJi(displayDate.getFullYear() - 4);
  const displayMonthGanJi = getGanJi(displayDate.getMonth() + displayDate.getFullYear() * 12);

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
            {format(displayDate, "yyyy.M.d")} {["日", "月", "火", "水", "木", "金", "土"][displayDate.getDay()]}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {calType === "hw" ? "황극력" : "선천력"}
            </span>
          </div>
          <div className="text-muted-foreground text-xs mt-1">
            ({displayYearGanJi}年 {displayMonthGanJi}月 {displayGanJi}日) {displaySeason}節局
          </div>
          <div className="mt-2 flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" data-testid="button-28mansions">
              {displayTrigram}, {displayMansion}宿
            </Button>
            <Button variant="outline" size="sm" data-testid="button-element">
              {displayElement}行
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 flex-wrap">
          <Button variant="ghost" size="icon" onClick={prevYear} className="h-8 w-8">
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

          <Button variant="ghost" size="icon" onClick={nextYear} className="h-8 w-8">
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

          <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
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

          <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 bg-amber-100 text-center font-bold text-sm border-t border-border">
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
          const dayIndex = day.getDate() + day.getMonth() * 30;
          const isSun = getDay(day) === 0;
          const isSat = getDay(day) === 6;
          const lunarDay = getLunarDay(dayNum, day.getMonth());
          const ganJi = getGanJi(dayIndex);
          const mansion = getMansion(dayIndex);
          const trigram = getTrigram(dayIndex);
          const general = getGeneral(dayIndex);
          
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
                    {lunarDay}
                  </div>
                </div>
              </div>
              
              <div className="ganji-text mt-1 text-center">
                {ganJi}
              </div>
              
              <div className="mansions-text mt-auto space-y-0.5 text-right">
                <div><strong className="text-primary">{trigram}</strong></div>
                <div>{mansion}, {general}</div>
              </div>
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
                <div className="text-muted-foreground text-xs mb-1">간지 (干支)</div>
                <div className="font-bold text-lg">{displayYearGanJi}年 {displayMonthGanJi}月 {displayGanJi}日</div>
              </div>
              <div className="bg-muted/50 rounded p-3">
                <div className="text-muted-foreground text-xs mb-1">절기 (節氣)</div>
                <div className="font-bold text-lg">{displaySeason}</div>
              </div>
              <div className="bg-muted/50 rounded p-3">
                <div className="text-muted-foreground text-xs mb-1">28수 (二十八宿)</div>
                <div className="font-bold text-lg">{displayMansion}宿</div>
              </div>
              <div className="bg-muted/50 rounded p-3">
                <div className="text-muted-foreground text-xs mb-1">팔괘 (八卦)</div>
                <div className="font-bold text-lg">{displayTrigram}卦</div>
              </div>
              <div className="bg-muted/50 rounded p-3">
                <div className="text-muted-foreground text-xs mb-1">오행 (五行)</div>
                <div className="font-bold text-lg">{displayElement}</div>
              </div>
              <div className="bg-muted/50 rounded p-3">
                <div className="text-muted-foreground text-xs mb-1">음력</div>
                <div className="font-bold text-lg">{getLunarDay(displayDate.getDate(), displayDate.getMonth())}일</div>
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
