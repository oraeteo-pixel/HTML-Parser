import { useMemo, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getHwanggeuk28Mansion, getHwanggeukDate, getDayGanZhi, getKoreanTime, getJeolguk, getSogungDaegung, getMansionGanjiMap, SIXTY_GANJI } from "@/lib/calendarData";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { JeolgukCircularChart } from "@/components/JeolgukCircularChart";

const MANSION_GENERALS: { [key: string]: string } = {
  "角": "鄧禹", "亢": "劉隆", "氐": "馬武", "房": "藏宮", "心": "耿純", "尾": "劉植", "箕": "銚期",
  "斗": "邳肜", "牛": "蓋延", "女": "万修", "虛": "景丹", "危": "李忠", "室": "祭遵", "壁": "任光",
  "奎": "朱佑", "婁": "王覇", "胃": "馮異", "昴": "堅鐔", "畢": "岑膨", "觜": "傅俊", "參": "寇恂",
  "井": "杜茂", "鬼": "耿弇", "柳": "陳俊", "星": "賈復", "張": "王梁", "翼": "吳漢", "軫": "馬成"
};

const ZUNKONG_MANSIONS = ["星", "尾", "昴", "女"];

const LEFT_COLUMN = ["角", "亢", "氐", "房", "心", "尾", "箕"];
const TOP_ROW = ["軫", "翼", "張", "星", "柳", "鬼", "井"];
const RIGHT_COLUMN = ["參", "觜", "畢", "昴", "胃", "婁", "奎"];
const BOTTOM_ROW = ["斗", "牛", "女", "虛", "危", "室", "壁"];

const CENTER_GANJI = ["己酉", "庚戌", "己卯", "庚辰"];

export default function MansionChart() {
  const [currentTime, setCurrentTime] = useState(getKoreanTime());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getKoreanTime());
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  
  const today = currentTime;
  const todayGanZhi = getDayGanZhi(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const todayHwDate = getHwanggeukDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const todayMansion = getHwanggeuk28Mansion(todayHwDate.year, todayHwDate.month, todayHwDate.day);
  const todayJeolguk = getJeolguk(todayHwDate.year, todayHwDate.month, todayHwDate.day);
  const todaySogungDaegung = getSogungDaegung(currentTime);
  
  const todayGanZhiIndex = SIXTY_GANJI.indexOf(todayGanZhi);
  
  const mansionGanjiMap = useMemo(() => getMansionGanjiMap(), []);
  
  const getGanjiDayOffset = (ganji: string): number => {
    const ganjiIndex = SIXTY_GANJI.indexOf(ganji);
    if (ganjiIndex === -1 || todayGanZhiIndex === -1) return 0;
    let diff = ganjiIndex - todayGanZhiIndex;
    if (diff < 0) diff += 60;
    return diff;
  };
  
  const renderMansionCell = (mansion: string, isToday: boolean) => {
    const isZunkong = ZUNKONG_MANSIONS.includes(mansion);
    const ganjiList = mansionGanjiMap[mansion] || [];
    
    return (
      <div 
        className={`
          p-1.5 rounded-md text-center min-h-[90px] flex flex-col transition-all
          ${isToday 
            ? 'ring-2 ring-[hsl(var(--orae-navy))] bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/40 dark:to-slate-700/20' 
            : 'bg-[var(--ganji-surface)] hover-elevate'}
        `}
        data-testid={`mansion-cell-${mansion}`}
      >
        <div className="font-bold text-base orae-navy">{mansion}</div>
        <div className="text-[9px] text-muted-foreground">{MANSION_GENERALS[mansion]}</div>
        {isZunkong && <Badge variant="outline" className="text-[7px] px-1 py-0 mx-auto mt-0.5 border-slate-500 text-slate-600 dark:text-slate-400">尊空</Badge>}
        <div className="text-[7px] text-muted-foreground mt-auto flex flex-wrap justify-center gap-[1px] leading-tight">
          {ganjiList.map((g, i) => {
            const dayOffset = getGanjiDayOffset(g);
            const isCurrentGanji = todayGanZhi === g;
            return (
              <span 
                key={i} 
                className={`${isCurrentGanji ? "font-bold orae-navy" : ""}`}
                title={isCurrentGanji ? "오늘" : `${dayOffset}일 후`}
              >
                {g}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-[990px] mx-auto px-2 py-4">
        <Card className="p-4 mb-4 bg-gradient-to-r from-slate-50/50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20">
          <h1 className="text-xl font-bold orae-navy text-center mb-3" data-testid="text-chart-title">
            後天 28宿 周天 星宿 配列圖
          </h1>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">오늘의 황극력</div>
            <div className="text-lg font-bold" data-testid="text-today-ganzhi">
              {todayHwDate.yearGanZhi}年 {todayHwDate.monthGanZhi}月 {todayGanZhi}日
            </div>
            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
              <Badge 
                className={`${todayMansion.isZunkong ? 'badge-slate' : 'badge-navy'}`}
              >
                {todayMansion.mansion}{todayMansion.isZunkong ? "" : "宿"}
              </Badge>
              <Badge className="badge-slate">
                {todayJeolguk.name}절국
              </Badge>
              <Badge className="badge-navy">
                소궁 {todaySogungDaegung.sogung} / 대궁 {todaySogungDaegung.daegung}
              </Badge>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-9 gap-1" data-testid="mansion-grid">
          <div className="col-span-1"></div>
          {TOP_ROW.map((mansion, i) => (
            <div key={`top-${i}`} className="col-span-1">
              {renderMansionCell(mansion, !todayMansion.isZunkong && todayMansion.mansion === mansion)}
            </div>
          ))}
          <div className="col-span-1"></div>

          {[0, 1, 2, 3, 4, 5, 6].map((rowIndex) => (
            <div key={`row-${rowIndex}`} className="contents">
              <div className="col-span-1">
                {renderMansionCell(LEFT_COLUMN[rowIndex], !todayMansion.isZunkong && todayMansion.mansion === LEFT_COLUMN[rowIndex])}
              </div>
              
              {rowIndex === 3 ? (
                <div className="col-span-7 row-span-1 flex items-center justify-center">
                  <Card className="p-2 text-center w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/30 dark:to-slate-800/30 border-[hsl(var(--orae-navy))]/20">
                    <div className="font-bold text-base orae-navy">曜雲殿</div>
                    <Badge variant="outline" className="text-[8px] px-1 py-0 border-slate-500 text-slate-600 dark:text-slate-400">星宿 尊空</Badge>
                    <div className="flex gap-1 flex-wrap justify-center mt-1">
                      {CENTER_GANJI.map((g, i) => {
                        const isCurrentGanji = todayGanZhi === g;
                        const dayOffset = getGanjiDayOffset(g);
                        return (
                          <Badge 
                            key={i} 
                            className={`text-[9px] px-1 py-0 ${isCurrentGanji ? "badge-navy" : ""}`}
                            variant={isCurrentGanji ? "default" : "secondary"}
                            title={isCurrentGanji ? "오늘" : `${dayOffset}일 후`}
                          >
                            {g}
                          </Badge>
                        );
                      })}
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="col-span-7"></div>
              )}
              
              <div className="col-span-1">
                {renderMansionCell(RIGHT_COLUMN[rowIndex], !todayMansion.isZunkong && todayMansion.mansion === RIGHT_COLUMN[rowIndex])}
              </div>
            </div>
          ))}

          <div className="col-span-1"></div>
          {BOTTOM_ROW.map((mansion, i) => (
            <div key={`bottom-${i}`} className="col-span-1">
              {renderMansionCell(mansion, !todayMansion.isZunkong && todayMansion.mansion === mansion)}
            </div>
          ))}
          <div className="col-span-1"></div>
        </div>

        {/* 24 Jeolguk Circular Chart */}
        <JeolgukCircularChart date={today} />
      </main>
      
      <Footer />
    </div>
  );
}
