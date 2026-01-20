import { useState, useEffect, useMemo } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  getKoreanDate,
  getHwanggeuk28Mansion,
  getHwanggeukDate,
  getHwanggeukHourGanZhi,
  getHwanggeukDayGanZhi,
  getSogungDaegung,
  get64HexagramName,
  getJeolguk,
  WEEKDAYS_HANJA,
} from "@/lib/calendarData";

import page1 from "@assets/deukchaebu-final.png";

export function DeukchaebuGallery() {
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTalisman, setShowTalisman] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
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
    const hwanggeuk = getHwanggeukDate(year, month, day, hours);
    const hwDayGanZhi = getHwanggeukDayGanZhi(hwanggeuk.year, hwanggeuk.month, hwanggeuk.day);
    const hwHourGanZhi = getHwanggeukHourGanZhi(year, month, day, hours, minutes);
    const jeolgukData = getJeolguk(hwanggeuk.year, hwanggeuk.month, hwanggeuk.day);
    const sogungDaegung = getSogungDaegung(new Date());
    const hexagram64 = get64HexagramName(sogungDaegung.sogung, sogungDaegung.daegung);
    const mansion = getHwanggeuk28Mansion(hwanggeuk.year, hwanggeuk.month, hwanggeuk.day);
    const weekdayHanja = WEEKDAYS_HANJA[new Date().getDay()];
    return { hwanggeuk, hwDayGanZhi, hwHourGanZhi, jeolguk: jeolgukData.name, sogungDaegung, hexagram64, mansion, weekdayHanja };
  }, [currentTime]);

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

  return (
    <div className="w-full" data-testid="deukchaebu-gallery">
      {/* 황극력 정보박스 */}
      <div className="slim-info-bar mb-2 mx-0 py-1.5 px-2" data-testid="deukchaebu-info-bar">
        <div className="flex flex-col gap-0.5 text-sm">
          <div className="flex flex-wrap items-center gap-1">
            <span className="font-bold text-gray-700 dark:text-gray-200">
              {calendarData.hwanggeuk.year}.{calendarData.hwanggeuk.month}.{calendarData.hwanggeuk.day}
            </span>
            <span className="font-semibold text-gray-600 dark:text-gray-300">
              {calendarData.weekdayHanja}
            </span>
            <span className="font-semibold text-gray-600 dark:text-gray-300">
              ({calendarData.hwanggeuk.yearGanZhi}年 {calendarData.hwanggeuk.monthGanZhi}月 {calendarData.hwDayGanZhi}日 {calendarData.hwHourGanZhi}時)
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <span className="font-bold text-gray-700 dark:text-gray-200">{calendarData.jeolguk}</span>
            <span className="font-semibold text-gray-600 dark:text-gray-300">
              &lt;소궁,대궁&gt;{calendarData.sogungDaegung.isZungung ? "존궁" : `${calendarData.sogungDaegung.sogung},${calendarData.sogungDaegung.daegung}`} {calendarData.hexagram64?.fullName || ''}
            </span>
            <button 
              className="slim-badge-cyan cursor-pointer text-xs"
              onClick={() => setShowTalisman(!showTalisman)}
              data-testid="button-mansion-toggle"
            >
              {calendarData.mansion.isZunkong ? calendarData.mansion.mansion : `${calendarData.mansion.mansion}, ${calendarData.mansion.general}`}
            </button>
          </div>
        </div>
      </div>

      {/* 28장 부적 표시 */}
      {!calendarData.mansion.isZunkong && (
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out talisman-box rounded-lg ${showTalisman ? 'max-h-[400px] opacity-100 p-4 my-2' : 'max-h-0 opacity-0 p-0 my-0'}`}
        >
          <div className="flex flex-col items-center">
            <img 
              src={`/img/${calendarData.mansion.image}.jpg`}
              alt={`${calendarData.mansion.mansion} 부적`}
              className="max-w-[200px] max-h-[280px] object-contain border border-border rounded-lg shadow-lg bg-white"
            />
          </div>
        </div>
      )}

      <div 
        className="bg-white rounded-none overflow-hidden cursor-pointer hover-elevate flex items-center justify-center py-4"
        onClick={openFullscreen}
        data-testid="gallery-deukchae-page-1"
      >
        <img
          src={page1}
          alt="득체부"
          className="h-auto object-contain"
          style={{ maxWidth: '100%' }}
        />
      </div>

      <Dialog open={fullscreenOpen} onOpenChange={() => closeFullscreen()}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 z-20 text-white hover:bg-white/20"
              onClick={closeFullscreen}
              data-testid="button-deukchae-fullscreen-close"
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-14 z-20 text-white hover:bg-white/20"
              onClick={() => setIsZoomed(!isZoomed)}
              data-testid="button-deukchae-fullscreen-zoom"
            >
              {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
            </Button>

            <div 
              className={`transition-transform duration-300 ${isZoomed ? 'overflow-auto' : 'overflow-hidden'}`}
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            >
              <img
                src={page1}
                alt="득체부"
                className={`transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-move' : 'max-w-full object-contain cursor-zoom-in'}`}
                onClick={() => !isZoomed && setIsZoomed(true)}
                data-testid="img-deukchae-fullscreen"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
