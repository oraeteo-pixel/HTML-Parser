import { useMemo, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getHwanggeuk28Mansion, getHwanggeukDate, getDayGanZhi, getKoreanTime, getJeolguk, getSogungDaegung, getMansionGanjiMap, SIXTY_GANJI, getHwanggeukHourGanZhi, get64HexagramName } from "@/lib/calendarData";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { JeolgukCircularChart } from "@/components/JeolgukCircularChart";

const MANSION_GENERALS: { [key: string]: string } = {
  "角": "鄧禹", "亢": "馬成", "氐": "吳漢", "房": "王梁", "心": "賈復", "尾": "陳俊", "箕": "耿弇",
  "斗": "杜茂", "牛": "寇恂", "女": "傅俊", "虛": "岑膨", "危": "堅鐔", "室": "馮異", "壁": "王覇",
  "奎": "朱佑", "婁": "任光", "胃": "祭遵", "昴": "李忠", "畢": "景丹", "觜": "万修", "參": "蓋延",
  "井": "邳肜", "鬼": "銚期", "柳": "劉植", "星": "耿純", "張": "藏宮", "翼": "馬武", "軫": "劉隆"
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
  const todayHourGanZhi = getHwanggeukHourGanZhi(today.getFullYear(), today.getMonth() + 1, today.getDate(), today.getHours(), today.getMinutes());
  
  const todayGanZhiIndex = SIXTY_GANJI.indexOf(todayGanZhi);
  
  const mansionGanjiMap = useMemo(() => getMansionGanjiMap(), []);
  
  const getGanjiDayOffset = (ganji: string): number => {
    const ganjiIndex = SIXTY_GANJI.indexOf(ganji);
    if (ganjiIndex === -1 || todayGanZhiIndex === -1) return 0;
    let diff = ganjiIndex - todayGanZhiIndex;
    if (diff < 0) diff += 60;
    return diff;
  };
  
  const renderMansionCell = (mansion: string, isToday: boolean, layout: "horizontal" | "vertical" = "horizontal") => {
    const isZunkong = ZUNKONG_MANSIONS.includes(mansion);
    const ganjiList = mansionGanjiMap[mansion] || [];
    const outerGanji = ganjiList[0] || "";
    const innerGanji = ganjiList[1] || "";
    const isOuterCurrent = todayGanZhi === outerGanji;
    const isInnerCurrent = todayGanZhi === innerGanji;
    const outerOffset = getGanjiDayOffset(outerGanji);
    const innerOffset = getGanjiDayOffset(innerGanji);
    
    return (
      <div 
        className={`
          p-1 rounded-md text-center min-h-[90px] flex flex-col transition-all
          ${isToday 
            ? 'ring-2 ring-[hsl(var(--orae-navy))] bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/40 dark:to-slate-700/20' 
            : 'bg-[var(--ganji-surface)] hover-elevate'}
        `}
        data-testid={`mansion-cell-${mansion}`}
      >
        {layout === "vertical" ? (
          <>
            {outerGanji && (
              <div 
                className={`text-[7px] ${isOuterCurrent ? "font-bold orae-navy" : "text-muted-foreground"}`}
                title={isOuterCurrent ? "오늘" : `${outerOffset}일 후`}
              >
                {outerGanji}
              </div>
            )}
            <div className="font-bold text-base orae-navy flex-1 flex items-center justify-center">{mansion}</div>
            <div className="text-[8px] text-muted-foreground">{MANSION_GENERALS[mansion]}</div>
            {isZunkong && <Badge variant="outline" className="text-[6px] px-0.5 py-0 mx-auto border-slate-500 text-slate-600 dark:text-slate-400">尊空</Badge>}
            {innerGanji && (
              <div 
                className={`text-[7px] ${isInnerCurrent ? "font-bold orae-navy" : "text-muted-foreground"}`}
                title={isInnerCurrent ? "오늘" : `${innerOffset}일 후`}
              >
                {innerGanji}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-center gap-0.5 flex-1">
              {outerGanji && (
                <span 
                  className={`text-[7px] ${isOuterCurrent ? "font-bold orae-navy" : "text-muted-foreground"}`}
                  title={isOuterCurrent ? "오늘" : `${outerOffset}일 후`}
                >
                  {outerGanji}
                </span>
              )}
              <span className="font-bold text-base orae-navy">{mansion}</span>
              {innerGanji && (
                <span 
                  className={`text-[7px] ${isInnerCurrent ? "font-bold orae-navy" : "text-muted-foreground"}`}
                  title={isInnerCurrent ? "오늘" : `${innerOffset}일 후`}
                >
                  {innerGanji}
                </span>
              )}
            </div>
            <div className="text-[8px] text-muted-foreground">{MANSION_GENERALS[mansion]}</div>
            {isZunkong && <Badge variant="outline" className="text-[6px] px-0.5 py-0 mx-auto border-slate-500 text-slate-600 dark:text-slate-400">尊空</Badge>}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="w-full max-w-[990px] mx-auto px-2 py-4">
        <Card className="p-4 mb-4 bg-gradient-to-r from-slate-50/50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20">
          <h1 className="text-xl font-bold orae-navy text-center mb-3" data-testid="text-chart-title">
            後天 28宿 周天 星宿 配列圖
          </h1>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">오늘의 황극력</div>
            <div className="text-lg font-bold" data-testid="text-today-ganzhi">
              {todayHwDate.yearGanZhi}年 {todayHwDate.monthGanZhi}月 {todayGanZhi}日 {todayHourGanZhi}時
            </div>
            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
              <Badge 
                className={`${todayMansion.isZunkong ? 'badge-slate' : 'badge-navy'}`}
              >
                {todayMansion.mansion}{todayMansion.isZunkong ? "" : "宿"}
              </Badge>
              <Badge className="badge-slate">
                {todayJeolguk.name}
              </Badge>
              <Badge className="badge-navy">
                {todaySogungDaegung.isZungung 
                  ? "존궁" 
                  : `소궁 ${todaySogungDaegung.sogung} / 대궁 ${todaySogungDaegung.daegung}`}
              </Badge>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-9 gap-1" data-testid="mansion-grid">
          <div className="col-span-1"></div>
          {TOP_ROW.map((mansion, i) => (
            <div key={`top-${i}`} className="col-span-1">
              {renderMansionCell(mansion, !todayMansion.isZunkong && todayMansion.mansion === mansion, "vertical")}
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
              {renderMansionCell(mansion, !todayMansion.isZunkong && todayMansion.mansion === mansion, "vertical")}
            </div>
          ))}
          <div className="col-span-1"></div>
        </div>

        {/* 24 Jeolguk Circular Chart */}
        <JeolgukCircularChart date={today} />

        {/* 81궁 그리드 (9x9) */}
        <Card className="mt-4 p-4">
          <h2 className="text-lg font-bold orae-navy text-center mb-3">八十一宮 (81궁)</h2>
          <div className="grid grid-cols-9 gap-1">
            {(() => {
              // 9궁 순서: 곤, 감, 태, 진, 중, 손, 간, 리, 건 (2~10)
              const nineOrder = [2, 3, 4, 5, 6, 7, 8, 9, 10];
              const trigramNames: { [key: number]: string } = {
                2: "坤", 3: "坎", 4: "兌", 5: "震", 6: "中", 7: "巽", 8: "艮", 9: "離", 10: "乾"
              };
              const cells: JSX.Element[] = [];
              
              // 현재 소궁/대궁 (실시간)
              const currentSogung = todaySogungDaegung.sogung;
              const currentDaegung = todaySogungDaegung.daegung;
              
              // 9x9 = 81궁 생성 (행: 하괘/대궁, 열: 상괘/소궁)
              for (let row = 0; row < 9; row++) {
                const lower = nineOrder[row]; // 하괘 (대궁)
                for (let col = 0; col < 9; col++) {
                  const upper = nineOrder[col]; // 상괘 (소궁)
                  const hexagram = get64HexagramName(upper, lower);
                  const isCurrentCell = upper === currentSogung && lower === currentDaegung;
                  
                  // 중궁(6)이 포함된 경우 특수 표시
                  const isCenterRow = lower === 6;
                  const isCenterCol = upper === 6;
                  const isCenter = isCenterRow && isCenterCol;
                  
                  cells.push(
                    <div 
                      key={`${lower}-${upper}`}
                      className={`text-center p-1 border rounded text-xs cursor-pointer transition-all ${
                        isCurrentCell 
                          ? "border-yellow-500 bg-yellow-400/50 text-yellow-900 dark:text-yellow-100 font-bold" 
                          : isCenter
                            ? "border-amber-400 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200"
                            : (isCenterRow || isCenterCol)
                              ? "border-border/30 bg-muted/30 text-muted-foreground"
                              : "border-border/50 hover-elevate"
                      }`}
                      title={hexagram ? `${hexagram.fullName} (${hexagram.korean})` : `${trigramNames[upper]}之${trigramNames[lower]}`}
                    >
                      <div className="font-bold text-[10px]">{hexagram?.hanja || (isCenter ? "中" : `${trigramNames[upper]}${trigramNames[lower]}`)}</div>
                    </div>
                  );
                }
              }
              return cells;
            })()}
          </div>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
