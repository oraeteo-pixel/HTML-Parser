import { useState, useEffect, useMemo } from "react";
import {
  getKoreanDate,
  get8Trigram,
  getHwanggeuk28Mansion,
  getHwanggeukDate,
  getHwanggeukHourGanZhi,
  getHwanggeukDayGanZhi,
  WEEKDAYS_HANJA,
} from "@/lib/calendarData";

import talismanJa from "@assets/talisman-ja.png";
import talismanChuk from "@assets/talisman-chuk.png";
import talismanIn from "@assets/talisman-in.png";
import talismanMyo from "@assets/talisman-myo.jpg";
import talismanJin from "@assets/talisman-jin.jpg";
import talismanSa from "@assets/talisman-sa.png";
import talismanO from "@assets/talisman-o.jpg";
import talismanMi from "@assets/talisman-mi.png";
import talismanSin from "@assets/talisman-sin.png";
import talismanYu from "@assets/talisman-yu.jpg";
import talismanSul from "@assets/talisman-sul.png";
import talismanHae from "@assets/talisman-hae.png";

import mansion28_deungwoo from "@assets/28mansions/_등우.jpg";
import mansion28_masung from "@assets/28mansions/_마성.jpg";
import mansion28_ohan from "@assets/28mansions/_오한.jpg";
import mansion28_wangryang from "@assets/28mansions/_왕량.jpg";
import mansion28_gabok from "@assets/28mansions/_가복.jpg";
import mansion28_jinjun from "@assets/28mansions/_진준.jpg";
import mansion28_gyunggam from "@assets/28mansions/_경감.jpg";
import mansion28_dumu from "@assets/28mansions/_두무.jpg";
import mansion28_gusun from "@assets/28mansions/_구순.jpg";
import mansion28_bujun from "@assets/28mansions/_부준.jpg";
import mansion28_jampaeng from "@assets/28mansions/_잠팽.jpg";
import mansion28_gyunsim from "@assets/28mansions/_견심.jpg";
import mansion28_poongee from "@assets/28mansions/_풍이.jpg";
import mansion28_wangpae from "@assets/28mansions/_왕패.jpg";
import mansion28_joowoo from "@assets/28mansions/_주우.jpg";
import mansion28_imgwang from "@assets/28mansions/_임광.jpg";
import mansion28_jejun from "@assets/28mansions/_제준.jpg";
import mansion28_eechung from "@assets/28mansions/_이충.jpg";
import mansion28_gyungdan from "@assets/28mansions/_경단.jpg";
import mansion28_mansoo from "@assets/28mansions/_만수.jpg";
import mansion28_gaeyeon from "@assets/28mansions/_개연.jpg";
import mansion28_biyoong from "@assets/28mansions/_비융.jpg";
import mansion28_yogi from "@assets/28mansions/_요기.jpg";
import mansion28_yoosik from "@assets/28mansions/_유식.jpg";
import mansion28_gyungsoon from "@assets/28mansions/_경순.jpg";
import mansion28_janggung from "@assets/28mansions/_장궁.jpg";
import mansion28_mamu from "@assets/28mansions/_마무.jpg";
import mansion28_yooyoong from "@assets/28mansions/_유융.jpg";

const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const SIX_SPIRITS = ["靑龍", "朱雀", "句陳", "螣蛇", "白虎", "玄武"];

const MANSION_28_TALISMANS: { [key: string]: string } = {
  "角": mansion28_deungwoo,
  "亢": mansion28_masung,
  "氐": mansion28_ohan,
  "房": mansion28_wangryang,
  "心": mansion28_gabok,
  "尾": mansion28_jinjun,
  "箕": mansion28_gyunggam,
  "斗": mansion28_dumu,
  "牛": mansion28_gusun,
  "女": mansion28_bujun,
  "虛": mansion28_jampaeng,
  "危": mansion28_gyunsim,
  "室": mansion28_poongee,
  "壁": mansion28_wangpae,
  "奎": mansion28_joowoo,
  "婁": mansion28_imgwang,
  "胃": mansion28_jejun,
  "昴": mansion28_eechung,
  "畢": mansion28_gyungdan,
  "觜": mansion28_mansoo,
  "參": mansion28_gaeyeon,
  "井": mansion28_biyoong,
  "鬼": mansion28_yogi,
  "柳": mansion28_yoosik,
  "星": mansion28_gyungsoon,
  "張": mansion28_janggung,
  "翼": mansion28_mamu,
  "軫": mansion28_yooyoong,
};

const DIARY_CONFIG = {
  containerMinHeight: 500,
  containerPadding: 24,
  columnSpacing: 8,
  titleFontSize: 14,
  mainFontSize: 13,
  incantationFontSize: 12,
  talismanLabelFontSize: 11,
  talismanImageHeight: 120,
  talismanImageMarginTop: 4,
};

const BRANCH_TALISMANS: { [key: string]: string } = {
  "子": talismanJa,
  "丑": talismanChuk,
  "寅": talismanIn,
  "卯": talismanMyo,
  "辰": talismanJin,
  "巳": talismanSa,
  "午": talismanO,
  "未": talismanMi,
  "申": talismanSin,
  "酉": talismanYu,
  "戌": talismanSul,
  "亥": talismanHae,
};

function getSixSpiritsForDay(dayStem: string): string[] {
  const stemStartMap: { [key: string]: number } = {
    "甲": 0, "乙": 0,
    "丙": 1, "丁": 1,
    "戊": 2, "己": 3,
    "庚": 4, "辛": 4,
    "壬": 5, "癸": 5
  };
  
  const startIdx = stemStartMap[dayStem] || 0;
  const spirits: string[] = [];
  
  for (let i = 0; i < 6; i++) {
    spirits.push(SIX_SPIRITS[(startIdx + i) % 6]);
  }
  
  return spirits;
}

function getThreeBranchesFromDayBranch(dayBranch: string): string[] {
  const startIdx = EARTHLY_BRANCHES.indexOf(dayBranch);
  const branches: string[] = [];
  
  const isYang = startIdx % 2 === 0;
  const step = isYang ? 2 : -2;
  
  for (let i = 0; i < 3; i++) {
    const idx = ((startIdx + i * step) % 12 + 12) % 12;
    branches.push(EARTHLY_BRANCHES[idx]);
  }
  
  return branches;
}

export function GwangjechansaengbuGallery() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTalisman, setShowTalisman] = useState(false);

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
    const hwanggeuk = getHwanggeukDate(year, month, day, hours);
    const hwMansion = getHwanggeuk28Mansion(hwanggeuk.year, hwanggeuk.month, hwanggeuk.day);
    
    const hwDayGanZhi = getHwanggeukDayGanZhi(hwanggeuk.year, hwanggeuk.month, hwanggeuk.day);
    const hwHourGanZhi = getHwanggeukHourGanZhi(year, month, day, hours, minutes);

    const hwDayStem = hwDayGanZhi[0];
    const hwDayBranch = hwDayGanZhi[1];
    
    const sixSpirits = getSixSpiritsForDay(hwDayStem);
    const threeBranches = getThreeBranchesFromDayBranch(hwDayBranch);

    return {
      trigram,
      hwMansion,
      hwanggeuk,
      hwDayGanZhi,
      hwHourGanZhi,
      sixSpirits,
      threeBranches,
      koreanDate: { year: adjustedYear, month: adjustedMonth, day: adjustedDay, hours, minutes }
    };
  }, [currentTime]);

  const { trigram, hwMansion, hwanggeuk, hwDayGanZhi, hwHourGanZhi, sixSpirits, threeBranches } = calendarData;

  const DiaryContent = ({ scale = 1 }: { scale?: number }) => {
    const cfg = DIARY_CONFIG;
    const fs = (size: number) => size * scale;
    const sp = (size: number) => size * scale;
    
    const colStyle: React.CSSProperties = {
      display: 'inline-block',
      verticalAlign: 'top',
      writingMode: 'vertical-rl',
      textOrientation: 'upright',
      marginLeft: sp(cfg.columnSpacing),
      color: 'black',
      fontWeight: 'bold'
    };
    
    return (
      <div 
        className="bg-white border border-gray-200 rounded-lg overflow-auto"
        style={{ 
          fontFamily: "'Noto Sans KR', 'Nanum Gothic', sans-serif",
          padding: sp(cfg.containerPadding),
          whiteSpace: 'nowrap',
          direction: 'rtl',
          minHeight: sp(cfg.containerMinHeight)
        }}
      >
        <div style={{ 
          display: 'inline-block', 
          verticalAlign: 'top',
          marginLeft: sp(cfg.columnSpacing),
          direction: 'ltr'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp(16) }}>
            <div style={{ writingMode: 'vertical-rl', textOrientation: 'upright', fontSize: fs(cfg.titleFontSize), color: 'black', fontWeight: 'bold' }}>
              益者三友
            </div>
            <div style={{ width: sp(40) }}></div>
            <div style={{ writingMode: 'vertical-rl', textOrientation: 'upright', fontSize: fs(cfg.titleFontSize), color: 'black', fontWeight: 'bold' }}>
              損者三友
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: sp(16) }}>
            <div style={{ writingMode: 'vertical-rl', textOrientation: 'upright', fontSize: fs(cfg.titleFontSize), color: 'black', fontWeight: 'bold' }}>
              基瑞在{trigram.trigram}
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ writingMode: 'vertical-rl', textOrientation: 'upright', fontSize: fs(cfg.titleFontSize), color: 'black', fontWeight: 'bold' }}>
              言聽
            </div>
            <div style={{ writingMode: 'vertical-rl', textOrientation: 'upright', fontSize: fs(cfg.titleFontSize), color: 'black', fontWeight: 'bold' }}>
              神
            </div>
            <div style={{ writingMode: 'vertical-rl', textOrientation: 'upright', fontSize: fs(cfg.titleFontSize), color: 'black', fontWeight: 'bold' }}>
              計用
            </div>
          </div>
        </div>

        <div style={{ ...colStyle, textAlign: 'center' }}>
          {MANSION_28_TALISMANS[hwMansion.mansion] && (
            <img 
              src={MANSION_28_TALISMANS[hwMansion.mansion]}
              alt={`${hwMansion.mansion}수부`}
              style={{ height: sp(cfg.talismanImageHeight), objectFit: 'contain' }}
            />
          )}
        </div>

        <div style={{ ...colStyle, fontSize: fs(cfg.mainFontSize) }}>
          {hwanggeuk.yearGanZhi}年{hwanggeuk.monthGanZhi}月{hwDayGanZhi}日{hwHourGanZhi}時
        </div>

        {threeBranches.map((branch, idx) => (
          <div key={idx} style={{ ...colStyle, textAlign: 'center' }}>
            <span style={{ fontSize: fs(cfg.talismanLabelFontSize) }}>{sixSpirits[idx]}</span>
            <br/>
            <img 
              src={BRANCH_TALISMANS[branch]}
              alt={`${sixSpirits[idx]}${branch}부`}
              style={{ height: sp(cfg.talismanImageHeight), objectFit: 'contain', marginTop: sp(cfg.talismanImageMarginTop) }}
            />
          </div>
        ))}

        <div style={{ ...colStyle, fontSize: fs(cfg.incantationFontSize) }}>
          廣濟蒼生
        </div>
        <div style={{ ...colStyle, fontSize: fs(cfg.incantationFontSize) }}>
          至氣今至願爲大降
        </div>
        <div style={{ ...colStyle, fontSize: fs(cfg.incantationFontSize), marginTop: sp(80) }}>
          朴判守
        </div>
        <div style={{ ...colStyle, fontSize: fs(cfg.incantationFontSize), marginTop: sp(100) }}>
          所願成就
        </div>
      </div>
    );
  };

  const weekdayHanja = WEEKDAYS_HANJA[new Date().getDay()];

  return (
    <div className="w-full" data-testid="gwangjechansaengbu-gallery">
      <div className="slim-info-bar mb-4" data-testid="gwangjechansaengbu-info-bar">
        <div className="flex flex-wrap items-center gap-1.5 text-base">
          <span className="font-bold text-gray-700 dark:text-gray-200">
            {hwanggeuk.year}.{hwanggeuk.month}.{hwanggeuk.day}
          </span>
          <span className="font-semibold text-gray-600 dark:text-gray-300">
            {weekdayHanja}
          </span>
          <span className="font-semibold text-gray-600 dark:text-gray-300">
            ({hwanggeuk.yearGanZhi}年 {hwanggeuk.monthGanZhi}月 {hwDayGanZhi}日 {hwHourGanZhi}時)
          </span>
          <button 
            className="slim-badge-cyan cursor-pointer"
            onClick={() => setShowTalisman(!showTalisman)}
            data-testid="button-mansion-toggle"
          >
            {hwMansion.isZunkong ? hwMansion.mansion : `${hwMansion.mansion}, ${hwMansion.general}`}
          </button>
        </div>
      </div>

      {!hwMansion.isZunkong && (
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out talisman-box rounded-lg ${showTalisman ? 'max-h-[400px] opacity-100 p-4 my-2' : 'max-h-0 opacity-0 p-0 my-0'}`}
        >
          <div className="flex flex-col items-center">
            <img 
              src={`/img/${hwMansion.image}.jpg`}
              alt={`${hwMansion.mansion} 부적`}
              className="max-w-[200px] max-h-[280px] object-contain border border-border rounded-lg shadow-lg bg-white"
            />
          </div>
        </div>
      )}

      <div 
        className="bg-white rounded-md overflow-auto flex items-center justify-center py-8"
        data-testid="gallery-gwangjechansaengbu-page-1"
      >
        <DiaryContent scale={0.9} />
      </div>
    </div>
  );
}
