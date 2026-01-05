import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { AuthForms } from "@/components/AuthForms";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

export function TopBar() {
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  
  const today = new Date();
  const dateStr = format(today, "yyyy-M-d");
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  const dayName = dayNames[today.getDay()];
  
  return (
    <div 
      data-testid="topbar"
      className="bg-background border-b border-border shadow-sm fixed top-0 left-0 right-0 z-50"
      style={{ boxShadow: "0 0 15px #ccc" }}
    >
      <div className="max-w-[990px] mx-auto h-[50px] flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-medium">{dateStr}</span>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{user.nickname}</span>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => logout.mutate()}
                data-testid="button-logout"
              >
                로그아웃
              </Button>
            </div>
          ) : (
            <Dialog open={authOpen} onOpenChange={setAuthOpen}>
              <DialogTrigger asChild>
                <div className="flex gap-2">
                  <Button variant="default" size="sm" data-testid="button-login">
                    로그인
                  </Button>
                  <Button variant="outline" size="sm" data-testid="button-register">
                    회원가입
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-card border-border">
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
