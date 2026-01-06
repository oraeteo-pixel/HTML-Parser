#!/usr/bin/env python3
"""Generate Hwanggeuk calendar data as Excel file"""

import openpyxl
from openpyxl.styles import Font, Alignment, Border, Side, PatternFill
from datetime import datetime, timedelta
import os

# Constants
HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]

TWENTY_EIGHT_MANSIONS = [
    "角", "亢", "氐", "房", "心", "尾", "箕",
    "斗", "牛", "女", "虛", "危", "室", "壁",
    "奎", "婁", "胃", "昴", "畢", "觜", "參",
    "井", "鬼", "柳", "星", "張", "翼", "軫"
]

MANSION_GENERALS = [
    "鄧禹", "馬成", "吳漢", "王梁", "賈復", "陣俊", "耿弇",
    "杜茂", "寇恂", "傅俊", "岑膨", "堅鐔", "馮異", "王覇",
    "朱佑", "任光", "祭遵", "李忠", "景丹", "万修", "蓋延",
    "邳肜", "銚期", "劉植", "耿純", "藏宮", "馬武", "劉隆"
]

MANSION_DESCRIPTIONS = [
    "日月之位", "天地之間", "瑞化之造", "珀雨之順", "寵露之功", "玲霜之心", "玉雪之契",
    "熱薰之序", "寒冷之節", "陰氣之理", "陽氣之理", "走獸之迷", "飛禽之殊", "人生之貴",
    "沙石之極", "岩岸之顯", "澤地之幽", "山岳之脉", "江水之精", "四季之土", "三冬之水",
    "三秋之金", "三夏之火", "三春之木", "煙霧之化", "風雲之墟", "河漢之邊", "星辰之道"
]

GANJI_TO_MANSION = {
    "甲子": 16, "乙丑": 15, "丙寅": 14, "丁卯": 13, "戊辰": 12, "己巳": 11,
    "庚午": 10, "辛未": 9, "壬申": 8, "癸酉": 7, "甲戌": 6, "乙亥": 5,
    "丙子": 4, "丁丑": 3, "戊寅": 2, "己卯": "中", "庚辰": "中", "辛巳": 1,
    "壬午": 0, "癸未": 27, "甲申": 26, "乙酉": 25, "丙戌": 24, "丁亥": 23,
    "戊子": 22, "己丑": 21, "庚寅": 20, "辛卯": 19, "壬辰": 18, "癸巳": 17,
    "甲午": 16, "乙未": 15, "丙申": 14, "丁酉": 13, "戊戌": 12, "己亥": 11,
    "庚子": 10, "辛丑": 9, "壬寅": 8, "癸卯": 7, "甲辰": 6, "乙巳": 5,
    "丙午": 4, "丁未": 3, "戊申": 2, "己酉": "中", "庚戌": "中", "辛亥": 1,
    "壬子": 0, "癸丑": 27, "甲寅": 26, "乙卯": 25, "丙辰": 24, "丁巳": 23,
    "戊午": 22, "己未": 21, "庚申": 20, "辛酉": 19, "壬戌": 18, "癸亥": 17
}

SIXTY_GANJI = [
    "甲子", "乙丑", "丙寅", "丁卯", "戊辰", "己巳", "庚午", "辛未", "壬申", "癸酉",
    "甲戌", "乙亥", "丙子", "丁丑", "戊寅", "己卯", "庚辰", "辛巳", "壬午", "癸未",
    "甲申", "乙酉", "丙戌", "丁亥", "戊子", "己丑", "庚寅", "辛卯", "壬辰", "癸巳",
    "甲午", "乙未", "丙申", "丁酉", "戊戌", "己亥", "庚子", "辛丑", "壬寅", "癸卯",
    "甲辰", "乙巳", "丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子", "癸丑",
    "甲寅", "乙卯", "丙辰", "丁巳", "戊午", "己未", "庚申", "辛酉", "壬戌", "癸亥"
]

HW_MONTH_DAYS = [30, 30, 30, 31, 31, 31, 31, 31, 31, 30, 30, 30]
HW_EPOCH_YEAR = 1989
HW_DAYS_PER_YEAR = 366

def get_hwanggeuk_date(solar_date):
    """Convert solar date to Hwanggeuk date"""
    year = solar_date.year
    hw_year_start = datetime(year, 4, 21)
    
    if solar_date < hw_year_start:
        hw_year_start = datetime(year - 1, 4, 21)
        hw_year = year - 1
    else:
        hw_year = year
    
    days_diff = (solar_date - hw_year_start).days
    
    hw_month = 1
    remaining_days = days_diff
    for i, month_days in enumerate(HW_MONTH_DAYS):
        if remaining_days < month_days:
            hw_month = i + 1
            break
        remaining_days -= month_days
    
    hw_day = remaining_days + 1
    
    return hw_year, hw_month, hw_day

def get_hwanggeuk_day_ganji(hw_year, hw_month, hw_day):
    """Get day Ganji for Hwanggeuk date"""
    days_from_epoch = (hw_year - HW_EPOCH_YEAR) * HW_DAYS_PER_YEAR
    for i in range(hw_month - 1):
        days_from_epoch += HW_MONTH_DAYS[i]
    days_from_epoch += hw_day - 1
    
    base_stem = 7  # 辛
    base_branch = 11  # 亥
    stem_index = (base_stem + days_from_epoch) % 10
    branch_index = (base_branch + days_from_epoch) % 12
    
    return HEAVENLY_STEMS[stem_index] + EARTHLY_BRANCHES[branch_index]

def get_28_mansion(ganji):
    """Get 28 mansion info from day Ganji"""
    mapping = GANJI_TO_MANSION.get(ganji)
    if mapping == "中":
        return "中", "-", "尊空"
    elif mapping is not None:
        return TWENTY_EIGHT_MANSIONS[mapping], MANSION_GENERALS[mapping], MANSION_DESCRIPTIONS[mapping]
    return "-", "-", "-"

def generate_calendar_excel(year=2026):
    """Generate Excel file with calendar data"""
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = f"황극력 {year}년"
    
    # Styles
    header_font = Font(bold=True, size=12)
    header_fill = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")
    header_font_white = Font(bold=True, size=12, color="FFFFFF")
    center_align = Alignment(horizontal="center", vertical="center")
    thin_border = Border(
        left=Side(style='thin'),
        right=Side(style='thin'),
        top=Side(style='thin'),
        bottom=Side(style='thin')
    )
    
    # Headers
    headers = ["양력", "황극력", "일간지", "28수", "마성(將)", "일월지위"]
    for col, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col, value=header)
        cell.font = header_font_white
        cell.fill = header_fill
        cell.alignment = center_align
        cell.border = thin_border
    
    # Generate data for the year
    start_date = datetime(year, 1, 1)
    end_date = datetime(year, 12, 31)
    current_date = start_date
    row = 2
    
    while current_date <= end_date:
        hw_year, hw_month, hw_day = get_hwanggeuk_date(current_date)
        day_ganji = get_hwanggeuk_day_ganji(hw_year, hw_month, hw_day)
        mansion, general, description = get_28_mansion(day_ganji)
        
        # Solar date
        ws.cell(row=row, column=1, value=current_date.strftime("%Y-%m-%d")).alignment = center_align
        ws.cell(row=row, column=1).border = thin_border
        
        # Hwanggeuk date
        ws.cell(row=row, column=2, value=f"{hw_year}년 {hw_month}월 {hw_day}일").alignment = center_align
        ws.cell(row=row, column=2).border = thin_border
        
        # Day Ganji
        ws.cell(row=row, column=3, value=day_ganji).alignment = center_align
        ws.cell(row=row, column=3).border = thin_border
        
        # 28 Mansion
        ws.cell(row=row, column=4, value=mansion).alignment = center_align
        ws.cell(row=row, column=4).border = thin_border
        
        # General
        ws.cell(row=row, column=5, value=general).alignment = center_align
        ws.cell(row=row, column=5).border = thin_border
        
        # Description
        ws.cell(row=row, column=6, value=description).alignment = center_align
        ws.cell(row=row, column=6).border = thin_border
        
        current_date += timedelta(days=1)
        row += 1
    
    # Adjust column widths
    ws.column_dimensions['A'].width = 14
    ws.column_dimensions['B'].width = 18
    ws.column_dimensions['C'].width = 10
    ws.column_dimensions['D'].width = 10
    ws.column_dimensions['E'].width = 12
    ws.column_dimensions['F'].width = 14
    
    # Save file
    output_path = "public/황극력_달력_2026.xlsx"
    wb.save(output_path)
    print(f"Excel file saved: {output_path}")
    return output_path

if __name__ == "__main__":
    generate_calendar_excel(2026)
