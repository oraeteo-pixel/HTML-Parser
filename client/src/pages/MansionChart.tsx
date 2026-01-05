import { useMemo, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getHwanggeuk28Mansion, getHwanggeukDate, getDayGanZhi, getKoreanTime, getJeolguk, getSogungDaegung, getMansionGanjiMap, SIXTY_GANJI } from "@/lib/calendarData";
import { Navigation } from "@/components/Navigation";
import { TopBar } from "@/components/TopBar";

const MANSION_GENERALS: { [key: string]: string } = {
  "角": "馬成", "亢": "鄧禹", "氐": "劉隆", "房": "馬武", "心": "藏宮", "尾": "耿純", "箕": "劉植",
  "斗": "銚期", "牛": "邳肜", "女": "蓋延", "虛": "万修", "危": "景丹", "室": "李忠", "壁": "祭遵",
  "奎": "任光", "婁": "朱佑", "胃": "王覇", "昴": "馮異", "畢": "堅鐔", "觜": "岑膨", "參": "傅俊",
  "井": "寇恂", "鬼": "杜茂", "柳": "耿弇", "星": "陣俊", "張": "賈復", "翼": "王梁", "軫": "吳漢"
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
            ? 'ring-2 ring-[var(--orae-pink)] bg-gradient-to-br from-pink-100 to-pink-50 dark:from-pink-900/40 dark:to-pink-800/20' 
            : 'bg-[var(--ganji-surface)] hover-elevate'}
        `}
        data-testid={`mansion-cell-${mansion}`}
      >
        <div className="font-bold text-base orae-pink">{mansion}</div>
        <div className="text-[9px] text-muted-foreground">{MANSION_GENERALS[mansion]}</div>
        {isZunkong && <Badge variant="outline" className="text-[7px] px-1 py-0 mx-auto mt-0.5 border-green-500 text-green-600">尊空</Badge>}
        <div className="text-[7px] text-muted-foreground mt-auto flex flex-wrap justify-center gap-[1px] leading-tight">
          {ganjiList.map((g, i) => {
            const dayOffset = getGanjiDayOffset(g);
            const isCurrentGanji = todayGanZhi === g;
            return (
              <span 
                key={i} 
                className={`${isCurrentGanji ? "font-bold orae-pink" : ""}`}
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
      <TopBar />
      <Navigation />
      
      <main className="max-w-[990px] mx-auto px-2 py-4">
        <Card className="p-4 mb-4 bg-gradient-to-r from-pink-50/50 to-amber-50/50 dark:from-pink-950/20 dark:to-amber-950/20">
          <h1 className="text-xl font-bold orae-pink text-center mb-3" data-testid="text-chart-title">
            後天 28宿 周天 星宿 配列圖
          </h1>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">오늘의 황극력</div>
            <div className="text-lg font-bold" data-testid="text-today-ganzhi">
              {todayHwDate.yearGanZhi}年 {todayHwDate.monthGanZhi}月 {todayGanZhi}日
            </div>
            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
              <Badge 
                className={`${todayMansion.isZunkong ? 'badge-jade' : 'badge-pink'}`}
              >
                {todayMansion.mansion}{todayMansion.isZunkong ? "" : "宿"}
              </Badge>
              <Badge className="badge-jade">
                {todayJeolguk.name}절국
              </Badge>
              <Badge className="badge-pink">
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
                  <Card className="p-4 text-center w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-pink-50 dark:from-amber-950/30 dark:to-pink-950/30 border-[var(--orae-pink)]/20">
                    <div className="font-bold text-xl orae-pink">曜雲殿</div>
                    <Badge variant="outline" className="text-xs border-green-500 text-green-600 mt-1">星宿 尊空</Badge>
                    <div className="text-xs text-muted-foreground mt-2">
                      闘以內脈制之 / 闘以外將軍制之
                    </div>
                    <div className="flex gap-2 flex-wrap justify-center mt-3">
                      {CENTER_GANJI.map((g, i) => {
                        const isCurrentGanji = todayGanZhi === g;
                        const dayOffset = getGanjiDayOffset(g);
                        return (
                          <Badge 
                            key={i} 
                            className={isCurrentGanji ? "badge-pink" : ""}
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

        <Card className="p-4 mt-4">
          <h3 className="font-bold text-sm mb-2 orae-pink">28宿 순환 설명</h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><span className="font-medium">동방(東方) 7수:</span> 角亢氐房心尾箕</p>
            <p><span className="font-medium">남방(南方) 7수:</span> 軫翼張星柳鬼井</p>
            <p><span className="font-medium">서방(西方) 7수:</span> 參觜畢昴胃婁奎</p>
            <p><span className="font-medium">북방(北方) 7수:</span> 斗牛女虛危室壁</p>
            <p><span className="font-medium text-green-600">尊空 (존공):</span> 星, 尾, 昴, 女</p>
            <p><span className="font-medium orae-pink">中央 曜雲殿:</span> 己酉, 庚戌, 己卯, 庚辰</p>
          </div>
        </Card>
      </main>
    </div>
  );
}
