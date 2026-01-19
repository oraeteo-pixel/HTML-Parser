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
} from "@/lib/calendarData";

import talismanGeneral from "@assets/talisman-general.jpg";
import talismanSa from "@assets/talisman-sa.png";
import talismanMyo from "@assets/talisman-myo.jpg";
import talismanChuk from "@assets/talisman-chuk.png";
import talismanHae from "@assets/talisman-hae.png";
import talismanYu from "@assets/talisman-yu.jpg";
import talismanMi from "@assets/talisman-mi.png";

const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const SIX_SPIRITS = ["靑龍", "朱雀", "句陳", "螣蛇", "白虎", "玄武"];

const BRANCH_TALISMANS: { [key: string]: string } = {
  "子": talismanChuk,
  "丑": talismanChuk,
  "寅": talismanMyo,
  "卯": talismanMyo,
  "辰": talismanSa,
  "巳": talismanSa,
  "午": talismanMi,
  "未": talismanMi,
  "申": talismanYu,
  "酉": talismanYu,
  "戌": talismanHae,
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

function getHourBranches(hourBranch: string): string[] {
  const startIdx = EARTHLY_BRANCHES.indexOf(hourBranch);
  const branches: string[] = [];
  
  for (let i = 0; i < 6; i++) {
    branches.push(EARTHLY_BRANCHES[(startIdx + i) % 12]);
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

    const dayStem = dayGanZhi[0];
    const hourBranch = hwHourGanZhi[1];
    
    const sixSpirits = getSixSpiritsForDay(dayStem);
    const hourBranches = getHourBranches(hourBranch);

    return {
      trigram,
      mansion,
      hwanggeuk,
      hwHourGanZhi,
      dayGanZhi,
      solarTerm,
      sixSpirits,
      hourBranches,
      dayStem,
      koreanDate: { year: adjustedYear, month: adjustedMonth, day: adjustedDay, hours, minutes }
    };
  }, [currentTime]);

  const { trigram, mansion, hwanggeuk, hwHourGanZhi, dayGanZhi, solarTerm, sixSpirits, hourBranches } = calendarData;

  const openFullscreen = () => {
    setFullscreenOpen(true);
    setIsZoomed(false);
  };

  const closeFullscreen = () => {
    setFullscreenOpen(false);
    setIsZoomed(false);
  };

  const DiaryContent = ({ scale = 1 }: { scale?: number }) => {
    return (
      <div 
        className="relative bg-white border border-gray-300 rounded-lg overflow-hidden"
        style={{ 
          width: 700 * scale,
          padding: 16 * scale,
          fontFamily: "'Noto Sans KR', 'Nanum Gothic', sans-serif"
        }}
      >
        <div className="flex items-start gap-4" style={{ gap: 16 * scale }}>
          <div className="flex-shrink-0">
            <img 
              src={talismanGeneral} 
              alt="장군" 
              style={{ 
                height: 100 * scale,
                objectFit: 'contain'
              }}
            />
          </div>

          <div className="flex-1">
            <div 
              className="font-bold text-black mb-1"
              style={{ fontSize: 14 * scale }}
            >
              {hwanggeuk.yearGanZhi}年 {hwanggeuk.monthGanZhi}月 {solarTerm?.hanja || ''}節局
            </div>

            <div 
              className="font-bold text-black mb-2"
              style={{ fontSize: 14 * scale }}
            >
              {dayGanZhi}日 {hwHourGanZhi}時 {trigram.trigram}之{mansion.mansion}
            </div>

            <div 
              className="grid grid-cols-6 gap-1"
              style={{ gap: 8 * scale }}
            >
              {hourBranches.map((branch, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col items-center"
                >
                  <div 
                    className="font-bold text-black text-center"
                    style={{ fontSize: 10 * scale }}
                  >
                    {sixSpirits[idx]}
                  </div>
                  
                  <img 
                    src={BRANCH_TALISMANS[branch] || talismanSa}
                    alt={`${branch} 부적`}
                    style={{ 
                      height: 70 * scale,
                      objectFit: 'contain'
                    }}
                  />
                  
                  <div 
                    className="font-bold text-black text-center"
                    style={{ fontSize: 10 * scale }}
                  >
                    {sixSpirits[idx]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 text-center">
          <div 
            className="text-black"
            style={{ fontSize: 11 * scale }}
          >
            侍天主造化定永世不忘萬事知
          </div>
          <div 
            className="text-black"
            style={{ fontSize: 11 * scale }}
          >
            至氣今至願爲大降
          </div>
          <div 
            className="text-black"
            style={{ fontSize: 10 * scale }}
          >
            天文地理風雲造化八門遁甲六丁六甲智慧勇力
          </div>
          <div 
            className="mt-1 text-black font-bold"
            style={{ fontSize: 11 * scale }}
          >
            所願成就
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full" data-testid="ilgijang-gallery">
      <div 
        className="bg-white rounded-md overflow-hidden cursor-pointer hover-elevate flex items-center justify-center py-4 overflow-x-auto"
        onClick={openFullscreen}
        data-testid="gallery-ilgijang-page-1"
      >
        <DiaryContent scale={0.85} />
      </div>

      <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
        <h3 className="text-lg font-semibold mb-2 text-amber-800 dark:text-amber-200">오늘의 황극력 정보</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-white dark:bg-gray-900 rounded p-2 text-center">
            <div className="text-xs text-muted-foreground">년</div>
            <div className="font-bold text-purple-700 dark:text-purple-300">{hwanggeuk.yearGanZhi}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded p-2 text-center">
            <div className="text-xs text-muted-foreground">월</div>
            <div className="font-bold text-green-700 dark:text-green-300">{hwanggeuk.monthGanZhi}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded p-2 text-center">
            <div className="text-xs text-muted-foreground">일</div>
            <div className="font-bold text-orange-700 dark:text-orange-300">{dayGanZhi}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded p-2 text-center">
            <div className="text-xs text-muted-foreground">시</div>
            <div className="font-bold text-cyan-700 dark:text-cyan-300">{hwHourGanZhi}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded p-2 text-center">
            <div className="text-xs text-muted-foreground">8괘</div>
            <div className="font-bold text-red-600 dark:text-red-400">{trigram.trigram}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded p-2 text-center">
            <div className="text-xs text-muted-foreground">28수</div>
            <div className="font-bold text-blue-600 dark:text-blue-400">{mansion.mansion}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded p-2 text-center">
            <div className="text-xs text-muted-foreground">절기</div>
            <div className="font-bold text-emerald-700 dark:text-emerald-300">{solarTerm?.hanja}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded p-2 text-center">
            <div className="text-xs text-muted-foreground">육신</div>
            <div className="font-bold text-amber-700 dark:text-amber-300">{sixSpirits[0]}</div>
          </div>
        </div>
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

            <div className={`transition-transform duration-300 ${isZoomed ? 'scale-125' : ''}`}>
              <DiaryContent scale={isZoomed ? 1.4 : 1.1} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
