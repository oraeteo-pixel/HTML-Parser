import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { AuthForms } from "@/components/AuthForms";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar, LogIn, UserCircle, LogOut } from "lucide-react";

export function TopBar() {
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  
  const today = new Date();
  const dateStr = format(today, "yyyy.M.d");
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  const dayName = dayNames[today.getDay()];
  
  return (
    <div 
      data-testid="topbar"
      className="bg-card border-b border-border fixed top-0 left-0 right-0 z-50"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
    >
      <div className="max-w-[990px] mx-auto h-[50px] flex items-center justify-between px-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{dateStr}</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
            {dayName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent/10">
                <UserCircle className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-accent">{user.nickname}</span>
              </div>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => logout.mutate()}
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-1" />
                로그아웃
              </Button>
            </div>
          ) : (
            <Dialog open={authOpen} onOpenChange={setAuthOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="default" 
                  size="sm"
                  className="gap-1.5"
                  data-testid="button-login"
                >
                  <LogIn className="h-4 w-4" />
                  로그인
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px] bg-card border-border p-6">
                <VisuallyHidden>
                  <DialogTitle>로그인 / 회원가입</DialogTitle>
                  <DialogDescription>오리알터닷컴 회원 인증</DialogDescription>
                </VisuallyHidden>
                <AuthForms onSuccess={() => setAuthOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}
