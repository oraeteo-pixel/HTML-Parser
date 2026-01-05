import { useMemo, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { getHwanggeuk28Mansion, getHwanggeukDate, getDayGanZhi, getJulianDayNumber, getKoreanTime, getJeolguk, getSogungDaegung } from "@/lib/calendarData";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const TWENTY_EIGHT_MANSIONS = [
  "角", "亢", "氐", "房", "心", "尾", "箕",
  "斗", "牛", "女", "虛", "危", "室", "壁",
  "奎", "婁", "胃", "昴", "畢", "觜", "參",
  "井", "鬼", "柳", "星", "張", "翼", "軫"
];

const MANSION_GENERALS = [
  "馬成", "鄧禹", "劉隆", "馬武", "藏宮", "耿純", "劉植",
  "銚期", "邳肜", "蓋延", "万修", "景丹", "李忠", "祭遵",
  "任光", "朱佑", "王覇", "馮異", "堅鐔", "岑膨", "傅俊",
  "寇恂", "杜茂", "耿弇", "陣俊", "賈復", "王梁", "吳漢"
];

const EAST_MANSIONS = [0, 1, 2, 3, 4, 5, 6];
const NORTH_MANSIONS = [7, 8, 9, 10, 11, 12, 13];
const WEST_MANSIONS = [14, 15, 16, 17, 18, 19, 20];
const SOUTH_MANSIONS = [21, 22, 23, 24, 25, 26, 27];

const ZUNKONG_MANSIONS = ["星", "尾", "昴", "女"];

const CENTER_STEMS = ["己", "庚"];

function getDayGanZhiForOffset(baseYear: number, baseMonth: number, baseDay: number, offset: number): string {
  const baseDate = new Date(baseYear, baseMonth - 1, baseDay);
  baseDate.setDate(baseDate.getDate() + offset);
  const jd = getJulianDayNumber(baseDate.getFullYear(), baseDate.getMonth() + 1, baseDate.getDate());
  const ganzhiOffset = ((jd + 49) % 60 + 60) % 60;
  const stemIndex = ganzhiOffset % 10;
  const branchIndex = ganzhiOffset % 12;
  return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[branchIndex];
}

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
  
  const todayStem = todayGanZhi.charAt(0);
  const isCenter = CENTER_STEMS.includes(todayStem);
  
  const weekGanZhis = useMemo(() => {
    const result = [];
    for (let i = 0; i < 7; i++) {
      const ganzhi = getDayGanZhiForOffset(today.getFullYear(), today.getMonth() + 1, today.getDate(), i);
      const futureDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      const hwDate = getHwanggeukDate(futureDate.getFullYear(), futureDate.getMonth() + 1, futureDate.getDate());
      const mansion = getHwanggeuk28Mansion(hwDate.year, hwDate.month, hwDate.day);
      result.push({ ganzhi, mansion: mansion.mansion, general: mansion.general, isZunkong: mansion.isZunkong });
    }
    return result;
  }, [today]);

  const renderMansionRow = (indices: number[], direction: string, color: string) => (
    <div className="flex flex-col items-center gap-1">
      <div className="text-sm font-bold" style={{ color }}>{direction}方</div>
      <div className="flex gap-1 flex-wrap justify-center">
        {indices.map((idx) => {
          const mansionName = TWENTY_EIGHT_MANSIONS[idx];
          const isToday = !todayMansion.isZunkong && todayMansion.mansion === mansionName;
          const isZunkong = ZUNKONG_MANSIONS.includes(mansionName);
          return (
            <div 
              key={idx}
              className={`
                w-12 h-16 flex flex-col items-center justify-center rounded text-xs
                ${isToday ? 'ring-2 ring-pink-500 bg-pink-100 dark:bg-pink-900/30' : 'bg-muted/50'}
              `}
              data-testid={`mansion-cell-${idx}`}
            >
              <div className="font-bold text-base">{mansionName}</div>
              <div className="text-[10px] text-muted-foreground">{MANSION_GENERALS[idx].slice(0, 2)}</div>
              {isZunkong && <div className="text-[8px] text-pink-600 font-bold">尊空</div>}
            </div>
          );
        })}
      </div>
    </div>
  );

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
      <p className="text-center text-sm text-muted-foreground mb-4">中央 曜雲殿</p>
      
      <Card className="p-4 mb-4">
        <div className="text-center mb-4">
          <div className="text-sm text-muted-foreground">오늘</div>
          <div className="text-2xl font-bold" data-testid="text-today-ganzhi">
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

        <div className="text-center text-xs text-muted-foreground mb-2">
          己卯, 庚辰, 己酉, 庚戌일은 中央에 해당합니다
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-4 border rounded p-2">
          <div className="font-bold">초一日</div>
          {weekGanZhis.slice(0, 6).map((item, i) => (
            <div key={i} className={i === 0 ? "font-bold text-pink-600" : ""}>
              {item.ganzhi}
            </div>
          ))}
          <div className="col-span-7 text-muted-foreground">
            {weekGanZhis.slice(0, 7).map((item, i) => (
              <span key={i} className={`mx-1 ${i === 0 ? "font-bold" : ""}`}>
                {item.mansion}
              </span>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="col-span-3">
          {renderMansionRow(EAST_MANSIONS, "東", "#22c55e")}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div>
          {renderMansionRow(NORTH_MANSIONS, "北", "#3b82f6")}
        </div>
        <div className="flex flex-col items-center justify-center">
          <Card className="p-4 text-center">
            <img 
              src="/img/28j_jinjun.jpg" 
              alt="曜雲殿"
              className="w-20 h-20 object-cover rounded mx-auto mb-2"
            />
            <div className="font-bold">曜雲殿</div>
            <div className="text-xs text-muted-foreground">
              闘以內脈制之 / 闘以外將軍制之
            </div>
          </Card>
        </div>
        <div>
          {renderMansionRow(SOUTH_MANSIONS, "南", "#ef4444")}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-3">
          {renderMansionRow(WEST_MANSIONS, "西", "#f59e0b")}
        </div>
      </div>

      <Card className="p-4 mt-4">
        <h3 className="font-bold text-sm mb-2">28宿 순환 설명</h3>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>초一日부터 시작하여 매일 28宿가 순환합니다.</p>
          <p>尊空 (존공)에 해당하는 수: 星, 尾, 昴, 女</p>
          <p>天干 己, 庚에 해당하는 날은 中央 (중)으로 표시됩니다.</p>
          <p>節局은 36일 주기로, 소궁은 9일 주기로 순환합니다.</p>
        </div>
      </Card>
    </div>
  );
}
