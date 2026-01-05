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

const MANSION_GENERAL_IMAGES = [
  "masung", "deungwoo", "yuyung", "mamu", "jangkung", "kungsun", "yusik",
  "yoki", "biyung", "kaeyoen", "mansu", "kyungdan", "leechung", "jejun",
  "limkwang", "juwoo", "wangpae", "punge", "kyunsim", "jampeng", "pujun",
  "kusun", "dumu", "kungdan", "jinjun", "kabok", "wanglyang", "ohan"
];

const MANSION_DESCRIPTIONS = [
  "日月之位", "天地之間", "瑞化之造", "珀雨之順", "寵露之功", "玲霜之心", "玉雪之契",
  "熱薰之序", "寒冷之節", "陰氣之理", "陽氣之理", "走獸之迷", "飛禽之殊", "人生之貴",
  "沙石之極", "岩岸之顯", "澤地之幽", "山岳之脉", "江水之精", "四季之土", "三冬之水",
  "三秋之金", "三夏之火", "三春之木", "煙霧之化", "風雲之墟", "河漢之邊", "星辰之道"
];

const EIGHT_TRIGRAMS = ["乾", "兌", "離", "震", "巽", "坎", "艮", "坤"];
const TRIGRAM_DIRECTIONS = ["西北", "西", "南", "東", "東南", "北", "東北", "西南"];

const SOLAR_TERMS_HANJA = [
  "冬至", "小寒", "大寒", "立春", "雨水", "驚蟄",
  "春分", "淸明", "穀雨", "立夏", "小滿", "芒種",
  "夏至", "小暑", "大暑", "立秋", "處暑", "白露",
  "秋分", "寒露", "霜降", "立冬", "小雪", "大雪"
];

const SOLAR_TERMS_KOREAN = [
  "동지", "소한", "대한", "입춘", "우수", "경칩",
  "춘분", "청명", "곡우", "입하", "소만", "망종",
  "하지", "소서", "대서", "입추", "처서", "백로",
  "추분", "한로", "상강", "입동", "소설", "대설"
];

const TERM_GENERALS = [
  "長孫無忌", "孝公", "杜如灰", "魏徵", "房玄齡", "顧士廉",
  "蔚遲敬德", "李靖", "蕭瑀", "丹遲玄", "劉弘期", "屈突通",
  "殷開山", "柴紹", "張孫順德", "張亮", "厚君集", "張公謹",
  "靖遲節", "虞世南", "劉靖灰", "唐儉", "李世勣", "秦菽寶"
];

function getJulianDayNumber(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

const BASE_DATE = new Date(1900, 0, 31);
const BASE_JD = getJulianDayNumber(1900, 1, 31);

const LUNAR_MONTH_DAYS = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
  0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
  0x0d520
];

function getLunarYearDays(year: number): number {
  let sum = 348;
  const yearData = LUNAR_MONTH_DAYS[year - 1900];
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (yearData & i) ? 1 : 0;
  }
  return sum + getLeapMonthDays(year);
}

function getLeapMonth(year: number): number {
  return LUNAR_MONTH_DAYS[year - 1900] & 0xf;
}

function getLeapMonthDays(year: number): number {
  if (getLeapMonth(year)) {
    return (LUNAR_MONTH_DAYS[year - 1900] & 0x10000) ? 30 : 29;
  }
  return 0;
}

function getLunarMonthDays(year: number, month: number): number {
  return (LUNAR_MONTH_DAYS[year - 1900] & (0x10000 >> month)) ? 30 : 29;
}

export function solarToLunar(year: number, month: number, day: number): { year: number; month: number; day: number; isLeap: boolean } {
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(year, month - 1, day);
  let offset = Math.floor((targetDate.getTime() - baseDate.getTime()) / 86400000);
  
  let lunarYear = 1900;
  let yearDays;
  while (lunarYear < 2100 && offset > 0) {
    yearDays = getLunarYearDays(lunarYear);
    offset -= yearDays;
    lunarYear++;
  }
  if (offset < 0) {
    offset += getLunarYearDays(--lunarYear);
  }
  
  const leapMonth = getLeapMonth(lunarYear);
  let isLeap = false;
  let lunarMonth = 1;
  let monthDays;
  
  for (let i = 1; i <= 12; i++) {
    if (leapMonth > 0 && i === leapMonth + 1 && !isLeap) {
      --i;
      isLeap = true;
      monthDays = getLeapMonthDays(lunarYear);
    } else {
      monthDays = getLunarMonthDays(lunarYear, i);
    }
    
    lunarMonth = i;
    
    if (offset < monthDays) {
      break;
    }
    offset -= monthDays;
    
    if (isLeap && i === leapMonth + 1) {
      isLeap = false;
    }
  }
  
  return {
    year: lunarYear,
    month: lunarMonth,
    day: offset + 2,
    isLeap
  };
}

export function getYearGanZhi(year: number): string {
  const offset = (year - 4) % 60;
  const stemIndex = offset % 10;
  const branchIndex = offset % 12;
  return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[branchIndex];
}

export function getMonthGanZhi(year: number, month: number): string {
  const diff = (year - 2024) * 12 + (month - 4);
  const g = (((diff % 10) + 10) % 10);
  const z = (((diff % 12) + 12) % 12);
  return HEAVENLY_STEMS[g] + EARTHLY_BRANCHES[z];
}

export function getDayGanZhi(year: number, month: number, day: number): string {
  const jd = getJulianDayNumber(year, month, day);
  const offset = (jd - 11) % 60;
  const stemIndex = offset % 10;
  const branchIndex = offset % 12;
  return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[branchIndex];
}

export function get28Mansion(year: number, month: number, day: number): { 
  mansion: string; 
  general: string; 
  direction: string;
  image: string;
  description: string;
  index: number;
} {
  const jd = getJulianDayNumber(year, month, day);
  const index = (jd + 11) % 28;
  
  let direction = "中";
  if (index >= 0 && index < 7) direction = "東";
  else if (index >= 7 && index < 14) direction = "北";
  else if (index >= 14 && index < 21) direction = "西";
  else direction = "南";
  
  return {
    mansion: TWENTY_EIGHT_MANSIONS[index],
    general: MANSION_GENERALS[index],
    direction,
    image: MANSION_GENERAL_IMAGES[index],
    description: MANSION_DESCRIPTIONS[index],
    index
  };
}

export function get8Trigram(year: number, month: number, day: number): { trigram: string; direction: string } {
  const jd = getJulianDayNumber(year, month, day);
  const index = jd % 9;
  if (index === 8) {
    return { trigram: "中", direction: "中央" };
  }
  return {
    trigram: EIGHT_TRIGRAMS[index],
    direction: TRIGRAM_DIRECTIONS[index]
  };
}

export function getSolarTerm(month: number, day: number): { hanja: string; korean: string; general: string } | null {
  const termDays: { [key: number]: number[] } = {
    1: [6, 20], 2: [4, 19], 3: [6, 21], 4: [5, 20],
    5: [6, 21], 6: [6, 21], 7: [7, 23], 8: [8, 23],
    9: [8, 23], 10: [8, 24], 11: [8, 22], 12: [7, 22]
  };
  
  const days = termDays[month];
  if (!days) return null;
  
  const termIndex = (month - 1) * 2;
  if (day === days[0]) {
    return {
      hanja: SOLAR_TERMS_HANJA[(termIndex + 3) % 24],
      korean: SOLAR_TERMS_KOREAN[(termIndex + 3) % 24],
      general: TERM_GENERALS[(termIndex + 3) % 24]
    };
  } else if (day === days[1]) {
    return {
      hanja: SOLAR_TERMS_HANJA[(termIndex + 4) % 24],
      korean: SOLAR_TERMS_KOREAN[(termIndex + 4) % 24],
      general: TERM_GENERALS[(termIndex + 4) % 24]
    };
  }
  return null;
}

export function getCurrentSolarTerm(month: number, day: number): { hanja: string; korean: string; general: string } {
  const termDays: { [key: number]: number[] } = {
    1: [6, 20], 2: [4, 19], 3: [6, 21], 4: [5, 20],
    5: [6, 21], 6: [6, 21], 7: [7, 23], 8: [8, 23],
    9: [8, 23], 10: [8, 24], 11: [8, 22], 12: [7, 22]
  };
  
  let termIndex = (month - 1) * 2 + 2;
  const days = termDays[month];
  
  if (day >= days[1]) {
    termIndex = (month - 1) * 2 + 4;
  } else if (day >= days[0]) {
    termIndex = (month - 1) * 2 + 3;
  }
  
  termIndex = ((termIndex % 24) + 24) % 24;
  
  return {
    hanja: SOLAR_TERMS_HANJA[termIndex],
    korean: SOLAR_TERMS_KOREAN[termIndex],
    general: TERM_GENERALS[termIndex]
  };
}

export function getHwanggeukDate(year: number, month: number, day: number): { 
  year: number; 
  month: number; 
  day: number;
  yearGanZhi: string;
  monthGanZhi: string;
} {
  const lunar = solarToLunar(year, month, day);
  
  let hwMonth = ((lunar.month + 9 - 1) % 12) + 1;
  
  let hwYear: number;
  if (lunar.month >= 4) {
    hwYear = lunar.year;
  } else {
    hwYear = lunar.year - 1;
  }
  
  let hwDay = lunar.day + 3;
  const lunarMonthDays = getLunarMonthDays(lunar.year, lunar.month);
  if (hwDay > lunarMonthDays) {
    hwDay = hwDay - lunarMonthDays;
    hwMonth = hwMonth + 1;
    if (hwMonth > 12) {
      hwMonth = 1;
      hwYear = hwYear + 1;
    }
  }
  
  const yearGanZhi = getYearGanZhi(hwYear);
  
  const monthBase = (hwYear - 4) % 10;
  const monthStemOffset = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
  const monthStemIndex = (monthStemOffset[monthBase] + hwMonth - 1) % 10;
  const monthBranchIndex = (hwMonth + 1) % 12;
  const monthGanZhi = HEAVENLY_STEMS[monthStemIndex] + EARTHLY_BRANCHES[monthBranchIndex];
  
  return { 
    year: hwYear, 
    month: hwMonth, 
    day: hwDay,
    yearGanZhi,
    monthGanZhi
  };
}

function lunarToSolar(lunarYear: number, lunarMonth: number, lunarDay: number, isLeapMonth: boolean): { year: number; month: number; day: number } {
  const baseDate = new Date(1900, 0, 31);
  let offset = 0;
  
  for (let y = 1900; y < lunarYear; y++) {
    offset += getLunarYearDays(y);
  }
  
  const leapMonth = getLeapMonth(lunarYear);
  
  for (let m = 1; m < lunarMonth; m++) {
    offset += getLunarMonthDays(lunarYear, m);
    if (m === leapMonth) {
      offset += getLeapMonthDays(lunarYear);
    }
  }
  
  if (isLeapMonth && lunarMonth === leapMonth) {
    offset += getLunarMonthDays(lunarYear, lunarMonth);
  }
  
  offset += lunarDay - 1;
  
  const resultDate = new Date(baseDate.getTime() + offset * 86400000);
  return {
    year: resultDate.getFullYear(),
    month: resultDate.getMonth() + 1,
    day: resultDate.getDate()
  };
}

export function hwanggeukToSolar(hwYear: number, hwMonth: number, hwDay: number): { year: number; month: number; day: number } {
  let lunarMonth = ((hwMonth - 10 + 12 - 1) % 12) + 1;
  
  let lunarYear: number;
  if (hwMonth >= 10) {
    lunarYear = hwYear;
  } else {
    lunarYear = hwYear + 1;
  }
  
  let lunarDay = hwDay - 3;
  if (lunarDay <= 0) {
    lunarMonth = lunarMonth - 1;
    if (lunarMonth <= 0) {
      lunarMonth = 12;
      lunarYear = lunarYear - 1;
    }
    lunarDay = getLunarMonthDays(lunarYear, lunarMonth) + lunarDay;
  }
  
  return lunarToSolar(lunarYear, lunarMonth, lunarDay, false);
}

export function getHwanggeukMonthDays(hwYear: number, hwMonth: number): number {
  let lunarMonth = ((hwMonth - 10 + 12 - 1) % 12) + 1;
  
  let lunarYear: number;
  if (hwMonth >= 10) {
    lunarYear = hwYear;
  } else {
    lunarYear = hwYear + 1;
  }
  
  return getLunarMonthDays(lunarYear, lunarMonth);
}

export function getHwanggeukMonthData(hwYear: number, hwMonth: number): Array<{
  hwDay: number;
  solarDate: Date;
  dayData: CalendarDayData;
}> {
  const days = getHwanggeukMonthDays(hwYear, hwMonth);
  const result = [];
  
  for (let d = 1; d <= days; d++) {
    const solar = hwanggeukToSolar(hwYear, hwMonth, d);
    const solarDate = new Date(solar.year, solar.month - 1, solar.day);
    const dayData = getCalendarDayData(solar.year, solar.month, solar.day);
    
    result.push({
      hwDay: d,
      solarDate,
      dayData
    });
  }
  
  return result;
}

export function getHwanggeukYearGanZhi(hwYear: number): string {
  return getYearGanZhi(hwYear);
}

export function getHwanggeukMonthGanZhi(hwYear: number, hwMonth: number): string {
  const monthBase = (hwYear - 4) % 10;
  const monthStemOffset = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
  const monthStemIndex = (monthStemOffset[monthBase] + hwMonth - 1) % 10;
  const monthBranchIndex = (hwMonth + 1) % 12;
  return HEAVENLY_STEMS[monthStemIndex] + EARTHLY_BRANCHES[monthBranchIndex];
}

export interface CalendarDayData {
  solarYear: number;
  solarMonth: number;
  solarDay: number;
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeapMonth: boolean;
  yearGanZhi: string;
  monthGanZhi: string;
  dayGanZhi: string;
  mansion: string;
  mansionGeneral: string;
  mansionDirection: string;
  mansionImage: string;
  mansionDescription: string;
  mansionIndex: number;
  trigram: string;
  trigramDirection: string;
  solarTerm: { hanja: string; korean: string; general: string } | null;
  currentTerm: { hanja: string; korean: string; general: string };
  hwanggeuk: { 
    year: number; 
    month: number; 
    day: number;
    yearGanZhi: string;
    monthGanZhi: string;
  };
}

export function getCalendarDayData(year: number, month: number, day: number): CalendarDayData {
  const lunar = solarToLunar(year, month, day);
  const yearGanZhi = getYearGanZhi(year);
  const monthGanZhi = getMonthGanZhi(year, month);
  const dayGanZhi = getDayGanZhi(year, month, day);
  const mansion = get28Mansion(year, month, day);
  const trigram = get8Trigram(year, month, day);
  const solarTerm = getSolarTerm(month, day);
  const currentTerm = getCurrentSolarTerm(month, day);
  const hwanggeuk = getHwanggeukDate(year, month, day);
  
  return {
    solarYear: year,
    solarMonth: month,
    solarDay: day,
    lunarYear: lunar.year,
    lunarMonth: lunar.month,
    lunarDay: lunar.day,
    isLeapMonth: lunar.isLeap,
    yearGanZhi,
    monthGanZhi,
    dayGanZhi,
    mansion: mansion.mansion,
    mansionGeneral: mansion.general,
    mansionDirection: mansion.direction,
    mansionImage: mansion.image,
    mansionDescription: mansion.description,
    mansionIndex: mansion.index,
    trigram: trigram.trigram,
    trigramDirection: trigram.direction,
    solarTerm,
    currentTerm,
    hwanggeuk
  };
}

export {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  TWENTY_EIGHT_MANSIONS,
  MANSION_GENERALS,
  MANSION_GENERAL_IMAGES,
  MANSION_DESCRIPTIONS,
  EIGHT_TRIGRAMS,
  SOLAR_TERMS_HANJA,
  SOLAR_TERMS_KOREAN
};
