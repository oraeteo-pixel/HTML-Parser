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
  "deungwoo", "masung", "ohan", "wanglyang", "kabok", "jinjun", "kungdan",
  "dumu", "kusun", "pujun", "jampeng", "kyunsim", "punge", "wangpae",
  "juwoo", "limkwang", "jejun", "leechung", "kyungdan", "mansu", "kaeyoen",
  "biyung", "yoki", "yusik", "kungsun", "jangkung", "mamu", "yuyung"
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
      hanja: "中之中",
      korean: "중지중",
      fullName: "中之中",
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

export function getCalendarDayData(year: number, month: number, day: number): CalendarDayData {
  const lunar = solarToLunar(year, month, day);
  // 음력 기반 간지 (korean-lunar-calendar 라이브러리 사용) - 참조용
  const lunarGanZhi = getLunarGanZhi(year, month, day);
  // 선천력 간지는 절기 기반으로 계산 (자정 기준 날짜 전환)
  const yearGanZhi = getYearGanZhi(year, month, day);
  const monthGanZhi = getMonthGanZhi(year, month, day);
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
