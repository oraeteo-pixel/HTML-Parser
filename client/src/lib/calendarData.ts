import KoreanLunarCalendar from 'korean-lunar-calendar';

export function getKoreanTime(date: Date = new Date()): Date {
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  return new Date(utc + (9 * 60 * 60 * 1000));
}

export function getKoreanDate(): { year: number; month: number; day: number; hours: number; minutes: number; dayOfWeek: number } {
  const kt = getKoreanTime();
  return {
    year: kt.getFullYear(),
    month: kt.getMonth() + 1,
    day: kt.getDate(),
    hours: kt.getHours(),
    minutes: kt.getMinutes(),
    dayOfWeek: kt.getDay()
  };
}

const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const TWENTY_EIGHT_MANSIONS = [
  "角", "亢", "氐", "房", "心", "尾", "箕",
  "斗", "牛", "女", "虛", "危", "室", "壁",
  "奎", "婁", "胃", "昴", "畢", "觜", "參",
  "井", "鬼", "柳", "星", "張", "翼", "軫"
];

const MANSION_GENERALS = [
  "鄧禹", "馬成", "吳漢", "王梁", "賈復", "陣俊", "耿弇",
  "杜茂", "寇恂", "傅俊", "岑膨", "堅鐔", "馮異", "王覇",
  "朱佑", "任光", "祭遵", "李忠", "景丹", "万修", "蓋延",
  "邳肜", "銚期", "劉植", "耿純", "藏宮", "馬武", "劉隆"
];

const MANSION_GENERAL_IMAGES = [
  "deungwoo", "masung", "ohan", "wanglyang", "kabok", "jinjun", "kungdan",
  "dumu", "kusun", "pujun", "jampeng", "kyunsim", "punge", "wangpae",
  "juwoo", "limkwang", "jejun", "leechung", "kyungdan", "mansu", "kaeyoen",
  "biyung", "yoki", "yusik", "kungsun", "jangkung", "mamu", "yuyung"
];

const MANSION_DESCRIPTIONS = [
  "日月之位", "天地之間", "瑞化之造", "珀雨之順", "寵露之功", "玲霜之心", "玉雪之契",
  "熱薰之序", "寒冷之節", "陰氣之理", "陽氣之理", "走獸之迷", "飛禽之殊", "人生之貴",
  "沙石之極", "岩岸之顯", "澤地之幽", "山岳之脉", "江水之精", "四季之土", "三冬之水",
  "三秋之金", "三夏之火", "三春之木", "煙霧之化", "風雲之墟", "河漢之邊", "星辰之道"
];

const EIGHT_TRIGRAMS = ["乾", "兌", "離", "震", "巽", "坎", "艮", "坤"];
const TRIGRAM_DIRECTIONS = ["西北", "西", "南", "東", "東南", "北", "東北", "西南"];

const TEN_GWA_CYCLE = [
  { name: "中", direction: "中央" },
  { name: "坤", direction: "西南" },
  { name: "坎", direction: "北" },
  { name: "兌", direction: "西" },
  { name: "震", direction: "東" },
  { name: "中", direction: "中央" },
  { name: "巽", direction: "東南" },
  { name: "艮", direction: "東北" },
  { name: "離", direction: "南" },
  { name: "乾", direction: "西北" }
];

const GANJI_TO_MANSION: { [key: string]: number | "中" } = {
  "甲子": 16, "乙丑": 15, "丙寅": 14, "丁卯": 13, "戊辰": 12, "己巳": 11,
  "庚午": 10, "辛未": 9, "壬申": 8, "癸酉": 7, "甲戌": 6, "乙亥": 5,
  "丙子": 4, "丁丑": 3, "戊寅": 2, "己卯": "中", "庚辰": "中", "辛巳": 1,
  "壬午": 0, "癸未": 27, "甲申": 26, "乙酉": 25, "丙戌": 24, "丁亥": 23,
  "戊子": 22, "己丑": 21, "庚寅": 20, "辛卯": 19, "壬辰": 18, "癸巳": 17,
  "甲午": 16, "乙未": 15, "丙申": 14, "丁酉": 13, "戊戌": 12, "己亥": 11,
  "庚子": 10, "辛丑": 9, "壬寅": 8, "癸卯": 7, "甲辰": 6, "乙巳": 5,
  "丙午": 4, "丁未": 3, "戊申": 2, "己酉": "中", "庚戌": "中", "辛亥": 1,
  "壬子": 0, "癸丑": 27, "甲寅": 26, "乙卯": 25, "丙辰": 24, "丁巳": 23,
  "戊午": 22, "己未": 21, "庚申": 20, "辛酉": 19, "壬戌": 18, "癸亥": 17
};

export const SIXTY_GANJI = [
  "甲子", "乙丑", "丙寅", "丁卯", "戊辰", "己巳", "庚午", "辛未", "壬申", "癸酉",
  "甲戌", "乙亥", "丙子", "丁丑", "戊寅", "己卯", "庚辰", "辛巳", "壬午", "癸未",
  "甲申", "乙酉", "丙戌", "丁亥", "戊子", "己丑", "庚寅", "辛卯", "壬辰", "癸巳",
  "甲午", "乙未", "丙申", "丁酉", "戊戌", "己亥", "庚子", "辛丑", "壬寅", "癸卯",
  "甲辰", "乙巳", "丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子", "癸丑",
  "甲寅", "乙卯", "丙辰", "丁巳", "戊午", "己未", "庚申", "辛酉", "壬戌", "癸亥"
];

export function getMansionGanjiMap(): { [mansion: string]: string[] } {
  const result: { [key: string]: string[] } = {};
  TWENTY_EIGHT_MANSIONS.forEach(m => { result[m] = []; });
  result["中"] = [];
  
  SIXTY_GANJI.forEach(ganji => {
    const mapping = GANJI_TO_MANSION[ganji];
    if (mapping === "中") {
      result["中"].push(ganji);
    } else if (typeof mapping === "number") {
      result[TWENTY_EIGHT_MANSIONS[mapping]].push(ganji);
    }
  });
  return result;
}

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

const JEOLGUK_NAMES = [
  "元和", "中化", "大和", "布化",
  "雷和", "風化", "立和", "行化",
  "建和", "普化", "淸和", "平化",
  "成和", "入化", "咸和", "亨化",
  "正和", "明化", "至和", "貞化",
  "太和", "體化", "仁和", "性化"
];

const WEEKDAYS_HANJA = ["日", "月", "火", "水", "木", "金", "土"];

export function getJulianDayNumber(year: number, month: number, day: number): number {
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
  const calendar = new KoreanLunarCalendar();
  
  if (calendar.setSolarDate(year, month, day)) {
    const lunar = calendar.getLunarCalendar();
    return {
      year: lunar.year,
      month: lunar.month,
      day: lunar.day,
      isLeap: lunar.intercalation === true
    };
  }
  
  return {
    year: year,
    month: 1,
    day: 1,
    isLeap: false
  };
}

export function getYearGanZhi(year: number, month?: number, day?: number): string {
  // 절기 기반 연간지: 입춘(2월 4일경) 전이면 전년 간지 사용
  let ganzhiYear = year;
  if (month !== undefined && day !== undefined) {
    const lichunDay = SOLAR_TERM_DAYS[2]?.[0] || 4; // 입춘일 (2월의 첫 번째 절기)
    if (month < 2 || (month === 2 && day < lichunDay)) {
      ganzhiYear = year - 1;
    }
  }
  const offset = (ganzhiYear - 4) % 60;
  const stemIndex = offset % 10;
  const branchIndex = offset % 12;
  return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[branchIndex];
}

export function getMonthGanZhi(year: number, month: number, day?: number): string {
  // 절기 기반 월간지 계산
  // 절입일: 소한(1월), 입춘(2월), 경칩(3월), 청명(4월), 입하(5월), 망종(6월)
  //        소서(7월), 입추(8월), 백로(9월), 한로(10월), 입동(11월), 대설(12월)
  
  const nodeDay = day !== undefined ? day : 15; // 기본값은 월 중순
  const termDays = SOLAR_TERM_DAYS[month];
  const nodeDate = termDays ? termDays[0] : 5; // 해당 월의 절입일
  
  // 절입일 전이면 전월 지지 사용
  let monthBranch: number; // 지지 인덱스 (0=子, 1=丑, 2=寅, ...)
  let ganzhiYear = year;
  
  if (nodeDay < nodeDate) {
    // 절입일 전: 전월 지지
    if (month === 1) {
      monthBranch = 0; // 자월(子月) - 전년 12월의 지지
      ganzhiYear = year - 1;
    } else if (month === 2) {
      monthBranch = 1; // 축월(丑月)
      ganzhiYear = year - 1; // 입춘 전이면 전년
    } else {
      monthBranch = month - 1; // 전월 지지
    }
  } else {
    // 절입일 이후: 해당월 지지
    if (month === 1) {
      monthBranch = 1; // 축월(丑月)
      ganzhiYear = year - 1; // 1월은 전년의 축월
    } else if (month === 2) {
      monthBranch = 2; // 인월(寅月) - 새해 시작
    } else {
      monthBranch = month; // 해당월 지지
    }
  }
  
  // 년간에 따른 월간 계산
  // 갑기년: 병인월(丙寅), 을경년: 무인월(戊寅), 병신년: 경인월(庚寅), 정임년: 임인월(壬寅), 무계년: 갑인월(甲寅)
  const yearStemIndex = ((ganzhiYear - 4) % 10 + 10) % 10;
  const inMonthStemStart = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0][yearStemIndex]; // 인월(寅月)의 천간
  
  // 인월(寅)=2부터 시작하므로 월지에서 2를 빼서 오프셋 계산
  const monthOffset = ((monthBranch - 2) % 12 + 12) % 12;
  const monthStemIndex = (inMonthStemStart + monthOffset) % 10;
  
  return HEAVENLY_STEMS[monthStemIndex] + EARTHLY_BRANCHES[monthBranch];
}

export function getDayGanZhi(year: number, month: number, day: number): string {
  const jd = getJulianDayNumber(year, month, day);
  const offset = ((jd + 49) % 60 + 60) % 60;
  const stemIndex = offset % 10;
  const branchIndex = offset % 12;
  return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[branchIndex];
}

export function getSeoncheonHourGanZhi(year: number, month: number, day: number, hour: number, minute: number): string {
  const dayGanZhi = getDayGanZhi(year, month, day);
  const dayStem = dayGanZhi[0];
  
  let adjustedYear = year;
  let adjustedMonth = month;
  let adjustedDay = day;
  if (hour >= 23) {
    const nextDate = new Date(year, month - 1, day + 1);
    adjustedYear = nextDate.getFullYear();
    adjustedMonth = nextDate.getMonth() + 1;
    adjustedDay = nextDate.getDate();
  }
  
  const adjustedDayGanZhi = getDayGanZhi(adjustedYear, adjustedMonth, adjustedDay);
  const adjustedDayStem = adjustedDayGanZhi[0];
  
  const stemStartMap: { [key: string]: number } = {
    "甲": 0, "己": 0,
    "乙": 2, "庚": 2,
    "丙": 4, "辛": 4,
    "丁": 6, "壬": 6,
    "戊": 8, "癸": 8
  };
  
  const hourStemStart = stemStartMap[adjustedDayStem] || 0;
  
  const timeValue = hour * 100 + minute;
  let branchIndex = 0;
  if (timeValue >= 2300 || timeValue < 100) branchIndex = 0;
  else if (timeValue >= 100 && timeValue < 300) branchIndex = 1;
  else if (timeValue >= 300 && timeValue < 500) branchIndex = 2;
  else if (timeValue >= 500 && timeValue < 700) branchIndex = 3;
  else if (timeValue >= 700 && timeValue < 900) branchIndex = 4;
  else if (timeValue >= 900 && timeValue < 1100) branchIndex = 5;
  else if (timeValue >= 1100 && timeValue < 1300) branchIndex = 6;
  else if (timeValue >= 1300 && timeValue < 1500) branchIndex = 7;
  else if (timeValue >= 1500 && timeValue < 1700) branchIndex = 8;
  else if (timeValue >= 1700 && timeValue < 1900) branchIndex = 9;
  else if (timeValue >= 1900 && timeValue < 2100) branchIndex = 10;
  else if (timeValue >= 2100 && timeValue < 2300) branchIndex = 11;
  
  const stemIndex = (hourStemStart + branchIndex) % 10;
  
  return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[branchIndex];
}

export function get28Mansion(year: number, month: number, day: number): { 
  mansion: string; 
  general: string; 
  direction: string;
  cardinalDirection: string;
  position: string;
  image: string;
  description: string;
  index: number;
} {
  const jd = getJulianDayNumber(year, month, day);
  const index = (jd + 10) % 28;
  
  let cardinalDirection = "南";
  if (index >= 0 && index < 7) cardinalDirection = "東";
  else if (index >= 7 && index < 14) cardinalDirection = "北";
  else if (index >= 14 && index < 21) cardinalDirection = "西";
  
  const positionIndex = (index % 7) + 1;
  let position = "중";
  if (positionIndex <= 2) position = "초";
  else if (positionIndex >= 6) position = "말";
  
  return {
    mansion: TWENTY_EIGHT_MANSIONS[index],
    general: MANSION_GENERALS[index],
    direction: cardinalDirection,
    cardinalDirection,
    position,
    image: MANSION_GENERAL_IMAGES[index],
    description: MANSION_DESCRIPTIONS[index],
    index
  };
}

export function get8Trigram(year: number, month: number, day: number): { trigram: string; direction: string } {
  const daysFromEpoch = getHwanggeukDaysFromEpochExport(year, month, day);
  
  if (daysFromEpoch < 0) {
    return { trigram: "-", direction: "-" };
  }
  
  const offset = 2;
  const index = ((daysFromEpoch + offset) % 10 + 10) % 10;
  return {
    trigram: TEN_GWA_CYCLE[index].name,
    direction: TEN_GWA_CYCLE[index].direction
  };
}

export function getHwanggeukDaysFromEpochExport(year: number, month: number, day: number): number {
  return getHwanggeukDaysFromEpoch(year, month, day);
}

const SOLAR_TERM_DAYS: { [key: number]: number[] } = {
  1: [5, 20],
  2: [4, 18],
  3: [5, 20],
  4: [4, 20],
  5: [5, 21],
  6: [5, 21],
  7: [7, 22],
  8: [7, 23],
  9: [7, 22],
  10: [8, 23],
  11: [7, 22],
  12: [7, 21]
};

export function getSolarTerm(month: number, day: number): { hanja: string; korean: string; general: string } | null {
  const days = SOLAR_TERM_DAYS[month];
  if (!days) return null;
  
  if (day === days[0]) {
    const termIndex = month * 2 - 1;
    return {
      hanja: SOLAR_TERMS_HANJA[termIndex],
      korean: SOLAR_TERMS_KOREAN[termIndex],
      general: TERM_GENERALS[termIndex]
    };
  } else if (day === days[1]) {
    const termIndex = (month * 2) % 24;
    return {
      hanja: SOLAR_TERMS_HANJA[termIndex],
      korean: SOLAR_TERMS_KOREAN[termIndex],
      general: TERM_GENERALS[termIndex]
    };
  }
  return null;
}

export function getCurrentSolarTerm(month: number, day: number): { hanja: string; korean: string; general: string } {
  const days = SOLAR_TERM_DAYS[month];
  
  let termIndex: number;
  
  if (day >= days[1]) {
    termIndex = (month - 1) * 2 + 2;
  } else if (day >= days[0]) {
    termIndex = (month - 1) * 2 + 1;
  } else {
    termIndex = (month - 1) * 2;
  }
  
  termIndex = ((termIndex % 24) + 24) % 24;
  
  return {
    hanja: SOLAR_TERMS_HANJA[termIndex],
    korean: SOLAR_TERMS_KOREAN[termIndex],
    general: TERM_GENERALS[termIndex]
  };
}

const HW_EPOCH_YEAR = 1989;
const HW_EPOCH_MONTH = 4;
const HW_EPOCH_DAY = 21;
const HW_DAYS_PER_YEAR = 366;
const HW_MONTH_DAYS = [30, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30, 31];

function getHwanggeukDaysFromEpoch(year: number, month: number, day: number): number {
  const epochDate = new Date(HW_EPOCH_YEAR, HW_EPOCH_MONTH - 1, HW_EPOCH_DAY);
  const targetDate = new Date(year, month - 1, day);
  const diffTime = targetDate.getTime() - epochDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function getHwanggeukDate(year: number, month: number, day: number, hour?: number): { 
  year: number; 
  month: number; 
  day: number;
  yearGanZhi: string;
  monthGanZhi: string;
} {
  // 23시 이후면 황극력은 다음 날로 전환
  let adjustedYear = year;
  let adjustedMonth = month;
  let adjustedDay = day;
  
  if (hour !== undefined && hour >= 23) {
    const nextDate = new Date(year, month - 1, day + 1);
    adjustedYear = nextDate.getFullYear();
    adjustedMonth = nextDate.getMonth() + 1;
    adjustedDay = nextDate.getDate();
  }
  
  const daysFromEpoch = getHwanggeukDaysFromEpoch(adjustedYear, adjustedMonth, adjustedDay);
  
  const hwYear = HW_EPOCH_YEAR + Math.floor(daysFromEpoch / HW_DAYS_PER_YEAR);
  let dayOfYear = (daysFromEpoch % HW_DAYS_PER_YEAR) + 1;
  
  let hwMonth = 1;
  let hwDay = dayOfYear;
  
  let cumulative = 0;
  for (let m = 0; m < 12; m++) {
    if (dayOfYear <= cumulative + HW_MONTH_DAYS[m]) {
      hwMonth = m + 1;
      hwDay = dayOfYear - cumulative;
      break;
    }
    cumulative += HW_MONTH_DAYS[m];
  }
  
  const yearGanZhi = getHwanggeukYearGanZhi(hwYear);
  const monthGanZhi = getHwanggeukMonthGanZhi(hwYear, hwMonth);
  
  return { 
    year: hwYear, 
    month: hwMonth, 
    day: hwDay,
    yearGanZhi,
    monthGanZhi
  };
}

function lunarToSolar(lunarYear: number, lunarMonth: number, lunarDay: number, isLeapMonth: boolean): { year: number; month: number; day: number } {
  const calendar = new KoreanLunarCalendar();
  
  if (calendar.setLunarDate(lunarYear, lunarMonth, lunarDay, isLeapMonth)) {
    const solar = calendar.getSolarCalendar();
    return {
      year: solar.year,
      month: solar.month,
      day: solar.day
    };
  }
  
  return {
    year: lunarYear,
    month: 1,
    day: 1
  };
}

export function hwanggeukToSolar(hwYear: number, hwMonth: number, hwDay: number): { year: number; month: number; day: number } {
  let dayOfYear = hwDay;
  for (let m = 0; m < hwMonth - 1; m++) {
    dayOfYear += HW_MONTH_DAYS[m];
  }
  
  const yearsFromEpoch = hwYear - HW_EPOCH_YEAR;
  const daysFromEpoch = yearsFromEpoch * HW_DAYS_PER_YEAR + dayOfYear - 1;
  
  const epochDate = new Date(HW_EPOCH_YEAR, HW_EPOCH_MONTH - 1, HW_EPOCH_DAY);
  const resultDate = new Date(epochDate.getTime() + daysFromEpoch * 24 * 60 * 60 * 1000);
  
  return {
    year: resultDate.getFullYear(),
    month: resultDate.getMonth() + 1,
    day: resultDate.getDate()
  };
}

export function getHwanggeukMonthDays(hwYear: number, hwMonth: number): number {
  return HW_MONTH_DAYS[hwMonth - 1];
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

export function getHwanggeukHourGanZhi(year: number, month: number, day: number, hour: number, minute: number): string {
  const daysFromEpoch = getHwanggeukDaysFromEpoch(year, month, day);
  
  let adjustedDaysFromEpoch = daysFromEpoch;
  if (hour >= 23) {
    adjustedDaysFromEpoch = daysFromEpoch + 1;
  }
  
  const dayOffset = ((adjustedDaysFromEpoch % 5) + 5) % 5;
  
  const hourGanZhiTable = [
    ["丁巳","戊午","己未","庚申","辛酉","壬戌","癸亥","甲子","乙丑","丙寅","丁卯","戊辰"],
    ["己巳","庚午","辛未","壬申","癸酉","甲戌","乙亥","丙子","丁丑","戊寅","己卯","庚辰"],
    ["辛巳","壬午","癸未","甲申","乙酉","丙戌","丁亥","戊子","己丑","庚寅","辛卯","壬辰"],
    ["癸巳","甲午","乙未","丙申","丁酉","戊戌","己亥","庚子","辛丑","壬寅","癸卯","甲辰"],
    ["乙巳","丙午","丁未","戊申","己酉","庚戌","辛亥","壬子","癸丑","甲寅","乙卯","丙辰"]
  ];
  
  const timeValue = hour * 100 + minute;
  
  let hourIndex = 0;
  if (timeValue >= 2300 || timeValue < 100) hourIndex = 0;
  else if (timeValue >= 100 && timeValue < 300) hourIndex = 1;
  else if (timeValue >= 300 && timeValue < 500) hourIndex = 2;
  else if (timeValue >= 500 && timeValue < 700) hourIndex = 3;
  else if (timeValue >= 700 && timeValue < 900) hourIndex = 4;
  else if (timeValue >= 900 && timeValue < 1100) hourIndex = 5;
  else if (timeValue >= 1100 && timeValue < 1300) hourIndex = 6;
  else if (timeValue >= 1300 && timeValue < 1500) hourIndex = 7;
  else if (timeValue >= 1500 && timeValue < 1700) hourIndex = 8;
  else if (timeValue >= 1700 && timeValue < 1900) hourIndex = 9;
  else if (timeValue >= 1900 && timeValue < 2100) hourIndex = 10;
  else if (timeValue >= 2100 && timeValue < 2300) hourIndex = 11;
  
  return hourGanZhiTable[dayOffset][hourIndex];
}

const HW_28_MANSIONS = [
  "角", "亢", "氐", "房", "心", "尾", "箕",
  "斗", "牛", "女", "虛", "危", "室", "壁",
  "奎", "婁", "胃", "昴", "畢", "觜", "參",
  "井", "鬼", "柳", "星", "張", "翼", "軫"
];

const HW_28_GENERALS = [
  "鄧禹", "馬成", "吳漢", "王梁", "賈復", "陣俊", "耿弇",
  "杜茂", "寇恂", "傅俊", "岑膨", "堅鐔", "馮異", "王覇",
  "朱佑", "任光", "祭遵", "李忠", "景丹", "万修", "蓋延",
  "邳肜", "銚期", "劉植", "耿純", "藏宮", "馬武", "劉隆"
];

const HW_28_DESCRIPTIONS = [
  "天地之間", "瑞化之造", "珀雨之順", "寵露之功", "玲霜之心", "玉雪之契", "熱薰之序",
  "寒冷之節", "陰氣之理", "陽氣之理", "走獸之迷", "飛禽之殊", "人生之貴", "沙石之極",
  "岩岸之顯", "澤地之幽", "山岳之脉", "江水之精", "四季之土", "三冬之水", "三秋之金",
  "三夏之火", "三春之木", "煙霧之化", "風雲之墟", "河漢之邊", "星辰之道", "日月之位"
];

const HW_28_IMAGES = [
  "_등우", "_마성", "_오한", "_왕량", "_가복", "_진준", "_경감",
  "_두무", "_구순", "_부준", "_잠팽", "_견심", "_풍이", "_왕패",
  "_주우", "_임광", "_제준", "_이충", "_경단", "_만수", "_개연",
  "_비융", "_요기", "_유식", "_경순", "_장궁", "_마무", "_유융"
];

const HW_28_ZUNKOG_MANSIONS = ["星", "尾", "昴", "女"];

export function getHwanggeukDayGanZhi(hwYear: number, hwMonth: number, hwDay: number): string {
  const daysFromHwEpoch = (hwYear - HW_EPOCH_YEAR) * HW_DAYS_PER_YEAR + 
    HW_MONTH_DAYS.slice(0, hwMonth - 1).reduce((a, b) => a + b, 0) + hwDay - 1;
  
  const baseStem = 7;
  const baseBranch = 11;
  const stemIndex = ((baseStem + daysFromHwEpoch) % 10 + 10) % 10;
  const branchIndex = ((baseBranch + daysFromHwEpoch) % 12 + 12) % 12;
  
  return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[branchIndex];
}

export function getHwanggeuk28Mansion(hwYear: number, hwMonth: number, hwDay: number): { 
  mansion: string; 
  general: string;
  description: string;
  image: string;
  isZunkong: boolean;
} {
  const dayGanZhi = getHwanggeukDayGanZhi(hwYear, hwMonth, hwDay);
  
  const mapping = GANJI_TO_MANSION[dayGanZhi];
  
  if (mapping === "中") {
    return { 
      mansion: "中, 星宿尊空", 
      general: "-",
      description: "尊空",
      image: "",
      isZunkong: true
    };
  }
  
  const mansionIndex = mapping as number;
  const mansion = HW_28_MANSIONS[mansionIndex];
  const general = HW_28_GENERALS[mansionIndex];
  const description = HW_28_DESCRIPTIONS[mansionIndex];
  const image = HW_28_IMAGES[mansionIndex];
  
  return { mansion, general, description, image, isZunkong: false };
}

export function getHwanggeukPosition(hwYear: number, hwMonth: number, hwDay: number): string {
  const dayOfYear = HW_MONTH_DAYS.slice(0, hwMonth - 1).reduce((a, b) => a + b, 0) + hwDay;
  
  if (dayOfYear >= 365) {
    return "尊宮";
  }
  
  const n = dayOfYear - 1;
  const step = Math.floor((n * 2) / 9);
  const cycleIndex = ((step % 81) + 81) % 81;
  
  const first = 2 + Math.floor(cycleIndex / 9);
  const second = 2 + (cycleIndex % 9);
  
  if (first === 10 && second === 10) {
    return "10지10/尊宮";
  }
  
  const isTransitionDay = (n % 9) === 4;
  
  if (isTransitionDay) {
    const nextCycleIndex = ((cycleIndex + 1) % 81);
    const nextFirst = 2 + Math.floor(nextCycleIndex / 9);
    const nextSecond = 2 + (nextCycleIndex % 9);
    return `${first}지${second}/${nextFirst}지${nextSecond}`;
  }
  
  return `${first}지${second}`;
}

export function getJeolguk(hwYear: number, hwMonth: number, hwDay: number): {
  name: string;
  periodType: string;
  sogung: number;
  daegung: number;
} {
  const JEOLGUK_START_YEAR = 2025;
  
  const daysFromHwEpoch = (hwYear - HW_EPOCH_YEAR) * HW_DAYS_PER_YEAR + 
    HW_MONTH_DAYS.slice(0, hwMonth - 1).reduce((a, b) => a + b, 0) + hwDay - 1;
  const sogung = (((daysFromHwEpoch % 9) + 9) % 9) + 1;
  const daegung = ((Math.floor(Math.abs(daysFromHwEpoch) / 9) % 9)) + 1;
  
  if (hwYear < JEOLGUK_START_YEAR) {
    const normalizedDays = ((daysFromHwEpoch % 24) + 24) % 24;
    const name = JEOLGUK_NAMES[normalizedDays] + "節局";
    return { name, periodType: "", sogung, daegung };
  }
  
  const periodInMonth = hwDay >= 18 ? 1 : (hwDay >= 3 ? 0 : -1);
  
  let periodIndex: number;
  if (periodInMonth === -1) {
    if (hwMonth === 1) {
      periodIndex = 23;
    } else {
      periodIndex = (hwMonth - 2) * 2 + 1;
    }
  } else {
    periodIndex = (hwMonth - 1) * 2 + periodInMonth;
  }
  
  const yearOffset = hwYear - JEOLGUK_START_YEAR;
  const totalPeriods = yearOffset * 24 + periodIndex;
  
  const jeolgukIndex = ((totalPeriods % 24) + 24) % 24;
  const name = JEOLGUK_NAMES[jeolgukIndex] + "節局";
  
  return { name, periodType: "", sogung, daegung };
}

// 황극력 366일 데이터 (구궁도2.xlsx에서 추출)
// 형식: hwanggeukData[dayIndex][slotIndex] = [sogung, daegung]
// dayIndex: 0-365 (1월 1일 = 0)
// slotIndex: 0-17 (18개 슬롯/일, 80분 간격)
import hwanggeukData from './hwanggeukData.json';

// 슬롯 시작 시간 (분 단위) - 구궁도2.xlsx 헤더 기반
// 슬롯 0 (0시20까지): 23:00 전날 ~ 0:20 당일
// 슬롯 1-8: 0:20 ~ 11:00 (AM)
// 슬롯 9-17: 11:00 ~ 23:00 (PM)
const SLOT_START_MINUTES = [
  -60,   // 슬롯 0: 23:00 (전날, -60으로 표현)
  20,    // 슬롯 1: 0:20
  100,   // 슬롯 2: 1:40
  180,   // 슬롯 3: 3:00
  260,   // 슬롯 4: 4:20
  340,   // 슬롯 5: 5:40
  420,   // 슬롯 6: 7:00
  500,   // 슬롯 7: 8:20
  580,   // 슬롯 8: 9:40
  660,   // 슬롯 9: 11:00
  740,   // 슬롯 10: 12:20
  820,   // 슬롯 11: 13:40
  900,   // 슬롯 12: 15:00
  980,   // 슬롯 13: 16:20
  1060,  // 슬롯 14: 17:40
  1140,  // 슬롯 15: 19:00
  1220,  // 슬롯 16: 20:20
  1300,  // 슬롯 17: 21:40
  1380,  // 다음 슬롯 0 시작 (23:00)
];

function calculateDaegungAndPosition(koreanTime: Date): { daegung: number; sogung: number; position: number; yValue: number; halfDayOfYear: number; totalSlots: number; slotInHalfDay: number } {
  const hours = koreanTime.getHours();
  const minutes = koreanTime.getMinutes();
  const totalMinutesOfDay = hours * 60 + minutes;
  
  // 양력 날짜를 황극력으로 변환
  const year = koreanTime.getFullYear();
  const month = koreanTime.getMonth() + 1;
  const day = koreanTime.getDate();
  
  // 슬롯 인덱스 계산 (시간 기반)
  let slotIndex: number;
  let adjustedYear = year;
  let adjustedMonth = month;
  let adjustedDay = day;
  
  if (totalMinutesOfDay < 20) {
    // 0:00~0:20 = 해당 날짜의 슬롯 0
    slotIndex = 0;
  } else {
    // 0:20 이후: 슬롯 1-17 중 하나
    slotIndex = 0;
    for (let i = 1; i < 18; i++) {
      if (totalMinutesOfDay >= SLOT_START_MINUTES[i] && totalMinutesOfDay < SLOT_START_MINUTES[i + 1]) {
        slotIndex = i;
        break;
      }
    }
    // 21:40~23:00 = 슬롯 17
    if (totalMinutesOfDay >= 1300 && totalMinutesOfDay < 1380) {
      slotIndex = 17;
    }
    // 23:00~24:00 = 다음 날의 슬롯 0
    if (totalMinutesOfDay >= 1380) {
      slotIndex = 0;
      // 다음 날로 조정
      const nextDay = new Date(year, month - 1, day + 1);
      adjustedYear = nextDay.getFullYear();
      adjustedMonth = nextDay.getMonth() + 1;
      adjustedDay = nextDay.getDate();
    }
  }
  
  // 양력 → 황극력 변환
  const hwDate = getHwanggeukDate(adjustedYear, adjustedMonth, adjustedDay);
  
  // 황극력 연중 일자 계산 (1-indexed)
  let hwDayOfYear = hwDate.day;
  for (let m = 0; m < hwDate.month - 1; m++) {
    hwDayOfYear += HW_MONTH_DAYS[m];
  }
  
  // AM/PM 결정
  const isAM = slotIndex >= 1 && slotIndex <= 8;
  
  // 황극력 데이터에서 소궁/대궁 조회 (dayIndex = 황극력 연중 일자 - 1)
  const dayIndex = Math.min(hwDayOfYear - 1, 365);
  const dayData = (hwanggeukData as number[][][])[dayIndex];
  
  let sogung = 6;
  let daegung = 6;
  
  if (dayData && dayData[slotIndex]) {
    sogung = dayData[slotIndex][0] || 6;
    daegung = dayData[slotIndex][1] || 6;
  }
  
  // Position 계산: AM 첫 슬롯(슬롯 1)의 소궁 값이 position
  const amFirstSlot = dayData ? dayData[1] : [6, 6];
  const position = amFirstSlot[0] || 6;
  
  const halfDayOfYear = (hwDayOfYear - 1) * 2 + (isAM ? 0 : 1);
  const totalSlots = dayIndex * 18 + slotIndex;
  const slotInHalfDay = isAM ? slotIndex - 1 : slotIndex - 9;
  const yValue = position;
  
  return { daegung, sogung, position, yValue, halfDayOfYear, totalSlots, slotInHalfDay };
}

export function getSogungDaegung(date: Date): {
  sogung: number;
  daegung: number;
  position: number;
  yValue: number;
  timeSlot: number;
  isAM: boolean;
  remainingMinutes: number;
  isZungung: boolean;
} {
  // 한국 시간으로 변환 (UTC+9)
  const koreanTime = getKoreanTime(date);
  
  // 구궁도3.xls 기반 계산 (12년 사이클 적용)
  const { daegung, sogung, position, yValue, totalSlots } = calculateDaegungAndPosition(koreanTime);
  
  // 시간 슬롯 (1-18): 00:20부터 시작
  // 오전 (1-9차궁): 00:20~11:00
  // 오후 (10-18차궁): 11:00~00:20
  const timeSlot = (((totalSlots % 18) + 18) % 18) + 1;
  const isAM = timeSlot <= 9;
  
  // 남은 시간 계산 (현재 슬롯 내 경과 시간)
  const epochUTC = Date.UTC(2013, 11, 31, 15, 20, 0);
  const minutesFromEpoch = Math.floor((koreanTime.getTime() - epochUTC) / (1000 * 60));
  const minutesInSlot = ((minutesFromEpoch % 80) + 80) % 80;
  const remainingMinutes = 80 - minutesInSlot;
  
  // 중궁 여부 (position 6)
  const isZungung = position === 6;
  
  return { 
    sogung, 
    daegung,
    position,
    yValue,
    timeSlot: Math.min(18, Math.max(1, timeSlot)), 
    isAM, 
    remainingMinutes: Math.max(0, Math.min(80, remainingMinutes)),
    isZungung
  };
}

export function getWeekdayHanja(dayOfWeek: number): string {
  return WEEKDAYS_HANJA[dayOfWeek];
}

// 특정 날짜의 대궁, position 계산 (4.5일 주기 기준)
// 황극력 연도를 기준으로 계산
// 황극력 연말 마지막 1.5일 = 존궁(尊宮)
export function getDaegungPositionForDate(year: number, month: number, day: number): { 
  daegungAM: number; 
  daegungPM: number; 
  positionAM: number; 
  positionPM: number;
  isTransitionDay: boolean;
  isJongungAM: boolean;
  isJongungPM: boolean;
} {
  // 오전 06:00과 오후 18:00 시점 사용
  const amTime = new Date(year, month - 1, day, 6, 0, 0);
  const pmTime = new Date(year, month - 1, day, 18, 0, 0);
  
  // 해당 양력 날짜의 황극력 연도 확인
  const hwDate = getHwanggeukDate(year, month, day);
  const hwYear = hwDate.year;
  
  // 해당 황극력 연도의 시작일 (hwanggeukToSolar로 정확한 양력일 계산)
  const yearStart = hwanggeukToSolar(hwYear, 1, 1);
  const amEpoch = new Date(yearStart.year, yearStart.month - 1, yearStart.day - 1, 23, 0, 0);
  const pmEpoch = amEpoch;
  
  // 다음 황극력 연도 시작일 (존궁 계산용)
  const nextYearStart = hwanggeukToSolar(hwYear + 1, 1, 1);
  const nextEpochDate = new Date(nextYearStart.year, nextYearStart.month - 1, nextYearStart.day - 1, 23, 0, 0);
  
  // 시작점부터 경과한 분 계산
  const amMinutes = Math.floor((amTime.getTime() - amEpoch.getTime()) / (1000 * 60));
  const pmMinutes = Math.floor((pmTime.getTime() - pmEpoch.getTime()) / (1000 * 60));
  
  // 반일(720분) 수 계산
  const halfDayPeriod = 720;
  const amHalfDays = Math.floor(amMinutes / halfDayPeriod);
  const pmHalfDays = Math.floor(pmMinutes / halfDayPeriod);
  
  // 81궁 달력 표시용 오프셋
  // 황극력 1월 1일 = 二之二(原)로 시작해야 함
  const calibrationOffset = 0;  // 대궁: 1월 1일에 2부터 시작
  const positionOffset = 0;     // Position: 1월 1일에 2부터 시작
  
  // 양수 모듈로 함수
  const posMod = (n: number, m: number) => ((n % m) + m) % m;
  
  // 대궁 계산: 9반일(4.5일)마다 변화 (2→3→4→5→6→7→8→9→10)
  const amDaegungCycle = Math.floor(amHalfDays / 9);
  const pmDaegungCycle = Math.floor(pmHalfDays / 9);
  const daegungAM = posMod(amDaegungCycle + calibrationOffset, 9) + 2;
  const daegungPM = posMod(pmDaegungCycle + calibrationOffset, 9) + 2;
  
  // Position 계산: 81반일(40.5일)마다 변화 (2→3→4→5→6→7→8→9→10)
  const amPositionCycle = Math.floor(amDaegungCycle / 9);
  const pmPositionCycle = Math.floor(pmDaegungCycle / 9);
  const positionAM = posMod(amPositionCycle + positionOffset, 9) + 2;
  const positionPM = posMod(pmPositionCycle + positionOffset, 9) + 2;
  
  // 존궁 여부: 황극력 연말 마지막 1.5일 (다음 황극력 1월 1일 직전 36시간)
  const amToNextEpoch = nextEpochDate.getTime() - amTime.getTime();
  const pmToNextEpoch = nextEpochDate.getTime() - pmTime.getTime();
  const oneAndHalfDaysMs = 1.5 * 24 * 60 * 60 * 1000;
  const isJongungAM = amToNextEpoch > 0 && amToNextEpoch <= oneAndHalfDaysMs;
  const isJongungPM = pmToNextEpoch > 0 && pmToNextEpoch <= oneAndHalfDaysMs;
  
  // 전환일 여부
  const isTransitionDay = (daegungAM !== daegungPM) || (positionAM !== positionPM);
  
  return { daegungAM, daegungPM, positionAM, positionPM, isTransitionDay, isJongungAM, isJongungPM };
}

// 특정 날짜의 81궁 이름 조회 (오전/오후 모두 반환)
export function get81PalaceNameForDate(year: number, month: number, day: number): { 
  nameAM: string; 
  namePM: string; 
  isTransitionDay: boolean;
} {
  const { daegungAM, daegungPM, positionAM, positionPM, isTransitionDay } = getDaegungPositionForDate(year, month, day);
  const nameAM = get81PalaceName(positionAM, daegungAM);
  const namePM = get81PalaceName(positionPM, daegungPM);
  return { nameAM, namePM, isTransitionDay };
}

// 특정 날짜의 X之Y 표기 조회 (오전/오후 모두 반환)
export function getPositionDaegungForDate(year: number, month: number, day: number): { 
  positionAM: number; 
  daegungAM: number; 
  positionPM: number;
  daegungPM: number;
  notationAM: string; 
  notationPM: string;
  nameAM: string; 
  namePM: string;
  isTransitionDay: boolean;
  isJongungAM: boolean;
  isJongungPM: boolean;
} {
  const { daegungAM, daegungPM, positionAM, positionPM, isTransitionDay, isJongungAM, isJongungPM } = getDaegungPositionForDate(year, month, day);
  const notationAM = formatPositionDaegungHanja(positionAM, daegungAM);
  const notationPM = formatPositionDaegungHanja(positionPM, daegungPM);
  const nameAM = get81PalaceName(positionAM, daegungAM);
  const namePM = get81PalaceName(positionPM, daegungPM);
  return { positionAM, daegungAM, positionPM, daegungPM, notationAM, notationPM, nameAM, namePM, isTransitionDay, isJongungAM, isJongungPM };
}

const SOGUNG_DAEGUNG_HANJA = ["", "", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

// 81궁 명칭 매핑: [position][대궁] = 명칭
// 81궁 이름은 4.5일(대궁 기간) 동안 고정됨
// X之Y = position之대궁 (소궁은 이름에 영향 없음)
// position: 2-10, 대궁: 2-10 (각각 9개씩 = 81개 조합)
const EIGHTY_ONE_PALACE_NAMES: { [key: string]: string } = {
  // Position 2 (二之X): 대궁 2→10
  "2-2": "原", "2-3": "潛", "2-4": "守", "2-5": "信", "2-6": "直", "2-7": "蒙", "2-8": "閑", "2-9": "須", "2-10": "厲",
  // Position 3 (三之X): 대궁 2→10
  "3-2": "成", "3-3": "沖", "3-4": "振", "3-5": "祈", "3-6": "常", "3-7": "柔", "3-8": "易", "3-9": "親", "3-10": "華",
  // Position 4 (四之X): 대궁 2→10
  "4-2": "見", "4-3": "獲", "4-4": "從", "4-5": "交", "4-6": "育", "4-7": "壯", "4-8": "興", "4-9": "欣", "4-10": "舒",
  // Position 5 (五之X): 대궁 2→10
  "5-2": "比", "5-3": "開", "5-4": "晉", "5-5": "公", "5-6": "益", "5-7": "章", "5-8": "盈", "5-9": "錫", "5-10": "靡",
  // Position 6 (六之X): 대궁 2→10
  "6-2": "庶", "6-3": "決", "6-4": "豫", "6-5": "升", "6-6": "中", "6-7": "伏", "6-8": "過", "6-9": "疑", "6-10": "寡",
  // Position 7 (七之X): 대궁 2→10
  "7-2": "飾", "7-3": "戾", "7-4": "虛", "7-5": "昧", "7-6": "損", "7-7": "用", "7-8": "郤", "7-9": "翕", "7-10": "遠",
  // Position 8 (八之X): 대궁 2→10
  "8-2": "迅", "8-3": "懼", "8-4": "除", "8-5": "弱", "8-6": "疾", "8-7": "競", "8-8": "分", "8-9": "誦", "8-10": "收",
  // Position 9 (九之X): 대궁 2→10
  "9-2": "實", "9-3": "賓", "9-4": "危", "9-5": "堅", "9-6": "革", "9-7": "報", "9-8": "止", "9-9": "戎", "9-10": "結",
  // Position 10 (十之X): 대궁 2→10
  "10-2": "養", "10-3": "遇", "10-4": "勝", "10-5": "囚", "10-6": "任", "10-7": "固", "10-8": "移", "10-9": "墮", "10-10": "終"
};

export function numberToSogungHanja(num: number): string {
  if (num >= 2 && num <= 10) {
    return SOGUNG_DAEGUNG_HANJA[num];
  }
  return num.toString();
}

// X之Y 표기: position之대궁 (이름은 4.5일 동안 고정)
export function formatPositionDaegungHanja(position: number, daegung: number): string {
  return `${numberToSogungHanja(position)}之${numberToSogungHanja(daegung)}`;
}

// 이전 함수명 호환 (deprecated - formatPositionDaegungHanja 사용 권장)
export function formatSogungDaegungHanja(sogung: number, daegung: number): string {
  return `${numberToSogungHanja(sogung)}之${numberToSogungHanja(daegung)}`;
}

// 81궁 이름 조회 (position과 대궁으로 결정, 소궁은 영향 없음)
export function get81PalaceName(position: number, daegung: number): string {
  const key = `${position}-${daegung}`;
  return EIGHTY_ONE_PALACE_NAMES[key] || "";
}

// 용담 팔괘 매핑 (낙서 기반)
// 2=坤, 3=坎, 4=兌, 5=震, 7=巽, 8=艮, 9=離, 10=乾, 1&6=中央
const NUMBER_TO_TRIGRAM: { [key: number]: { name: string; korean: string; element: string; symbol: string } } = {
  1: { name: "中", korean: "중", element: "中", symbol: "○" },  // 중앙
  2: { name: "坤", korean: "곤", element: "地", symbol: "☷" },  // 곤
  3: { name: "坎", korean: "감", element: "水", symbol: "☵" },  // 감
  4: { name: "兌", korean: "태", element: "澤", symbol: "☱" },  // 태
  5: { name: "震", korean: "진", element: "雷", symbol: "☳" },  // 진
  6: { name: "中", korean: "중", element: "中", symbol: "○" },  // 중앙
  7: { name: "巽", korean: "손", element: "風", symbol: "☴" },  // 손
  8: { name: "艮", korean: "간", element: "山", symbol: "☶" },  // 간
  9: { name: "離", korean: "리", element: "火", symbol: "☲" },  // 리
  10: { name: "乾", korean: "건", element: "天", symbol: "☰" }  // 건
};

// 64괘 명칭 매핑 (용담 팔괘 기준)
// 키: "${대궁(하괘)}-${소궁(상괘)}" = 괘명
// 용담 팔괘: 2=坤, 3=坎, 4=兌, 5=震, 7=巽, 8=艮, 9=離, 10=乾
const SIXTY_FOUR_HEXAGRAMS: { [key: string]: { hanja: string; korean: string; fullName: string } } = {
  // 坤 (2=地) 하괘
  "2-2": { hanja: "重坤地", korean: "중곤지", fullName: "重坤地" },
  "2-3": { hanja: "比", korean: "비", fullName: "水地比" },
  "2-4": { hanja: "萃", korean: "췌", fullName: "澤地萃" },
  "2-5": { hanja: "豫", korean: "예", fullName: "雷地豫" },
  "2-7": { hanja: "觀", korean: "관", fullName: "風地觀" },
  "2-8": { hanja: "剝", korean: "박", fullName: "山地剝" },
  "2-9": { hanja: "晉", korean: "진", fullName: "火地晉" },
  "2-10": { hanja: "否", korean: "비", fullName: "天地否" },
  // 坎 (3=水) 하괘
  "3-2": { hanja: "師", korean: "사", fullName: "地水師" },
  "3-3": { hanja: "重坎水", korean: "중감수", fullName: "重坎水" },
  "3-4": { hanja: "困", korean: "곤", fullName: "澤水困" },
  "3-5": { hanja: "解", korean: "해", fullName: "雷水解" },
  "3-7": { hanja: "渙", korean: "환", fullName: "風水渙" },
  "3-8": { hanja: "蒙", korean: "몽", fullName: "山水蒙" },
  "3-9": { hanja: "未濟", korean: "미제", fullName: "火水未濟" },
  "3-10": { hanja: "訟", korean: "송", fullName: "天水訟" },
  // 兌 (4=澤) 하괘
  "4-2": { hanja: "臨", korean: "림", fullName: "地澤臨" },
  "4-3": { hanja: "節", korean: "절", fullName: "水澤節" },
  "4-4": { hanja: "重兌澤", korean: "중태택", fullName: "重兌澤" },
  "4-5": { hanja: "歸妹", korean: "귀매", fullName: "雷澤歸妹" },
  "4-7": { hanja: "中孚", korean: "중부", fullName: "風澤中孚" },
  "4-8": { hanja: "損", korean: "손", fullName: "山澤損" },
  "4-9": { hanja: "睽", korean: "규", fullName: "火澤睽" },
  "4-10": { hanja: "履", korean: "리", fullName: "天澤履" },
  // 震 (5=雷) 하괘
  "5-2": { hanja: "復", korean: "복", fullName: "地雷復" },
  "5-3": { hanja: "屯", korean: "둔", fullName: "水雷屯" },
  "5-4": { hanja: "隨", korean: "수", fullName: "澤雷隨" },
  "5-5": { hanja: "重震雷", korean: "중진뢰", fullName: "重震雷" },
  "5-7": { hanja: "益", korean: "익", fullName: "風雷益" },
  "5-8": { hanja: "頤", korean: "이", fullName: "山雷頤" },
  "5-9": { hanja: "噬嗑", korean: "서합", fullName: "火雷噬嗑" },
  "5-10": { hanja: "無妄", korean: "무망", fullName: "天雷無妄" },
  // 巽 (7=風) 하괘
  "7-2": { hanja: "升", korean: "승", fullName: "地風升" },
  "7-3": { hanja: "井", korean: "정", fullName: "水風井" },
  "7-4": { hanja: "大過", korean: "대과", fullName: "澤風大過" },
  "7-5": { hanja: "恒", korean: "항", fullName: "雷風恒" },
  "7-7": { hanja: "重巽風", korean: "중손풍", fullName: "重巽風" },
  "7-8": { hanja: "蠱", korean: "고", fullName: "山風蠱" },
  "7-9": { hanja: "鼎", korean: "정", fullName: "火風鼎" },
  "7-10": { hanja: "姤", korean: "구", fullName: "天風姤" },
  // 艮 (8=山) 하괘
  "8-2": { hanja: "謙", korean: "겸", fullName: "地山謙" },
  "8-3": { hanja: "蹇", korean: "건", fullName: "水山蹇" },
  "8-4": { hanja: "咸", korean: "함", fullName: "澤山咸" },
  "8-5": { hanja: "小過", korean: "소과", fullName: "雷山小過" },
  "8-7": { hanja: "漸", korean: "점", fullName: "風山漸" },
  "8-8": { hanja: "重艮山", korean: "중간산", fullName: "重艮山" },
  "8-9": { hanja: "旅", korean: "려", fullName: "火山旅" },
  "8-10": { hanja: "遯", korean: "돈", fullName: "天山遯" },
  // 離 (9=火) 하괘
  "9-2": { hanja: "明夷", korean: "명이", fullName: "地火明夷" },
  "9-3": { hanja: "旣濟", korean: "기제", fullName: "水火旣濟" },
  "9-4": { hanja: "革", korean: "혁", fullName: "澤火革" },
  "9-5": { hanja: "豐", korean: "풍", fullName: "雷火豐" },
  "9-7": { hanja: "家人", korean: "가인", fullName: "風火家人" },
  "9-8": { hanja: "賁", korean: "비", fullName: "山火賁" },
  "9-9": { hanja: "重離火", korean: "중리화", fullName: "重離火" },
  "9-10": { hanja: "同人", korean: "동인", fullName: "天火同人" },
  // 乾 (10=天) 하괘
  "10-2": { hanja: "泰", korean: "태", fullName: "地天泰" },
  "10-3": { hanja: "需", korean: "수", fullName: "水天需" },
  "10-4": { hanja: "夬", korean: "쾌", fullName: "澤天夬" },
  "10-5": { hanja: "大壯", korean: "대장", fullName: "雷天大壯" },
  "10-7": { hanja: "小畜", korean: "소축", fullName: "風天小畜" },
  "10-8": { hanja: "大畜", korean: "대축", fullName: "山天大畜" },
  "10-9": { hanja: "大有", korean: "대유", fullName: "火天大有" },
  "10-10": { hanja: "重乾天", korean: "중건천", fullName: "重乾天" }
};

// 중궁(6) 관련 괘 명칭 (용담 팔괘: 2=坤, 3=坎, 4=兌, 5=震, 6=中, 7=巽, 8=艮, 9=離, 10=乾)
const JUNGGUNG_TRIGRAM_NAMES: Record<number, { hanja: string; korean: string }> = {
  2: { hanja: "坤", korean: "곤" },
  3: { hanja: "坎", korean: "감" },
  4: { hanja: "兌", korean: "태" },
  5: { hanja: "震", korean: "진" },
  6: { hanja: "中", korean: "중" },
  7: { hanja: "巽", korean: "손" },
  8: { hanja: "艮", korean: "간" },
  9: { hanja: "離", korean: "리" },
  10: { hanja: "乾", korean: "건" }
};

// 소궁/대궁에서 64괘 명칭 가져오기
// 소궁 = 상괘(위), 대궁 = 하괘(아래)
export function get64HexagramName(sogung: number, daegung: number): { hanja: string; korean: string; fullName: string; lowerTrigram: string; upperTrigram: string } | null {
  // 중궁(6)이 포함된 경우 특수 처리
  // 대궁=6: X지중 (소궁之中)
  // 소궁=6: 중지X (中之대궁)
  if (daegung === 6 && sogung === 6) {
    // 6,6 = 중지중
    return {
      hanja: "重之中",
      korean: "중지중",
      fullName: "重之中",
      lowerTrigram: "中",
      upperTrigram: "中"
    };
  } else if (daegung === 6) {
    // 대궁이 중궁: X지중 (소궁之中)
    const upper = JUNGGUNG_TRIGRAM_NAMES[sogung];
    if (upper) {
      return {
        hanja: `${upper.hanja}之中`,
        korean: `${upper.korean}지중`,
        fullName: `${upper.hanja}之中`,
        lowerTrigram: "中",
        upperTrigram: upper.hanja
      };
    }
    return null;
  } else if (sogung === 6) {
    // 소궁이 중궁: 중지X (中之대궁)
    const lower = JUNGGUNG_TRIGRAM_NAMES[daegung];
    if (lower) {
      return {
        hanja: `中之${lower.hanja}`,
        korean: `중지${lower.korean}`,
        fullName: `中之${lower.hanja}`,
        lowerTrigram: lower.hanja,
        upperTrigram: "中"
      };
    }
    return null;
  }
  
  // 키: 하괘(대궁)-상괘(소궁) 순서
  const key = `${daegung}-${sogung}`;
  const hexagram = SIXTY_FOUR_HEXAGRAMS[key];
  
  if (!hexagram) return null;
  
  const upperTrigram = NUMBER_TO_TRIGRAM[sogung];  // 소궁 = 상괘
  const lowerTrigram = NUMBER_TO_TRIGRAM[daegung]; // 대궁 = 하괘
  
  return {
    ...hexagram,
    lowerTrigram: lowerTrigram?.element || "",
    upperTrigram: upperTrigram?.element || ""
  };
}

// 팔괘 정보 가져오기
export function getTrigramInfo(num: number): { name: string; korean: string; element: string; symbol: string } | null {
  return NUMBER_TO_TRIGRAM[num] || null;
}

export function getHwanggeukYearGanZhi(hwYear: number): string {
  const yearsFromEpoch = hwYear - HW_EPOCH_YEAR;
  const baseYearStem = 5;
  const baseYearBranch = 5;
  const stemIndex = (baseYearStem + yearsFromEpoch + 10) % 10;
  const branchIndex = (baseYearBranch + yearsFromEpoch + 12) % 12;
  return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[branchIndex];
}

export function getHwanggeukMonthGanZhi(hwYear: number, hwMonth: number): string {
  const yearsFromEpoch = hwYear - HW_EPOCH_YEAR;
  const totalMonths = yearsFromEpoch * 12 + hwMonth - 1;
  const baseMonthStem = 7;
  const baseMonthBranch = 9;
  const stemIndex = (baseMonthStem + totalMonths + 100) % 10;
  const branchIndex = (baseMonthBranch + totalMonths + 120) % 12;
  return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[branchIndex];
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
  lunarGanZhi: {
    year: string;
    month: string;
    day: string;
  };
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

export function getLunarGanZhi(year: number, month: number, day: number): { year: string; month: string; day: string } {
  const calendar = new KoreanLunarCalendar();
  
  if (calendar.setSolarDate(year, month, day)) {
    const gapja = calendar.getChineseGapja();
    return {
      year: gapja.year.replace('年', ''),
      month: gapja.month.replace('月', ''),
      day: gapja.day.replace('日', '')
    };
  }
  
  return { year: '-', month: '-', day: '-' };
}

export function getCalendarDayData(year: number, month: number, day: number, hour?: number): CalendarDayData {
  // 23:00 이후면 다음날로 계산
  let adjustedYear = year;
  let adjustedMonth = month;
  let adjustedDay = day;
  if (hour !== undefined && hour >= 23) {
    const nextDate = new Date(year, month - 1, day + 1);
    adjustedYear = nextDate.getFullYear();
    adjustedMonth = nextDate.getMonth() + 1;
    adjustedDay = nextDate.getDate();
  }
  
  const lunar = solarToLunar(adjustedYear, adjustedMonth, adjustedDay);
  // 음력 기반 간지 (korean-lunar-calendar 라이브러리 사용) - 참조용
  const lunarGanZhi = getLunarGanZhi(adjustedYear, adjustedMonth, adjustedDay);
  // 선천력 간지는 절기 기반으로 계산 (23시 기준 날짜 전환)
  const yearGanZhi = getYearGanZhi(adjustedYear, adjustedMonth, adjustedDay);
  const monthGanZhi = getMonthGanZhi(adjustedYear, adjustedMonth, adjustedDay);
  const dayGanZhi = getDayGanZhi(adjustedYear, adjustedMonth, adjustedDay);
  const mansion = get28Mansion(adjustedYear, adjustedMonth, adjustedDay);
  const trigram = get8Trigram(adjustedYear, adjustedMonth, adjustedDay);
  const solarTerm = getSolarTerm(adjustedMonth, adjustedDay);
  const currentTerm = getCurrentSolarTerm(adjustedMonth, adjustedDay);
  const hwanggeuk = getHwanggeukDate(adjustedYear, adjustedMonth, adjustedDay);
  
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
    lunarGanZhi,
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

// 64괘 주역 순번 매핑 (키: "${상괘}-${하괘}", 값: 1~64 순번)
export const HEXAGRAM_ORDER: { [key: string]: number } = {
  "10-10": 1,   // 중천건
  "2-2": 2,     // 중지곤
  "3-5": 3,     // 수뢰둔
  "8-3": 4,     // 산수몽
  "3-10": 5,    // 수천수
  "10-3": 6,    // 천수송
  "2-3": 7,     // 지수사
  "3-2": 8,     // 수지비
  "7-10": 9,    // 풍천소축
  "10-4": 10,   // 천택리
  "2-10": 11,   // 지천태
  "10-2": 12,   // 천지비
  "10-9": 13,   // 천화동인
  "9-10": 14,   // 화천대유
  "2-8": 15,    // 지산겸
  "5-2": 16,    // 뇌지예
  "4-5": 17,    // 택뢰수
  "8-7": 18,    // 산풍고
  "2-4": 19,    // 지택림
  "7-2": 20,    // 풍지관
  "9-5": 21,    // 화뢰서합
  "8-9": 22,    // 산화비
  "8-2": 23,    // 산지박
  "2-5": 24,    // 지뢰복
  "10-5": 25,   // 천뢰무망
  "8-10": 26,   // 산천대축
  "8-5": 27,    // 산뢰이
  "4-7": 28,    // 택풍대과
  "3-3": 29,    // 중수감
  "9-9": 30,    // 중화리
  "4-8": 31,    // 택산함
  "5-7": 32,    // 뇌풍항
  "10-8": 33,   // 천산둔
  "5-10": 34,   // 뇌천대장
  "9-2": 35,    // 화지진
  "2-9": 36,    // 지화명이
  "7-9": 37,    // 풍화가인
  "9-4": 38,    // 화택규
  "3-8": 39,    // 수산건
  "5-3": 40,    // 뢰수해
  "8-4": 41,    // 산택손
  "7-5": 42,    // 풍뢰익
  "4-10": 43,   // 택천쾌
  "10-7": 44,   // 천풍구
  "4-2": 45,    // 택지췌
  "2-7": 46,    // 지풍승
  "4-3": 47,    // 택수곤
  "3-7": 48,    // 수풍정
  "4-9": 49,    // 택화혁
  "9-7": 50,    // 화풍정
  "5-5": 51,    // 중뢰진
  "8-8": 52,    // 중산간
  "7-8": 53,    // 풍산점
  "5-4": 54,    // 뇌택귀매
  "5-9": 55,    // 뇌화풍
  "9-8": 56,    // 화산려
  "7-7": 57,    // 중풍손
  "4-4": 58,    // 중택태
  "7-3": 59,    // 풍수환
  "3-4": 60,    // 수택절
  "7-4": 61,    // 풍택중부
  "5-8": 62,    // 뢰산소과
  "3-9": 63,    // 수화기제
  "9-3": 64,    // 화수미제
};

// 64괘 주역 괘사 및 풀이 데이터
// 키: "${상괘}-${하괘}" (소궁-대궁)
export const HEXAGRAM_INTERPRETATIONS: { [key: string]: { 
  name: string; 
  korean: string; 
  fullName: string;
  description?: string;  // 기본 설명 (괘 구조 설명)
  guasa: string;  // 괘사 (卦辭)
  meaning: string;  // 의미/풀이
  advice: string;  // 조언
  wonmun?: string;  // 원문 (原文) - 효사, 단전, 상전, 문언전 등
} } = {
  // 乾 (10=天) 상괘
  "10-10": { name: "乾", korean: "건", fullName: "重天乾(중천건)", description: "두 개의 소성괘들이 겹쳐서 모두 하늘을 상징하는 건괘이다. 따라서 여섯 효(爻)가 모두 양(陽)으로, 64괘 중 가장 강하고 튼튼한 괘다. 만물의 근본인 하늘과 아버지를 상징한다. 속성은 '위대하다', '크게 통한다', '굳세다'라는 뜻이다.", guasa: "乾 元亨利貞", meaning: "여섯 용이 하늘에 오르는 象. 건(乾)은 힘(Force)을 뜻하며, 창조적인 강한 행위를 의미한다. 두 개의 소성괘 모두 하늘을 상징하며, 여섯 효(爻)가 모두 양(陽)으로 64괘 중 가장 강하고 튼튼한 괘다. 위대한 하늘 군자의 도리로서 크게 통하며, 곧고 바르면 이롭다. 점을 쳐서 이 괘가 나오면 희망은 크게 통할 것이나, 동기가 바르고 그 바름이 지속될 것을 조건으로 한다.", advice: "창조적 힘(Creative Power): 독창성과 폭발적인 영감의 기간. 삶 속의 사건들은 잘 진행될 것이다. 어떤 벤처 사업도 잘 될 것이며, 사람들은 당신의 지도력을 주시할 것이다.",
    wonmun: `【괘사】
乾은 元亨利貞(건은 원형이정)
乾은 元하고 亨하고 利하고 貞하니라(크고 형통하고 이롭고 바르니라).

【효사】
初九는 潛龍이니 勿用이니라(초구는 잠긴 용이니 쓰지 말지니라).

九二는 見龍在田이니 利見大人이니라(구이는 나타난 용이 밭에 있으니 대인을 봄이 이로우니라).

九三은 君子終日乾乾하야 夕惕若하면 厲하나 无咎리라(구삼은 군자가 날이 마치도록 굳세고 굳세어서 저녁에 두려워 하면 위태로우나 허물은 없으리라).

九四는 或躍在淵하면 无咎리라(구사는 혹 뛰어 못에 있으면 허물이 없으리라).

九五는 飛龍在天이니 利見大人이니라(구오는 나는 용이 하늘에 있으니 대인을 봄이 이로우니라).

上九는 亢龍이니 有悔리라(상구는 높은 용이니 뉘우침이 있으리라).

用九는 見群龍호대 无首하면 吉하리라(용구는 뭇용을 보되 머리함이 없으면 길하리라).

【단전(彖傳)】
彖曰 大哉라 乾元이여. 萬物이 資始하나니 乃統天이로다.
(단에 가로되 크도다! 건의 元이여! 만물이 바탕하여 비롯하나니, 이에 하늘을 거느리도다!)

雲行雨施하야 品物이 流形하나니라.
(구름이 행하며 비가 베풀어서 품물이 제각기 흘러 모양을 갖추느니라).

大明終始하면 六位時成하나니 時乘六龍하야 以御天하나니라.
(마침과 비롯함을 크게 밝히면 여섯 位가 때로 이루어지나니 여섯 용을 타서 하늘을 모느니라).

乾道變化애 各正性命하나니 保合大和하야 乃利貞하니라.
(乾의 도가 변하고 화함에 각기 성명을 바루나니, 크게 화함을 보전하고 합해서 이에 이롭고 바르니라).

首出庶物애 萬國이 咸寧하나니라.
(뭇 물건에 머리로 나옴에 만국이 다 편안하느니라).

【상전(象傳)】
象曰 天行이 健하니 君子以하야 自彊不息하나니라.
(상에 가로되 하늘의 운행이 굳건하니, 군자가 이로써 스스로 굳세어 쉬지 않느니라).

潛龍勿用은 陽在下也오(양이 아래에 있음이요),
見龍在田은 德施普也오(덕을 베풀음이 넓음이요),
終日乾乾은 反復道也오(반복함을 도로함이요),
或躍在淵은 進이 无咎也오(나아감이 허물이 없음이요),
飛龍在天은 大人造也오(대인의 지음이요),
亢龍有悔는 盈不可久也오(차서 가히 오래하지 못함이요),
用九는 天德은 不可爲首也라(천덕은 가히 머리하지 못함이라).

【문언전(文言傳)】
文言曰 元者는 善之長也오 亨者는 嘉之會也오 利者는 義之和也오 貞者는 事之幹也니
(문언에 가로되 元은 善의 어른이요, 亨은 아름다움의 모임이요, 利는 의리의 和함이요, 貞은 일의 줄기니),

君子體仁이 足以長人이며 嘉會足以合禮며 利物이 足以和義며 貞固足以幹事니
(군자가 仁을 체득함이 족히 사람을 기르며, 모임을 아름답게 함이 족히 禮에 합하며, 물건을 이롭게 함이 족히 의리에 화합하며, 바르고 굳셈이 족히 일을 주장함이니),

君子行此四德者라 故로 曰乾元亨利貞이라.
(군자가 이 네가지 덕을 행하는지라, 그러므로 가로되 '乾元亨利貞'이라).

初九曰 潛龍勿用은 何謂也오.
子曰 龍德而隱者也니 不易乎世하며 不成乎名하야 遯世無悶하며 不見是而无悶하야 樂則行之하고 憂則違之하야 確乎其不可拔이 潛龍也라.
(공자 말씀하시되 "용의 덕이 숨어 있는 것이니, 세상을 바꾸지 아니하며, 이름을 이루지 아니하여, 세상을 피해 살아도 민망하지 아니하며, 옳음을 알아주지 않아도 민망함이 없어서, 즐거우면 행하고, 근심하면 어겨서, 확고하여 그 가히 뽑을 수 없는 것이 潛龍이라.")

九二曰 見龍在田利見大人은 何謂也오.
子曰 龍德而正中者也니 庸言之信하며 庸行之謹하야 閑邪存其誠하며 善世而不伐하며 德博而化니 易曰見龍在田利見大人이라하니 君德也라.
(공자 말씀하시되 "용의 덕으로 바르고 가운데 함이니, 평상시 말을 미덥게 하며, 행실을 삼가하여, 간사함을 막고 그 정성을 보존하며, 세상을 착하게 해도 자랑하지 않으며, 덕을 넓게 펼쳐 교화시키니, 역에 말하길 '見龍在田利見大人'이라 하니 인군의 덕이라.")

九三曰 君子終日乾乾夕惕若厲无咎는 何謂也오.
子曰 君子進德修業하나니 忠信이 所以進德也오 修辭立其誠이 所以居業也라.
知至至之라 可與幾也며 知終終之라 可與存義也니 是故로 居上位而不驕하며 在下位而不憂하나니 故로 乾乾하야 因其時而惕하면 雖危나 无咎矣리라.
(공자 말씀하시되 "군자가 덕에 나아가며 업을 닦나니 충성되고 미덥게 함이 덕에 나아가는 바요, 말을 닦고 그 정성을 세움이 업에 거하는 바라. 이를 줄을 알고 이르니 더불어 기미 할 수 있으며, 마칠 줄을 알고 마치니 더불어 의리를 보존할 수 있으니, 이런 까닭에 높은 자리에 있어도 교만하지 아니하며 낮은 자리에 있어도 근심하지 않나니, 그러므로 굳세고 굳세게해서 그 때로 인하여 두려워하면 비록 위태하나 허물이 없으리라.")

九四曰 或躍在淵无咎는 何謂也오.
子曰 上下无常이 非爲邪也며 進退无恒이 非離群也라 君子進德修業은 欲及時也니 故로 无咎니라.
(공자 말씀하시되 "오르고 내림에 항상함이 없음이 간사함을 하고자 함이 아니요, 나아가고 물러남에 항상함이 없음이 무리를 떠나려 함이 아니다. '君子進德修業'은 때에 미치고자 함이니, 그러므로 허물이 없느니라.")

九五曰 飛龍在天利見大人은 何謂也오.
子曰 同聲相應하며 同氣相求하야 水流濕하며 火就燥하며 雲從龍하며 風從虎라. 聖人이 作而萬物이 覩하나니 本乎天者는 親上하고 本乎地者는 親下하나니 則各從其類也니라.
(공자 말씀하시되 "같은 소리는 서로 응하며, 같은 기운끼리는 서로 구해서, 물은 젖은 데로 흐르며, 불은 마른 데로 나아가며, 구름은 용을 좇으며, 바람은 범을 따르느니라. 성인이 일어남에 만물이 바라보나니, 하늘에 근본한 것은 위를 친하고, 땅에 근본한 것은 아래를 친하나니 곧 각기 그 類를 따르느니라.")

上九曰 亢龍有悔는 何謂也오.
子曰 貴而无位하며 高而无民하며 賢人이 在下位而无輔라 是以動而有悔也니라.
(공자 말씀하시되 "귀해도 位가 없으며, 높아도 백성이 없으며, 어진 사람이 아래에 있어도 돕는이가 없느니라. 그러므로 움직임에 뉘우침이 있느니라.")

潛龍勿用은 下也오(아래함이요),
見龍在田은 時舍也오(때로 그침이요),
終日乾乾은 行事也오(일을 행함이요),
或躍在淵은 自試也오(스스로를 시험함이요),
飛龍在天은 上治也오(위에서 다스림이요),
亢龍有悔는 窮之災也오(궁해서 재앙이요),
乾元用九는 天下治也라(천하를 다스림이라).

潛龍勿用은 陽氣潛藏이오(양기가 잠겨 감추어짐이요),
見龍在田은 天下文明이오(천하가 문명함이요),
終日乾乾은 與時偕行이오(때로 더불어 함께 행함이요),
或躍在淵은 乾道乃革이오(건도가 이에 바뀜이요),
飛龍在天은 乃位乎天德이오(이에 하늘덕에 자리함이요),
亢龍有悔는 與時偕極이오(때로 더불어 모두 극함이요),
乾元用九는 乃見天則이라(이에 하늘법을 봄이라).

乾元者는 始而亨者也오 利貞者는 性情也라.
('乾元'은 시작해서 형통한 것이요, '利貞'은 性과 情이라).

乾始能以美利로 利天下라 不言所利하니 大矣哉라.
(乾의 시작함이 능히 아름다운 利로써 천하를 이롭게 하니라. 이로운 바를 말하지 아니하니 크도다!)`
  },
  "10-4": { name: "履", korean: "리", fullName: "天澤履(천택리)", description: "위는 하늘[天]이고, 아래는 못[澤]이다. 이(履)는 '밟는다', '따른다', '예절'이라는 뜻이다. 하늘 아래 저수지가 있으니, 지나침과 부족함이 없이 풍요로워 예절을 나타낸다. 의식(衣食)이 풍족해야 예절을 안다는 말에서 이(履)를 괘 이름으로 하였다.", guasa: "履虎尾 不咥人 亨", meaning: "범의 꼬리를 밟은 象. 이(履)는 밟음(Treading), 행위/조치를 뜻한다. 발로 밟다. 실천의 어려움이 있다. 호랑이의 꼬리를 밟아도 사람을 물지 않으니 통한다. 점쳐서 이 괘를 얻으면 앞길에 위험과 불안이 가로놓여 있다. 마음을 부드럽게 하여, 유순히 인내하며 노력하여, 희망을 달성하도록 할 일이다. 교만한 마음으로 자신의 능력을 나타내려 하면 오히려 화를 당한다.", advice: "밟기(Treading): 탐욕적이 된다면 소유할 수 있는 돈보다 더 많은 돈을 잃게 될 것이다. 다른 사람으로부터의 조언이 도움이 되지 못한다. 자신의 이익에 기초해서 조언을 주는 관련자들을 경계하라.",
    wonmun: `【괘사】
履虎尾(이호미) : 호랑이 꼬리를 밟더라도
不咥人亨(불질인형) : 사람을 물지 않으니 형통하리라.

【단전(彖傳)】
彖曰(단왈) : 단에 가로대,
履柔履剛也(이유이강야) : 이는 유가 강에 밟힘이니,
說而應乎乾(열이응호건) : 기쁨으로 건에 응하는지라.
是以履虎尾(시이이호미) : 이로써 호랑이 꼬리를 밟아도
不咥人亨(불질인형) : 물지 않으니 형통함이라.
剛中正(강중정) : 강건하고 중정함으로써
履帝位而不疚(이제위이불구) : 제위(帝位)를 밟아 폐단이 없으니
光明也(광명야) : 광명하리라.

【상전(象傳)】
象曰(상왈) : 상에 가로대,
上天下澤履(상천하택이) : 위는 하늘이고 아래는 못이 있는 이괘의 괘상이니
君子以辯上下(군자이변상하) : 군자가 이로써 위 아래를 분별하여
定民志(정민지) : 백성의 뜻을 정하느니라.

【효사】
初九(초구) : 초구는
素履往無咎(소이왕무구) : 본래대로 밟아 나아가면 허물이 없으리라.

象曰(상왈) : 상에 가로대,
素履之往(소이지왕) : '소이지왕'은
獨行願也(독행원야) : 홀로 원하는 것을 행함이라.

九二(구이) : 구이는
履道坦坦(이도탄탄) : 밟는 도가 탄탄하니,
幽人貞吉(유인정길) : 유인이라야 바르고 길하리라.

象曰(상왈) : 상에 가로대,
幽人貞吉(유인정길) : '유인정길'은
中不自亂也(중불자란야) : 중을 얻어 스스로 어지럽지 않음이라.

六三(육삼) : 육삼은
眇能視(묘능시) : 소경이 능히 보며
跛能履(파능이) : 절름발이가 능히 밟는지라.
履虎尾(이호미) : 호랑이 꼬리를 밟아서
咥人凶(질인흉) : 사람을 무니 흉하고,
武人為于大君(무인위우대군) : 무인이 대군이 되다.

象曰(상왈) : 상에 가로대,
眇能視(묘능시) : '묘능시'는
不足以有明也(불족이유명야) : 족히 밝음이 있지 못함으로써요,
跛能履(파능이) : '파능이'는
不足以與行也(불족이여행야) : 족히 더불어 행하지 못함으로써요.
咥人之凶(질인지흉) : '질인지흉'은
位不當也(위불당야) : 자리가 마땅치 않음이요,
武人為于大君(무인위우대군) : '무인위우대군'은
志剛也(지강야) : 뜻이 강함이라.

九四(구사) : 구사는
履虎尾(이호미) : 호랑이 꼬리를 밟음이니,
愬愬終吉(소소종길) : 조심하고 조심하면 마침내 길하리라.

象曰(상왈) : 상에 가로대,
愬愬終吉(소소종길) : '소소종길'은
志行也(지행야) : 뜻이 행하여짐이라.

九五(구오) : 구오는
夬履貞厲(쾌이정려) : 흔쾌히 밟음이니, 바르더라도 위태하리라.

象曰(상왈) : 상에 가로대,
夬履貞厲(쾌이정려) : '쾌이정려'는
位正當也(위정당야) : 위가 정당함이라.

上九(상구) : 상구는
視履考祥(시이고상) : 밟아온 것을 보아서 상서로운 것을 상고하되
其旋元吉(기선원길) : 그 시행을 두루 잘했으면 크게 길하리라.

象曰(상왈) : 상에 가로대,
元吉在上(원길재상) : 크게 길함이 위에 있음이
大有慶也(대유경야) : 큰 경사가 있음이라.` },
  "10-9": { name: "同人", korean: "동인", fullName: "天火同人", description: "위는 하늘[天]이고, 아래는 불[火]이다. 동인(同人)은 '뜻을 같이 한다', '협력'이라는 뜻이다. 어두운 하늘 아래 불이 타오르며 세상을 밝히는 상이다. 즉 어두운 밤길에 등불을 얻은 상이다. 세상을 밝히는 일은 여러 사람이 힘을 합쳐야 하므로 동인(同人)을 괘 이름으로 하였다.", guasa: "同人于野 亨 利涉大川 利君子貞", meaning: "위는 하늘[天]이고, 아래는 불[火]이다. 동인(同人)은 '뜻을 같이 한다', '협력'이라는 뜻이다. 어두운 하늘 아래 불이 타오르며 세상을 밝히는 상이다. 즉 어두운 밤길에 등불을 얻은 상이다. 세상을 밝히는 일은 여러 사람이 힘을 합쳐야 하므로 동인(同人)을 괘 이름으로 하였다.", advice: "남과 같이 행동하거나 동지(同志)를 만난다.",
    wonmun: `【괘사】
同人于野亨(동인우야형) : 사람을 같이 하는 것을 들에서 하면 형통하리니,
利涉大川(이섭대천) : 큰 내를 건너는 것이 이로우며,
利君子貞(이군자정) : 군자의 바름이 이로우니라.

【단전(彖傳)】
彖曰(단왈) : 단에 가로대,
同人(동인) : 동인은
柔得位得中而應乎乾(유득위득중이응호건) : 유가 위를 얻으며 중을 얻어서 건에 응하니
曰同人(왈동인) : 가로대 동인이니라.
同人曰(동인왈) : 동인에 가로대,
同人于野亨利涉大川(동인우야형이섭대천) : '동인우야형이섭대천'은
乾行也(건행야) : 건장하게 행함이오,
文明以健(문명이건) : 문명함으로써 굳건히 하고
中正而應(중정이응) : 중정해서 응함이
君子正也(군자정야) : 군자의 바름이니,
唯君子為能通天下之志(유군자위능통천하지지) : 오직 군자여야 능히 천하의 뜻을 통하느니라.

【상전(象傳)】
象曰(상왈) : 상에 가로대,
天與火同人(천여화동인) : 하늘과 불이 동인이니
君子以類族辨物(군자이류족변물) : 군자가 이로써 류와 족으로 물건을 분별하느니라.

【효사】
初九(초구) : 초구는
同人于門(동인우문) : 동인을 문에서 함이니
無咎(무구) : 허물이 없으리라.

象曰(상왈) : 상에 가로대,
出門同人(출문동인) : 문에 나가서 동인하는 것을
又誰咎也(우수구야) : 또 누가 허물하리오.

六二(육이) : 육이는
同人于宗吝(동인우종린) : 동인을 종친에서 함이니 인색하도다.

象曰(상왈) : 상에 가로대,
同人于宗(동인우종) : '동인우종'은
吝道也(린도야) : 인색한 도이다.

九三(구삼) : 구삼은
伏戎于莽(복융우망) : 군사를 숲에 매복시키고
升其高陵(승기고릉) : 그 높은 언덕에 올라
三歲不興(삼세불흥) : 3년을 일어나지 못하도다.

象曰(상왈) : 상에 가로대,
伏戎于莽(복융우망) : '복융우망'은
敵剛也(적강야) : 적이 강함이요,
三歲不興(삼세불흥) : '삼세불흥'이니
安行也(안행야) : 어디를 가리오.

九四(구사) : 구사는
乘其墉(승기용) : 그 담에 오르되
弗克攻吉(불극공길) : 능히 치지 아니하니 길하니라.

象曰(상왈) : 상에 가로대,
乘其墉(승기용) : '승기용'은
義弗克也(의불극야) : 의리가 이기지 못함이요,
其吉(기길) : 그 길한 것은
則困而反則也(칙곤이반칙야) : 즉 곤해서 법에 돌아옴이라.

九五(구오) : 구오는
同人先號咷而後笑(동인선호도이후소) : 동인이 먼저는 부르짖고 울고 뒤에는 웃으니,
大師克相遇(대사극상우) : 큰 군사로 이겨야 서로 만나도다.

象曰(상왈) : 상에 가로대,
同人之先(동인지선) : '동인지선'은
以中直也(이중직야) : 가운데하고 곧음으로써요,
大師相遇(대사상우) : '대사상우'는
言相克也(언상극야) : 서로 이김을 말함이라.

上九(상구) : 상구는
同人于郊(동인우교) : 동인을 들에서 함이니
無悔(무회) : 뉘우침이 없으니라.

象曰(상왈) : 상에 가로대,
同人于郊(동인우교) : '동인우교'는
志未得也(지미득야) : 뜻을 얻지 못함이라.` },
  "10-5": { name: "无妄", korean: "무망", fullName: "天雷无妄", description: "위는 하늘[天]이고, 아래는 천둥 우레[雷]다. 무(无)는 '없다'라는 뜻이고, 망(妄)은 '허망하다'는 뜻이다. 하늘에 천둥이 울리니 머지 않아 비가 오겠지만 당장은 아니다. 초조하지 말고 침착하게 때를 기다려야 한다.", guasa: "无妄 元亨 利貞 其匪正 有眚 不利有攸往", meaning: "위는 하늘[天]이고, 아래는 천둥 우레[雷]다. 무(无)는 '없다'라는 뜻이고, 망(妄)은 '허망하다'는 뜻이다. 하늘에 천둥이 울리니 머지 않아 비가 오겠지만 당장은 아니다. 초조하지 말고 침착하게 때를 기다려야 한다.", advice: "욕심 없이 순리대로 행하고 변함이 없어야 좋다." },
  "10-7": { name: "姤", korean: "구", fullName: "天風姤", description: "위는 하늘[天]이고, 아래는 바람[風]이다. 구는 '우연히 만나다', '추하다'라는 뜻이다. 하늘 아래에서 바람이 부니 흩어졌던 구름이 모인다. 만난다는 뜻의 구를 괘 이름으로 하였다. 하나의 음이 다섯 개의 양을 떠받치고 있으니 추하다.", guasa: "姤 女壯 勿用取女", meaning: "위는 하늘[天]이고, 아래는 바람[風]이다. 구는 '우연히 만나다', '추하다'라는 뜻이다. 하늘 아래에서 바람이 부니 흩어졌던 구름이 모인다. 만난다는 뜻의 구를 괘 이름으로 하였다. 하나의 음이 다섯 개의 양을 떠받치고 있으니 추하다.", advice: "우연히 만난다. 기(氣)가 센 여자를 만날 수 있다." },
  "10-3": { name: "訟", korean: "송", fullName: "天水訟(천수송)", description: "위는 하늘[天]이고, 아래는 물[水]이다. 송(訟)은 '다툼', '소송', '재판' 등을 뜻한다. 하늘 아래에 물이 넘치는 상이니 욕심이 지나쳐 마찰과 갈등이 생기고 대립 항쟁하는 형상으로, 괘 이름을 송(訟)으로 하였다.", guasa: "訟 有孚 窒惕 中吉 終凶 利見大人 不利涉大川", meaning: "항해 중에 큰 바람을 만난 象. 송(訟)은 논쟁(Arguing), 충돌(갈등), 소송을 의미한다. 쟁론, 소송, 경쟁의 때이다. 두려워하여 중지하면 길하나 마지막까지 가면 흉하다. 대인을 보니 이롭다. 큰 강을 건너는 것은 이롭지 않다. 모든 일에 장애가 많다. 쟁론을 삼가고, 마음을 부드럽게 하여 성실히 노력하면 난을 면할 수 있다.", advice: "충돌(Conflict): 권위와 힘으로 사람들과 싸우는 것은 긍정적인 결과를 초래하지 못한다. 행동하기 전에 모든 가능한 해법들을 숙고하라. 함께 일하는 사람에 대항하여 의견을 설정하지 마라.",
    wonmun: `【괘사】
訟有孚窒惕中吉終凶(송유부질척중길종흉) : 송은 믿음을 두나 막혀서 두려우니, 중은 길하고 마침은 흉하니
利見大人(이견대인) : 대인을 봄이 이롭고
不利涉大川(불리섭대천) : 큰 내를 건넘이 이롭지 아니하니라.

【단전(彖傳)】
彖曰(단왈) : 단에 가로대
訟上剛下險(송상강하험) : 송은 위는 강하고 아래는 험해서,
險而健訟(험이건송) : 험하여 건장함이 송이다.

訟有孚窒惕中吉(송유부질척중길) : '송유부질척중길'은
剛來而得中也(강래이득중야) : 강이 와서 중을 얻음이오,
終凶(종흉) : '종흉'은
訟不可成也(송불가성야) : 송사는 가히 이루지 못할 것이요,
利見大人(이견대인) : '이견대인'은
尚中正也(상중정야) : 중정함을 숭상함이오,
不利涉大川(불리섭대천) : '불리섭대천'은
入于淵也(입우연야) : 못에 빠짐이라.

【상전(象傳)】
象曰(상왈) : 상에 가로대,
天與水違行訟(천여수위행송) : 하늘과 물이 어긋나게 행함이 송이니,
君子以作事謀始(군자이작사모시) : 군자가 이로써 일을 지음에 처음을 꾀하느니라.

【효사】
初六(초육) : 초육은
不永所事(불영소사) : 일을 길게 끌지 아니하면,
小有言終吉(소유언종길) : 조금 말이 있으나 마침은 길하리라.

象曰(상왈) : 상에 가로대,
不永所事(불영소사) : 일을 길게 끌지 아니하면,
訟不可長也(송불가장야) : 송사는 오래하지 못하는 것이니,
雖小有言其辯明也(수소유언기변명야) : 비록 조금 말이 있으나 그 분별함이 분명하리라.

九二(구이) : 구이는
不克訟(불극송) : 송사를 이기지 못하니,
歸而逋其邑(귀이포기읍) : 그 사는 고을로 돌아가
人三百戶無眚(인삼백호무생) : 읍사람이 300호면 재앙이 없으리라.

象曰(상왈) : 상에 가로대
不克訟歸逋竄也(불극송귀포찬야) : 송사를 이기지 못해서 돌아가 숨으니,
自下訟上患至掇也(자하송상환지철야) : 아래로부터 위를 송사하면, 재환이 이르러도 걷힐 것이다.

六三(육삼) : 육삼은
食舊德貞厲終吉(식구덕정려종길) : 옛 덕을 먹어서 바르게 하면, 위태로우나 마침내 길하리라.
或從王事無成(혹종왕사무성) : 혹 왕의 일을 좇아서 이룸은 없을 것이다.

象曰(상왈) : 상에 가로대,
食舊德從上吉也(식구덕종상길야) : 옛 덕을 먹어서 바르게 하면, 위를 따라도 길하리라.

九四(구사) : 구사는
不克訟(불극송) : 송사를 이기지 못함이라.
復即命渝(부즉명유) : 다시 명에 돌아와 변해야 한다
安貞吉(안정길) : 안정하고 곧으면 길하리라.

象曰(상왈) : 상에 가로대,
復即命渝安貞(부즉명유안정) : '복즉명유안정'은
不失也(불실야) : 잃지 않음이라

九五(구오) : 구오는
訟元吉(송원길) : 송사에 크게 길함이라.

象曰(상왈) : 상에 가로대,
訟元吉(송원길) : 송사에 길함은
以中正也(이중정야) : 중정의 일을 지켰기 때문이다

上九(상구) : 상구는
或錫之鞶帶(혹석지반대) : 혹 이겨서 허리에 두르는 관대를 주더라도,
終朝三褫之(종조삼치지) : 아침이 마치는 짧은 기간에 세번 빼앗기리라.

象曰(상왈) : 상에 가로대,
以訟受服(이송수복) : 송사로써 항복을 받음이,
亦不足敬也(역불족경야) : 또한 족히 공경할 만한 일이 아니기 때문이다.` },
  "10-8": { name: "遯", korean: "돈", fullName: "天山遯", description: "위는 하늘[天]이고, 아래는 산[山]이다. 둔(遯)은 '피하다', '물러나다', '은둔하다'라는 뜻이다. 산이 아무리 높다하더라도 하늘 아래 있다. 이제 물러나라는 뜻에서 둔(遯)을 괘 이름으로 하였다.", guasa: "遯 亨 小利貞", meaning: "위는 하늘[天]이고, 아래는 산[山]이다. 둔(遯)은 '피하다', '물러나다', '은둔하다'라는 뜻이다. 산이 아무리 높다하더라도 하늘 아래 있다. 이제 물러나라는 뜻에서 둔(遯)을 괘 이름으로 하였다.", advice: "숨거나 달아나야 좋은 상(象)." },
  "10-2": { name: "否", korean: "비", fullName: "天地否(천지비)", description: "위는 하늘[天]이고, 아래는 땅[地]이다. 비(否)는 '막히다', '답답하다'라는 뜻이다. 하늘은 하늘대로 위에 있고, 땅은 땅대로 아래에 있다. 천지 화합이 일어나지 않아 막혀 있는 상태다. 답답하다는 뜻으로 비(否)를 괘 이름으로 하였다.", guasa: "否之匪人 不利君子貞 大往小來", meaning: "달이 먹구름 속에 숨는 象. 비(否)는 정체/폐색(Obstruction), 막힘, 천지가 통하지 않는 상태를 뜻한다. 하늘은 하늘대로 위에 있고, 땅은 땅대로 아래에 있다. 천지 화합이 일어나지 않아 막혀 있는 상태다. 음양이 교류하지 못하니 모든 일이 막혀 이루어지지 않는다.", advice: "정체(Stagnation): 막혀서 일이 안 된다. 침체와 정지의 시기다. 진정한 전환이 일어날 때까지 인내심을 가지고 기다려야 한다. 현재의 어려움은 시간이 지나면 해소될 것이다.",
    wonmun: `【괘사】
否之匪人(비지비인) : 비는 사람의 도리가 거부된 것이라
不利君子貞(불리군자정) : 군자의 바름도 이롭지 못하니,
大往小來(대왕소래) : 큰 것이 가고 작은 것이 오느니라.

【단전(彖傳)】
彖曰(단왈) : 단에 가로대,
否之匪人不利君子貞大往小來(비지비인불리군자정대왕소래) : '비지비인불리군자정대왕소래'는
則是天地不交而萬物不通也(칙시천지불교이만물불통야) : 곧 이 천지가 사귀지 못해서 만물이 통하지 아니하며,
上下不交而天下無邦也(상하불교이천하무방야) : 상하가 사귀지 못해서 천하에 나라 없음이라.
內陰而外陽(내음이외양) : 안에는 음이고 밖에는 양이며,
內柔而外剛(내유이외강) : 안에는 유하고 밖에는 강하며,
內小人而外君子(내소인이외군자) : 안에는 소인이요 밖에는 군자니,
小人道長(소인도장) : 소인의 도가 자라나고
君子道消也(군자도소야) : 군자의 도는 사라지느니라.

【상전(象傳)】
象曰(상왈) : 상에 가로대,
天地不交否(천지불교비) : 천지가 사귀지 않는 것이 비괘의 괘상이니,
君子以儉德辟難(군자이검덕벽난) : 군자가 이로써 덕을 검소히 하고 어려움을 피해서
不可榮以祿(불가영이록) : 가히 록 받는 것으로써 영화를 누리지 않느니라.

【효사】
初六(초육) : 초육은
拔茅茹(발모여) : 띠뿌리를 뽑음이라.
以其彙(이기휘) : 그 무리로써
貞吉亨(정길형) : 바름이 길해서 형통하니라.

象曰(상왈) : 상에 가로대,
拔茅貞吉(발모정길) : '발모정길'은
志在君也(지재군야) : 뜻이 임금에 있음이라.

六二(육이) : 육이는
包承(포승) : 포옹하여 이음이니,
小人吉(소인길) : 소인은 길하고
大人否亨(대인비형) : 대인은 비색하니 형통하니라.

象曰(상왈) : 상에 가로대,
大人否亨(대인비형) : '대인비형'은
不亂群也(불란군야) : 무리를 어지럽히지 않음이라.

六三(육삼) : 육삼은
包羞(포수) : 싼 것이 부끄럽도다.

象曰(상왈) : 상에 가로대,
包羞(포수) : '포수'는
位不當也(위불당야) : 위가 마땅치 않음이라.

九四(구사) : 구사는
有命無咎(유명무구) : 명을 두면 허물이 없어서
疇離祉(주리지) : 무리가 복에 걸리리라.

象曰(상왈) : 상에 가로대,
有命無咎(유명무구) : '유명무구'는
志行也(지행야) : 뜻이 행하여 짐이라.

九五(구오) : 구오는
休否(휴비) : 비색한 것을 쉬게 하니라.
大人吉(대인길) : 대인의 길함이니
其亡其亡(기망기망) : 그 망할까 망할까 하여야
繫于苞桑(계우포상) : 우묵한 뽕나무에 매리라.

象曰(상왈) : 상에 가로대,
大人之吉(대인지길) : '대인지길'은
位正當也(위정당야) : 위가 바르고 마땅함이라.

上九(상구) : 상구는
傾否(경비) : 비색한 것이 기울어짐이니,
先否後喜(선비후희) : 먼저는 비색하고 뒤에는 기뻐하리라.

象曰(상왈) : 상에 가로대,
否終則傾(비종칙경) : 비색한 것이 마친 즉 기울어지나니
何可長也(하가장야) : 어찌 가히 길이 하리오.` },
  // 兌 (4=澤) 상괘
  "4-10": { name: "夬", korean: "쾌", fullName: "澤天夬", description: "위는 못[澤]이고, 아래는 하늘[天]이다. 쾌는 '물리친다', '결단한다'는 뜻이다. 아래 다섯 양효가 위에 있는 하나의 음효를 밀어내고 있는 상이니, 쾌(夬)를 괘 이름으로 하였다. 결단을 내릴 때다.", guasa: "夬 揚于王庭 孚號有厲 告自邑 不利卽戎 利有攸往", meaning: "위는 못[澤]이고, 아래는 하늘[天]이다. 쾌는 '물리친다', '결단한다'는 뜻이다. 아래 다섯 양효가 위에 있는 하나의 음효를 밀어내고 있는 상이니, 쾌(夬)를 괘 이름으로 하였다. 결단을 내릴 때다.", advice: "좋은 일이 있으니 결정해야 한다." },
  "4-4": { name: "兌", korean: "태", fullName: "重澤兌", description: "위도 못[澤]이고, 겹쳐서 아래도 못[澤]이다. 태(兌)는 '즐거움', '온화한 분위기'를 뜻한다. 연못에 있는 물은 낮은 곳으로 흐르며 대지에 있는 모든 만물에게 골고루 물을 나누어준다. 베푸는 곳에서 기쁨을 느낄 수 있다.", guasa: "兌 亨 利貞", meaning: "위도 못[澤]이고, 겹쳐서 아래도 못[澤]이다. 태(兌)는 '즐거움', '온화한 분위기'를 뜻한다. 연못에 있는 물은 낮은 곳으로 흐르며 대지에 있는 모든 만물에게 골고루 물을 나누어준다. 베푸는 곳에서 기쁨을 느낄 수 있다.", advice: "좋은 일이 있다. 기쁨의 괘." },
  "4-9": { name: "革", korean: "혁", fullName: "澤火革", description: "위는 못[澤]이고, 아래는 불[火]이다. 혁(革)은 '바꾸다', '혁신하다', '혁명'의 뜻이다. 연못 아래 불이 있다. 물이 끓어 증발하면 큰 변화를 하므로 혁(革)을 괘 이름으로 하였다. 혁은 짐승 가죽이다. 가죽의 털을 벗기면 전혀 다른 것으로 변하기 때문에 '혁명'이라는 의미가 있다.", guasa: "革 已日乃孚 元亨利貞 悔亡", meaning: "위는 못[澤]이고, 아래는 불[火]이다. 혁(革)은 '바꾸다', '혁신하다', '혁명'의 뜻이다. 연못 아래 불이 있다. 물이 끓어 증발하면 큰 변화를 하므로 혁(革)을 괘 이름으로 하였다. 혁은 짐승 가죽이다. 가죽의 털을 벗기면 전혀 다른 것으로 변하기 때문에 '혁명'이라는 의미가 있다.", advice: "변화가 있으니 대비하라." },
  "4-5": { name: "隨", korean: "수", fullName: "澤雷隨", description: "위는 연못[澤]이고, 아래는 우레 천둥[雷]이다. 수(隨)는 '따르다', '순종한다'라는 뜻이다. 수동적이며 종속적인 의미다. 하늘에서 진동해야 할 우레가 연못 아래 있으니, 꼼짝 못하고 연못의 뜻에 따를 수밖에 없어 수(隨)를 괘 이름으로 하였다.", guasa: "隨 元亨 利貞 无咎", meaning: "위는 연못[澤]이고, 아래는 우레 천둥[雷]이다. 수(隨)는 '따르다', '순종한다'라는 뜻이다. 수동적이며 종속적인 의미다. 하늘에서 진동해야 할 우레가 연못 아래 있으니, 꼼짝 못하고 연못의 뜻에 따를 수밖에 없어 수(隨)를 괘 이름으로 하였다.", advice: "순리대로 따라야 한다." },
  "4-7": { name: "大過", korean: "대과", fullName: "澤風大過", description: "위는 못[澤]이고, 아래는 바람[風]이다. 대과(大過)란 정상적인 것에서 크게 벗어나 '지나치다'라는 뜻이다. 잔잔한 못에 바람이 불어 물결이 크게 일어난다. 작은 배가 큰 풍랑을 만났으니, 지나치다라는 뜻에서 대과(大過)를 괘 이름으로 하였다.", guasa: "大過 棟橈 利有攸往 亨", meaning: "위는 못[澤]이고, 아래는 바람[風]이다. 대과(大過)란 정상적인 것에서 크게 벗어나 '지나치다'라는 뜻이다. 잔잔한 못에 바람이 불어 물결이 크게 일어난다. 작은 배가 큰 풍랑을 만났으니, 지나치다라는 뜻에서 대과(大過)를 괘 이름으로 하였다.", advice: "너무 지나치니 조금 참으라." },
  "4-3": { name: "困", korean: "곤", fullName: "澤水困", description: "위는 못[澤]이고, 아래는 물[水]이다. 곤(困)은 '부족하다', '곤궁하다', '괴롭다', '통하지 않는다'라는 뜻이다. 연못 아래에 있는 물이 빠지는 모습이다. 물이 부족하면 만물은 곤궁에 처하게 되므로, 곤(困)을 괘 이름으로 하였다.", guasa: "困 亨 貞 大人吉 无咎 有言不信", meaning: "위는 못[澤]이고, 아래는 물[水]이다. 곤(困)은 '부족하다', '곤궁하다', '괴롭다', '통하지 않는다'라는 뜻이다. 연못 아래에 있는 물이 빠지는 모습이다. 물이 부족하면 만물은 곤궁에 처하게 되므로, 곤(困)을 괘 이름으로 하였다.", advice: "곤경에 빠져 있다." },
  "4-8": { name: "咸", korean: "함", fullName: "澤山咸", description: "위는 못[澤]이고, 아래는 산[山]이다. 함(咸)은 감(感)과 같은 뜻으로 '느낌이 좋다'는 의미다. 젊은 여자를 상징하는 태(兌)괘 아래 젊은 남자를 상징하는 간(艮)괘가 있다. 남녀간의 순수한 사랑을 상징하는 감상적인 의미의 함(咸)이다.", guasa: "咸 亨 利貞 取女吉", meaning: "위는 못[澤]이고, 아래는 산[山]이다. 함(咸)은 감(感)과 같은 뜻으로 '느낌이 좋다'는 의미다. 젊은 여자를 상징하는 태(兌)괘 아래 젊은 남자를 상징하는 간(艮)괘가 있다. 남녀간의 순수한 사랑을 상징하는 감상적인 의미의 함(咸)이다.", advice: "서로 사랑을 느낀다. 감응의 괘." },
  "4-2": { name: "萃", korean: "췌", fullName: "澤地萃", description: "위는 못[澤]이고, 아래는 땅[地]이다. 췌(萃)는 '모인다'라는 뜻이다. 땅 위에 연못이 있으면 물이 모인다. 모인다는 뜻의 췌(萃)를 괘 이름으로 하였다.", guasa: "萃 王假有廟 利見大人 亨 利貞 用大牲吉 利有攸往", meaning: "위는 못[澤]이고, 아래는 땅[地]이다. 췌(萃)는 '모인다'라는 뜻이다. 땅 위에 연못이 있으면 물이 모인다. 모인다는 뜻의 췌(萃)를 괘 이름으로 하였다.", advice: "모인다. 무성하다. 경쟁에서 이긴다." },
  // 離 (9=火) 상괘
  "9-10": { name: "大有", korean: "대유", fullName: "火天大有", description: "위는 불[火]이고, 아래는 하늘[天]이다. 대유(大有)는 '크게 만족하여 즐거워하는 상태'를 말한다. 하늘의 불인 태양이 온 천하를 비추는 상이다. 즉 해가 중천에 떠 빛나는 상이니, 천하를 소유한다는 의미의 대유(大有)를 괘 이름으로 하였다.", guasa: "大有 元亨", meaning: "위는 불[火]이고, 아래는 하늘[天]이다. 대유(大有)는 '크게 만족하여 즐거워하는 상태'를 말한다. 하늘의 불인 태양이 온 천하를 비추는 상이다. 즉 해가 중천에 떠 빛나는 상이니, 천하를 소유한다는 의미의 대유(大有)를 괘 이름으로 하였다.", advice: "크게 소유한다. 지금 당장 적극적으로 일을 시작해야 한다.",
    wonmun: `【괘사】
大有(대유) : 대유는
元亨(원형) : 크게 형통하니라.

【단전(彖傳)】
彖曰(단왈) : 단에 가로대,
大有(대유) : 대유는
柔得尊位大中(유득존위대중) : 부드러운 것이 존귀한 위를 얻고 크게 중정의 효에 위치하여
而上下應之曰大有(이상하응지왈대유) : 상하의 효들이 잘 호응하여 대유라 하니,
其德剛健而文明(기덕강건이문명) : 그 덕이 강건해서 문명하고,
應乎天而時行(응호천이시행) : 하늘에 응하여 때로 행함이라.
是以元亨(시이원형) : 이로써 형통하니라.

【상전(象傳)】
象曰(상왈) : 상에 가로대,
火在天上(화재천상) : 불이 하늘 위에 있는 것이
大有(대유) : 대유니,
君子以遏惡揚善(군자이알악양선) : 군자가 이로써 악한 것을 막고 선한 것을 드날려서
順天休命(순천휴명) : 하늘의 아름다운 명을 따르느니라.

【효사】
初九(초구) : 초구는
無交害(무교해) : 해로운 데에 사귐이 없으니
匪咎(비구) : 허물이 아니나,
艱則無咎(간칙무구) : 어렵게 해야 곧 허물이 없으리라.

象曰(상왈) : 상에 가로대,
大有初九(대유초구) : '대유초구'는
無交害也(무교해야) : 해로운데 사귐이 없느니라.

九二(구이) : 구이는
大車以載(대거이재) : 큰 수레로써 실음이니
有攸往(유유왕) : 갈 바를 두어
無咎(무구) : 허물이 없으리라.

象曰(상왈) : 상에 가로대,
大車以載(대거이재) : '대거이재'는
積中不敗也(적중불패야) : 가운데 쌓아서 패하지 않음이라.

九三(구삼) : 구삼은
公用亨于天子(공용형우천자) : 공이 천자에게 바침이니,
小人弗克(소인불극) : 소인은 능하지 못하느니라.

象曰(상왈) : 상에 가로대,
公用亨于天子(공용형우천자) : '공용형우천자'는
小人害也(소인해야) : 소인은 해로우리라.

九四(구사) : 구사는
匪其彭(비기팽) : 성대히 하지 아니하면
無咎(무구) : 허물이 없으리라.

象曰(상왈) : 상에 가로대,
匪其彭無咎(비기팽무구) : '비기팽무구'는
明辨晢也(명변철야) : 밝게 분별하는 지혜라.

六五(육오) : 육오는
厥孚交如(궐부교여) : 믿음있게 사귀니
威如吉(위여길) : 위엄이 있으면 길하리라.

象曰(상왈) : 상에 가로대,
厥孚交如(궐부교여) : '궐부교여'는
信以發志也(신이발지야) : 믿음으로써 뜻을 발함이요,
威如之吉(위여지길) : '위여지길'은
易而無備也(이이무비야) : 쉽게 하면 갖추지 못함이라.

上九(상구) : 상구는
自天祐之(자천우지) : 하늘로부터 돕는지라.
吉無不利(길무불리) : 길하여 이롭지 않음이 없도다.

象曰(상왈) : 상에 가로대,
大有上吉(대유상길) : '대유상길'은
自天祐也(자천우야) : 하늘로부터 도움이라.` },
  "9-4": { name: "睽", korean: "규", fullName: "火澤睽", description: "위에는 불[火]이고, 아래는 못[澤]이다. 규는 '서로 등지다', '노려보다', '사팔눈'이라는 뜻이다. 불은 타오르면서 위로 올라가고, 연못의 물은 낮은 쪽으로 흘러간다. 서로 등져 어긋나 떨어지므로 규(睽)를 괘 이름으로 하였다.", guasa: "暌 小事吉", meaning: "위에는 불[火]이고, 아래는 못[澤]이다. 규는 '서로 등지다', '노려보다', '사팔눈'이라는 뜻이다. 불은 타오르면서 위로 올라가고, 연못의 물은 낮은 쪽으로 흘러간다. 서로 등져 어긋나 떨어지므로 규(睽)를 괘 이름으로 하였다.", advice: "일그러지고 불화가 있는 격. 동상이몽(同床異夢)." },
  "9-9": { name: "離", korean: "리", fullName: "重火離", description: "위도 불[火]이고, 겹쳐서 아래도 불[火]이다. 불 두 개가 겹쳐있으니 화(火)를 괘 이름으로 하였다. 불 두 개는 태양을 상징하며, 정열과 왕성한 의욕을 뜻한다.", guasa: "離 利貞 亨 畜牝牛吉", meaning: "위도 불[火]이고, 겹쳐서 아래도 불[火]이다. 불 두 개가 겹쳐있으니 화(火)를 괘 이름으로 하였다. 불 두 개는 태양을 상징하며, 정열과 왕성한 의욕을 뜻한다.", advice: "불이 훨훨 타고 있는 상으로 천하 태평한 괘." },
  "9-5": { name: "噬嗑", korean: "서합", fullName: "火雷噬嗑", description: "위는 불[火]이고, 아래는 천둥 우레[雷]다. 서합에서 서는 '씹다'라는 뜻이고, 합은 '입을 다물다'라는 뜻이다. 그러므로 서합은 '음식을 입안에 넣고 씹는다'는 의미다. 불과 우레가 만나면 천지를 진동하니, 격렬한 언쟁과 싸움에 휘말릴 수 있다.", guasa: "噬嗑 亨 利用獄", meaning: "위는 불[火]이고, 아래는 천둥 우레[雷]다. 서합에서 서는 '씹다'라는 뜻이고, 합은 '입을 다물다'라는 뜻이다. 그러므로 서합은 '음식을 입안에 넣고 씹는다'는 의미다. 불과 우레가 만나면 천지를 진동하니, 격렬한 언쟁과 싸움에 휘말릴 수 있다.", advice: "고기와 모래를 같이 저작하는 격. 순리대로 따르면 길함." },
  "9-7": { name: "鼎", korean: "정", fullName: "火風鼎", description: "위는 불[火]이고, 아래는 바람[風]이다. 정(鼎)은 '발이 셋인 솥', '안정감'을 뜻한다. 불 밑에 바람이 불고 있는 상이니 음식을 만들기 위해 아궁이에 불을 지피는 모습이다. 음식을 만드는 솥을 뜻하는 정(鼎)을 괘 이름으로 하였다.", guasa: "鼎 元吉 亨", meaning: "위는 불[火]이고, 아래는 바람[風]이다. 정(鼎)은 '발이 셋인 솥', '안정감'을 뜻한다. 불 밑에 바람이 불고 있는 상이니 음식을 만들기 위해 아궁이에 불을 지피는 모습이다. 음식을 만드는 솥을 뜻하는 정(鼎)을 괘 이름으로 하였다.", advice: "조건이 구비되었으니 협력하면 대길(大吉)." },
  "9-3": { name: "未濟", korean: "미제", fullName: "火水未濟", description: "위는 불[火]이고, 아래는 물[水]이다. 미제(未濟)란 '아직 건너지 않았다', '미완성'을 뜻한다. 불과 물이 각기 제자리에 있기 때문에 미제(未濟)를 괘 이름으로 하였다.", guasa: "未濟 亨 小狐汔濟 濡其尾 无攸利", meaning: "위는 불[火]이고, 아래는 물[水]이다. 미제(未濟)란 '아직 건너지 않았다', '미완성'을 뜻한다. 불과 물이 각기 제자리에 있기 때문에 미제(未濟)를 괘 이름으로 하였다.", advice: "아직 어려운 상태에 있지만 노력하면 가능하다." },
  "9-8": { name: "旅", korean: "려", fullName: "火山旅", description: "위는 불[火]이고, 아래는 산[山]이다. 여(旅)는 '여행', '집과 고향을 떠나 낯선 곳으로 가는 것', '방황하는 나그네'를 뜻한다. 태양이 산에서 떠서 산으로 지는 것은 나그네의 여정과 같으므로 여(旅)를 괘 이름으로 하였다.", guasa: "旅 小亨 旅貞吉", meaning: "위는 불[火]이고, 아래는 산[山]이다. 여(旅)는 '여행', '집과 고향을 떠나 낯선 곳으로 가는 것', '방황하는 나그네'를 뜻한다. 태양이 산에서 떠서 산으로 지는 것은 나그네의 여정과 같으므로 여(旅)를 괘 이름으로 하였다.", advice: "나그네처럼 고달프고 외롭지만 얻는 것도 있음." },
  "9-2": { name: "晉", korean: "진", fullName: "火地晉", description: "위는 불[火]이고, 아래는 땅[地]이다. 진(晋)은 '나아가다', '전진하다'라는 뜻이다. 불인 태양이 지상 위로 떠오르면서 점점 밝아진다. 나아간다는 의미에서 진(晋)을 괘 이름으로 하였다.", guasa: "晉 康侯 用錫馬蕃庶 晝日三接", meaning: "위는 불[火]이고, 아래는 땅[地]이다. 진(晋)은 '나아가다', '전진하다'라는 뜻이다. 불인 태양이 지상 위로 떠오르면서 점점 밝아진다. 나아간다는 의미에서 진(晋)을 괘 이름으로 하였다.", advice: "밝은 태양이 솟아오른다. 나아감의 괘." },
  // 震 (5=雷) 상괘
  "5-10": { name: "大壯", korean: "대장", fullName: "雷天大壯", description: "위는 천둥 우레[雷]고, 아래는 하늘[天]이다. 대장(大壯)은 '힘차다', '성대하다', '씩씩하다'라는 뜻이다. 하늘 위에서 우레가 움직이고 있으므로 힘차고 씩씩하다는 뜻에서 대장(大壯)을 괘 이름으로 하였다.", guasa: "大壯 利貞", meaning: "위는 천둥 우레[雷]고, 아래는 하늘[天]이다. 대장(大壯)은 '힘차다', '성대하다', '씩씩하다'라는 뜻이다. 하늘 위에서 우레가 움직이고 있으므로 힘차고 씩씩하다는 뜻에서 대장(大壯)을 괘 이름으로 하였다.", advice: "크게 번창하고 왕성하게 진행한다." },
  "5-4": { name: "歸妹", korean: "귀매", fullName: "雷澤歸妹", description: "위는 천둥 우레[雷]고, 아래는 못[澤]이다. 귀매(歸妹)는 '정상적이지 못한 결혼'이라는 뜻이다. 위는 나이든 남자를 상징하는 진괘고, 아래는 어린 여자를 상징하는 태괘다. 젊은 여자가 음란한 소질이 있어 중년 남자와 만나니 정상적이지 못하다는 뜻에서 귀매(歸妹)를 괘 이름으로 하였다.", guasa: "歸妹 征凶 无攸利", meaning: "위는 천둥 우레[雷]고, 아래는 못[澤]이다. 귀매(歸妹)는 '정상적이지 못한 결혼'이라는 뜻이다. 위는 나이든 남자를 상징하는 진괘고, 아래는 어린 여자를 상징하는 태괘다. 젊은 여자가 음란한 소질이 있어 중년 남자와 만나니 정상적이지 못하다는 뜻에서 귀매(歸妹)를 괘 이름으로 하였다.", advice: "소녀가 나이 많은 남자에게 시집가는 형." },
  "5-9": { name: "豐", korean: "풍", fullName: "雷火豐", description: "위는 천둥 우레[雷]이고, 아래는 불[火]이다. 풍(豊)은 '풍성하다'라는 뜻이다. 천둥 우레가 치고 비가 내린 후 햇볕이 밝게 빛나는 모습이다. 만물이 성장하여 풍성한 결실을 맺는다는 뜻에서 풍(豊)을 괘 이름으로 하였다.", guasa: "豐 亨 王假之 勿憂 宜日中", meaning: "위는 천둥 우레[雷]이고, 아래는 불[火]이다. 풍(豊)은 '풍성하다'라는 뜻이다. 천둥 우레가 치고 비가 내린 후 햇볕이 밝게 빛나는 모습이다. 만물이 성장하여 풍성한 결실을 맺는다는 뜻에서 풍(豊)을 괘 이름으로 하였다.", advice: "풍족하다. 번영을 상징한다." },
  "5-5": { name: "震", korean: "진", fullName: "重雷震", description: "위도 천둥 우레[雷]고, 겹쳐서 아래도 천둥 우레[雷]다. 뇌(雷)는 '천둥 우레', '몹시 두려워하다', '사나운 모양', '위엄을 떨치다'를 뜻한다. 우레가 크게 진동하니 많은 사람들이 놀라 두려워한다.", guasa: "震 亨 震來虩虩 笑言啞啞 震驚百里 不喪匕鬯", meaning: "위도 천둥 우레[雷]고, 겹쳐서 아래도 천둥 우레[雷]다. 뇌(雷)는 '천둥 우레', '몹시 두려워하다', '사나운 모양', '위엄을 떨치다'를 뜻한다. 우레가 크게 진동하니 많은 사람들이 놀라 두려워한다.", advice: "크게 놀랄 일이 있을 수 있음. 소리만 요란하고 실속없는 괘." },
  "5-7": { name: "恒", korean: "항", fullName: "雷風恒", description: "위는 천둥 우레[雷]고, 아래는 바람[風]이다. 항(恒)은 '변함이 없다', '한결같이 계속 된다'라는 뜻이다. 장남이 장녀 위에 있다. 남편이 위에 있고 아내는 아래에 있는 상이다. 그 법도가 한결같다는 뜻에서 항(恒)을 괘 이름으로 하였다.", guasa: "恒 亨 无咎 利貞 利有攸往", meaning: "위는 천둥 우레[雷]고, 아래는 바람[風]이다. 항(恒)은 '변함이 없다', '한결같이 계속 된다'라는 뜻이다. 장남이 장녀 위에 있다. 남편이 위에 있고 아내는 아래에 있는 상이다. 그 법도가 한결같다는 뜻에서 항(恒)을 괘 이름으로 하였다.", advice: "좋은 일이 많다. 항상함의 괘." },
  "5-3": { name: "解", korean: "해", fullName: "雷水解", description: "위는 천둥 우레[雷]이고, 아래는 물[水]이다. 해(解)는 '해결되다', '해소된다', '풀린다'라는 뜻이다. 천둥이 진동하여 비를 내리니 얼어붙었던 대지가 풀린다. 봄을 의미하므로, 해(解)를 괘 이름으로 하였다.", guasa: "解 利西南 无所往 其來復吉 有攸往 夙吉", meaning: "위는 천둥 우레[雷]이고, 아래는 물[水]이다. 해(解)는 '해결되다', '해소된다', '풀린다'라는 뜻이다. 천둥이 진동하여 비를 내리니 얼어붙었던 대지가 풀린다. 봄을 의미하므로, 해(解)를 괘 이름으로 하였다.", advice: "어려운 일이 풀린다." },
  "5-8": { name: "小過", korean: "소과", fullName: "雷山小過", description: "위는 천둥 우레[雷]이고, 아래는 산[山]이다. 소과(小過)는 '조금 지나치다'라는 뜻이다. 상괘와 하괘가 등을 지고 있다. 음이 양에 비해 약간 많다는 의미에서 조금 지나치다라는 뜻의 소과(小過)를 괘 이름으로 하였다.", guasa: "小過 亨 利貞 可小事 不可大事 飛鳥遺之音 不宜上 宜下 大吉", meaning: "위는 천둥 우레[雷]이고, 아래는 산[山]이다. 소과(小過)는 '조금 지나치다'라는 뜻이다. 상괘와 하괘가 등을 지고 있다. 음이 양에 비해 약간 많다는 의미에서 조금 지나치다라는 뜻의 소과(小過)를 괘 이름으로 하였다.", advice: "일이 조금 지나치니 조심하라." },
  "5-2": { name: "豫", korean: "예", fullName: "雷地豫", description: "위는 우뢰 천둥[雷]이고, 아래는 땅[地]이다. 예(豫)는 '예측한다'라는 뜻이다. 땅 위에서 천둥 번개가 치면 비가 내리는 것을 예측할 수 있으므로, 예(豫)를 괘 이름으로 하였다.", guasa: "豫 利建侯行師", meaning: "위는 우뢰 천둥[雷]이고, 아래는 땅[地]이다. 예(豫)는 '예측한다'라는 뜻이다. 땅 위에서 천둥 번개가 치면 비가 내리는 것을 예측할 수 있으므로, 예(豫)를 괘 이름으로 하였다.", advice: "앞으로 좋은 일이 있으니 준비하라." },
  // 巽 (7=風) 상괘
  "7-10": { name: "小畜", korean: "소축", fullName: "風天小畜(풍천소축)", description: "위는 바람[風]이고, 아래는 하늘[天]이다. 축(畜)은 '기르다', '저축하다'라는 뜻이다. 하늘 위에서 바람이 부는 모습이니, 비가 내리기 전의 상황을 상징한다. 비가 오면 생명체는 그 비를 저장한다. 까닭에 저축한다는 의미로 축(畜)을 괘 이름으로 하였다.", guasa: "小畜 亨 密雲不雨 自我西郊", meaning: "옥이 진흙 속에 묻혀 있는 象. 소축(小畜)은 적은 축적(Small Accumulating), 적은 수를 길들이는 힘, 적은 수확을 뜻한다. 작은 정지와 작은 축적의 때다. 일이 생각대로 진행되지 않는다. 작은 일은 성취할 수 있지만, 분수에 지나친 큰일은 방해가 있어 성취하지 못한다. 그러나 곧 개운의 때가 가까워 오니 노력을 계속하며 때가 이르기를 기다릴 일이다.", advice: "삼감(Restrained): 이번에 돈에 매우 주의를 기울여라. 별로 중요하다고 생각지 않은 일이 앞으로 나아가는 것을 가로막고 있다. 침체되거나 슬퍼하게 되기 쉽다. 행복하게 만들 수 있는 일들을 하라. 그러나 너무 많은 비용을 치르지는 마라.",
    wonmun: `【괘사】
小畜亨(소축형) : 소축은 형통하니
密雲不雨(밀운불우) : 빽빽한 구름에 비가 오지 않은 것은
自我西郊(자아서교) : 우리 서쪽 교외에 머물러있다.

【단전(彖傳)】
彖曰(단왈) : 단에 가로대,
小畜(소축) : 소축은
柔得位(유득위) : 유(柔)가 제자리를 얻음에
而上下應之曰小畜(이상하응지왈소축) : 위와 아래가 응하니 소축이라 하니라.

健而巽(건이손) : 굳건하고 겸손하며,
剛中而志行(강중이지행) : 강한 것이 중도를 얻어 뜻이 행해지니
乃亨(내형) : 형통하니라.

密雲不雨(밀운불우) : 빽빽한 구름이 비를 내리지 않음은
尙往也(상왕야) : 여전히 진행 중이요
自我西郊(자아서교) : '자아서교'는 우리 서쪽 교외에 머물러 있다고 함은
施未行也(시미행야) : 베풂이 행하여지지 않음이라.

【상전(象傳)】
象曰(상왈) : 상에 가로대,
風行天上小畜(풍행천상소축) : 바람이 하늘 위에 행하는 것이 소축괘 상이니
君子以懿文德(군자이의문덕) : 군자가 이것으로써 문덕을 아름답게 하느니라.

【효사】
初九(초구) : 초구는
復自道(부자도) : 회복함을 도로부터 함이니,
何其咎(하기구) : 무엇이 그 허물이리오.
吉(길) : 길하니라.

象曰(상왈) : 상에 가로대,
復自道(부자도) : '복자도'는
其義吉也(기의길야) : 그 뜻이 길하니라.

九二(구이) : 구이는
牽復吉(견부길) : 이끌어서 회복함이 길하니라.

象曰(상왈) : 상에 가로대,
牽復在中(견부재중) : '견복'은 가운데 있음이라.
亦不自失也(역불자실야) : 또한 스스로 잃지 않음이라.

九三(구삼) : 구삼은
輿說輻(여설복) : 수레의 바퀴살을 벗김이며,
夫妻反目(부처반목) : 부부가 반목함이로다.

象曰(상왈) : 상에 가로대,
夫妻反目(부처반목) : '부처반목'은
不能正室也(불능정실야) : 능히 집을 바로 하지 못하느니라.

六四(육사) : 육사는
有孚血去(유부혈거) : 믿음을 두면, 피가 사라져가고
惕出無咎(척출무구) : 두려운데서 나와서 허물이 없으리라.

象曰(상왈) : 상에 가로대,
有孚惕出(유부척출) : '유부척출'은
上合志也(상합지야) : 위와 뜻이 합함이라.

九五(구오) : 구오는
有孚攣如(유부련여) : 믿음을 갖고 서로 이끌고
富以其鄰(부이기린) : 부를 그 이웃과 같이 하다.

象曰(상왈) : 상에 가로대,
有孚攣如(유부련여) : '유부연여'는
不獨富也(불독부야) : 홀로 부하지 않음이라.

上九(상구) : 상구는
既雨既處(기우기처) : 이미 비오고 이미 그침은
尚德載(상덕재) : 덕을 숭상하여 실음이니
婦貞厲(부정려) : 지어미가 너무 고집하면 위태하리라.
月幾望(월기망) : 달이 거의 보름이니
君子征凶(군자정흉) : 군자가 집 떠나가면 흉하리라.

象曰(상왈) : 상에 가로대,
既雨既處(기우기처) : '기우기처'는
德積載也(덕적재야) : 덕이 쌓여서 가득 참이요,
君子征凶(군자정흉) : '군자정흉'은
有所疑也(유소의야) : 의심할 바가 있음이라.` },
  "7-4": { name: "中孚", korean: "중부", fullName: "風澤中孚", description: "위는 바람[風]이고, 아래는 연못[澤]이다. 중부(中孚)는 '어미 새가 알을 품어 따뜻하게 한다'는 뜻이다. 가운데 두 음효는 노른자이고 바깥 양효는 흰자와 껍데기를 나타내니 알의 모양을 뜻한다. 상괘와 하괘가 입을 맞춘 듯 대칭을 이룬다. 한 몸으로 결합되어 마치 어미 새가 알을 품고 있는 상이므로, 중부(中孚)를 괘 이름으로 하였다.", guasa: "中孚 豚魚吉 利涉大川 利貞", meaning: "위는 바람[風]이고, 아래는 연못[澤]이다. 중부(中孚)는 '어미 새가 알을 품어 따뜻하게 한다'는 뜻이다. 가운데 두 음효는 노른자이고 바깥 양효는 흰자와 껍데기를 나타내니 알의 모양을 뜻한다. 상괘와 하괘가 입을 맞춘 듯 대칭을 이룬다. 한 몸으로 결합되어 마치 어미 새가 알을 품고 있는 상이므로, 중부(中孚)를 괘 이름으로 하였다.", advice: "새가 알을 품듯이 정성을 다하면 결과가 좋다." },
  "7-9": { name: "家人", korean: "가인", fullName: "風火家人", description: "위는 바람[風]이고, 아래는 불[火]이다. 가인(家人)은 '집을 지키는 사람'을 뜻한다. 위는 장녀(長女)고, 아래는 중녀(中女)다. 동생이 언니 아래 있어 그 뜻을 따르니 일가(一家)가 편안히 다스려진다는 의미에서 가인(家人)을 괘 이름으로 하였다.", guasa: "家人 利女貞", meaning: "위는 바람[風]이고, 아래는 불[火]이다. 가인(家人)은 '집을 지키는 사람'을 뜻한다. 위는 장녀(長女)고, 아래는 중녀(中女)다. 동생이 언니 아래 있어 그 뜻을 따르니 일가(一家)가 편안히 다스려진다는 의미에서 가인(家人)을 괘 이름으로 하였다.", advice: "집안이 화목해지고 있다. 여자들이 애를 쓰고 있다." },
  "7-5": { name: "益", korean: "익", fullName: "風雷益", description: "위는 바람[風]이고 아래는 천둥 우레[雷]다. 익(益)은 '더하다', '증가하다', '이익이다'라는 뜻이다. 바람이 불고 천둥이 치니 비가 온다. 비는 골고루 만물을 적셔 유익함을 주기 때문에 익(益)을 괘 이름으로 하였다.", guasa: "益 利有攸往 利涉大川", meaning: "위는 바람[風]이고 아래는 천둥 우레[雷]다. 익(益)은 '더하다', '증가하다', '이익이다'라는 뜻이다. 바람이 불고 천둥이 치니 비가 온다. 비는 골고루 만물을 적셔 유익함을 주기 때문에 익(益)을 괘 이름으로 하였다.", advice: "이득이 있다." },
  "7-7": { name: "巽", korean: "손", fullName: "重風巽", description: "위도 바람[風]이고, 겹쳐서 아래도 바람[風]이다. 바람은 지상의 공간에 없는 곳이 없다. 그러나 실체를 눈으로 볼 수는 없다. 손괘는 하나의 음이 두 양 아래에 있어 순종하고 따르는 형상이다. 유순하고 겸양하며 부드러운 의미가 있다.", guasa: "巽 小亨 利有攸往 利見大人", meaning: "위도 바람[風]이고, 겹쳐서 아래도 바람[風]이다. 바람은 지상의 공간에 없는 곳이 없다. 그러나 실체를 눈으로 볼 수는 없다. 손괘는 하나의 음이 두 양 아래에 있어 순종하고 따르는 형상이다. 유순하고 겸양하며 부드러운 의미가 있다.", advice: "바람이 부는 격으로 조금씩 발전하고 있는 상." },
  "7-3": { name: "渙", korean: "환", fullName: "風水渙", description: "위는 바람[風]이고, 아래는 물[水]이다. 환(渙)은 '흩어지다', '풀어지다'라는 뜻이다. 물 위에서 바람이 분다. 물이 바람에 날려 사방으로 흩어지므로, 환(渙)을 괘 이름으로 하였다. 겨우내 얼었던 물이 봄바람에 녹아 풀어진다.", guasa: "渙 亨 王假有廟 利涉大川 利貞", meaning: "위는 바람[風]이고, 아래는 물[水]이다. 환(渙)은 '흩어지다', '풀어지다'라는 뜻이다. 물 위에서 바람이 분다. 물이 바람에 날려 사방으로 흩어지므로, 환(渙)을 괘 이름으로 하였다. 겨우내 얼었던 물이 봄바람에 녹아 풀어진다.", advice: "근심 걱정이 사라지고 발전을 예상한다." },
  "7-8": { name: "漸", korean: "점", fullName: "風山漸", description: "위는 바람[風]이고, 아래는 산[山]이다. 점(漸)은 '점점', '점차로 나아지는 것'을 뜻한다. 산 위에 따뜻한 바람이 불어오면 점차로 만물이 깨어난다. 점차로 나아간다는 뜻의 점(漸)을 괘 이름으로 하였다.", guasa: "漸 女歸吉 利貞", meaning: "위는 바람[風]이고, 아래는 산[山]이다. 점(漸)은 '점점', '점차로 나아지는 것'을 뜻한다. 산 위에 따뜻한 바람이 불어오면 점차로 만물이 깨어난다. 점차로 나아간다는 뜻의 점(漸)을 괘 이름으로 하였다.", advice: "점점 좋아지고 있는 상. 결혼하면 좋은 때." },
  "7-2": { name: "觀", korean: "관", fullName: "風地觀", description: "위는 바람[風]이고, 아래는 땅[地]이다. 관(觀)은 '살핀다'라는 뜻이다. 땅 위에 바람이 불어 새로운 변화가 일어난다. 이러한 변화를 잘 관찰해야 한다는 뜻에서 관(觀)을 괘 이름으로 하였다.", guasa: "觀 盥而不薦 有孚顒若", meaning: "위는 바람[風]이고, 아래는 땅[地]이다. 관(觀)은 '살핀다'라는 뜻이다. 땅 위에 바람이 불어 새로운 변화가 일어난다. 이러한 변화를 잘 관찰해야 한다는 뜻에서 관(觀)을 괘 이름으로 하였다.", advice: "어려운 일이 있을 수 있으니 잘 관망하여 행동하라." },
  // 坎 (3=水) 상괘
  "3-10": { name: "需", korean: "수", fullName: "水天需(수천수)", description: "위는 물[水]이고, 아래는 하늘[天]이다. 수(需)는 '기다리다', '기대하다'라는 뜻이다. 운무가 자욱한 상으로 물러서서 기다려야 할 때를 의미한다.", guasa: "需 有孚 光亨 貞吉 利涉大川", meaning: "운무(雲霧)가 자욱한 象. 수(需)는 '기다림(Attending)'과 '습기에 젖음'을 뜻한다. 성실히 기다리면 크게 통한다. 바르면 길하다. 큰 강을 건너는 데에 이롭다. 무슨 일이든 삼가고 자중하여 때를 기다리면 행운이 온다. 급히 서두르면 크게 실패한다.", advice: "기다림(Waiting): 고요하게 기다려야만 한다. 시간은 다시 행동할 수 있기 전에 얼마간 흘러가야 한다. 온화한 접근방법을 취하라. 현 상황이 변화할 때까지 움직임을 멈추어야 한다.",
    wonmun: `【괘사】
需有孚(수유부) : 수는 믿음이 있어서,
光亨貞吉(광형정길) : 빛나며 형통하고 바르게 하며 길하니,
利涉大川(이섭대천) : 큰 내를 건넘이 이로우니라.

【단전(彖傳)】
彖曰(단왈) : 단에 가로대,
需須也(수수야) : 수는 기다림이니
險在前也(험재전야) : 험한 것이 앞에 있느니라.

剛健而不陷(강건이불함) : 곧세고 튼튼히 하여 빠지지 않게 하니,
其義不困窮矣(기의불곤궁의) : 그 뜻이 곤궁하지 않음이라.

需有孚光亨貞吉(수유부광형정길) : '수유부광형정길'은
位乎天位(위호천위) : 천위에 자리에서
以正中也(이정중야) : 바르게 하고 가운데 함이니라.

利涉大川(이섭대천) : '이섭대천'은
往有功也(왕유공야) : 가서 공이 있음이라.

【상전(象傳)】
象曰(상왈) : 상에 가로대,
雲上於天需(운상어천수) : 구름이 하늘로 오르는 것이 수니,
君子以飲食宴樂(군자이음식연악) : 군자가 이로써 마시고 먹으며, 잔치를 벌여 즐기느니라.

【효사】
初九(초구) : 초구는
需于郊(수우교) : 들에서 기다림이라.
利用恆(이용항) : 항상함을 씀이 이로우니
無咎(무구) : 허물이 없으리라.

象曰(상왈) : 상에 가로대,
需于郊(수우교) : '수우교'는
不犯難行也(불범난행야) : 어려움을 범치 아니하고 행함이요,
利用恆無咎(이용항무구) : '이용항무구'는
未失常也(미실상야) : 떳떳함을 잃지 않음이라.

九二(구이) : 구이는
需于沙(수우사) : 모래밭에서 기다림이라
小有言(소유언) : 조금 말이 있으나
終吉(종길) : 마침내 길하리라.

象曰(상왈) : 상에 가로대,
需于沙(수우사) : '수우사'는
衍在中也(연재중야) : 너그러움으로 가운데 있으니,
雖小有言(수소유언) : 비록 조금 말이 있으나,
以終吉也(이종길야) : 길함으로써 마치라.

九三(구삼) : 구삼은
需于泥(수우니) : 진흙밭에서 기다림이니,
致寇至(치구지) : 도적 이름을 이루리라.

象曰(상왈) : 상에 가로대,
需于泥(수우니) : '수우니'는
災在外也(재재외야) : 재앙이 밖에 있음이라.
自我致寇(자아치구) : 나로부터 말미암아 도적을 이르게 하니,
敬愼不敗也(경신불패야) : 공경하고 삼가하면 패하지 않으리라.

六四(육사) : 육사는
需于血(수우혈) : 피에서 기다림이니
出自穴(출자혈) : 구멍으로 나오도다.

象曰(상왈) : 상에 가로대,
需于血(수우혈) : '수우혈'은
順以聽也(순이청야) : 순함으로써 들음이라.

九五(구오) : 구오는
需于酒食(수우주식) : 술과 음식에서 기다리니
貞吉(정길) : 바르고 길하니라.

象曰(상왈) : 상에 가로대,
酒食貞吉(주식정길) : '주식정길'은
以中正也(이중정야) : 가운데하고 바름으로써라.

上六(상육) : 상육은
入于穴(입우혈) : 구멍에 들어감이니,
有不速之客三人來(유불속지객삼인래) : 청하지 않은 손님이 셋이 오리니,
敬之終吉(경지종길) : 공경하면 마침내 길하리라.

象曰(상왈) : 상에 가로대
不速之客來敬之終吉(불속지객래경지종길) : '불속지객래경지종길'은
雖不當位(수불당위) : 비록 위는 마땅치 않으나
未大失也(미대실야) : 크게 잃지는 아니함이라.` },
  "3-4": { name: "節", korean: "절", fullName: "水澤節", description: "위는 물[水]이고, 아래는 못[澤]이다. 절(節)은 '절도', '규칙이나 제한', '절약'을 뜻한다. 연못 위에 물이 가득하니 물이 많으면 넘치게 하고 모자라면 흐르지 못하게 한다. 절도를 뜻하는 절(節)을 괘 이름으로 하였다.", guasa: "節 亨 苦節不可貞", meaning: "위는 물[水]이고, 아래는 못[澤]이다. 절(節)은 '절도', '규칙이나 제한', '절약'을 뜻한다. 연못 위에 물이 가득하니 물이 많으면 넘치게 하고 모자라면 흐르지 못하게 한다. 절도를 뜻하는 절(節)을 괘 이름으로 하였다.", advice: "절약하고 절도 있게 행동하라." },
  "3-9": { name: "旣濟", korean: "기제", fullName: "水火旣濟", description: "위는 물[水]이고, 아래는 불[火]이다. 기제(旣濟)란 '일을 이미 성취했다', '이미 물을 건넜다', '어려움에서 이미 벗어났다'라는 뜻이다. 물은 위에 있고 불은 아래에 있으니 서로가 목적한 곳으로 건넜다는 의미에서 기제(旣濟)를 괘 이름으로 하였다.", guasa: "旣濟 亨小 初吉終亂", meaning: "위는 물[水]이고, 아래는 불[火]이다. 기제(旣濟)란 '일을 이미 성취했다', '이미 물을 건넜다', '어려움에서 이미 벗어났다'라는 뜻이다. 물은 위에 있고 불은 아래에 있으니 서로가 목적한 곳으로 건넜다는 의미에서 기제(旣濟)를 괘 이름으로 하였다.", advice: "어려운 일이 지나간 상태. 앞으로는 내리막길." },
  "3-5": { name: "屯", korean: "둔", fullName: "水雷屯(수뢰둔)", description: "위는 물[水]이고, 아래는 우레[雷]다. 둔(屯)은 '진치다', '막히다', '고민하다'라는 뜻이다. 비가 내리고 천둥이 진동하는 상이니, 새싹이 눈 속에서 봄을 기다리는 것과 같다.", guasa: "屯 元亨利貞 勿用有攸往 利建侯", meaning: "새싹이 눈 속에서 봄을 기다리는 象. 둔(屯)은 싹이 트는 것(Sprouting)을 의미하며, 시작에 있어서의 어려움과 저장/축적을 뜻한다. 비가 내리고 천둥이 진동하는 상이니 충만함과 탄생의 어려움이 있다. 크게 통하나 바르니 이롭다. 돌연 나아가 일을 행하지 말라.", advice: "시작에 있어서의 어려움(Difficulty at the Beginning): 현 상황을 처리하는 방법을 알지 못할 것이다. 기다려라. 새로운 프로젝트가 혼란 속에서 시작한다. 폭풍우를 만날 시간이다.",
    wonmun: `【괘사】
屯은 元亨코 利貞하니 勿用有攸往이오 利建侯하니라
(둔은 원형코 이정하니 물용유유왕이오 이건후하니라)
크게 형통하고 바르게 함이 이로우니, 갈 바가 있어도 나아가지(쓰지) 말고 중심인물을 세우면 이로우리라.

【단전(彖傳)】
彖曰 屯은 剛柔始交而難生하며 動乎險中하니
(단왈 둔은 강유시교이난생하며 동호험중하니)
단에 이르기를, 둔은 강유가 처음 사귀어 어렵게 태어나 험한 중에 움직이니

大亨貞은 雷雨之動이 滿盈이라
(대형정은 뇌우지동이 만영이라)
대형정은 우레와 비의 움직임이 충만하다.

天造草昧에는 宜建侯오 而不寧이니라
(천조초매에는 의건후오 이불녕이니라)
만물이 처음 생겨나 어수선할 때에는 후를 세우는 것이 마땅하나, 후를 세우더라도 편안하지는 않다.

【상전(象傳)】
象曰 雲雷屯이니 君子以하야 經綸하나니라
(상왈 운뢰둔이니 군자이하야 경륜하나니라)
상에 이르기를, 구름과 우레가 둔이니 군자가 이로써 다스려 나간다.

【효사】
初九는 磐桓이니 利居貞하며 利建侯하니라
(초구는 반환이니 이거정하며 이건후하니라)
초구는 나아가기 어려워 머뭇거리니 올바르게 있음이 이로우며 후를 세우는 것이 이롭다.

象曰 雖磐桓하니 志行正也며 以貴下賤하니 大得民也로다
(상왈 수반환하니 지행정야며 이귀하천하니 대득민야로다)
비록 머뭇거리나 뜻을 바르게 행하며, 귀한 것으로 천한 것에게 낮추니 크게 백성을 얻는다.

六二는 屯如邅如하며 乘馬班如하니 匪寇면 婚媾리니 女子貞하야 不字라가 十年에아 乃字로다
(육이는 둔여전여하며 승마반여하니 비구면 혼구리니 여자정하야 불자라가 십년에아 내자로다)
육이는 어렵고 걷기 어려우며 말을 타고 있다가 내렸으니 도적이 아니면 청혼할 것이다. 여자가 곧아서 시집을 가지 않다가 십년 뒤에 시집을 간다.

象曰 六二之難은 乘剛也오 十年乃字는 反常也라
(상왈 육이지난은 승강야오 십년내자는 반상야라)
육이의 어려움은 음이 양을 탔기 때문이요, 십년만에 시집간다는 것은 마침내는 정상으로 되돌아옴이다.

六三은 卽鹿无虞라 惟入于林中이니 君子幾하야 不如舍니 往하면 吝하리라
(육삼은 즉록무우라 유입우림중이니 군자기하야 불여사니 왕하면 인하리라)
육삼은 사슴을 쫓으나 몰이꾼이 없어 오직 숲으로 들어갈 뿐이다. 군자가 이런 낌새를 알고 그치는 것만 같지 못하니 가면 인색하리라.

象曰 卽鹿无虞는 以從禽也오 君子舍之는 往하면 吝窮也라
(상왈 즉록무우는 이종금야오 군자사지는 왕하면 인궁야라)
사슴을 사냥하기 위해 쫓는데 몰이꾼이 없다는 것은 새를 쫓는 것과 같고, 군자가 그치는 것은 가면 인색하고 궁해지기 때문이다.

六四는 乘馬班如니 求婚媾하야 往하면 吉하야 无不利하리라
(육사는 승마반여니 구혼구하야 왕하면 길하야 무불리하리라)
육사는 말을 탔다가 내리니 청혼을 구하여 가면 길하며 이롭지 않음이 없다.

象曰 求而往은 明也라
(상왈 구이왕은 명야라)
구하여 가면 밝은 것이다.

九五는 屯其膏니 小貞이면 吉코 大貞이면 凶하리라
(구오는 둔기고니 소정이면 길코 대정이면 흉하리라)
구오는 그 기름에 어려우니 작게 바르면 길하고 크게 바르면 흉하리라.

象曰 屯其膏는 施未光也라
(상왈 둔기고는 시미광야라)
그 기름에 어렵다는 것은 베풂이 아직 빛나지 못함이라.

上六은 乘馬班如하야 泣血漣如하니라
(상륙은 승마반여하야 읍혈련여하니라)
상육은 말을 타고 머뭇거리다가 피눈물을 줄줄 흘리느니라.

象曰 泣血漣如는 何可長也리오
(상왈 읍혈련여는 하가장야리오)
피눈물을 줄줄 흘림은 어찌 오래 갈 수 있으리오.` },
  "3-7": { name: "井", korean: "정", fullName: "水風井", description: "위는 물[水]이고, 아래는 바람[風]이다. 정(井)은 '우물', '두레박'을 뜻한다. 바람이 물 밑에 있다. 바람이 깊은 곳까지 통하는 모습이니, 우물을 뜻하는 정(井)을 괘 이름으로 하였다. 우물물을 퍼 올리려면 두레박이 필요하고 노고가 필요하다.", guasa: "井 改邑不改井 无喪无得 往來井井 汔至亦未繘井 羸其瓶 凶", meaning: "위는 물[水]이고, 아래는 바람[風]이다. 정(井)은 '우물', '두레박'을 뜻한다. 바람이 물 밑에 있다. 바람이 깊은 곳까지 통하는 모습이니, 우물을 뜻하는 정(井)을 괘 이름으로 하였다. 우물물을 퍼 올리려면 두레박이 필요하고 노고가 필요하다.", advice: "우물가에서 두레박을 얻은 격. 현재 상태가 가장 좋다." },
  "3-3": { name: "坎", korean: "감", fullName: "重水坎", description: "위도 물[水]이고, 겹쳐서 아래도 물[水]이다. 물이 겹쳐 있으니, 수(水)를 괘 이름으로 하였다. 두 소성괘 모두 두 음효 중간 구덩이에 양효가 빠져있다. 모든 일은 지나치면 위험에 빠지게 된다. 실패, 좌절, 파산, 병고 등의 어려운 일을 뜻한다.", guasa: "習坎 有孚 維心亨 行有尙", meaning: "위도 물[水]이고, 겹쳐서 아래도 물[水]이다. 물이 겹쳐 있으니, 수(水)를 괘 이름으로 하였다. 두 소성괘 모두 두 음효 중간 구덩이에 양효가 빠져있다. 모든 일은 지나치면 위험에 빠지게 된다. 실패, 좌절, 파산, 병고 등의 어려운 일을 뜻한다.", advice: "험난한 데 빠져 있는 격. 앞뒤로 홍수가 일고 있음." },
  "3-8": { name: "蹇", korean: "건", fullName: "水山蹇", description: "위는 물[水]이고, 아래는 산[山]이다. 건(蹇)은 '절뚝발이', '나아가기 힘들다', '멈추다'라는 뜻이다. 산 위에 물이 있으니, 산을 넘으면 다시 물이 앞길을 막고 있다. 나아가기가 불편하니, 절름발이라는 뜻을 가진 건(蹇)을 괘 이름으로 하였다.", guasa: "蹇 利西南 不利東北 利見大人 貞吉", meaning: "위는 물[水]이고, 아래는 산[山]이다. 건(蹇)은 '절뚝발이', '나아가기 힘들다', '멈추다'라는 뜻이다. 산 위에 물이 있으니, 산을 넘으면 다시 물이 앞길을 막고 있다. 나아가기가 불편하니, 절름발이라는 뜻을 가진 건(蹇)을 괘 이름으로 하였다.", advice: "진퇴양난의 처지에 있으니 신중하게 행동해야 한다." },
  "3-2": { name: "比", korean: "비", fullName: "水地比(수지비)", description: "위는 물[水]이고, 아래는 땅[地]이다. 비(比)는 '견주다', '비교하다', '인화(人和)'를 뜻한다. 물은 낮은 곳으로 모여 내를 이루고 힘을 합친다. 뜻을 같이하는 사람끼리 집단을 이루어 서로 돕고 협력하므로, 비(比)를 괘 이름으로 하였다.", guasa: "比 吉 原筮元永貞 无咎 不寧方來 後夫凶", meaning: "뭇별이 북두성을 좇아 모여드는 象. 비(比)는 군집화(Grouping), 함께 소유하는 것(holding together), 연맹(alliance)을 뜻한다. 친밀함의 때다. 서먹서먹했던 사람도 이제 찾아온다. 늦는 사람은 흉. 다른 사람과 친밀히 지내며 함께 일하면, 대부분의 일은 성취된다. 혼자서 일하면 좋은 결과를 얻지 못한다. 바른 일인 경우 즉시 실행에 옮기도록.", advice: "합일(Unity): 환경을 인식하라. 모든 가능한 아이디어들을 갈고 다듬어라. 함께하는 사람들을 믿을 시간이다. 당신이 말한 것을 주시하라. 모든 단어는 이 번에 중요성을 지닌다. 당신은 팀의 일부이다.",
    wonmun: `【괘사】
比吉(비길) : 비는 길하니
原筮(원서) : 처음 점을 하되
元永貞無咎(원영정무구) : 크고 장구하고 정도를 얻게 될 때 허물이 없으리라.
不寧方來(불녕방래) : 편하지 못하여야 바야흐로 돌아오니,
後夫凶(후부흉) : 뒤에 돌아오면 대장부라도 흉하리라.

【단전(彖傳)】
彖曰(단왈) : 단에 가로대,
比吉也(비길야) : 비는 길한 것이며,
比輔也(비보야) : 비는 돕는 것이니,
下順從也(하순종야) : 아래가 순종한다.
原筮元永貞無咎(원서원영정무구) : 처음 점을 침에 크고 장구하고 바른 도로써 친애할 때 탈을 면할 수 있다고 함은
以剛中也(이강중야) : 강양과 중정의 도로 임하기 때문이다.
不寧方來(불녕방래) : 에워싼 무리들이 찾아드는 것은
上下應也(상하응야) : 윗사람과 아랫 사람이 서로 호응하고 있기 때문이요
後夫凶(후부흉) : 기회를 놓친 자가 아무리 강한 기상을 지니고 있어도 흉하다 함은
其道窮也(기도궁야) : 그 길이 막히기 때문이다.

【상전(象傳)】
象曰(상왈) : 상에 가로대,
地上有水比(지상유수비) : 땅 위에 물이 있는 것이 비괘다.
先王以建萬國親諸侯(선왕이건만국친제후) : 선왕이 이로써 만국을 세우고 제후를 친애한다.

【효사】
初六(초육) : 초육은
有孚比之(유부비지) : 믿음을 두고 친화하니
無咎(무구) : 허물이 없으리니
有孚盈缶(유부영부) : 믿음을 둠이 그릇에 가득하면
終來有它吉(종래유타길) : 마침내 뜻밖의 다른 데에서 길함이 나타나리라.

象曰(상왈) : 상에 가로대,
比之初六(비지초육) : '비의 초육'은
有它吉也(유타길야) : 다른 데에서 길함이 나타난다.

六二(육이) : 육이는
比之自內(비지자내) : 돕는 것을 안으로부터 하니,
貞吉(정길) : 바르게 하면 길하도다.

象曰(상왈) : 상에 가로대,
比之自內(비지자내) : '비지자내'는
不自失也(불자실야) : 스스로 잃지 아니함이라.

六三(육삼) : 육삼은
比之匪人(비지비인) : 친화할 수 없는 자와 친화함이라.

象曰(상왈) : 상에 가로대,
比之匪人(비지비인) : 친화할 수 없는 자와 친화하니
不亦傷乎(불역상호) : 또한 잃지 않겠는가.

六四(육사) : 육사는
外比之(외비지) : 외부에서 도우니,
貞吉(정길) : 바르게 하면 길하리다.

象曰(상왈) : 상에 가로대,
外比於賢(외비어현) : 밖으로 어진 이를 돕는 것은
以從上也(이종상야) : 위를 좇기 때문이라.

九五(구오) : 구오는
顯比(현비) : 나타나게 돕는 것이니,
王用三驅(왕용삼구) : 왕이 세 군데로 모는 것을 씀에,
失前禽(실전금) : 앞의 새를 달아나게 하여
邑人不誡吉(읍인불계길) : 읍 사람을 경계하지 아니하니 길하도다.

象曰(상왈) : 상에 가로대,
顯比之吉(현비지길) : '현비지길'은
位正中也(위정중야) : 위가 정히 가운데 함이요,
舍逆取順(사역취순) : 거역하는 자를 버리고 순종하는 자를 취하고
失前禽也(실전금야) : 달아 나는 짐승을 버려두는 것이다.
邑人不誡(읍인불계) : 나라의 백성을 경계하지 않음은
上使中也(상사중야) : 위에서 부림이 정당하기 때문이다.

上六(상육) : 상육은
比之無首凶(비지무수흉) : 돕는데 상대가 없으니 흉하니라.

象曰(상왈) : 상에 가로대,
比之無首(비지무수) : 친화의 길을 모색하나 상대가 없음은
無所終也(무소종야) : 친화의 대열에서 끝까지 할 사람이 없기 때문이다.` },
  // 艮 (8=山) 상괘
  "8-10": { name: "大畜", korean: "대축", fullName: "山天大畜", description: "위는 산[山]이고, 아래는 하늘[天]이다. 대축(大畜)은 '크게 쌓다', '많이 모이다'라는 뜻이다. 하늘 위로 산이 높이 솟아 오른 모습이다. 크게 축적된 상이므로, 대축(大畜)을 괘 이름으로 하였다. 새로운 변화가 하늘을 찌르고 있다.", guasa: "大畜 利貞 不家食吉 利涉大川", meaning: "위는 산[山]이고, 아래는 하늘[天]이다. 대축(大畜)은 '크게 쌓다', '많이 모이다'라는 뜻이다. 하늘 위로 산이 높이 솟아 오른 모습이다. 크게 축적된 상이므로, 대축(大畜)을 괘 이름으로 하였다. 새로운 변화가 하늘을 찌르고 있다.", advice: "풍족하게 쌓여 있는 상태. 인재를 기르고 덕을 길러야 한다." },
  "8-4": { name: "損", korean: "손", fullName: "山澤損", description: "위는 산[山]이고, 아래는 못[澤]이다. 손(損)은 '덜다', '줄이다', '손해보다'라는 뜻이다. 산 아래에 있는 저수지의 물은 들판을 적시기 위해 흘러가야 하므로, 잃는다는 의미에서 손(損)을 괘 이름으로 하였다.", guasa: "損 有孚 元吉 无咎 可貞 利有攸往 曷之用 二簋可用亨", meaning: "위는 산[山]이고, 아래는 못[澤]이다. 손(損)은 '덜다', '줄이다', '손해보다'라는 뜻이다. 산 아래에 있는 저수지의 물은 들판을 적시기 위해 흘러가야 하므로, 잃는다는 의미에서 손(損)을 괘 이름으로 하였다.", advice: "손해를 보고 있는 상. 앞으로 언젠가는 이익이 있다." },
  "8-9": { name: "賁", korean: "비", fullName: "山火賁", description: "위는 산[山]이고, 아래는 불[火]이다. 비(賁)는 '꾸미다', '장식하다'라는 뜻이다. 산 아래 불이 있음은 해가 서산에 기울어 찬란한 황혼 노을을 나타낸다. 아름답게 꾸민다는 뜻의 비(賁)를 괘 이름으로 하였다. 겉치레만 하느라고 실속이 없다.", guasa: "賁 亨 小利有攸往", meaning: "위는 산[山]이고, 아래는 불[火]이다. 비(賁)는 '꾸미다', '장식하다'라는 뜻이다. 산 아래 불이 있음은 해가 서산에 기울어 찬란한 황혼 노을을 나타낸다. 아름답게 꾸민다는 뜻의 비(賁)를 괘 이름으로 하였다. 겉치레만 하느라고 실속이 없다.", advice: "지금은 아름답게 보이나 앞으로는 암흑이 예상된다." },
  "8-5": { name: "頤", korean: "이", fullName: "山雷頤", description: "위는 산[山]이고, 아래는 천둥 우레[雷]다. 이는 '턱', '기르다', '봉양하다'의 뜻이다. 산 아래 천둥 우레가 진동하는 상이다. 무언가 산 위로 올라가는 모습이므로, 생명을 기른다는 의미의 이(頤)를 괘 이름으로 하였다.", guasa: "頤 貞吉 觀頤 自求口實", meaning: "위는 산[山]이고, 아래는 천둥 우레[雷]다. 이는 '턱', '기르다', '봉양하다'의 뜻이다. 산 아래 천둥 우레가 진동하는 상이다. 무언가 산 위로 올라가는 모습이므로, 생명을 기른다는 의미의 이(頤)를 괘 이름으로 하였다.", advice: "자신을 수양하고, 음식이나 말을 조심해야 한다." },
  "8-7": { name: "蠱", korean: "고", fullName: "山風蠱", description: "위는 산[山]이고, 아래는 바람[風]이다. 고(蠱)는 '벌레', '벌레가 나뭇잎을 갉아먹는다'는 뜻이다. 어려운 일을 뜻한다. 산 밑에 바람이 머물고 있으니, 공기가 혼탁하여 부패하기 쉽다. 더러운 벌레가 생기므로, 고(蠱)를 괘 이름으로 하였다.", guasa: "蠱 元亨 利涉大川 先甲三日 後甲三日", meaning: "위는 산[山]이고, 아래는 바람[風]이다. 고(蠱)는 '벌레', '벌레가 나뭇잎을 갉아먹는다'는 뜻이다. 어려운 일을 뜻한다. 산 밑에 바람이 머물고 있으니, 공기가 혼탁하여 부패하기 쉽다. 더러운 벌레가 생기므로, 고(蠱)를 괘 이름으로 하였다.", advice: "내부의 병폐(病弊)를 제거해야 한다." },
  "8-3": { name: "蒙", korean: "몽", fullName: "山水蒙(산수몽)", description: "위의 괘는 산[山]이고, 아래 괘는 물[水]이다. 몽(蒙)은 '어리다', '어리석다'라는 뜻이다. 시작의 상(象)이며 교육과 밀접한 관계가 있다. 그래서 교육과 연관된 몽(蒙)자를 괘의 이름으로 하였고, 계몽(啓蒙)이라는 말이 또한 여기서 나왔다.", guasa: "蒙 亨 匪我求童蒙 童蒙求我 初筮告 再三瀆 瀆則不告 利貞", meaning: "보옥(寶玉)을 깊숙이 감춘 象. 몽(蒙)은 덮개/밀봉(Enveloping)을 뜻하며, 청춘의 어리석음(youthful folly)과 젊음의 새싹을 의미한다. 시작의 상(象)이며 교육과 밀접한 관계가 있다. 모든 일에 길조가 보이나 금방 이루어지지는 않는다. 오랜 세월에 걸쳐 점차 성취되므로, 서둘지 말고 서서히 진행해 가도록 한다. 성실이 제일.", advice: "젊은 비경험(Youthful Inexperience): 사귀어 온 사람들의 꿈과 목표를 고려하는 것을 망각해 왔다. 목표를 너무 높이 설정해 왔다. 지식 부족은 장애이다. 타협할 시간이다.",
    wonmun: `【괘사】
蒙亨(몽형) : 몽은 형통하니
匪我求童蒙(비아구동몽) : 동몽을 구함이 아니라
童蒙求我(동몽구아) : 동몽이 나를 구함이니,
初筮告(초서고) : 처음 점치거든 알려주고
再三瀆(재삼독) : 두번 세번하면 더럽히는 것이라.
瀆則不告(독칙불고) : 더럽힌 즉 알려주지 말지니
利貞(이정) : 바르게 함이 이로우니라.

【단전(彖傳)】
彖曰(단왈) : 단에 가로대,
蒙山下有險(몽산하유험) : 산 아래 험한 것이 있고
險而止蒙(험이지몽) : 험해서 그치는 것이 몽이라.

蒙亨(몽형) : '몽형'은
以亨行(이형행) : 형통함으로써 행함이니
時中也(시중야) : 때로 중함이요,
匪我求童蒙童蒙求我(비아구동몽동몽구아) : '비아구동몽동몽구아'는
志應也(지응야) : 뜻이 응함이요,
初筮告(초서고) : '초서고'는
以剛中也(이강중야) : 강하고 가운데 함으로써요,
再三瀆瀆則不告(재삼독독칙불곡) : '재삼독독즉불곡'은
瀆蒙也(독몽야) : 몽을 더럽히게 됨이니,
蒙以養正(몽이양정) : 몽으로써 바른 것을 기름이
聖功也(성공야) : 성스러운 공이라.

【상전(象傳)】
象曰(상왈) : 상에 가로대,
山下出泉蒙(산하출천몽) : 산 아래 샘이 솟아나는 것이 몽이니,
君子以果行育德(군자이과행육덕) : 군자가 이로써 과감히 행하며 덕을 기르니라.

【효사】
初六(초륙) : 초육은
發蒙(발몽) : 몽을 일깨우는데
利用刑人(이용형인) : 사람에게 형벌함을 쓰고서
用說桎梏(용설질곡) : 질곡을 벗김이 이로우니,
以往吝(이왕린) : 형벌로써만 해 나가면 인색하리라.

象曰(상왈) : 상에 가로대,
利用刑人(이용형인) : '이용형인'은
以正法也(이정법야) : 써 법을 바르게 함이라.

九二(구이) : 구이는
包蒙吉(포몽길) : 몽을 감싸면 길하고
納婦吉(납부길) : 지어미를 얻으면 길하리니,
子克家(자극가) : 자식이 집을 다스리도다.

象曰(상왈) : 상에 가로대,
子克家(자극가) : '자극가'는
剛柔節也(강유절야) : 강과 유가 접함이라.

六三(육삼) : 육삼은
勿用取女(물용취녀) : 써 여자를 취하지 말지니,
見金夫(견금부) : 돈 있는 사내를 보고
不有躬(불유궁) : 몸을 두지 못하니
無攸利(무유리) : 이로울 바가 없느니라.

象曰(상왈) : 상에 가로대
勿用取女(물용취녀) : '물용취녀'는
行不順也(행불순야) : 행실이 순하지 아니함이라.

六四(육사) : 육사는
困蒙吝(곤몽린) : 곤궁한 몽이니 인색하도다.

象曰(상왈) : 상에 가로대,
困蒙之吝(곤몽지린) : '곤몽지린'은
獨遠實也(독원실야) : 홀로 실상에서 멀음이라.

六五(육오) : 육오는
童蒙吉(동몽길) : 어린 몽이니 길하니라.

象曰(상왈) : 상에 가로대,
童蒙之吉(동몽지길) : '동몽지길'은
順以巽也(순이손야) : 순하고 공순함으로써라.

上九(상구) : 상구는
擊蒙(격몽) : 몽을 침이니.
不利為寇(불리위구) : 도적이 됨이 이롭지 아니하고
利禦寇(이어구) : 도적을 막음이 이로우니라.

象曰(상왈) : 상에 가로대,
利用禦寇(이용어구) : '도적 막음을 씀이 이로운 것'은
上下順也(상하순야) : 위와 아래가 순함이라.` },
  "8-8": { name: "艮", korean: "간", fullName: "重山艮", description: "위도 산[山]이고, 겹쳐서 아래도 산[山]이다. 산이 첩첩이 있으니 산(山)을 괘 이름으로 하였다. 간괘는 하나의 양이 두 음 위에 머무르고 있는 상이다. 산은 움직이지 않고 그곳에 있으므로 '머무르다'라는 뜻이다.", guasa: "艮其背 不獲其身 行其庭 不見其人 无咎", meaning: "위도 산[山]이고, 겹쳐서 아래도 산[山]이다. 산이 첩첩이 있으니 산(山)을 괘 이름으로 하였다. 간괘는 하나의 양이 두 음 위에 머무르고 있는 상이다. 산은 움직이지 않고 그곳에 있으므로 '머무르다'라는 뜻이다.", advice: "산 넘어 산인 격. 노력을 배가해야 풀린다." },
  "8-2": { name: "剝", korean: "박", fullName: "山地剝", description: "위는 산[山]이고, 아래는 땅[地]이다. 박(剝)은 '벗기다', '빼앗다'라는 뜻이다. 산이 땅 위에 우뚝 솟아 있으니, 비바람에 깎여 벗겨지고 상처를 입는다는 뜻에서 박(剝)을 괘 이름으로 하였다. 매사에 조심해야 한다.", guasa: "剝 不利有攸往", meaning: "위는 산[山]이고, 아래는 땅[地]이다. 박(剝)은 '벗기다', '빼앗다'라는 뜻이다. 산이 땅 위에 우뚝 솟아 있으니, 비바람에 깎여 벗겨지고 상처를 입는다는 뜻에서 박(剝)을 괘 이름으로 하였다. 매사에 조심해야 한다.", advice: "무너지기 직전으로 인내가 필요하다." },
  // 坤 (2=地) 상괘
  "2-10": { name: "泰", korean: "태", fullName: "地天泰(지천태)", description: "위는 땅[地]이고, 아래는 하늘[天]이다. 태(泰)는 '크다', '크게 통한다', '태평하다'라는 뜻이다. 땅의 기운은 하늘로 올라가고 하늘의 기운은 땅으로 내려와 서로 조화를 이룬다. 서로 크게 통한다는 의미로 태(泰)를 괘 이름으로 하였다.", guasa: "泰 小往大來 吉亨", meaning: "풍년이 들어 백곡이 풍성한 象. 태(泰)는 포용하는(Prevading) 것, 평화(peace), 위대함(greatness)을 뜻한다. 크게 통한다. 태평의 때다. 작은 것은 가고 큰 것이 돌아온다. 길하여 통한다. 점치는 사람에게 양강(陽剛)의 덕이 있으면 길하다. 원하는 일이 통할 것이다.", advice: "번영(Prospering): 태양이 나오고 행운이 빛을 비추고 있다. 이 번에 이 행운을 이용하지 않고 방치해 두지 마라. 이 번을 봄의 시작으로서 생각하라. 건강과 부를 창출할 수 있는 이상적인 시기임을 잊지 마라.",
    wonmun: `【괘사】
泰小往大來(태소왕대래) : 태는 작은 것이 가고, 큰 것이 오는 것이니
吉亨(길형) : 길하여 형통하리라.

【단전(彖傳)】
彖曰(단왈) : 단에 가로대
泰小往大來吉亨(태소왕대래길형) : '태소왕대래길형'은
則是天地交而萬物通也(칙시천지교이만물통야) : 곧 천지가 사귀어 만물이 통하는 것이며,
上下交而其志同也(상하교이기지동야) : 위와 아래가 사귀어 그 뜻이 같음이라.
內陽而外陰(내양이외음) : 안에는 양이고, 밖에는 음이며,
內健而外順(내건이외순) : 안으로는 강건하고 밖으로는 유순하며,
內君子而外小人(내군자이외소인) : 안으로는 군자요 밖으로는 소인이니,
君子道長(군자도장) : 군자의 도는 자라나고
小人道消也(소인도소야) : 소인의 도는 사라지느니라.

【상전(象傳)】
象曰(상왈) : 상에 가로대,
天地交泰(천지교태) : 하늘과 땅의 사귐이 태괘의 괘상이니,
后以財成天地之道(후이재성천지지도) : 군주가 이로써 천지의 도를 재단하여 이루며,
輔相天地之宜(보상천지지의) : 천지의 마땅함을 힘 보태고
以左右民(이좌우민) : 도움으로써 백성을 좌하고 우하느니라.

【효사】
初九(초구) : 초구는
拔茅茹(발모여) : 띠풀 뿌리를 뽑음이라.
以其彙征吉(이기휘정길) : 그 무리로써 감이니 길하니라.

象曰(상왈) : 상에 가로대,
拔茅征吉(발모정길) : '발모정길'은
志在外也(지재외야) : 뜻이 밖에 있음이라.

九二(구이) : 구이는
包荒(포황) : 거친 것을 싸며
用馮河(용풍하) : 하수를 건너는 용맹을 쓰며,
不遐遺(불하유) : 멀리 있는 것을 버리지 아니하며
朋亡(붕망) : 붕당을 없애면,
得尚于中行(득상우중행) : 중정의 도를 행함에 숭상함을 얻으리라.

象曰(상왈) : 상에 가로대,
包荒得尚于中行(포황득상우중행) : '포황득상우중행'은
以光大也(이광대야) : 빛나고 큼을 얻기 때문이라.

九三(구삼) : 구삼은
無平不陂(무평불피) : 평평하다가 언덕지지 않음이 없으며,
無往不復(무왕불부) : 가다가 돌아오지 않음이 없으니,
艱貞(간정) : 어렵게 하고 바르게 하면
無咎(무구) : 허물이 없어서
勿恤其孚(물휼기부) : 근심치 않더라도 그 미더운지라.
于食有福(우식유복) : 먹는 데에 복이 있으리라.

象曰(상왈) : 상에 가로대,
無往不復(무왕불부) : '무왕불복'은
天地際也(천지제야) : 천지가 사귐이라.

六四(육사) : 육사는
翩翩(편편) : 펄펄 나래짓하듯
不富以其鄰(불부이기린) : 부하려 하지 않고 그 이웃으로써 하여,
不戒以孚(불계이부) : 경계하지 아니해도 미덥도다.

象曰(상왈) : 상에 가로대,
翩翩不富(편편불부) : '편편불부'는
皆失實也(개실실야) : 모두 실질을 잃음이요,
不戒以孚(불계이부) : '불계이부'는
中心願也(중심원야) : 중심으로 원함이라.

六五(육오) : 육오는
帝乙歸妹(제을귀매) : 제을이 누이동생을 시집보내는 것이니,
以祉元吉(이지원길) : 이로써 복이 되며 크게 길하리라.

象曰(상왈) : 상에 가로대,
以祉元吉(이지원길) : '이지원길'은
中以行願也(중이행원야) : 가운데로써 원함을 행함이라.

上六(상육) : 상육은
城復于隍(성부우황) : 성이 무너져 터에 돌아옴이라.
勿用師(물용사) : 군사를 쓰지 말고
自邑告命貞吝(자읍고명정린) : 읍으로부터 명이 고할지니 바르더라도 인색하니라.

象曰(상왈) : 상에 가로대,
城復于隍(성부우황) : '성복우황'은
其命亂也(기명란야) : 그 명이 어지러움이라.` },
  "2-4": { name: "臨", korean: "림", fullName: "地澤臨", description: "위는 땅[地]이고, 아래는 못[澤]이다. 임(臨)은 '순서를 밟다', '군림하다'라는 뜻이다. 땅 속에 물이 가득하니 곧 새로운 시작에 임한다는 뜻에서 임(臨)을 괘 이름으로 하였다. 여러 사람 위에 있는 지도자 상이다.", guasa: "臨 元亨利貞 至于八月有凶", meaning: "위는 땅[地]이고, 아래는 못[澤]이다. 임(臨)은 '순서를 밟다', '군림하다'라는 뜻이다. 땅 속에 물이 가득하니 곧 새로운 시작에 임한다는 뜻에서 임(臨)을 괘 이름으로 하였다. 여러 사람 위에 있는 지도자 상이다.", advice: "군림하고 지배하는 괘. 부하의 반발이 있을 수 있다." },
  "2-9": { name: "明夷", korean: "명이", fullName: "地火明夷", description: "위는 땅[地]이고, 아래는 불[火]이다. 이(夷)는 '상하고 깨지는 것'이므로 명이(明夷)는 '밝은 것이 상하고 깨진다'는 뜻이다. 태양이 땅 아래 잠겨가고 있다. 어두움이 온다는 뜻에서 명이(明夷)를 괘 이름으로 하였다. 해가 서산에 지는 상이다.", guasa: "明夷 利艱貞", meaning: "위는 땅[地]이고, 아래는 불[火]이다. 이(夷)는 '상하고 깨지는 것'이므로 명이(明夷)는 '밝은 것이 상하고 깨진다'는 뜻이다. 태양이 땅 아래 잠겨가고 있다. 어두움이 온다는 뜻에서 명이(明夷)를 괘 이름으로 하였다. 해가 서산에 지는 상이다.", advice: "해가 지고 암흑이 온다." },
  "2-5": { name: "復", korean: "복", fullName: "地雷復", description: "위는 땅[地]이고, 아래는 우레 천둥[雷]이다. 복(復)은 '돌아오다', '회복하다'라는 뜻이다. 땅 밑에서 천둥 우레가 울린다는 것은 땅 위에 새로운 시작을 알리는 것과 같으므로, 복(復)을 괘 이름으로 하였다. 곧 성공할 운을 맞고 있다.", guasa: "復 亨 出入无疾 朋來无咎 反復其道 七日來復 利有攸往", meaning: "위는 땅[地]이고, 아래는 우레 천둥[雷]이다. 복(復)은 '돌아오다', '회복하다'라는 뜻이다. 땅 밑에서 천둥 우레가 울린다는 것은 땅 위에 새로운 시작을 알리는 것과 같으므로, 복(復)을 괘 이름으로 하였다. 곧 성공할 운을 맞고 있다.", advice: "앞으로 좋은 일이 있으니 적극적으로 행동하라." },
  "2-7": { name: "升", korean: "승", fullName: "地風升", description: "위는 땅[地]이고, 아래는 바람[風]이다. 승(升)은 '위로 상승하다', '올라가다', '번성하다'라는 뜻이다. 땅 밑에 있는 바람이 위로 상승하고 있으니 상승한다는 뜻의 승(升)을 괘 이름으로 하였다.", guasa: "升 元亨 用見大人 勿恤 南征吉", meaning: "위는 땅[地]이고, 아래는 바람[風]이다. 승(升)은 '위로 상승하다', '올라가다', '번성하다'라는 뜻이다. 땅 밑에 있는 바람이 위로 상승하고 있으니 상승한다는 뜻의 승(升)을 괘 이름으로 하였다.", advice: "크게 발전한다." },
  "2-3": { name: "師", korean: "사", fullName: "地水師(지수사)", description: "위는 땅[地]이고, 아래는 물[水]이다. 사(師)는 '선생', '군대', '거느리다'라는 뜻이다. 땅 밑으로 물이 모이는 상이니 여러 사람이 모인 집단을 상징하므로, 통솔한다는 의미에서 사(師)를 괘 이름으로 하였다.", guasa: "師 貞 丈人吉 无咎", meaning: "영웅이 여러 군졸을 거느린 象. 사(師)는 이끔/지도(Leading), 군대(the army), 병력(the troops)을 뜻한다. 전쟁의 때이다. 대인일 때는 길하여 화가 없다. 점쳐서 이 괘를 얻으면 그 일이 정당하고, 그 일을 행하는 사람이 바르면 결과는 길하다.", advice: "훈련(Discipline): 세력들이 당신에 대항해서 움직인다. 생존하기 위해 모든 힘과 용기를 필요로 한다. 이 도전과 어려움에서 생존함으로써 지켜보는 사람들로부터 존경을 얻게 될 것이다. 정신을 진작시켜라.",
    wonmun: `【괘사】
師貞(사정) : 사는 바르게 함이니,
丈人吉無咎(장인길무구) : 장인이라야 길하고 허물이 없으리라.

【단전(彖傳)】
彖曰(단왈) : 단에 가로대,
師眾也(사중야) : 사는 무리를 말함이요
貞正也(정정야) : 정은 정의이니
能以眾正(능이중정) : 능히 무리를 바르게 하면
可以王矣(가이왕의) : 왕이 될 수 있으리라.

剛中而應(강중이응) : 양강이 중정의 도를 지키면서 응하고
行險而順(행험이순) : 험한 일을 행하여도 순조로우니
以此毒天下(이차독천하) : 이로써 천하를 괴롭혀도
而民從之(이민종지) : 백성이 따르니
吉又何咎矣(길우하구의) : 길하니 또 무슨 허물이리요.

【상전(象傳)】
象曰(상왈) : 상에 가로대,
地中有水師(지중유수사) : 대지 가운데 물이 있으니 사(師)의 형상이다
君子以容民畜眾(군자이용민축중) : 군자가 이로써 백성을 포용하고 민중을 길러야 한다.

【효사】
初六(초육) : 초육은
師出以律(사출이률) : 군사가 나아가는데 율령으로써 함이니,
否臧凶(부장흉) : 그렇지 아니하면 착하더라도 흉하느니라.

象曰(상왈) : 상에 가로대
師出以律(사출이률) : 군사가 출정함에 기율이 있어야 하니
失律凶也(실률흉야) : 율령을 잃으면 흉하리라.

九二(구이) : 구이는
在師中(재사중) : 군에 있어서 중도를 지켜야
吉無咎(길무구) : 길하고 허물이 없을 것이니
王三錫命(왕삼석명) : 왕이 세 번 포상의 명을 내릴 것이다.

象曰(상왈) : 상에 가로대,
在師中吉(재사중길) : 군에 있어 중도를 지켜 길함은
承天寵也(승천총야) : 하늘의 은총을 이음이요,
王三錫命(왕삼석명) : 왕이 세 번 포상의 명을 내림은
懷萬邦也(회만방야) : 만방을 품음이라.

六三(육삼) : 육삼은
師或輿尸凶(사혹여시흉) : 군사가 시체를 수레에 싣고 돌아오니 흉하리라.

象曰(상왈) : 상에 가로대,
師或輿尸(사혹여시) : 군사가 시체를 수레에 싣고 돌아오니
大無功也(대무공야) : 크게 공이 없으리라.

六四(육사) : 육사는
師左次無咎(사좌차무구) : 군사가 진영으로 물러나는 것이니, 허물이 없도다.

象曰(상왈) : 상에 가로대,
左次無咎未失常也(좌차무구미실상야) : '좌차무구'는 떳떳함을 잃음이 아니라.

六五(육오) : 육오는
田有禽(전유금) : 밭에 새가 있거든,
利執言(이집언) : 말을 받드는 것이 이로우니
無咎(무구) : 허물이 없으리라.

長子帥師(장자수사) : 장자가 군사를 거느리나
弟子輿尸(제자여시) : 제자가 시체를 수레에 실으리라
貞凶(정흉) : 바르게 하더라도 흉하리라.

象曰(상왈) : 상에 가로대,
長子帥師(장자수사) : '장자수사'는
以中行也(이중행야) : 중으로써 행해야 하며
弟子輿尸(제자여시) : '제자여시'는
使不當也(사불당야) : 부림이 마땅치 않게 부림이라.

上六(상육) : 상육은
大君有命(대군유명) : 대군이 명령을 내려
開國承家(개국승가) : 나라를 열고, 가문을 잇는데
小人勿用(소인물용) : 소인을 쓰지 말지니라.

象曰(상왈) : 상에 가로대,
大君有命(대군유명) : '대군유명'은
以正功也(이정공야) : 공을 바르게 해야 하기 때문이다
小人勿用(소인물용) : '소인물용'은
必亂邦也(필란방야) : 반드시 나라를 어지럽히기 때문이라.` },
  "2-8": { name: "謙", korean: "겸", fullName: "地山謙", description: "위는 땅[地]이고, 아래는 산[山]이다. 겸(謙)은 '겸손', '겸양'으로 자기보다 부족한 사람을 이끌어주고 도와준다는 뜻이다. 높은 산이 땅 밑에 파묻힌 모습이다. 벼가 익어 고개를 숙이는 상이므로 겸손하다는 의미에서 겸(謙)을 괘 이름으로 하였다.", guasa: "謙 亨 君子有終", meaning: "위는 땅[地]이고, 아래는 산[山]이다. 겸(謙)은 '겸손', '겸양'으로 자기보다 부족한 사람을 이끌어주고 도와준다는 뜻이다. 높은 산이 땅 밑에 파묻힌 모습이다. 벼가 익어 고개를 숙이는 상이므로 겸손하다는 의미에서 겸(謙)을 괘 이름으로 하였다.", advice: "겸손하게 행동하면 잘 풀린다.",
    wonmun: `【괘사】
謙亨(겸형) : 겸손하면 형통하리니
君子有終(군자유종) : 군자는 유종의 미를 거두리라.

【단전(彖傳)】
彖曰(단왈) : 단에 이르기를
謙亨(겸형) : '겸형'은
天道下濟而光明(천도하제이광명) : 하늘의 도리는 작용이 아래로 내려와 빛나고
地道卑而上行(지도비이상행) : 땅의 도리는 낮은 위치를 지킴으로서 그 작용이 위로 올라가 시행된다.
天道虧盈而益謙(천도휴영이익겸) : 하늘의 도는 이지러지고 차고 하여 차지 않은 것을 보탠다.
地道變盈而流謙(지도변영이류겸) : 땅의 도는 가득 찬 것을 변경하여 차지 않은 곳에 흘러든다.
鬼神害盈而福謙(귀신해영이복겸) : 귀신은 가득 차 있는 것에는 해를 주고 겸손한 자에게는 복을 준다.
人道惡盈而好謙(인도악영이호겸) : 사람의 도리는 교만한 것을 미워하고 겸손한 것을 좋아한다.
謙尊而光(겸존이광) : 높은 지위를 겸손히 하면 빛나고
卑而不可踰(비이불가유) : 낮은 자리에 있는 자는 남이 업신여기지 못한다.
君子之終也(군자지종야) : 군자는 유종의 미를 거둔다.

【상전(象傳)】
象曰(상왈) : 상에 이르기를
地中有山謙(지중유산겸) : 낮은 땅에 높은 산이 있는 것이 겸괘의 상이다.
君子以裒多益寡(군자이부다익과) : 군자는 이 괘상을 보고 많은 것에서 덜어 적은 것에 보태어
稱物平施(칭물평시) : 사물의 균형을 살피고 공평하게 베푼다.

【효사】
初六(초육) : 초육은
謙謙君子(겸겸군자) : 겸손한 군자는
用涉大川吉(용섭대천길) : 큰 내를 건너는 일을 해도 길하다.

象曰(상왈) : 상에 이르기를
謙謙君子(겸겸군자) : '겸손한 군자'란
卑以自牧也(비이자목야) : 낮추어서 스스로를 기르는 자이다.

六二(육이) : 육이는
鳴謙貞吉(명겸정길) : 명성이 나도 겸손하고 곧으면 길하리라.

象曰(상왈) : 상에 이르기를
鳴謙貞吉(명겸정길) : '명성이 나도 겸손하고 곧다'는 것은
中心得也(중심득야) : 중심을 얻었다는 것이다.

九三(구삼) : 구삼은
勞謙君子(노겸군자) : 수고해도 겸손한 군자는
有終吉(유종길) : 끝에 길함이 있을 것이다.

象曰(상왈) : 상에 이르기를
勞謙君子(노겸군자) : '수고해도 겸손한 군자'에게는
萬民服也(만민복야) : 만민이 심복한다.

六四(육사) : 육사는
無不利撝謙(무불리휘겸) : 자신을 낮추고 겸손함에 이롭지 않음이 없다.

象曰(상왈) : 상에 이르기를
無不利撝謙(무불리휘겸) : '자신을 낮추고 겸손함에 이롭지 않음'은
不違則也(불위칙야) : 규칙을 어기지 않는다는 것이다.

六五(육오) : 육오는
不富以其鄰(불부이기린) : 부귀하면서도 그 이웃을 해하지 않으니
利用侵伐(이용침벌) : 이용 침벌해도
無不利(무불리) : 이롭지 않음이 없다.

象曰(상왈) : 상에 이르기를
利用侵伐(이용침벌) : '이용 침벌이라 함'은
征不服也(정불복야) : 복종하지 않는 자를 정벌함이다.

上六(상육) : 상육은
鳴謙(명겸) : 명성을 얻었으나 겸손하니
利用行師(이용행사) : 군사를 동원하면
征邑國(정읍국) : 읍국을 정벌할 수 있다.

象曰(상왈) : 상에 이르기를
鳴謙(명겸) : '명성을 얻었으나 겸손하다 함'은
志未得也(지미득야) : 뜻을 아직 얻지 못함이라.
可用行師(가용행사) : 군사를 동원하면
征邑國也(정읍국야) : 작은 읍국을 정벌할 수 있다.` },
  "2-2": { name: "坤", korean: "곤", fullName: "重地坤(중지곤)", description: "모두 땅을 상징하는 곤괘가 겹쳐서 구성되어 있다. 여섯 효(爻)가 모두 음(陰)으로 만물을 포용하고 양육하는 땅과 어머니를 상징한다. 속성은 '순응하다', '지극하다'라는 뜻이다.", guasa: "坤 元亨利牝馬之貞 君子有攸往 先迷後得主 利西南得朋 東北喪朋 安貞吉", meaning: "기름진 땅에 오곡을 심는 象. 곤(坤)은 들판(Field)을 의미하며, 수용적인(receptive) 것과 흐름(flow)을 뜻한다. 여섯 효(爻)가 모두 음(陰)으로 만물을 포용하고 양육하는 땅과 어머니를 상징한다. 땅의 포용성, 신하의 도리로서 크게 통한다. 유순한 사람이라면 길하지만 강퍅한 사람이라면 흉하다. 독주하지 말고 다른 사람과 힘을 합쳐 일하면 좋다.", advice: "자연스러운 반응(Natural Response): 열심히 일해야 할 시간이다. 노력에 대한 대가를 곧 받게 될 것이다. 앞쪽으로 계속 정진하라. 고요히 머물 시간이 아니다.",
    wonmun: `【괘사】
坤元亨(곤원형) : 곤은 원하고 형하고
利牝馬之貞(리빈마지정) : 이하고 암말의 정함이니,
君子有攸往(군자유유왕) : 군자가 갈바를 두느니라.

先迷(선미) : 먼저 하면 아득하고,
後得主利(후득주리) : 뒤에 하면 얻으리니 이로움을 주창하니라.

西南得朋(서남득붕) : 서남은 벗을 얻고,
東北喪朋(동북상붕) : 동북은 벗을 잃으니,
安貞吉(안정길) : 안정하여 길하리라.

【단전(彖傳)】
彖曰(단왈) : 단에 이르기를
至哉坤元(지재곤원) : 지극하도다. 곤의 원이여.
萬物資生(만물자생) : 만물이 바탕하여 생하나니,
乃順承天(내순승천) : 이에 순히 하늘을 이으니,
坤厚載物(곤후재물) : 곤이 두터워 만물을 실음이
德合無疆(덕합무강) : 덕이 무강한 데 합하여,
含弘光大(함홍광대) : 머금으며 넓으며 빛나며 커서
品物咸亨(품물함형) : 품물이 다 형통하느니라.

牝馬地類(빈마지류) : 암말은 땅의 무리이니
行地無疆(행지무강) : 땅을 다님에 경계가 없으며,
柔順利貞(유순리정) : 유순하고 이정함은
君子攸行(군자유행) : 군자의 행하는 바이다.

先迷失道(선미실도) : 먼저 하면 아득해서 돌을 잃고,
後順得常(후순득상) : 뒤에 하면 순해서 항상함을 얻으리니,
西南得朋(서남득붕) : 서남에서 벗을 얻음은
乃與類行(내여류행) : 이에 무리로 더불어 행함이요,
東北喪朋(동북상붕) : 동북에서 벗을 잃음은
乃終有慶(내종유경) : 이에 마침내 경사가 있으리니.

安貞之吉(안정지길) : 인정하여 길함이
應地無疆(응지무강) : 땅의 지경이 없는 것에 응하느니라.

【상전(象傳)】
象曰(상왈) : 상에 이르기를
地勢坤(지세곤) : 땅의 형세가 곤이니,
君子以厚德載物(군자이후덕재물) : 군자가 이로써 두터운 덕으로 만물을 싣느니라.

【효사】
初六(초륙) : 초육은
履霜堅冰至(리상견빙지) : 서리를 밟으면 굳은 얼음을 이르니니라.

象曰(상왈) : 상에 이르기를
履霜堅冰(리상견빙) : 이상견빙은
陰始凝也(음시응야) : 음이 처음 엉김이니,
馴致其道(순치기도) : 그 도를 길들여 이루어서
至堅冰也(지견빙야) : 굳은 얼음에 이르게 하느니라

六二(륙이) : 육이는
直方大(직방대) : 곧고 모나고 큰지라,
不習無不利(불습무불리) : 익히지 아니해도 이롭지 아니함이 없느니라.

象曰(상왈) : 상에 이르기를,
六二之動(륙이지동) : 육이의 동함이 
直以方也(직이방야) : 곧고 방정하니,
不習無不利(불습무불리) : 불습무불리는
地道光也(지도광야) : 땅의 도가 빛남이니라.

六三(륙삼) : 육삼은
含章可貞(함장가정) : 빛나는 것을 머금어 가히 바르게 함이니,
或從王事(혹종왕사) : 혹 왕의 일을 좇아서
無成有終(무성유종) : 이름은 없으되 마침은 있느니라.

象曰(상왈) : 상에 이르기를
含章可貞(함장가정) : 함장가정이나
以時發也(이시발야) : 때로써 발함이요,
或從王事(혹종왕사) : 혹종왕사는
知光大也(지광대야) : 앎이 빛나고 큼이라.

六四(륙사) : 육사는
括囊(괄낭) : 주머니를 매면
無咎無譽(무구무예) : 허물이 없으며 명예로움도 없으리라.

象曰(상왈) : 상에 이르기를
括囊無咎(괄낭무구) : 괄낭무구는
慎不害也(신불해야) : 신중하면 해롭지 아니하리라.

六五(륙오) : 육오는
黃裳元吉(황상원길) : 누런 치마면 크게 길하리라.

象曰(상왈) : 상에 가로대
黃裳元吉(황상원길) : 황상원길은
文在中也(문재중야) : 문채가 가운데 있음이라

上六(상륙) : 상육은
龍戰于野(룡전우야) : 용이 들에서 싸우니
其血玄黃(기혈현황) : 그 피가 검고 누르도다.

象曰(상왈) : 상에 가로대,
龍戰于野(룡전우야) : 용이 들에서 싸움은
其道窮也(기도궁야) : 그 도가 다함이라.

用六(용륙) : 용육은
利永貞(리영정) : 오래하고 바르게 함이 이로우니라.

象曰(상왈) : 상에 가로대,
用六永貞(용륙영정) : 용육영정은
以大終也(이대종야) : 큼으로써 마침 때문이라.

【문언전(文言傳)】
文言曰(문언왈) : 문언에 이르기를,
坤至柔而動也剛(곤지유이동야강) : 곤은 지극히 유순하되 움직임에 강하고,
至靜而德方(지정이덕방) : 지극히 고요하되 덕이 방정하니,
後得主而有常(후득주이유상) : 뒤에 하면 얻어서 리(利)를 주장하여 떳떳함이 있으며,
含萬物而化光(함만물이화광) : 만물이 머금어 화함이 빛나니
坤道其順乎(곤도기순호) : 곤의 도가 그 순한져!
承天而時行(승천이시행) : 하늘을 이어 때로 행하느니라.

(초육을 설명함)
積善之家(적선지가) : 선을 쌓은 집안에는
必有餘慶(필유여경) : 반드시 남은 경사가 있고,
積不善之家(적불선지가) : 불선을 쌓은 집안에는
必有餘殃(필유여앙) : 반드시 남은 재앙이 있나니,
臣弒其君(신시기군) : 신하가 그 인군을 죽이며,
子弒其父(자시기부) : 자식이 그 아비를 죽임이
非一朝一夕之故(비일조일석지고) : 하루아침 하루저녁의 연고가 아님이라.

其所由來者漸矣(기소유래자점의) : 그 말미암아 온 바가 점차함이니,
由辯之不早辯也(유변지불조변야) : 분별할 것을 일찍 분별치 못함으로 말미암은 것이니,

易曰(역왈) : 역에 가로대,
履霜堅冰至(리상견빙지) : '서리를 밟으면 굳은 얼음이 이른다'하니
蓋言順也(개언순야) : 대개 순종함을 이른다.

(육이를 설명함)
直其正也(직기정야) : 직은 그 바름이요,
方其義也(방기의야) : 방은 그 의로운 것이니.
君子敬以直內(군자경이직내) : 군자가 공경함으로써 안을 곧게 하고
義以方外(의이방외) : 의리로써 밖을 방정하게 해서,
敬義立而德不孤(경의립이덕불고) : 경과 의가 섬에 덕이 외롭지 아니하나니,

直方大(직방대) : '직방대
不習無不利(불습무불리) : 불습무불리'는
則不疑其所行也(칙불의기소행야) : 즉 그 행하는 바를 의심치 아니 함이라.

(육삼을 설명함)
陰雖有美(음수유미) : 음이 비록 아름다움이 있으나,
含之以從王事(함지이종왕사) : 머금어서 써 왕의 일을 좇아서
弗敢成也(불감성야) : 감히 이루지 못하니,

地道也(지도야) : 땅의 도이며,
妻道也(처도야) : 처의 도이며.
臣道也(신도야) : 신하의 도이니,
地道無成(지도무성) : 땅의 도는 이룸은 없되
而代有終也(이대유종야) : 이어서 마침을 두느니라.
天地變化(천지변화) : 천지가 변화하면
草木蕃(초목번) : 초목이 번성하고
天地閉(천지폐) : 천지가 닫히면
賢人隱(현인은) : 현인이 숨나니,

(육사를 설명함)
易曰(역왈) : 역에 이르기를,
括囊無咎無譽(괄낭무구무예) : 괄낭무구무예'라 하니
蓋言謹也(개언근야) : 대개 '삼감'을 말함이다.

(육오를 설명함)
君子黃中通理(군자황중통리) : 군자가 황중의 이치를 통해서
正位居體(정위거체) : 바른 자리에 몸을 거하며,

美在其中(미재기중) : 아름다움이 그 가운데 있어
而暢於四支(이창어사지) : 사지에 빛나며
發於事業(발어사업) : 사업을 발하나니,
美之至也(미지지야) : 아름다움의 지극함이다.

(상육을 설명함)
陰疑於陽必戰(음의어양필전) : 음이 양을 의심하면 반드시 싸우나니,
為其嫌於無陽也(위기혐어무양야) : 그 양이 없음을 의심함이라.

故稱龍焉(고칭룡언) : 그러므로, 용이라 일컫고,
猶未離其類也(유미리기류야) : 오히려 그 동류를 떠나지 못는지라.
故稱血焉(고칭혈언) : 그러므로 혈이라 일컬으니,

夫玄黃者(부현황자) : 무릇 '현황'이라는것은
天地之雜也(천지지잡야) : 천지의 섞임이니
天玄而地黃(천현이지황) : 하늘은 검고 땅은 누르니라` }
};

// 64괘 주역 풀이 조회 함수
export function getHexagramInterpretation(sogung: number, daegung: number): { 
  name: string; 
  korean: string; 
  fullName: string;
  description?: string;
  guasa: string;
  meaning: string;
  advice: string;
  wonmun?: string;
  lowerTrigram: { name: string; symbol: string };
  upperTrigram: { name: string; symbol: string };
} | null {
  // 중궁(6)이 포함된 경우 특수 처리
  if (sogung === 6 || daegung === 6) {
    return null; // 중궁은 주역 64괘에 포함되지 않음
  }
  
  // HEXAGRAM_INTERPRETATIONS의 키: "${상괘}-${하괘}" (소궁-대궁)
  const key = `${sogung}-${daegung}`;
  const interp = HEXAGRAM_INTERPRETATIONS[key];
  if (!interp) return null;
  
  const lowerInfo = NUMBER_TO_TRIGRAM[daegung];
  const upperInfo = NUMBER_TO_TRIGRAM[sogung];
  
  return {
    ...interp,
    lowerTrigram: { name: lowerInfo?.name || "", symbol: lowerInfo?.symbol || "" },
    upperTrigram: { name: upperInfo?.name || "", symbol: upperInfo?.symbol || "" }
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
  SOLAR_TERMS_KOREAN,
  TERM_GENERALS,
  WEEKDAYS_HANJA
};
