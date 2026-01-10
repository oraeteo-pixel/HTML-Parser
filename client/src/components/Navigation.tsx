import { User, Star, BookOpen, CalendarDays, Users, LogOut, Loader2, Mail } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Post } from "@shared/schema";

type PostWithAuthor = Post & { author: string };

export function Navigation() {
  const { user, isLoading, isAuthenticated, logout, isLoggingOut } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: madangPosts } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/posts/section/madang"],
    enabled: isAuthenticated,
  });
  
  const { data: ebookPosts } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/posts/section", "ebook"],
    queryFn: () => fetch("/api/posts/section/ebook").then(res => res.json()),
    enabled: isAuthenticated,
  });
  
  const { data: unreadCount } = useQuery<{ count: number }>({
    queryKey: ["/api/messages/unread-count"],
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });
  
  const userHasMadangPosts = madangPosts?.some(post => post.authorId === user?.id);
  const userHasEbookPosts = ebookPosts?.some(post => post.authorId === user?.id);
  
  const menuItems = [
    { icon: CalendarDays, label: "Calendar", korLabel: "달력", href: "/calendar", hasUserContent: false },
    { icon: Star, label: "28su", korLabel: "28수", href: "/28su", hasUserContent: false },
    { icon: Users, label: "Community", korLabel: "마당", href: "/madang", hasUserContent: userHasMadangPosts },
    { icon: BookOpen, label: "Ebook", korLabel: "전자책", href: "/ebook", hasUserContent: userHasEbookPosts },
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
        <div className="h-[56px] sm:h-[70px] flex items-center justify-between relative">
          <Link href="/calendar" className="flex items-center gap-2 hover:opacity-80 transition-opacity" data-testid="link-logo">
            <svg viewBox="0 0 40 40" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" stroke="#0d7377" strokeWidth="2.5" fill="none"/>
              <circle cx="20" cy="20" r="14" stroke="#0d7377" strokeWidth="2.5" fill="none"/>
              <circle cx="20" cy="20" r="10" stroke="#0d7377" strokeWidth="2.5" fill="none"/>
              <circle cx="20" cy="20" r="6" stroke="#0d7377" strokeWidth="2.5" fill="none"/>
              <circle cx="20" cy="20" r="2" fill="#0d7377"/>
              <line x1="20" y1="2" x2="20" y2="10" stroke="#0d7377" strokeWidth="2.5"/>
              <line x1="6" y1="12" x2="12" y2="16" stroke="#0d7377" strokeWidth="2.5"/>
              <line x1="28" y1="16" x2="34" y2="12" stroke="#0d7377" strokeWidth="2.5"/>
              <line x1="8" y1="28" x2="14" y2="24" stroke="#0d7377" strokeWidth="2.5"/>
              <line x1="26" y1="24" x2="32" y2="28" stroke="#0d7377" strokeWidth="2.5"/>
            </svg>
            <span className="text-2xl sm:text-3xl font-bold tracking-wide" style={{ color: '#0d7377' }}>ORAE</span>
          </Link>

          <div className="flex gap-2 sm:gap-4 items-end pb-1">
            {menuItems.map((item) => (
              <Link 
                key={item.label}
                href={item.href}
                className="flex flex-col items-center gap-0 group cursor-pointer"
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <item.icon 
                  className={`h-6 w-6 sm:h-8 sm:w-8 group-hover:opacity-70 transition-opacity ${item.hasUserContent ? 'text-primary' : ''}`}
                  style={item.hasUserContent ? undefined : { color: 'hsl(210 20% 30%)' }} 
                  strokeWidth={2.5} 
                />
              </Link>
            ))}
            
            {isLoading ? (
              <div className="p-1">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" style={{ color: 'hsl(210 20% 30%)' }} strokeWidth={2.5} />
              </div>
            ) : isAuthenticated && user ? (
              <>
              <Link
                href="/messages"
                className="flex flex-col items-center gap-0 group cursor-pointer relative"
                data-testid="nav-messages"
              >
                <Mail className={`h-6 w-6 sm:h-8 sm:w-8 group-hover:opacity-70 transition-opacity ${unreadCount?.count ? 'text-primary' : ''}`} style={unreadCount?.count ? undefined : { color: 'hsl(210 20% 30%)' }} strokeWidth={2.5} />
                {unreadCount?.count ? (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {unreadCount.count > 9 ? '9+' : unreadCount.count}
                  </span>
                ) : null}
              </Link>
              <Popover>
                <PopoverTrigger asChild>
                  <button 
                    className="flex flex-col items-center gap-0 group cursor-pointer"
                    data-testid="nav-user"
                  >
                    {user.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="" 
                        className="h-6 w-6 sm:h-8 sm:w-8 rounded-full"
                      />
                    ) : (
                      <User className="h-6 w-6 sm:h-8 sm:w-8 group-hover:opacity-70 transition-opacity text-primary" strokeWidth={2.5} />
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
              </>
            ) : (
              <button 
                className="flex flex-col items-center gap-0 group cursor-pointer"
                data-testid="nav-user"
                onClick={handleLogin}
              >
                <User className="h-6 w-6 sm:h-8 sm:w-8 group-hover:opacity-70 transition-opacity" style={{ color: 'hsl(210 20% 30%)' }} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
