import { useState, useEffect, useMemo } from "react";
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

  return (
    <div className="w-full" data-testid="deukchaebu-gallery">
      {/* 황극력 정보박스 */}
      <div className="slim-info-bar mb-2 mx-0 py-1.5 px-2" data-testid="deukchaebu-info-bar">
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

      <div 
        className="bg-white rounded-none overflow-hidden flex items-center justify-center py-4"
        data-testid="gallery-deukchae-page-1"
      >
        <img
          src={page1}
          alt="득체부"
          className="h-auto object-contain"
          style={{ maxWidth: '100%' }}
        />
      </div>
    </div>
  );
}
