import { User, Star, BookOpen, CalendarDays, Users, LogOut, Loader2, Mail, Settings } from "lucide-react";
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

interface LogoSettings {
  logoText?: string;
  logoTextKorean?: string;
  logoTextHanja?: string;
  logoColor?: string;
  logoFontFamily?: string;
  logoTextSize?: string;
  logoTextKoreanSize?: string;
  logoTextHanjaSize?: string;
  logoImageUrl?: string;
  logoScale?: string;
  logoSharpness?: string;
  logoBackgroundColor?: string;
  logoTextEnabled?: string;
  logoTextContent?: string;
  logoTextColor?: string;
  logoFontWeight?: string;
  logoFontFamilyOverlay?: string;
  logoLogoGap?: string;
}

const DEFAULT_LOGO: LogoSettings = {
  logoText: "",
  logoTextKorean: "오래",
  logoTextHanja: "",
  logoColor: "#0d7377",
  logoFontFamily: "Noto Sans KR",
  logoTextSize: "2xl",
  logoTextKoreanSize: "3xl",
  logoTextHanjaSize: "xs",
};

const getSizeValue = (size?: string): string => {
  const sizeMap: Record<string, string> = {
    'xs': '0.75rem',
    'sm': '0.875rem',
    'base': '1rem',
    'lg': '1.125rem',
    'xl': '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  };
  return sizeMap[size || 'base'] || '1rem';
};

export function Navigation() {
  const { user, isLoading, isAuthenticated, logout, isLoggingOut } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: siteSettings } = useQuery<LogoSettings>({
    queryKey: ["/api/settings"],
  });
  
  const logoColor = siteSettings?.logoColor || DEFAULT_LOGO.logoColor;
  const logoText = siteSettings?.logoText ?? DEFAULT_LOGO.logoText;
  const logoTextKorean = siteSettings?.logoTextKorean ?? DEFAULT_LOGO.logoTextKorean;
  const logoTextHanja = siteSettings?.logoTextHanja ?? DEFAULT_LOGO.logoTextHanja;
  const logoFontFamily = siteSettings?.logoFontFamily || DEFAULT_LOGO.logoFontFamily;
  const logoTextSize = siteSettings?.logoTextSize || DEFAULT_LOGO.logoTextSize;
  const logoTextKoreanSize = siteSettings?.logoTextKoreanSize || DEFAULT_LOGO.logoTextKoreanSize;
  const logoTextHanjaSize = siteSettings?.logoTextHanjaSize || DEFAULT_LOGO.logoTextHanjaSize;
  const logoImageUrl = siteSettings?.logoImageUrl;
  const logoScale = Number(siteSettings?.logoScale) || 100;
  const logoSharpness = Number(siteSettings?.logoSharpness) || 100;
  const logoBackgroundColor = siteSettings?.logoBackgroundColor || "transparent";
  const logoTextEnabled = siteSettings?.logoTextEnabled === "true";
  const logoTextContent = siteSettings?.logoTextContent || "";
  const logoTextColorValue = siteSettings?.logoTextColor || "#000000";
  const logoTextSizeValue = Number(siteSettings?.logoTextSize) || 20;
  const logoFontWeightValue = Number(siteSettings?.logoFontWeight) || 700;
  const logoFontFamilyOverlay = siteSettings?.logoFontFamilyOverlay || "Noto Sans KR";
  const logoLogoGap = Number(siteSettings?.logoLogoGap) || 8;
  
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
    { icon: BookOpen, label: "Ebook", korLabel: "현무경", href: "/ebook", hasUserContent: userHasEbookPosts },
    { icon: Users, label: "Community", korLabel: "마당", href: "/madang", hasUserContent: userHasMadangPosts },
  ];

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 border-b border-border flex-shrink-0" style={{ boxShadow: "0 0 10px #ddd" }}>
      <div className="w-full max-w-[990px] mx-auto px-2">
        <div className="h-[56px] sm:h-[70px] flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            {logoImageUrl ? (
              <div 
                className="flex items-center px-1 rounded bg-gray-100 dark:bg-gray-800"
                style={{ 
                  gap: `${logoLogoGap}px`,
                }}
              >
                <a href="https://cafe.daum.net/pusan7777/5yGr/68" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" data-testid="link-logo">
                  <img 
                    src={logoImageUrl} 
                    alt="로고" 
                    className="w-auto object-contain"
                    style={{
                      height: `clamp(28px, ${logoScale * 0.1}vw, 56px)`,
                      filter: `contrast(${logoSharpness}%)`,
                    }}
                  />
                </a>
                {logoTextEnabled && logoTextContent && (
                  <Link href="/calendar" className="hover:opacity-80 transition-opacity">
                    <span 
                      className="whitespace-nowrap"
                      style={{ 
                        color: logoTextColorValue,
                        fontSize: `clamp(12px, ${logoTextSizeValue * 0.25}vw, ${logoTextSizeValue}px)`,
                        fontWeight: logoFontWeightValue,
                        fontFamily: logoFontFamilyOverlay,
                      }}
                    >
                      {logoTextContent}
                    </span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 px-1 rounded bg-gray-100 dark:bg-gray-800">
                <a href="https://cafe.daum.net/pusan7777/5yGr/68" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" data-testid="link-logo">
                  <svg viewBox="0 0 40 40" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" stroke={logoColor} strokeWidth="2.5" fill="none"/>
                    <circle cx="20" cy="20" r="14" stroke={logoColor} strokeWidth="2.5" fill="none"/>
                    <circle cx="20" cy="20" r="10" stroke={logoColor} strokeWidth="2.5" fill="none"/>
                    <circle cx="20" cy="20" r="6" stroke={logoColor} strokeWidth="2.5" fill="none"/>
                    <circle cx="20" cy="20" r="2" fill={logoColor}/>
                    <line x1="20" y1="2" x2="20" y2="10" stroke={logoColor} strokeWidth="2.5"/>
                    <line x1="6" y1="12" x2="12" y2="16" stroke={logoColor} strokeWidth="2.5"/>
                    <line x1="28" y1="16" x2="34" y2="12" stroke={logoColor} strokeWidth="2.5"/>
                    <line x1="8" y1="28" x2="14" y2="24" stroke={logoColor} strokeWidth="2.5"/>
                    <line x1="26" y1="24" x2="32" y2="28" stroke={logoColor} strokeWidth="2.5"/>
                  </svg>
                </a>
                <Link href="/calendar" className="hover:opacity-80 transition-opacity">
                  <div className="flex flex-col leading-tight" style={{ fontFamily: `${logoFontFamily}, sans-serif` }}>
                    {logoText && <span className="font-bold" style={{ color: logoColor, fontSize: getSizeValue(logoTextSize) }}>{logoText}</span>}
                    {logoTextKorean && <span className="font-bold" style={{ color: logoColor, fontSize: getSizeValue(logoTextKoreanSize) }}>{logoTextKorean}</span>}
                    {logoTextHanja && <span style={{ color: logoColor, fontSize: getSizeValue(logoTextHanjaSize) }}>{logoTextHanja}</span>}
                  </div>
                </Link>
              </div>
            )}
          </div>

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
                    {user.isAdmin === 1 && (
                      <Button 
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setLocation("/admin")}
                        data-testid="button-admin"
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        관리자
                      </Button>
                    )}
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
