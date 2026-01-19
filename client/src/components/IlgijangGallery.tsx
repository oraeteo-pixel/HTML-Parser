import { useState, useEffect, useMemo } from "react";
import {
  getKoreanDate,
  get8Trigram,
  get28Mansion,
  getHwanggeukDate,
  getHwanggeukHourGanZhi,
  getDayGanZhi,
  getYearGanZhi,
  getMonthGanZhi,
  SIXTY_GANJI,
} from "@/lib/calendarData";

const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const EIGHT_TRIGRAMS_ORDER = ["坤", "坎", "兌", "震", "巽", "艮", "離", "乾"];
const TRIGRAM_KOREAN = {
  "乾": "건",
  "兌": "태",
  "離": "리",
  "震": "진",
  "巽": "손",
  "坎": "감",
  "艮": "간",
  "坤": "곤",
  "中": "중"
};

const TWENTY_EIGHT_MANSIONS = [
  "角", "亢", "氐", "房", "心", "尾", "箕",
  "斗", "牛", "女", "虛", "危", "室", "壁",
  "奎", "婁", "胃", "昴", "畢", "觜", "參",
  "井", "鬼", "柳", "星", "張", "翼", "軫"
];

const MANSION_KOREAN: { [key: string]: string } = {
  "角": "각", "亢": "항", "氐": "저", "房": "방", "心": "심", "尾": "미", "箕": "기",
  "斗": "두", "牛": "우", "女": "녀", "虛": "허", "危": "위", "室": "실", "壁": "벽",
  "奎": "규", "婁": "루", "胃": "위", "昴": "묘", "畢": "필", "觜": "자", "參": "삼",
  "井": "정", "鬼": "귀", "柳": "류", "星": "성", "張": "장", "翼": "익", "軫": "진"
};

const SIX_SPIRITS = ["청룡", "주작", "구진", "등사", "백호", "현무"];
const SIX_SPIRITS_HANJA = ["靑龍", "朱雀", "句陳", "螣蛇", "白虎", "玄武"];

function getSixSpiritAssignment(dayStem: string): { [key: string]: string } {
  const stemIndex = HEAVENLY_STEMS.indexOf(dayStem);
  const spiritStartMap: { [key: number]: number } = {
    0: 0, 1: 0,
    2: 1, 3: 1,
    4: 2,
    5: 3,
    6: 4, 7: 4,
    8: 5, 9: 5
  };
  
  const startIdx = spiritStartMap[stemIndex] || 0;
  
  const result: { [key: string]: string } = {};
  for (let i = 0; i < 10; i++) {
    const spiritIdx = (startIdx + Math.floor(i / 2) + (i >= 4 && i < 8 ? 0 : 0)) % 6;
    let adjustedSpiritIdx: number;
    
    if (i === 0 || i === 1) adjustedSpiritIdx = 0;
    else if (i === 2 || i === 3) adjustedSpiritIdx = 1;
    else if (i === 4) adjustedSpiritIdx = 2;
    else if (i === 5) adjustedSpiritIdx = 3;
    else if (i === 6 || i === 7) adjustedSpiritIdx = 4;
    else adjustedSpiritIdx = 5;
    
    const finalIdx = (startIdx + adjustedSpiritIdx) % 6;
    result[HEAVENLY_STEMS[i]] = SIX_SPIRITS[finalIdx];
  }
  
  return result;
}

function getSixSpiritForStem(dayStem: string): { [key: string]: { korean: string; hanja: string } } {
  const spiritOrder = ["청룡", "주작", "구진", "등사", "백호", "현무"];
  const spiritHanja = ["靑龍", "朱雀", "句陳", "螣蛇", "白虎", "玄武"];
  
  const stemStartMap: { [key: string]: number } = {
    "甲": 0, "乙": 0,
    "丙": 1, "丁": 1,
    "戊": 2,
    "己": 3,
    "庚": 4, "辛": 4,
    "壬": 5, "癸": 5
  };
  
  const startIdx = stemStartMap[dayStem] || 0;
  
  const result: { [key: string]: { korean: string; hanja: string } } = {};
  
  const stemGroups = [
    ["甲", "乙"],
    ["丙", "丁"],
    ["戊"],
    ["己"],
    ["庚", "辛"],
    ["壬", "癸"]
  ];
  
  for (let groupIdx = 0; groupIdx < stemGroups.length; groupIdx++) {
    const spiritIdx = (6 - startIdx + groupIdx) % 6;
    for (const stem of stemGroups[groupIdx]) {
      result[stem] = {
        korean: spiritOrder[spiritIdx],
        hanja: spiritHanja[spiritIdx]
      };
    }
  }
  
  return result;
}

export function IlgijangGallery() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  
  const calendarData = useMemo(() => {
    const koreanDate = getKoreanDate();
    const { year, month, day, hours, minutes } = koreanDate;
    
    let adjustedYear = year;
    let adjustedMonth = month;
    let adjustedDay = day;
    if (hours >= 23) {
      const nextDate = new Date(year, month - 1, day + 1);
      adjustedYear = nextDate.getFullYear();
      adjustedMonth = nextDate.getMonth() + 1;
      adjustedDay = nextDate.getDate();
    }
    
    const trigram = get8Trigram(adjustedYear, adjustedMonth, adjustedDay);
    const mansion = get28Mansion(adjustedYear, adjustedMonth, adjustedDay);
    const hwanggeuk = getHwanggeukDate(year, month, day, hours);
    const hwHourGanZhi = getHwanggeukHourGanZhi(year, month, day, hours, minutes);
    const dayGanZhi = getDayGanZhi(adjustedYear, adjustedMonth, adjustedDay);
    const yearGanZhi = getYearGanZhi(adjustedYear, adjustedMonth, adjustedDay);
    const monthGanZhi = getMonthGanZhi(adjustedYear, adjustedMonth, adjustedDay);
    
    const dayStem = dayGanZhi[0];
    const sixSpirits = getSixSpiritForStem(dayStem);
    
    return {
      trigram,
      mansion,
      hwanggeuk,
      hwHourGanZhi,
      dayGanZhi,
      yearGanZhi,
      monthGanZhi,
      sixSpirits,
      dayStem,
      koreanDate: { year: adjustedYear, month: adjustedMonth, day: adjustedDay, hours, minutes }
    };
  }, [currentTime]);
  
  const { trigram, mansion, hwanggeuk, hwHourGanZhi, dayGanZhi, yearGanZhi, monthGanZhi, sixSpirits, dayStem, koreanDate } = calendarData;
  
  const currentTrigramIdx = EIGHT_TRIGRAMS_ORDER.indexOf(trigram.trigram);
  const currentMansionIdx = TWENTY_EIGHT_MANSIONS.indexOf(mansion.mansion);
  
  return (
    <div className="w-full p-4" data-testid="ilgijang-gallery">
      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
        <h2 className="text-2xl font-bold text-center mb-6 text-amber-900 dark:text-amber-100">
          황극력 일기장
        </h2>
        
        <div className="text-center mb-6 text-sm text-muted-foreground">
          {koreanDate.year}년 {koreanDate.month}월 {koreanDate.day}일 {koreanDate.hours}시 {koreanDate.minutes}분 (KST)
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-amber-300 dark:border-amber-700">
            <h3 className="text-lg font-semibold mb-3 text-center text-amber-800 dark:text-amber-200">8괘 (팔괘)</h3>
            <div className="flex justify-center gap-2 flex-wrap">
              {EIGHT_TRIGRAMS_ORDER.map((gwa, idx) => (
                <div
                  key={gwa}
                  className={`w-10 h-10 flex items-center justify-center rounded-md text-lg font-bold transition-all ${
                    trigram.trigram === gwa
                      ? "bg-red-600 text-white scale-110 shadow-lg"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}
                  data-testid={`trigram-${gwa}`}
                >
                  {gwa}
                </div>
              ))}
            </div>
            <div className="text-center mt-3 text-sm">
              <span className="text-muted-foreground">오늘의 괘: </span>
              <span className="font-bold text-red-600 dark:text-red-400">
                {trigram.trigram} ({TRIGRAM_KOREAN[trigram.trigram as keyof typeof TRIGRAM_KOREAN] || trigram.trigram})
              </span>
              <span className="text-muted-foreground ml-2">방위: {trigram.direction}</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-amber-300 dark:border-amber-700">
            <h3 className="text-lg font-semibold mb-3 text-center text-amber-800 dark:text-amber-200">28수 (이십팔수)</h3>
            <div className="grid grid-cols-7 gap-1 text-xs">
              {TWENTY_EIGHT_MANSIONS.map((su, idx) => (
                <div
                  key={su}
                  className={`w-8 h-8 flex items-center justify-center rounded-md font-bold transition-all ${
                    mansion.mansion === su
                      ? "bg-blue-600 text-white scale-110 shadow-lg"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}
                  data-testid={`mansion-${su}`}
                >
                  {su}
                </div>
              ))}
            </div>
            <div className="text-center mt-3 text-sm">
              <span className="text-muted-foreground">오늘의 수: </span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {mansion.mansion} ({MANSION_KOREAN[mansion.mansion]}) - {mansion.direction}방
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg p-4 border border-amber-300 dark:border-amber-700">
          <h3 className="text-lg font-semibold mb-3 text-center text-amber-800 dark:text-amber-200">황극력 년월일시</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-gradient-to-b from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-950/40 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">년 (年)</div>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{hwanggeuk.yearGanZhi}</div>
              <div className="text-sm text-muted-foreground">{hwanggeuk.year}년</div>
            </div>
            <div className="bg-gradient-to-b from-green-100 to-green-50 dark:from-green-900/40 dark:to-green-950/40 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">월 (月)</div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">{hwanggeuk.monthGanZhi}</div>
              <div className="text-sm text-muted-foreground">{hwanggeuk.month}월</div>
            </div>
            <div className="bg-gradient-to-b from-orange-100 to-orange-50 dark:from-orange-900/40 dark:to-orange-950/40 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">일 (日)</div>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{dayGanZhi}</div>
              <div className="text-sm text-muted-foreground">{hwanggeuk.day}일</div>
            </div>
            <div className="bg-gradient-to-b from-cyan-100 to-cyan-50 dark:from-cyan-900/40 dark:to-cyan-950/40 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">시 (時)</div>
              <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">{hwHourGanZhi}</div>
              <div className="text-sm text-muted-foreground">{koreanDate.hours}시</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg p-4 border border-amber-300 dark:border-amber-700">
          <h3 className="text-lg font-semibold mb-3 text-center text-amber-800 dark:text-amber-200">
            천간 육신 (오늘: {dayGanZhi}일)
          </h3>
          <div className="text-center text-sm text-muted-foreground mb-3">
            일간 {dayStem}에 따른 육신 배치
          </div>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {HEAVENLY_STEMS.map((stem, idx) => {
              const spirit = sixSpirits[stem];
              const isCurrentDay = stem === dayStem;
              
              return (
                <div
                  key={stem}
                  className={`rounded-lg p-2 text-center transition-all ${
                    isCurrentDay
                      ? "bg-yellow-400 dark:bg-yellow-600 scale-105 shadow-lg"
                      : "bg-gray-50 dark:bg-gray-800"
                  }`}
                  data-testid={`stem-spirit-${stem}`}
                >
                  <div className={`text-lg font-bold ${isCurrentDay ? "text-yellow-900" : "text-gray-700 dark:text-gray-300"}`}>
                    {stem}
                  </div>
                  <div className={`text-xs mt-1 ${isCurrentDay ? "text-yellow-800" : "text-muted-foreground"}`}>
                    {spirit?.korean}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-2">
            {SIX_SPIRITS.map((spirit, idx) => (
              <div
                key={spirit}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center"
                data-testid={`spirit-${spirit}`}
              >
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{spirit}</div>
                <div className="text-xs text-muted-foreground">{SIX_SPIRITS_HANJA[idx]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
