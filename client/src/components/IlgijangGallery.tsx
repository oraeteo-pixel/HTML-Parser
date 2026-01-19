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
} from "@/lib/calendarData";

import backgroundImg from "@assets/ilgijang-background.png";

const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

const TRIGRAM_KOREAN: { [key: string]: string } = {
  "乾": "건", "兌": "태", "離": "리", "震": "진",
  "巽": "손", "坎": "감", "艮": "간", "坤": "곤", "中": "중"
};

const MANSION_KOREAN: { [key: string]: string } = {
  "角": "각", "亢": "항", "氐": "저", "房": "방", "心": "심", "尾": "미", "箕": "기",
  "斗": "두", "牛": "우", "女": "녀", "虛": "허", "危": "위", "室": "실", "壁": "벽",
  "奎": "규", "婁": "루", "胃": "위", "昴": "묘", "畢": "필", "觜": "자", "參": "삼",
  "井": "정", "鬼": "귀", "柳": "류", "星": "성", "張": "장", "翼": "익", "軫": "진"
};

const SIX_SPIRITS = ["靑龍", "朱雀", "句陳", "螣蛇", "白虎", "玄武"];

function getSixSpiritForDayStem(dayStem: string): string {
  const stemGroups: { [key: string]: number } = {
    "甲": 0, "乙": 0,
    "丙": 1, "丁": 1,
    "戊": 2,
    "己": 3,
    "庚": 4, "辛": 4,
    "壬": 5, "癸": 5
  };
  return SIX_SPIRITS[stemGroups[dayStem] || 0];
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

    const dayStem = dayGanZhi[0];
    const sixSpirit = getSixSpiritForDayStem(dayStem);

    return {
      trigram,
      mansion,
      hwanggeuk,
      hwHourGanZhi,
      dayGanZhi,
      sixSpirit,
      dayStem,
      koreanDate: { year: adjustedYear, month: adjustedMonth, day: adjustedDay, hours, minutes }
    };
  }, [currentTime]);

  const { trigram, mansion, hwanggeuk, hwHourGanZhi, dayGanZhi, sixSpirit } = calendarData;

  const yearMonthText = `${hwanggeuk.yearGanZhi}年 ${hwanggeuk.monthGanZhi}月`;
  const dayHourTrigramText = `${dayGanZhi}日 ${hwHourGanZhi}時 ${trigram.trigram}之${mansion.mansion}`;

  const openFullscreen = () => {
    setFullscreenOpen(true);
    setIsZoomed(false);
  };

  const closeFullscreen = () => {
    setFullscreenOpen(false);
    setIsZoomed(false);
  };

  const DiaryContent = ({ scale = 1 }: { scale?: number }) => (
    <div 
      className="relative bg-white"
      style={{ 
        width: 724 * scale, 
        height: 1024 * scale,
        fontSize: `${scale}em`
      }}
    >
      <img
        src={backgroundImg}
        alt="황극력 일기장"
        className="absolute inset-0 w-full h-full object-contain"
      />
      
      <div 
        className="absolute text-black font-bold"
        style={{
          top: `${15.5 * scale}%`,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: `${14 * scale}px`,
          letterSpacing: `${2 * scale}px`,
          whiteSpace: 'nowrap'
        }}
      >
        {yearMonthText}
      </div>
      
      <div 
        className="absolute text-black font-bold"
        style={{
          top: `${17.5 * scale}%`,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: `${14 * scale}px`,
          letterSpacing: `${2 * scale}px`,
          whiteSpace: 'nowrap'
        }}
      >
        {dayHourTrigramText}
      </div>

      <div 
        className="absolute text-black font-semibold"
        style={{
          top: `${20 * scale}%`,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: `${12 * scale}px`
        }}
      >
        {sixSpirit}
      </div>

      {[25, 31.5, 38, 44.5, 51, 57.5].map((topPercent, idx) => (
        <div 
          key={idx}
          className="absolute text-black font-semibold"
          style={{
            top: `${topPercent * scale}%`,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: `${10 * scale}px`
          }}
        >
          {sixSpirit}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full" data-testid="ilgijang-gallery">
      <div 
        className="bg-white rounded-md overflow-hidden cursor-pointer hover-elevate flex items-center justify-center py-4"
        onClick={openFullscreen}
        data-testid="gallery-ilgijang-page-1"
      >
        <div className="max-w-full overflow-hidden flex justify-center">
          <DiaryContent scale={0.6} />
        </div>
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
            <div className="font-bold text-red-600 dark:text-red-400">{trigram.trigram} ({TRIGRAM_KOREAN[trigram.trigram]})</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded p-2 text-center">
            <div className="text-xs text-muted-foreground">28수</div>
            <div className="font-bold text-blue-600 dark:text-blue-400">{mansion.mansion} ({MANSION_KOREAN[mansion.mansion]})</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded p-2 text-center md:col-span-2">
            <div className="text-xs text-muted-foreground">육신</div>
            <div className="font-bold text-amber-700 dark:text-amber-300">{sixSpirit}</div>
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

            <div className={`transition-transform duration-300 ${isZoomed ? 'scale-150' : ''}`}>
              <DiaryContent scale={isZoomed ? 1.2 : 0.85} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
