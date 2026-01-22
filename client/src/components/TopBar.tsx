import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, LogIn, UserCircle, LogOut, Loader2, UserPlus } from "lucide-react";
import { SignUpModal } from "./SignUpModal";

export function TopBar() {
  const { user, isLoading, isAuthenticated, logout, isLoggingOut } = useAuth();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  
  const today = new Date();
  const dateStr = format(today, "yyyy.M.d");
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  const dayName = dayNames[today.getDay()];
  
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleLogout = () => {
    logout();
  };
  
  return (
    <div 
      data-testid="topbar"
      className="bg-card border-b border-border fixed top-0 left-0 right-0 z-50"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
    >
      <div className="w-full max-w-[990px] mx-auto h-[50px] flex items-center justify-between px-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{dateStr}</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
            {dayName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent/10">
                {user.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="" 
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <UserCircle className="h-4 w-4 text-accent" />
                )}
                <span className="text-sm font-medium text-accent">
                  {user.firstName || user.email || "User"}
                </span>
              </div>
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-logout"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4 mr-1" />
                )}
                로그아웃
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSignUpModal(true)}
                className="gap-1.5"
                data-testid="button-signup"
              >
                <UserPlus className="h-4 w-4" />
                회원가입
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleLogin}
                className="gap-1.5"
                data-testid="button-login"
              >
                <LogIn className="h-4 w-4" />
                로그인
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <SignUpModal 
        open={showSignUpModal} 
        onOpenChange={setShowSignUpModal} 
      />
    </div>
  );
}
