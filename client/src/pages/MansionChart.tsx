import { useMemo, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { getHwanggeuk28Mansion, getHwanggeukDate, getDayGanZhi, getKoreanTime, getJeolguk, getSogungDaegung, getMansionGanjiMap } from "@/lib/calendarData";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

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
  
  const mansionGanjiMap = useMemo(() => getMansionGanjiMap(), []);
  
  const renderMansionCell = (mansion: string, isToday: boolean) => {
    const isZunkong = ZUNKONG_MANSIONS.includes(mansion);
    const ganjiList = mansionGanjiMap[mansion] || [];
    
    return (
      <div 
        className={`
          p-1 rounded text-center min-h-[80px] flex flex-col
          ${isToday ? 'ring-2 ring-pink-500 bg-pink-100 dark:bg-pink-900/30' : 'bg-muted/50'}
        `}
        data-testid={`mansion-cell-${mansion}`}
      >
        <div className="font-bold text-lg">{mansion}</div>
        <div className="text-[9px] text-muted-foreground">{MANSION_GENERALS[mansion]?.slice(0, 2)}</div>
        {isZunkong && <div className="text-[8px] text-green-600 font-bold">尊空</div>}
        <div className="text-[8px] text-muted-foreground mt-auto flex flex-wrap justify-center gap-[2px]">
          {ganjiList.map((g, i) => (
            <span key={i} className={todayGanZhi === g ? "font-bold text-pink-600" : ""}>{g}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/">
          <Button variant="ghost" size="icon" data-testid="button-back-home">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold" data-testid="text-chart-title">
          後天 28宿 周天 星宿 配列圖
        </h1>
      </div>
      
      <Card className="p-3 mb-4">
        <div className="text-center mb-2">
          <div className="text-sm text-muted-foreground">오늘</div>
          <div className="text-xl font-bold" data-testid="text-today-ganzhi">
            {todayHwDate.yearGanZhi}年 {todayHwDate.monthGanZhi}月 {todayGanZhi}日
          </div>
          <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
            <span 
              className="inline-block px-2 py-1 rounded text-white text-sm"
              style={{ backgroundColor: todayMansion.isZunkong ? '#4a9f4a' : '#fb6c9f' }}
            >
              {todayMansion.mansion}{todayMansion.isZunkong ? "" : "宿"}
            </span>
            <span className="badge-jade px-2 py-1 rounded text-sm">
              {todayJeolguk.name}절국
            </span>
            <span className="badge-pink px-2 py-1 rounded text-sm">
              소궁,대궁 {todaySogungDaegung.sogung},{todaySogungDaegung.daegung}
            </span>
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
                <Card className="p-3 text-center w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-amber-50 dark:from-pink-950/30 dark:to-amber-950/30">
                  <div className="font-bold text-lg">曜雲殿</div>
                  <div className="text-sm text-green-600 font-bold mb-1">星宿 尊空</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    闘以內脈制之 / 闘以外將軍制之
                  </div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {CENTER_GANJI.map((g, i) => (
                      <span 
                        key={i} 
                        className={`px-2 py-1 rounded text-sm ${todayGanZhi === g ? "bg-pink-500 text-white font-bold" : "bg-muted"}`}
                      >
                        {g}
                      </span>
                    ))}
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
        <h3 className="font-bold text-sm mb-2">28宿 순환 설명</h3>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>동방(東方) 7수: 角亢氐房心尾箕</p>
          <p>남방(南方) 7수: 軫翼張星柳鬼井</p>
          <p>서방(西方) 7수: 參觜畢昴胃婁奎</p>
          <p>북방(北方) 7수: 斗牛女虛危室壁</p>
          <p>尊空 (존공)에 해당하는 수: 星, 尾, 昴, 女</p>
          <p>中央 (己酉, 庚戌, 己卯, 庚辰)은 曜雲殿에 해당합니다.</p>
        </div>
      </Card>
    </div>
  );
}
