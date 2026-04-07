import { useEffect } from "react";
import { useSearch } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Calendar } from "@/components/Calendar";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

const ERROR_MESSAGES: Record<string, string> = {
  naver_auth_failed: "네이버 로그인 중 오류가 발생했습니다.",
  kakao_auth_failed: "카카오 로그인 중 오류가 발생했습니다.",
  google_auth_failed: "구글 로그인 중 오류가 발생했습니다.",
  naver_token_failed: "네이버 인증 토큰 발급에 실패했습니다.",
  kakao_token_failed: "카카오 인증 토큰 발급에 실패했습니다.",
  google_token_failed: "구글 인증 토큰 발급에 실패했습니다.",
  naver_profile_failed: "네이버 프로필 정보를 가져오지 못했습니다.",
  naver_auth_error: "네이버 로그인 처리 중 오류가 발생했습니다.",
  kakao_auth_error: "카카오 로그인 처리 중 오류가 발생했습니다.",
  google_auth_error: "구글 로그인 처리 중 오류가 발생했습니다.",
  invalid_state: "로그인 요청이 만료됐습니다. 다시 시도해주세요.",
};

export default function CalendarPage() {
  const search = useSearch();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const error = params.get("error");
    const login = params.get("login");

    if (error) {
      const msg = ERROR_MESSAGES[error] || "로그인 중 오류가 발생했습니다.";
      toast({ title: "로그인 실패", description: msg, variant: "destructive" });
      window.history.replaceState({}, "", "/calendar");
    } else if (login === "success") {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "로그인 성공", description: "환영합니다!" });
      window.history.replaceState({}, "", "/calendar");
    }
  }, [search, toast]);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-background">
      <Navigation />
      
      <main className="flex-1 overflow-auto">
        <div className="w-full max-w-[990px] mx-auto px-0 sm:px-2 py-2 sm:py-4 bg-white dark:bg-background" data-testid="calendar-main">
          <Calendar />
        </div>
        <Footer />

        {/* 스크롤 네비게이션 화살표 */}
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
          <Button
            size="icon"
            variant="outline"
            className="rounded-full shadow-lg"
            onClick={() => {
              const mainContainer = document.querySelector('main');
              if (mainContainer) {
                mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            data-testid="button-scroll-top"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full shadow-lg"
            onClick={() => {
              const mainContainer = document.querySelector('main');
              if (mainContainer) {
                mainContainer.scrollTo({ top: mainContainer.scrollHeight, behavior: 'smooth' });
              }
            }}
            data-testid="button-scroll-bottom"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
