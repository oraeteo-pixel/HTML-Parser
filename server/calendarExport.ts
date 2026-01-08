import * as XLSX from 'xlsx';

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

const NUMBER_TO_TRIGRAM: { [key: number]: { name: string; korean: string; element: string } } = {
  1: { name: "中", korean: "중", element: "中" },
  2: { name: "坤", korean: "곤", element: "地" },
  3: { name: "坎", korean: "감", element: "水" },
  4: { name: "兌", korean: "태", element: "澤" },
  5: { name: "震", korean: "진", element: "雷" },
  6: { name: "中", korean: "중", element: "中" },
  7: { name: "巽", korean: "손", element: "風" },
  8: { name: "艮", korean: "간", element: "山" },
  9: { name: "離", korean: "리", element: "火" },
  10: { name: "乾", korean: "건", element: "天" }
};

const CHINESE_NUMBERS = ["二", "三", "四", "五", "六", "七", "八", "九", "十"];
const EIGHTY_ONE_NAMES: { [key: string]: string } = {
  "2-2": "原", "2-3": "潛", "2-4": "守", "2-5": "信", "2-6": "直", "2-7": "蒙", "2-8": "閑", "2-9": "須", "2-10": "厲",
  "3-2": "成", "3-3": "沖", "3-4": "振", "3-5": "祈", "3-6": "常", "3-7": "柔", "3-8": "易", "3-9": "親", "3-10": "華",
  "4-2": "見", "4-3": "獲", "4-4": "從", "4-5": "交", "4-6": "育", "4-7": "壯", "4-8": "興", "4-9": "欣", "4-10": "舒",
  "5-2": "比", "5-3": "開", "5-4": "晉", "5-5": "公", "5-6": "益", "5-7": "章", "5-8": "盈", "5-9": "錫", "5-10": "靡",
  "6-2": "庶", "6-3": "決", "6-4": "豫", "6-5": "升", "6-6": "中", "6-7": "伏", "6-8": "過", "6-9": "疑", "6-10": "寡",
  "7-2": "飾", "7-3": "戾", "7-4": "虛", "7-5": "昧", "7-6": "損", "7-7": "用", "7-8": "郤", "7-9": "翕", "7-10": "遠",
  "8-2": "迅", "8-3": "懼", "8-4": "除", "8-5": "弱", "8-6": "疾", "8-7": "競", "8-8": "分", "8-9": "誦", "8-10": "收",
  "9-2": "實", "9-3": "賓", "9-4": "危", "9-5": "堅", "9-6": "革", "9-7": "報", "9-8": "止", "9-9": "戎", "9-10": "結",
  "10-2": "養", "10-3": "遇", "10-4": "勝", "10-5": "囚", "10-6": "任", "10-7": "固", "10-8": "移", "10-9": "墮", "10-10": "終"
};

function getDayGanZhi(year: number, month: number, day: number): string {
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const daysDiff = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const baseIndex = 10;
  const ganZhiIndex = (daysDiff + baseIndex) % 60;
  const stemIndex = ganZhiIndex % 10;
  const branchIndex = ganZhiIndex % 12;
  return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[branchIndex];
}

function getMansionData(ganji: string): { mansion: string; general: string; mansionIndex: number | "中" } {
  const mansionIndex = GANJI_TO_MANSION[ganji];
  if (mansionIndex === "中") {
    return { mansion: "中", general: "中", mansionIndex: "中" };
  }
  return {
    mansion: TWENTY_EIGHT_MANSIONS[mansionIndex],
    general: MANSION_GENERALS[mansionIndex],
    mansionIndex
  };
}

function getSogungDaegungForDate(date: Date, isAM: boolean): { sogung: number; daegung: number; position: number; name81: string } {
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const koreanTime = new Date(utc + (9 * 60 * 60000));
  
  const year = koreanTime.getFullYear();
  const month = koreanTime.getMonth() + 1;
  const day = koreanTime.getDate();
  
  let epochYear = year;
  if (month < 4 || (month === 4 && day < 21) || (month === 4 && day === 20)) {
    epochYear = year - 1;
  }
  
  const epochUTC = Date.UTC(epochYear, 3, 20, 14, 0, 0);
  const epochDate = new Date(epochUTC + (9 * 60 * 60 * 1000));
  
  const adjustedTime = new Date(koreanTime);
  if (!isAM) {
    adjustedTime.setHours(14);
  } else {
    adjustedTime.setHours(2);
  }
  
  const minutesFromEpoch = Math.floor((adjustedTime.getTime() - epochDate.getTime()) / (1000 * 60));
  const halfDayPeriod = 720;
  const totalHalfDays = Math.floor(minutesFromEpoch / halfDayPeriod);
  
  const calibrationOffset = -1;
  const daegungIndex = ((totalHalfDays + calibrationOffset) % 9 + 9) % 9;
  const daegung = daegungIndex + 2;
  
  const daegungCycleNum = Math.floor(totalHalfDays / 9);
  const positionOffset = 3;
  const positionIndex = ((daegungCycleNum + positionOffset) % 9 + 9) % 9;
  const position = positionIndex + 2;
  
  const sogung = daegung;
  
  const name81 = EIGHTY_ONE_NAMES[`${position}-${daegung}`] || "";
  
  return { sogung, daegung, position, name81 };
}

function getTrigramInfo(num: number): { name: string; korean: string; element: string } {
  return NUMBER_TO_TRIGRAM[num] || { name: "中", korean: "중", element: "中" };
}

export function generateCalendarExcel(startDate: Date, endDate: Date): Buffer {
  const data: any[] = [];
  
  data.push([
    "날짜", "간지", "28수", "28장", 
    "오전 소궁", "오전 대궁", "오전 81궁", "오전 팔괘(소)", "오전 팔괘(대)",
    "오후 소궁", "오후 대궁", "오후 81궁", "오후 팔괘(소)", "오후 팔괘(대)"
  ]);
  
  const current = new Date(startDate);
  while (current <= endDate) {
    const year = current.getFullYear();
    const month = current.getMonth() + 1;
    const day = current.getDate();
    
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const ganji = getDayGanZhi(year, month, day);
    const { mansion, general } = getMansionData(ganji);
    
    const amData = getSogungDaegungForDate(current, true);
    const pmData = getSogungDaegungForDate(current, false);
    
    const amSogungTrigram = getTrigramInfo(amData.sogung);
    const amDaegungTrigram = getTrigramInfo(amData.daegung);
    const pmSogungTrigram = getTrigramInfo(pmData.sogung);
    const pmDaegungTrigram = getTrigramInfo(pmData.daegung);
    
    data.push([
      dateStr,
      ganji,
      mansion,
      general,
      amData.sogung,
      amData.daegung,
      amData.name81,
      amSogungTrigram.name,
      amDaegungTrigram.name,
      pmData.sogung,
      pmData.daegung,
      pmData.name81,
      pmSogungTrigram.name,
      pmDaegungTrigram.name
    ]);
    
    current.setDate(current.getDate() + 1);
  }
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "달력데이터");
  
  ws['!cols'] = [
    { wch: 12 },
    { wch: 6 },
    { wch: 4 },
    { wch: 6 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 }
  ];
  
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
}
