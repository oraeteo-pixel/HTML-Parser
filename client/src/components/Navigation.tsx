import { Map, User, Star, BookOpen, ShoppingBag, CalendarDays, Users } from "lucide-react";
import { Link } from "wouter";
import logoImage from "@assets/image_1767628183426.png";

export function Navigation() {
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
            <img src={logoImage} alt="ORAE Logo" className="h-10 w-10" />
            <span className="text-3xl font-bold orae-pink">ORAE</span>
          </Link>

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
