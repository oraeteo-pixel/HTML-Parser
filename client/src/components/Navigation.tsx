import { Map, User, Star, BookOpen, ShoppingBag, CalendarDays, Users } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import logoImage from "@assets/image_1767628183426.png";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { AuthForms } from "@/components/AuthForms";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Navigation() {
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  
  const menuItems = [
    { icon: CalendarDays, label: "Calendar", korLabel: "달력", href: "/calendar" },
    { icon: Star, label: "28su", korLabel: "28수", href: "/28su" },
    { icon: Users, label: "Community", korLabel: "커뮤니티", href: "/community" },
    { icon: BookOpen, label: "Ebook", korLabel: "전자책", href: "/ebook" },
    { icon: ShoppingBag, label: "Store", korLabel: "문구몰", href: "/store" },
    { icon: Map, label: "Map", korLabel: "지도", href: "/map" },
  ];

  return (
    <div className="bg-white dark:bg-card border-b border-border sticky top-0 z-50" style={{ boxShadow: "0 0 15px #ccc" }}>
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
            
            {user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button 
                    className="flex flex-col items-center gap-0 group cursor-pointer"
                    data-testid="nav-user"
                  >
                    <User className="h-8 w-8 orae-pink group-hover:opacity-70 transition-opacity" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-center">{user.nickname}</p>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => logout.mutate()}
                      data-testid="button-logout"
                    >
                      로그아웃
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <button 
                className="flex flex-col items-center gap-0 group cursor-pointer"
                data-testid="nav-user"
                onClick={() => setAuthOpen(true)}
              >
                <User className="h-8 w-8 orae-pink group-hover:opacity-70 transition-opacity" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <VisuallyHidden>
            <DialogTitle>로그인 / 회원가입</DialogTitle>
            <DialogDescription>ORAE 회원 인증</DialogDescription>
          </VisuallyHidden>
          <AuthForms onSuccess={() => setAuthOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
