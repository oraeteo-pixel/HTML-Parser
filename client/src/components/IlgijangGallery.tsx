import { useState, useEffect, useMemo } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  getKoreanDate,
  get8Trigram,
  get28Mansion,
  getHwanggeukDate,
  getHwanggeukHourGanZhi,
  getDayGanZhi,
  getCurrentSolarTerm,
  getSogungDaegung,
  get64HexagramName,
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

// ========================================
// 일기장 레이아웃 설정 (여기서 수정하세요)
// ========================================
const DIARY_CONFIG = {
  // 전체 컨테이너
  containerMinHeight: 500,      // 전체 높이 (px)
  containerPadding: 24,         // 여백 (px)
  
  // 열 간격
  columnSpacing: 8,             // 열 사이 간격 (px)
  
  // 글자 크기
  titleFontSize: 14,            // 익자삼우, 손자삼우 글자 크기
  mainFontSize: 13,             // 본문 글자 크기
  incantationFontSize: 12,      // 주문 글자 크기
  talismanLabelFontSize: 11,    // 부적 라벨(子부, 丑부 등) 글자 크기
  
  // 부적 이미지
  talismanImageHeight: 120,     // 부적 이미지 높이 (px)
  talismanImageMarginTop: 4,    // 부적 이미지 위 간격 (px)
};
// ========================================

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
    "戊": 2,
    "己": 3,
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

function getSixBranchesFromDayBranch(dayBranch: string): string[] {
  const startIdx = EARTHLY_BRANCHES.indexOf(dayBranch);
  const branches: string[] = [];
  
  const isYang = startIdx % 2 === 0;
  const step = isYang ? 2 : -2;
  
  for (let i = 0; i < 6; i++) {
    const idx = ((startIdx + i * step) % 12 + 12) % 12;
    branches.push(EARTHLY_BRANCHES[idx]);
  }
  
  return branches;
}

export function IlgijangGallery() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

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
    const solarTerm = getCurrentSolarTerm(adjustedMonth, adjustedDay);

    const sogungDaegung = getSogungDaegung(new Date());
    const hexagram64 = get64HexagramName(sogungDaegung.sogung, sogungDaegung.daegung);

    const dayStem = dayGanZhi[0];
    const dayBranch = dayGanZhi[1];
    
    const sixSpirits = getSixSpiritsForDay(dayStem);
    const sixBranches = getSixBranchesFromDayBranch(dayBranch);

    return {
      trigram,
      mansion,
      hwanggeuk,
      hwHourGanZhi,
      dayGanZhi,
      solarTerm,
      sixSpirits,
      sixBranches,
      dayStem,
      dayBranch,
      sogungDaegung,
      hexagram64,
      koreanDate: { year: adjustedYear, month: adjustedMonth, day: adjustedDay, hours, minutes }
    };
  }, [currentTime]);

  const { trigram, mansion, hwanggeuk, hwHourGanZhi, dayGanZhi, solarTerm, sixSpirits, sixBranches, sogungDaegung, hexagram64 } = calendarData;

  const openFullscreen = () => {
    setFullscreenOpen(true);
    setIsZoomed(false);
  };

  const closeFullscreen = () => {
    setFullscreenOpen(false);
    setIsZoomed(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fullscreenOpen) return;
      if (e.key === "Escape") closeFullscreen();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenOpen]);

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
        {/* 익자삼우 / 손자삼우 / 기서재괘 / 언청신계용 - 이미지 레이아웃 */}
        <div style={{ 
          display: 'inline-block', 
          verticalAlign: 'top',
          marginLeft: sp(cfg.columnSpacing),
          direction: 'ltr'
        }}>
          {/* 상단: 益者三友 ... 損者三友 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp(16) }}>
            <div style={{ writingMode: 'vertical-rl', textOrientation: 'upright', fontSize: fs(cfg.titleFontSize), color: 'black', fontWeight: 'bold' }}>
              益者三友
            </div>
            <div style={{ width: sp(40) }}></div>
            <div style={{ writingMode: 'vertical-rl', textOrientation: 'upright', fontSize: fs(cfg.titleFontSize), color: 'black', fontWeight: 'bold' }}>
              損者三友
            </div>
          </div>
          
          {/* 중간: 基瑞在震 (가운데 정렬 - 神 위) */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: sp(16) }}>
            <div style={{ writingMode: 'vertical-rl', textOrientation: 'upright', fontSize: fs(cfg.titleFontSize), color: 'black', fontWeight: 'bold' }}>
              基瑞在{trigram.trigram}
            </div>
          </div>
          
          {/* 하단: 言聽 神 計用 */}
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

        {/* 28수부 */}
        <div style={{ ...colStyle, textAlign: 'center' }}>
          <span style={{ fontSize: fs(cfg.talismanLabelFontSize) }}>{mansion.mansion}宿부</span>
          <br/>
          {MANSION_28_TALISMANS[mansion.mansion] && (
            <img 
              src={MANSION_28_TALISMANS[mansion.mansion]}
              alt={`${mansion.mansion}수부`}
              style={{ height: sp(cfg.talismanImageHeight), objectFit: 'contain', marginTop: sp(cfg.talismanImageMarginTop) }}
            />
          )}
        </div>

        {/* 황극력 년월 + 24절국 (한 열) */}
        <div style={{ ...colStyle, fontSize: fs(cfg.mainFontSize) }}>
          皇極曆年月{hwanggeuk.yearGanZhi}{hwanggeuk.monthGanZhi}24節局{solarTerm?.hanja || ''}
        </div>

        {/* 황극력 일시 */}
        <div style={{ ...colStyle, fontSize: fs(cfg.mainFontSize) }}>
          皇極曆<br/>日時<br/><br/>{dayGanZhi}<br/>{hwHourGanZhi}
        </div>

        {/* 28수 */}
        <div style={{ ...colStyle, fontSize: fs(cfg.mainFontSize) }}>
          28宿<br/><br/>{mansion.mansion}
        </div>

        {/* 24절국 */}
        <div style={{ ...colStyle, fontSize: fs(cfg.mainFontSize) }}>
          24節局<br/><br/>{solarTerm?.hanja || ''}
        </div>

        {/* 소궁 대궁 64괘 */}
        <div style={{ ...colStyle, fontSize: fs(cfg.mainFontSize) }}>
          小宮<br/>大宮<br/>64卦<br/><br/>{sogungDaegung.sogung}<br/>{sogungDaegung.daegung}<br/>{hexagram64?.hanja || ''}
        </div>

        {/* 육신 */}
        <div style={{ ...colStyle, fontSize: fs(cfg.mainFontSize) }}>
          {sixSpirits[0]}<br/>{sixSpirits[1]}<br/>{sixSpirits[2]}<br/>{sixSpirits[3]}<br/>{sixSpirits[4]}<br/>{sixSpirits[5]}
        </div>

        {/* 6개 부적 */}
        {sixBranches.map((branch, idx) => (
          <div key={idx} style={{ ...colStyle, textAlign: 'center' }}>
            <span style={{ fontSize: fs(cfg.talismanLabelFontSize) }}>{branch}부</span>
            <br/>
            <img 
              src={BRANCH_TALISMANS[branch]}
              alt={`${branch}부`}
              style={{ height: sp(cfg.talismanImageHeight), objectFit: 'contain', marginTop: sp(cfg.talismanImageMarginTop) }}
            />
          </div>
        ))}

        {/* 주문 */}
        <div style={{ ...colStyle, fontSize: fs(cfg.incantationFontSize) }}>
          侍天主造化定<br/>永世不忘萬事知
        </div>
        <div style={{ ...colStyle, fontSize: fs(cfg.incantationFontSize) }}>至氣今至願爲大降</div>
        <div style={{ ...colStyle, fontSize: fs(cfg.incantationFontSize) }}>
          天文地理風雲造化<br/>八門遁甲六丁六甲<br/>智慧勇力
        </div>
        <div style={{ ...colStyle, fontSize: fs(cfg.incantationFontSize) }}>所願成就</div>
      </div>
    );
  };

  return (
    <div className="w-full" data-testid="ilgijang-gallery">
      <div 
        className="bg-white rounded-md overflow-auto cursor-pointer hover-elevate flex items-center justify-center py-8"
        onClick={openFullscreen}
        data-testid="gallery-ilgijang-page-1"
      >
        <DiaryContent scale={0.9} />
      </div>

      <Dialog open={fullscreenOpen} onOpenChange={() => closeFullscreen()}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <VisuallyHidden>
            <DialogTitle>황극력 일기장</DialogTitle>
          </VisuallyHidden>
          <div className="relative w-full h-[90vh] flex items-center justify-center overflow-auto">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 z-20 text-white hover:bg-white/20"
              onClick={closeFullscreen}
              data-testid="button-ilgijang-fullscreen-close"
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-14 z-20 text-white hover:bg-white/20"
              onClick={() => setIsZoomed(!isZoomed)}
              data-testid="button-ilgijang-fullscreen-zoom"
            >
              {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
            </Button>

            <DiaryContent scale={isZoomed ? 1.5 : 1.2} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
