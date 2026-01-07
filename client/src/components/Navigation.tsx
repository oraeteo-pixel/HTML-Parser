import { User, Star, BookOpen, CalendarDays, Users, LogIn, LogOut, Loader2 } from "lucide-react";
import { Link } from "wouter";
import logoImage from "@assets/image_1767628183426.png";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Navigation() {
  const { user, isLoading, isAuthenticated, logout, isLoggingOut } = useAuth();
  
  const menuItems = [
    { icon: CalendarDays, label: "Calendar", korLabel: "달력", href: "/calendar" },
    { icon: Star, label: "28su", korLabel: "28수", href: "/28su" },
    { icon: Users, label: "Community", korLabel: "커뮤니티", href: "/community" },
    { icon: BookOpen, label: "Ebook", korLabel: "전자책", href: "/ebook" },
  ];

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-white dark:bg-card border-b border-border sticky top-0 z-50" style={{ boxShadow: "0 0 15px #ccc" }}>
      <div className="max-w-[990px] mx-auto px-2">
        <div className="h-[70px] flex items-center justify-between relative">
          <Link href="/calendar" className="flex items-center gap-1 hover:opacity-80 transition-opacity" data-testid="link-logo">
            <img src={logoImage} alt="ORAE Logo" className="h-10 w-10" />
          </Link>

          <div className="flex gap-4 items-end pb-1">
            {menuItems.map((item) => (
              <Link 
                key={item.label}
                href={item.href}
                className="flex flex-col items-center gap-0 group cursor-pointer"
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <item.icon className="h-8 w-8 group-hover:opacity-70 transition-opacity" style={{ color: 'hsl(210 20% 30%)' }} />
              </Link>
            ))}
            
            {isLoading ? (
              <div className="p-1">
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'hsl(210 20% 30%)' }} />
              </div>
            ) : isAuthenticated && user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button 
                    className="flex flex-col items-center gap-0 group cursor-pointer p-1 rounded-md bg-[hsl(210_20%_30%)]/20"
                    data-testid="nav-user"
                  >
                    {user.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="" 
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <User className="h-8 w-8 group-hover:opacity-70 transition-opacity" style={{ color: 'hsl(210 20% 30%)' }} />
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-center">
                      {user.firstName || user.email || "User"}
                    </p>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      data-testid="button-logout"
                    >
                      {isLoggingOut ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <LogOut className="h-4 w-4 mr-1" />
                      )}
                      로그아웃
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <button 
                className="flex flex-col items-center gap-0 group cursor-pointer"
                data-testid="nav-user"
                onClick={handleLogin}
              >
                <User className="h-8 w-8 group-hover:opacity-70 transition-opacity" style={{ color: 'hsl(210 20% 30%)' }} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
