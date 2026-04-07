import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { SiNaver, SiKakaotalk, SiGoogle } from "react-icons/si";
import { useQueryClient } from "@tanstack/react-query";

interface SignUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignUpModal({ open, onOpenChange }: SignUpModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");
  const [showRegPw, setShowRegPw] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const popupRef = useRef<Window | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "oauth_callback") return;
      const { login, error } = event.data;
      if (login === "success") {
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        toast({ title: "로그인 성공", description: "환영합니다!" });
        handleClose();
      } else if (error) {
        const msgs: Record<string, string> = {
          invalid_state: "로그인 요청이 만료됐습니다. 다시 시도해주세요.",
          naver_auth_failed: "네이버 로그인에 실패했습니다.",
          kakao_auth_failed: "카카오 로그인에 실패했습니다.",
          google_auth_failed: "구글 로그인에 실패했습니다.",
        };
        toast({ title: "로그인 실패", description: msgs[error] || "다시 시도해주세요.", variant: "destructive" });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleClose = () => {
    setLoginEmail(""); setLoginPassword(""); setShowLoginPw(false);
    setRegName(""); setRegEmail(""); setRegPhone(""); setRegPassword(""); setRegPasswordConfirm(""); setShowRegPw(false);
    onOpenChange(false);
  };

  const handleLoginSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    toast({ title: "로그인 성공", description: "환영합니다!" });
    handleClose();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast({ title: "입력 오류", description: "이메일과 비밀번호를 입력해주세요.", variant: "destructive" });
      return;
    }
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "로그인 실패");
      handleLoginSuccess();
    } catch (err: any) {
      toast({ title: "로그인 실패", description: err.message, variant: "destructive" });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      toast({ title: "입력 오류", description: "이름, 이메일, 비밀번호를 모두 입력해주세요.", variant: "destructive" });
      return;
    }
    if (regPassword.length < 6) {
      toast({ title: "입력 오류", description: "비밀번호는 6자 이상이어야 합니다.", variant: "destructive" });
      return;
    }
    if (regPassword !== regPasswordConfirm) {
      toast({ title: "입력 오류", description: "비밀번호가 일치하지 않습니다.", variant: "destructive" });
      return;
    }
    setRegLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: regEmail, password: regPassword, firstName: regName, phone: regPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "회원가입 실패");
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "회원가입 완료", description: "환영합니다!" });
      handleClose();
    } catch (err: any) {
      toast({ title: "회원가입 실패", description: err.message, variant: "destructive" });
    } finally {
      setRegLoading(false);
    }
  };

  const handleSocial = (provider: "naver" | "kakao" | "google") => {
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      `/api/auth/${provider}`,
      `${provider}_oauth`,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
    if (popup) {
      popupRef.current = popup;
      popup.focus();
    } else {
      // 팝업 차단된 경우 현재 페이지에서 이동
      window.location.href = `/api/auth/${provider}`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden" data-testid="signup-modal">
        <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "register")} className="w-full">
          <TabsList className="w-full rounded-none h-12 bg-muted/50 border-b">
            <TabsTrigger value="login" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary" data-testid="tab-login">
              로그인
            </TabsTrigger>
            <TabsTrigger value="register" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary" data-testid="tab-register">
              회원가입
            </TabsTrigger>
          </TabsList>

          {/* 로그인 탭 */}
          <TabsContent value="login" className="mt-0 p-6 space-y-4">
            <DialogHeader className="pb-2">
              <DialogTitle className="text-center text-lg">로그인</DialogTitle>
              <DialogDescription className="text-center text-sm">
                이메일 또는 소셜 계정으로 로그인하세요
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="login-email">이메일</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="example@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  data-testid="input-login-email"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="login-password">비밀번호</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showLoginPw ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    data-testid="input-login-password"
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPw(!showLoginPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showLoginPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loginLoading} data-testid="button-login-submit">
                {loginLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />로그인 중...</> : "로그인"}
              </Button>
            </form>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">또는 소셜 로그인</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={() => handleSocial("naver")} className="w-full h-11 text-white" style={{ backgroundColor: "#03C75A" }} data-testid="button-login-naver">
                <SiNaver className="w-4 h-4 mr-2" /> 네이버로 로그인
              </Button>
              <Button onClick={() => handleSocial("kakao")} className="w-full h-11 text-black" style={{ backgroundColor: "#FEE500" }} data-testid="button-login-kakao">
                <SiKakaotalk className="w-4 h-4 mr-2" /> 카카오로 로그인
              </Button>
              <Button onClick={() => handleSocial("google")} variant="outline" className="w-full h-11" data-testid="button-login-google">
                <SiGoogle className="w-4 h-4 mr-2 text-red-500" /> 구글로 로그인
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground pt-1">
              계정이 없으신가요?{" "}
              <button onClick={() => setTab("register")} className="text-primary underline underline-offset-2 hover:opacity-80">
                회원가입
              </button>
            </p>
          </TabsContent>

          {/* 회원가입 탭 */}
          <TabsContent value="register" className="mt-0 p-6 space-y-4">
            <DialogHeader className="pb-2">
              <DialogTitle className="text-center text-lg">회원가입</DialogTitle>
              <DialogDescription className="text-center text-sm">
                이메일 또는 소셜 계정으로 가입하세요
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="reg-name">이름 <span className="text-red-500">*</span></Label>
                <Input
                  id="reg-name"
                  type="text"
                  placeholder="홍길동"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  data-testid="input-register-name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-email">이메일 <span className="text-red-500">*</span></Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="example@email.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  data-testid="input-register-email"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-phone">휴대폰번호</Label>
                <Input
                  id="reg-phone"
                  type="tel"
                  placeholder="010-1234-5678"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  data-testid="input-register-phone"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-password">비밀번호 <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showRegPw ? "text" : "password"}
                    placeholder="6자 이상 입력하세요"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    data-testid="input-register-password"
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPw(!showRegPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showRegPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-password-confirm">비밀번호 확인 <span className="text-red-500">*</span></Label>
                <Input
                  id="reg-password-confirm"
                  type={showRegPw ? "text" : "password"}
                  placeholder="비밀번호를 다시 입력하세요"
                  value={regPasswordConfirm}
                  onChange={(e) => setRegPasswordConfirm(e.target.value)}
                  data-testid="input-register-password-confirm"
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={regLoading} data-testid="button-register-submit">
                {regLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />처리 중...</> : "가입하기"}
              </Button>
            </form>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">또는 소셜 가입</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={() => handleSocial("naver")} className="w-full h-11 text-white" style={{ backgroundColor: "#03C75A" }} data-testid="button-register-naver">
                <SiNaver className="w-4 h-4 mr-2" /> 네이버로 가입
              </Button>
              <Button onClick={() => handleSocial("kakao")} className="w-full h-11 text-black" style={{ backgroundColor: "#FEE500" }} data-testid="button-register-kakao">
                <SiKakaotalk className="w-4 h-4 mr-2" /> 카카오로 가입
              </Button>
              <Button onClick={() => handleSocial("google")} variant="outline" className="w-full h-11" data-testid="button-register-google">
                <SiGoogle className="w-4 h-4 mr-2 text-red-500" /> 구글로 가입
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground pt-1">
              이미 계정이 있으신가요?{" "}
              <button onClick={() => setTab("login")} className="text-primary underline underline-offset-2 hover:opacity-80">
                로그인
              </button>
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
