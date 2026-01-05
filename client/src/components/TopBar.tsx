import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AuthForms } from "@/components/AuthForms";
import { useState } from "react";
import { format } from "date-fns";

export function TopBar() {
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  
  // Mock Korean lunar date for display
  const today = new Date();
  const dateStr = format(today, "yyyy.M.d");
  const dayName = ["日", "月", "火", "水", "木", "金", "土"][today.getDay()];
  
  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 text-xs md:text-sm font-mono border-b-2 border-accent">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 opacity-90">
          <span>{dateStr} ({dayName})</span>
          <span className="hidden sm:inline text-accent">음11.17 己卯日</span>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-secondary opacity-80">Welcome, {user.nickname}</span>
              <button 
                onClick={() => logout.mutate()}
                className="hover:text-accent transition-colors underline decoration-accent/50 underline-offset-4"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Dialog open={authOpen} onOpenChange={setAuthOpen}>
              <DialogTrigger asChild>
                <div className="flex gap-3 cursor-pointer">
                  <span className="hover:text-accent transition-colors">로그인</span>
                  <span className="opacity-30">|</span>
                  <span className="hover:text-accent transition-colors">회원가입</span>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-[#FDFBF7] border-primary">
                <AuthForms onSuccess={() => setAuthOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}
