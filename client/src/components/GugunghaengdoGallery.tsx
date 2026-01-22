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

import palgwaeImage from "@assets/image_1769055485170.png";

const GUGUNG_HEADER = ["10乾", "9離", "8艮", "7兌", "6中", "5震", "4兌", "3坎", "2坤", "9宮", "80分1宮"];
const GUGUNG_DATA = [
  { cols: [10, 9, 8, 7, 6, 5, 4, 3, 2, "子", "11:00~12:20"] },
  { cols: [9, 8, 5, 10, 6, 2, 7, 4, 3, "二次", "12:20~1:40"] },
  { cols: [8, 5, 2, 9, 6, 3, 10, 7, 4, "三次", "1:40~3:00"] },
  { cols: [7, 10, 9, 4, 6, 8, 3, 2, 5, "四次", "3:00~4:20"] },
  { cols: [6, 6, 6, 6, 6, 6, 6, 6, 6, "五次", "4:20~5:40"] },
  { cols: [5, 2, 3, 8, 6, 4, 9, 10, 7, "六次", "5:40~7:00"] },
  { cols: [4, 7, 10, 3, 6, 9, 2, 5, 8, "七次", "7:00~8:20"] },
  { cols: [3, 4, 7, 2, 6, 10, 5, 8, 9, "八次", "8:20~9:40"] },
  { cols: [2, 3, 4, 5, 6, 7, 8, 9, 10, "九次", "9:40~11:00"] },
];

const HAENGNO_DATA = [
  { cheon: "一天", cols: ["二之二", "二之三", "二之四", "二之五", "二之六", "二之七", "二之八", "二之九", "二之十"], meanings: ["원(原)", "잠(潛)", "수(守)", "신(信)", "직(直)", "몽(蒙)", "한(閑)", "수(須)", "려(厲)"] },
  { cheon: "二天", cols: ["三之二", "三之三", "三之四", "三之五", "三之六", "三之七", "三之八", "三之九", "三之十"], meanings: ["성(成)", "충(沖)", "진(振)", "기(祈)", "상(常)", "유(柔)", "이(易)", "친(親)", "화(華)"] },
  { cheon: "三天", cols: ["四之二", "四之三", "四之四", "四之五", "四之六", "四之七", "四之八", "四之九", "四之十"], meanings: ["견(見)", "획(獲)", "종(從)", "교(交)", "육(育)", "장(壯)", "흥(興)", "흔(欣)", "서(舒)"] },
  { cheon: "四天", cols: ["五之二", "五之三", "五之四", "五之五", "五之六", "五之七", "五之八", "五之九", "五之十"], meanings: ["비(比)", "개(開)", "진(晉)", "공(公)", "익(益)", "장(章)", "영(盈)", "석(錫)", "미(靡)"] },
  { cheon: "五天", cols: ["六之二", "六之三", "六之四", "六之五", "六之六", "六之七", "六之八", "六之九", "六之十"], meanings: ["서(庶)", "결(決)", "예(豫)", "승(升)", "중(中)", "복(伏)", "과(過)", "의(疑)", "과(寡)"] },
  { cheon: "六天", cols: ["七之二", "七之三", "七之四", "七之五", "七之六", "七之七", "七之八", "七之九", "七之十"], meanings: ["식(飾)", "려(戾)", "허(虛)", "매(昧)", "손(損)", "용(用)", "극(極)", "흡(翕)", "원(遠)"] },
  { cheon: "七天", cols: ["八之二", "八之三", "八之四", "八之五", "八之六", "八之七", "八之八", "八之九", "八之十"], meanings: ["신(迅)", "구(懼)", "제(除)", "약(弱)", "질(疾)", "경(競)", "분(分)", "송(訟)", "수(收)"] },
  { cheon: "八天", cols: ["九之二", "九之三", "九之四", "九之五", "九之六", "九之七", "九之八", "九之九", "九之十"], meanings: ["실(實)", "빈(賓)", "위(危)", "견(堅)", "혁(革)", "보(報)", "지(止)", "융(戎)", "결(結)"] },
  { cheon: "九天", cols: ["十之二", "十之三", "十之四", "十之五", "十之六", "十之七", "十之八", "十之九", "十之十"], meanings: ["양(養)", "우(遇)", "승(勝)", "수(囚)", "임(任)", "고(固)", "이(移)", "타(墮)", "종(終)"] },
];

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

      {/* 팔괘그림 + 대궁소궁 구궁 행로표 (나란히) */}
      <div className="flex flex-col md:flex-row gap-1 mb-4">
        {/* 팔괘그림 */}
        <div 
          className="bg-white rounded-md overflow-hidden flex items-center justify-center py-2 md:w-1/3"
          data-testid="gallery-palgwae-image"
        >
          <img
            src={palgwaeImage}
            alt="용담도에 적용한 천간 (동지기준)"
            className="max-w-full max-h-[350px] object-contain"
          />
        </div>

        {/* 대궁소궁 구궁 행로표 */}
        <div 
          className="bg-white dark:bg-gray-900 rounded-md overflow-hidden py-4 px-2 md:w-2/3"
          data-testid="gallery-gugung-table"
        >
          <h3 className="text-center text-base font-bold mb-3 text-gray-800 dark:text-gray-200">
            皇極數 4.5日 九宮 行路 1宮 80分
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  {GUGUNG_HEADER.map((header, idx) => (
                    <th key={idx} className="border border-gray-300 dark:border-gray-600 px-1 py-1 text-center font-bold text-gray-800 dark:text-gray-200">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GUGUNG_DATA.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-gray-300 dark:border-gray-600">
                    {row.cols.map((col, colIndex) => (
                      <td key={colIndex} className="border border-gray-300 dark:border-gray-600 px-1 py-1 text-center text-gray-800 dark:text-gray-200">
                        {col}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 황극력 9천 행로표 */}
      <div 
        className="bg-white dark:bg-gray-900 rounded-md overflow-hidden py-4 px-2"
        data-testid="gallery-haengno-table"
      >
        <h3 className="text-center text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
          &lt; 황극력 9천(天) 행로(行路)표 &gt;
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs md:text-sm">
            <tbody>
              {HAENGNO_DATA.map((row, rowIndex) => (
                <>
                  <tr key={`${rowIndex}-cols`} className="border-b border-gray-300 dark:border-gray-600">
                    <td className="border border-gray-300 dark:border-gray-600 px-1 py-1 text-center font-bold bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200" rowSpan={2}>
                      {row.cheon}
                    </td>
                    {row.cols.map((col, colIndex) => (
                      <td key={colIndex} className="border border-gray-300 dark:border-gray-600 px-1 py-1 text-center bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {col}
                      </td>
                    ))}
                  </tr>
                  <tr key={`${rowIndex}-meanings`} className="border-b border-gray-300 dark:border-gray-600">
                    {row.meanings.map((meaning, meaningIndex) => (
                      <td key={meaningIndex} className="border border-gray-300 dark:border-gray-600 px-1 py-1 text-center text-gray-800 dark:text-gray-200">
                        {meaning}
                      </td>
                    ))}
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
