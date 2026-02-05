import { useState, useCallback, useEffect, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
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

import page1 from "@assets/image_1768886387533.png";

const pages = [page1];

export function SomyeoleumhaebuGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<number | null>(null);
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

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const openFullscreen = (index: number) => {
    setFullscreenImage(index);
    setIsZoomed(false);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
    setIsZoomed(false);
  };

  const navigateFullscreen = (direction: "prev" | "next") => {
    if (fullscreenImage === null) return;
    const newIndex = direction === "prev" 
      ? Math.max(0, fullscreenImage - 1)
      : Math.min(pages.length - 1, fullscreenImage + 1);
    setFullscreenImage(newIndex);
    setIsZoomed(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreenImage === null) return;
      if (e.key === "Escape") closeFullscreen();
      if (e.key === "ArrowLeft") navigateFullscreen("prev");
      if (e.key === "ArrowRight") navigateFullscreen("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenImage]);

  return (
    <div className="w-full" data-testid="somyeoleumhaebu-gallery">
      {/* 황극력 정보박스 */}
      <div className="slim-info-bar mb-2 mx-0 py-1.5 px-2" data-testid="somyeoleumhaebu-info-bar">
        <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-0.5 md:gap-2 text-sm">
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
          {showTalisman && (
            <div className="mt-2">
              {calendarData.mansion.isZunkong ? (
                <div className="inline-block px-2 py-1 border border-gray-400 dark:border-gray-500 rounded text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
                  {calendarData.mansion.mansion}
                </div>
              ) : (
                <div className="inline-block p-2 border border-gray-400 dark:border-gray-500 rounded bg-white dark:bg-gray-800">
                  <img 
                    src={`/img/${calendarData.mansion.image}.jpg`}
                    alt={`${calendarData.mansion.general}`}
                    className="max-w-[150px] max-h-[200px] object-contain"
                  />
                  <div className="text-center mt-1 text-sm text-gray-700 dark:text-gray-300">{calendarData.mansion.general}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {pages.map((page, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 px-0"
              >
                <div 
                  className="bg-white rounded-none overflow-hidden flex items-center justify-center py-4"
                  data-testid={`gallery-somyeol-page-${index + 1}`}
                >
                  <img
                    src={page}
                    alt={`소멸음해부 ${index + 1}쪽`}
                    className="max-w-[400px] h-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {pages.length > 1 && (
          <>
            <Button
              size="icon"
              variant="secondary"
              className="absolute left-1 top-1/2 -translate-y-1/2 z-10 opacity-80 hover:opacity-100"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              data-testid="button-somyeol-gallery-prev"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              variant="secondary"
              className="absolute right-1 top-1/2 -translate-y-1/2 z-10 opacity-80 hover:opacity-100"
              onClick={scrollNext}
              disabled={!canScrollNext}
              data-testid="button-somyeol-gallery-next"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      <div className="flex items-center justify-center mt-2">
        <span className="text-xs text-muted-foreground">
          {selectedIndex + 1} / {pages.length}
        </span>
      </div>

      <Dialog open={fullscreenImage !== null} onOpenChange={() => closeFullscreen()}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 z-20 text-white hover:bg-white/20"
              onClick={closeFullscreen}
              data-testid="button-somyeol-fullscreen-close"
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-14 z-20 text-white hover:bg-white/20"
              onClick={() => setIsZoomed(!isZoomed)}
              data-testid="button-somyeol-fullscreen-zoom"
            >
              {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
            </Button>

            {fullscreenImage !== null && fullscreenImage > 0 && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20"
                onClick={() => navigateFullscreen("prev")}
                data-testid="button-somyeol-fullscreen-prev"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}

            {fullscreenImage !== null && fullscreenImage < pages.length - 1 && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20"
                onClick={() => navigateFullscreen("next")}
                data-testid="button-somyeol-fullscreen-next"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}

            {fullscreenImage !== null && (
              <div 
                className={`transition-transform duration-300 ${isZoomed ? 'overflow-auto' : 'overflow-hidden'}`}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              >
                <img
                  src={pages[fullscreenImage]}
                  alt={`소멸음해부 ${fullscreenImage + 1}쪽`}
                  className={`transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-move' : 'max-h-[85vh] max-w-full object-contain cursor-zoom-in'}`}
                  onClick={() => !isZoomed && setIsZoomed(true)}
                  data-testid="img-somyeol-fullscreen"
                />
              </div>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {fullscreenImage !== null ? `${fullscreenImage + 1} / ${pages.length}` : ""}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
