import { Map, User, Star, BookOpen, ShoppingBag, CalendarDays, Users } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { getCalendarDayData } from "@/lib/calendarData";
import logoImage from "@assets/image_1767628183426.png";

export function Navigation() {
  const today = new Date();
  const dateStr = format(today, "yyyy.M.d");
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  const dayName = dayNames[today.getDay()];
  
  const todayData = getCalendarDayData(today.getFullYear(), today.getMonth() + 1, today.getDate());

  const menuItems = [
    { icon: CalendarDays, label: "Calendar", korLabel: "달력", href: "/calendar" },
    { icon: Star, label: "28su", korLabel: "28수", href: "/28su" },
    { icon: Users, label: "Community", korLabel: "커뮤니티", href: "/community" },
    { icon: BookOpen, label: "Ebook", korLabel: "전자책", href: "/ebook" },
    { icon: ShoppingBag, label: "Store", korLabel: "문구몰", href: "/store" },
    { icon: Map, label: "Map", korLabel: "지도", href: "/map" },
    { icon: User, label: "User", korLabel: "회원", href: "/user" },
  ];

  return (
    <div className="bg-white dark:bg-card border-b border-border pt-[50px]">
      <div className="max-w-[990px] mx-auto px-2">
        <div className="h-[70px] flex items-center justify-between relative">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" data-testid="link-logo">
            <img src={logoImage} alt="ORAE Logo" className="h-8 w-8" />
            <span className="text-2xl font-bold orae-pink">ORAE</span>
          </Link>

          <div className="absolute bottom-1 left-0">
            <div className="text-base">
              <span className="orae-pink font-bold">{dateStr} {dayName}</span>
              <span className="text-muted-foreground ml-2 text-sm">
                (음{todayData.lunarMonth}.{todayData.lunarDay} {todayData.dayGanZhi}日)
              </span>
            </div>
          </div>

          <div className="flex gap-4 items-end pb-1">
            {menuItems.map((item) => (
              <Link 
                key={item.label}
                href={item.href}
                className="flex flex-col items-center gap-0 group cursor-pointer"
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <item.icon className="h-8 w-8 orae-pink group-hover:opacity-70 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
