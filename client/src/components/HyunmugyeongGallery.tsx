import { useState, useCallback, useEffect, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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

import page1 from "@assets/玄武經1쪽_1768798346130.jpg";
import page2 from "@assets/玄武經2쪽_1768798346131.jpg";
import page3 from "@assets/玄武經3쪽_1768798346132.jpg";
import page4 from "@assets/玄武經4쪽_1768798346133.jpg";
import page5 from "@assets/玄武經5쪽_1768798346133.jpg";
import page6 from "@assets/玄武經6쪽_1768798346136.jpg";
import page7 from "@assets/玄武經7쪽_1768798346137.jpg";
import page8 from "@assets/玄武經8쪽_1768798346138.jpg";
import page9 from "@assets/玄武經9쪽_1768798346139.jpg";
import page10 from "@assets/玄武經10쪽_1768798346140.jpg";
import page11 from "@assets/玄武經11쪽_1768798346141.jpg";
import page12 from "@assets/玄武經12쪽_1768798346141.jpg";
import page13 from "@assets/玄武經13쪽_1768798346142.jpg";
import page14 from "@assets/玄武經14쪽_1768798346143.jpg";
import page15 from "@assets/玄武經15쪽_1768798374396.jpg";
import page16 from "@assets/玄武經16쪽_1768798374398.jpg";
import page17 from "@assets/玄武經17쪽_1768798374399.jpg";
import page18 from "@assets/玄武經18쪽_1768798374400.jpg";
import page19 from "@assets/玄武經19쪽_1768798374401.jpg";
import page20 from "@assets/玄武經20쪽_1768798374402.jpg";
import page21 from "@assets/玄武經21쪽_1768798374403.jpg";
import page22 from "@assets/玄武經22쪽_1768798374404.jpg";
import page23 from "@assets/玄武經23쪽_1768798374404.jpg";
import page24 from "@assets/玄武經24쪽_1768798374405.jpg";
import page25 from "@assets/玄武經25쪽_1768798374406.jpg";
import page26 from "@assets/玄武經26쪽_1768798374407.jpg";
import page27 from "@assets/玄武經27쪽_1768798374407.jpg";
import page28 from "@assets/玄武經28쪽_1768798374408.jpg";
import page29 from "@assets/玄武經29쪽_1768798400003.jpg";
import page30 from "@assets/玄武經30쪽_1768798400006.jpg";
import page31 from "@assets/玄武經31쪽_1768798400007.jpg";
import page32 from "@assets/玄武經32쪽_1768798400008.jpg";
import page33 from "@assets/玄武經33쪽_1768798400008.jpg";
import page34 from "@assets/玄武經34쪽_1768798400009.jpg";
import page35 from "@assets/玄武經35쪽_1768798400010.jpg";
import page36 from "@assets/玄武經36쪽_1768798400011.jpg";

const pages = [
  page1, page2, page3, page4, page5, page6, page7, page8, page9, page10,
  page11, page12, page13, page14, page15, page16, page17, page18, page19, page20,
  page21, page22, page23, page24, page25, page26, page27, page28, page29, page30,
  page31, page32, page33, page34, page35, page36
];

export function HyunmugyeongGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
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


  return (
    <div className="w-full" data-testid="hyunmugyeong-gallery">
      {/* 황극력 정보박스 */}
      <div className="slim-info-bar mb-2 mx-0 py-1.5 px-2" data-testid="hyunmugyeong-info-bar">
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
            <div className="w-full mt-2">
              {calendarData.mansion.isZunkong ? (
                <span className="inline-block px-2 py-1 border border-gray-400 dark:border-gray-500 rounded text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
                  {calendarData.mansion.mansion}
                </span>
              ) : (
                <span className="inline-block p-2 border border-gray-400 dark:border-gray-500 rounded bg-white dark:bg-gray-800">
                  <img 
                    src={`/img/${calendarData.mansion.image}.jpg`}
                    alt={`${calendarData.mansion.general}`}
                    className="max-w-[150px] max-h-[200px] object-contain"
                  />
                  <span className="block text-center mt-1 text-sm text-gray-700 dark:text-gray-300">{calendarData.mansion.general}</span>
                </span>
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
                  className="min-h-[85vh] bg-white rounded-none overflow-hidden flex flex-col items-center justify-center relative"
                  data-testid={`gallery-page-${index + 1}`}
                >
                  <img
                    src={page}
                    alt={`현무경 ${index + 1}쪽`}
                    className="w-full h-auto max-h-[85vh] object-contain"
                    style={(index === 0 || index === 1) ? { marginLeft: '1px' } : undefined}
                    loading="lazy"
                  />
                  {(index === 0 || index === 1) && (
                    <div 
                      className="absolute text-center w-full" 
                      style={{ 
                        fontFamily: "'Noto Serif KR', 'Batang', serif",
                        top: '35%',
                        paddingLeft: '1px'
                      }}
                    >
                      <p className="text-sm md:text-base font-bold text-gray-900 tracking-wide">
                        普濟蒼生君不知 符書以外別無通
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          size="icon"
          variant="secondary"
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 opacity-80 hover:opacity-100"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          data-testid="button-gallery-prev"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          variant="secondary"
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 opacity-80 hover:opacity-100"
          onClick={scrollNext}
          disabled={!canScrollNext}
          data-testid="button-gallery-next"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center justify-center mt-2">
        <span className="text-xs text-muted-foreground">
          {selectedIndex + 1} / {pages.length}
        </span>
      </div>

    </div>
  );
}
