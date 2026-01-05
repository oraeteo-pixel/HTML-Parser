import { Grid, Map, User, LayoutGrid } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

export function Navigation() {
  const today = new Date();
  const dateStr = format(today, "yyyy.M.d");
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  const dayKor = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = dayNames[today.getDay()];

  const menuItems = [
    { icon: LayoutGrid, label: "Square", korLabel: "광장" },
    { icon: Map, label: "Map", korLabel: "지도" },
    { icon: Grid, label: "Madang", korLabel: "마당" },
    { icon: User, label: "User", korLabel: "회원" },
  ];

  return (
    <div className="bg-white border-b border-border pt-[50px]">
      <div className="max-w-[990px] mx-auto px-2">
        <div className="h-[70px] flex items-center justify-between relative">
          <Link href="/" className="block" data-testid="link-logo">
            <span className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
              오리알터닷컴
            </span>
          </Link>

          <div className="absolute bottom-1 left-1">
            <div className="orae-pink text-lg font-bold">
              <strong>{dateStr} {dayName}</strong>
              <span className="text-muted-foreground ml-2 text-sm">(음11.17 己卯日)</span>
            </div>
          </div>

          <div className="flex gap-4 items-end pb-1">
            {menuItems.map((item) => (
              <button 
                key={item.label}
                className="flex flex-col items-center gap-0 group cursor-pointer"
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <item.icon className="h-8 w-8 orae-pink group-hover:text-accent transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
