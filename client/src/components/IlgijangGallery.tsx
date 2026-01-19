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

const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const SIX_SPIRITS = ["靑龍", "朱雀", "句陳", "螣蛇", "白虎", "玄武"];

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
    const fs = (size: number) => size * scale;
    const sp = (size: number) => size * scale;
    
    return (
      <div 
        className="bg-white border border-gray-200 rounded-lg overflow-auto"
        style={{ 
          fontFamily: "'Noto Sans KR', 'Nanum Gothic', sans-serif",
          padding: sp(24),
          writingMode: 'vertical-rl',
          textOrientation: 'upright',
          height: sp(450)
        }}
      >
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row',
          gap: sp(10),
          color: 'black',
          fontWeight: 'bold',
          height: '100%'
        }}>
          {/* 맨 오른쪽: 익자삼우 */}
          <div style={{ fontSize: fs(14) }}>益者三友</div>

          {/* 손자삼우 */}
          <div style={{ fontSize: fs(14) }}>損者三友</div>

          {/* 황극력 년월 */}
          <div style={{ fontSize: fs(13), display: 'flex', flexDirection: 'column', gap: sp(2) }}>
            <span>皇極曆</span>
            <span>年月</span>
            <span style={{ marginTop: sp(12) }}>{hwanggeuk.yearGanZhi}</span>
            <span>{hwanggeuk.monthGanZhi}</span>
          </div>

          {/* 황극력 일시 */}
          <div style={{ fontSize: fs(13), display: 'flex', flexDirection: 'column', gap: sp(2) }}>
            <span>皇極曆</span>
            <span>日時</span>
            <span style={{ marginTop: sp(12) }}>{dayGanZhi}</span>
            <span>{hwHourGanZhi}</span>
          </div>

          {/* 28수 */}
          <div style={{ fontSize: fs(13), display: 'flex', flexDirection: 'column', gap: sp(2) }}>
            <span>28宿</span>
            <span style={{ marginTop: sp(12) }}>{mansion.mansion}</span>
          </div>

          {/* 24절국 */}
          <div style={{ fontSize: fs(13), display: 'flex', flexDirection: 'column', gap: sp(2) }}>
            <span>24節局</span>
            <span style={{ marginTop: sp(12) }}>{solarTerm?.hanja || ''}</span>
          </div>

          {/* 소궁 대궁 64괘 */}
          <div style={{ fontSize: fs(13), display: 'flex', flexDirection: 'column', gap: sp(2) }}>
            <span>小宮</span>
            <span>大宮</span>
            <span>64卦</span>
            <span style={{ marginTop: sp(12) }}>{sogungDaegung.sogung}</span>
            <span>{sogungDaegung.daegung}</span>
            <span>{hexagram64?.hanja || ''}</span>
          </div>

          {/* 육신 */}
          <div style={{ fontSize: fs(13), display: 'flex', flexDirection: 'column', gap: sp(2) }}>
            <span>{sixSpirits[0]}</span>
            <span>{sixSpirits[1]}</span>
            <span>{sixSpirits[2]}</span>
            <span>{sixSpirits[3]}</span>
            <span>{sixSpirits[4]}</span>
            <span>{sixSpirits[5]}</span>
          </div>

          {/* 6개 부적 */}
          {sixBranches.map((branch, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: sp(4) }}>
              <span style={{ fontSize: fs(11) }}>{branch}부</span>
              <img 
                src={BRANCH_TALISMANS[branch]}
                alt={`${branch}부`}
                style={{ width: sp(60), objectFit: 'contain', writingMode: 'horizontal-tb' }}
              />
            </div>
          ))}

          {/* 주문 */}
          <div style={{ fontSize: fs(12), display: 'flex', flexDirection: 'column', gap: sp(2) }}>
            <span>侍天主造化定</span>
            <span>永世不忘萬事知</span>
          </div>
          <div style={{ fontSize: fs(12) }}>至氣今至願爲大降</div>
          <div style={{ fontSize: fs(12), display: 'flex', flexDirection: 'column', gap: sp(2) }}>
            <span>天文地理風雲造化</span>
            <span>八門遁甲六丁六甲</span>
            <span>智慧勇力</span>
          </div>
          <div style={{ fontSize: fs(12) }}>所願成就</div>

          {/* 기서, 언청, 신, 계용 */}
          <div style={{ fontSize: fs(13), display: 'flex', flexDirection: 'column', gap: sp(2) }}>
            <span>基祥西在{trigram.trigram}</span>
            <span style={{ marginTop: sp(20) }}>言聽</span>
            <span style={{ marginTop: sp(8) }}>神</span>
            <span style={{ marginTop: sp(8) }}>計用</span>
          </div>
        </div>
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
