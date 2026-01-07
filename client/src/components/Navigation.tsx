import { User, Star, BookOpen, CalendarDays, Users, LogOut, Loader2, PenSquare } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import logoImage from "@assets/image_1767628183426.png";
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
          <Link href="/calendar" className="flex items-center gap-1 hover:opacity-80 transition-opacity" data-testid="link-logo">
            <img src={logoImage} alt="ORAE Logo" className="h-8 w-8 sm:h-10 sm:w-10" />
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
                  strokeWidth={2} 
                />
              </Link>
            ))}
            
            {isLoading ? (
              <div className="p-1">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" style={{ color: 'hsl(210 20% 30%)' }} strokeWidth={2} />
              </div>
            ) : isAuthenticated && user ? (
              <>
              <Popover>
                <PopoverTrigger asChild>
                  <button 
                    className="flex flex-col items-center gap-0 group cursor-pointer"
                    data-testid="nav-write"
                  >
                    <PenSquare className="h-6 w-6 sm:h-8 sm:w-8 group-hover:opacity-70 transition-opacity text-primary" strokeWidth={2} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2">
                  <div className="space-y-1">
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setLocation("/madang?write=true")}
                      data-testid="button-write-madang"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      마당에 글쓰기
                    </Button>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setLocation("/ebook?write=true")}
                      data-testid="button-write-ebook"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      전자책 올리기
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
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
                <User className="h-6 w-6 sm:h-8 sm:w-8 group-hover:opacity-70 transition-opacity" style={{ color: 'hsl(210 20% 30%)' }} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
