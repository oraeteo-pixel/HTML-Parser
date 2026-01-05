import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getHwanggeukDate, getJeolguk, getDayGanZhi, SIXTY_GANJI } from "@/lib/calendarData";

// 24절국 data with hanja names, associated mansions, and directions
const JEOLGUK_DATA = [
  { name: "동지", hanja: "冬至", mansion: "斗", month: 11, direction: "북", stem: "壬" },
  { name: "소한", hanja: "小寒", mansion: "牛", month: 12, direction: "북", stem: "癸" },
  { name: "대한", hanja: "大寒", mansion: "女", month: 12, direction: "북", stem: "癸" },
  { name: "입춘", hanja: "立春", mansion: "虛", month: 1, direction: "동북", stem: "甲" },
  { name: "우수", hanja: "雨水", mansion: "危", month: 1, direction: "동북", stem: "甲" },
  { name: "경칩", hanja: "驚蟄", mansion: "室", month: 2, direction: "동", stem: "乙" },
  { name: "춘분", hanja: "春分", mansion: "壁", month: 2, direction: "동", stem: "乙" },
  { name: "청명", hanja: "淸明", mansion: "奎", month: 3, direction: "동", stem: "乙" },
  { name: "곡우", hanja: "穀雨", mansion: "婁", month: 3, direction: "동남", stem: "丙" },
  { name: "입하", hanja: "立夏", mansion: "胃", month: 4, direction: "동남", stem: "丙" },
  { name: "소만", hanja: "小滿", mansion: "昴", month: 4, direction: "남", stem: "丁" },
  { name: "망종", hanja: "芒種", mansion: "畢", month: 5, direction: "남", stem: "丁" },
  { name: "하지", hanja: "夏至", mansion: "觜", month: 5, direction: "남", stem: "丁" },
  { name: "소서", hanja: "小暑", mansion: "參", month: 6, direction: "남", stem: "丁" },
  { name: "대서", hanja: "大暑", mansion: "井", month: 6, direction: "서남", stem: "戊" },
  { name: "입추", hanja: "立秋", mansion: "鬼", month: 7, direction: "서남", stem: "己" },
  { name: "처서", hanja: "處暑", mansion: "柳", month: 7, direction: "서", stem: "庚" },
  { name: "백로", hanja: "白露", mansion: "星", month: 8, direction: "서", stem: "庚" },
  { name: "추분", hanja: "秋分", mansion: "張", month: 8, direction: "서", stem: "辛" },
  { name: "한로", hanja: "寒露", mansion: "翼", month: 9, direction: "서", stem: "辛" },
  { name: "상강", hanja: "霜降", mansion: "軫", month: 9, direction: "서북", stem: "辛" },
  { name: "입동", hanja: "立冬", mansion: "角", month: 10, direction: "서북", stem: "壬" },
  { name: "소설", hanja: "小雪", mansion: "亢", month: 10, direction: "북", stem: "壬" },
  { name: "대설", hanja: "大雪", mansion: "氐", month: 11, direction: "북", stem: "壬" },
];

// 절국 names
const JEOLGUK_NAMES = [
  { korean: "원화", hanja: "元和" },
  { korean: "중화", hanja: "中化" },
  { korean: "대화", hanja: "大和" },
  { korean: "포화", hanja: "布化" },
  { korean: "뇌화", hanja: "雷和" },
  { korean: "풍화", hanja: "風化" },
  { korean: "입화", hanja: "立和" },
  { korean: "행화", hanja: "行和" },
  { korean: "건화", hanja: "建和" },
  { korean: "보화", hanja: "普化" },
  { korean: "청화", hanja: "淸和" },
  { korean: "평화", hanja: "平和" },
  { korean: "성화", hanja: "成和" },
  { korean: "입화", hanja: "入化" },
  { korean: "함화", hanja: "咸和" },
  { korean: "형화", hanja: "亨化" },
  { korean: "정화", hanja: "正和" },
  { korean: "명화", hanja: "明和" },
  { korean: "지화", hanja: "至和" },
  { korean: "정화", hanja: "貞和" },
  { korean: "태화", hanja: "太和" },
  { korean: "체화", hanja: "體和" },
  { korean: "인화", hanja: "仁和" },
  { korean: "성화", hanja: "性和" },
];

// 8 Trigrams with their positions
const TRIGRAMS = [
  { name: "乾", korean: "건", number: 1, direction: "서북", symbol: "☰" },
  { name: "兌", korean: "태", number: 2, direction: "서", symbol: "☱" },
  { name: "離", korean: "리", number: 3, direction: "남", symbol: "☲" },
  { name: "震", korean: "진", number: 4, direction: "동", symbol: "☳" },
  { name: "巽", korean: "손", number: 5, direction: "동남", symbol: "☴" },
  { name: "坎", korean: "감", number: 6, direction: "북", symbol: "☵" },
  { name: "艮", korean: "간", number: 7, direction: "동북", symbol: "☶" },
  { name: "坤", korean: "곤", number: 8, direction: "서남", symbol: "☷" },
];

// 10 Heavenly Stems
const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

interface JeolgukChartProps {
  date: Date;
}

export function JeolgukChart({ date }: JeolgukChartProps) {
  const todayGanZhi = getDayGanZhi(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const todayHwDate = getHwanggeukDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const todayJeolguk = getJeolguk(todayHwDate.year, todayHwDate.month, todayHwDate.day);
  
  const todayGanZhiIndex = SIXTY_GANJI.indexOf(todayGanZhi);
  const todayStem = todayGanZhi.charAt(0); // First character is the stem
  
  // Calculate current jeolguk index based on the returned jeolguk name
  const currentJeolgukIndex = useMemo(() => {
    const jeolgukName = todayJeolguk.name.replace("절국", "");
    for (let i = 0; i < JEOLGUK_NAMES.length; i++) {
      if (jeolgukName.includes(JEOLGUK_NAMES[i].korean) || jeolgukName.includes(JEOLGUK_NAMES[i].hanja)) {
        return i;
      }
    }
    return 0;
  }, [todayJeolguk.name]);
  
  // Calculate days until each ganji
  const getGanjiDayOffset = (ganji: string): number => {
    const ganjiIndex = SIXTY_GANJI.indexOf(ganji);
    if (ganjiIndex === -1 || todayGanZhiIndex === -1) return 0;
    let diff = ganjiIndex - todayGanZhiIndex;
    if (diff < 0) diff += 60;
    return diff;
  };

  return (
    <Card className="p-4 mt-4">
      <h2 className="text-lg font-bold orae-navy text-center mb-4" data-testid="text-jeolguk-title">
        [ 24節局 ] 용담도에 적용한 천간 (동지기준)
      </h2>
      
      {/* Current Status Display */}
      <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
        <Badge className="badge-navy">
          오늘: {todayGanZhi}
        </Badge>
        <Badge className="badge-slate">
          {todayJeolguk.name}
        </Badge>
        <Badge variant="outline">
          천간: {todayStem}
        </Badge>
      </div>

      {/* Circular Chart Representation */}
      <div className="relative mx-auto" style={{ maxWidth: "600px" }}>
        {/* Outer Ring - 24 Jeolguk */}
        <div className="grid grid-cols-6 gap-1 mb-4">
          {JEOLGUK_DATA.map((jeolguk, index) => {
            const isCurrentSector = currentJeolgukIndex === index;
            const jeolgukName = JEOLGUK_NAMES[index];
            
            return (
              <div
                key={index}
                className={`
                  p-2 rounded-md text-center text-xs transition-all
                  ${isCurrentSector 
                    ? 'ring-2 ring-[hsl(var(--orae-navy))] bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/40 dark:to-slate-700/20' 
                    : 'bg-muted/30 hover-elevate'}
                `}
                data-testid={`jeolguk-sector-${index}`}
              >
                <div className="font-bold text-sm orae-navy">{jeolguk.hanja}</div>
                <div className="text-muted-foreground">{jeolguk.name}</div>
                <div className="text-[10px] mt-1">
                  <span className="font-medium">{jeolgukName.hanja}</span>
                </div>
                <div className="text-[9px] text-muted-foreground">
                  {jeolguk.mansion}宿 · {jeolguk.month}月
                </div>
                <div className={`text-[10px] mt-0.5 ${todayStem === jeolguk.stem ? 'font-bold orae-navy' : 'text-muted-foreground'}`}>
                  {jeolguk.stem}
                </div>
              </div>
            );
          })}
        </div>

        {/* Inner Circle - 8 Trigrams */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {TRIGRAMS.map((trigram, index) => (
            <div
              key={index}
              className="p-2 rounded-md text-center bg-muted/20"
              data-testid={`trigram-${trigram.name}`}
            >
              <div className="text-2xl">{trigram.symbol}</div>
              <div className="text-xs font-bold orae-navy">{trigram.name}</div>
              <div className="text-[10px] text-muted-foreground">{trigram.korean} · {trigram.direction}</div>
            </div>
          ))}
        </div>

        {/* Center - 10 Heavenly Stems */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/30 dark:to-slate-800/30 rounded-lg p-4">
          <div className="text-center mb-2">
            <span className="text-sm font-bold orae-navy">十天干 (10 천간)</span>
          </div>
          <div className="flex justify-center gap-2 flex-wrap">
            {HEAVENLY_STEMS.map((stem, index) => {
              const isToday = todayStem === stem;
              return (
                <div
                  key={index}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                    ${isToday 
                      ? 'bg-[hsl(var(--orae-navy))] text-white ring-2 ring-offset-2 ring-[hsl(var(--orae-navy))]' 
                      : 'bg-muted/50 text-muted-foreground'}
                  `}
                  title={isToday ? "오늘의 천간" : `${stem} (${index + 1}번째)`}
                  data-testid={`stem-${stem}`}
                >
                  {stem}
                </div>
              );
            })}
          </div>
          <div className="text-center mt-3 text-xs text-muted-foreground">
            <p>陽: 甲丙戊庚壬 / 陰: 乙丁己辛癸</p>
          </div>
        </div>
      </div>

      {/* 60 Ganji Reference */}
      <div className="mt-4 p-3 bg-muted/20 rounded-lg">
        <div className="text-sm font-bold orae-navy mb-2 text-center">60甲子 순환</div>
        <div className="grid grid-cols-10 gap-1 text-[9px] text-center">
          {SIXTY_GANJI.map((ganji, index) => {
            const isToday = ganji === todayGanZhi;
            const dayOffset = getGanjiDayOffset(ganji);
            return (
              <div
                key={index}
                className={`
                  p-1 rounded
                  ${isToday 
                    ? 'bg-[hsl(var(--orae-navy))] text-white font-bold' 
                    : 'bg-muted/30'}
                `}
                title={isToday ? "오늘" : `${dayOffset}일 후`}
                data-testid={`ganji-${ganji}`}
              >
                {ganji}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 text-xs text-muted-foreground space-y-1">
        <p><span className="font-medium orae-navy">절국 순환:</span> 원화 → 중화 → ... → 성화 (24절국)</p>
        <p><span className="font-medium">방위:</span> 북(子), 동북(丑寅), 동(卯), 동남(辰巳), 남(午), 서남(未申), 서(酉), 서북(戌亥)</p>
      </div>
    </Card>
  );
}
