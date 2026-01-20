import { useState, useMemo, useEffect } from "react";
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

export function GugunghaengdoGallery() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTalisman, setShowTalisman] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const calendarData = useMemo(() => {
    const koreanDate = getKoreanDate();
    const { year, month, day, hours, minutes } = koreanDate;
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

  return (
    <div className="w-full" data-testid="gugunghaengdo-gallery">
      <div className="slim-info-bar mb-2 mx-0 py-1.5 px-2" data-testid="gugunghaengdo-info-bar">
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
        </div>
      </div>

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
        className="bg-white rounded-none overflow-hidden flex items-center justify-center py-4"
        data-testid="gallery-gugunghaengdo-page-1"
      >
        <div className="text-center text-muted-foreground p-8">
          <p className="text-lg font-semibold">구궁행로도</p>
          <p className="text-sm mt-2">준비 중입니다</p>
        </div>
      </div>
    </div>
  );
}
