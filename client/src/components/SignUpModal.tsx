import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle } from "lucide-react";
import { SiNaver, SiKakaotalk } from "react-icons/si";

interface SignUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "select" | "form" | "success";

export function SignUpModal({ open, onOpenChange }: SignUpModalProps) {
  const [step, setStep] = useState<Step>("select");
  const [provider, setProvider] = useState<"naver" | "kakao" | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleProviderSelect = (selectedProvider: "naver" | "kakao") => {
    setProvider(selectedProvider);
    setStep("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim() || !email.trim()) {
      toast({
        title: "입력 오류",
        description: "모든 필수 항목을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "입력 오류",
        description: "올바른 이메일 형식을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/auth/oauth-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, name, phone, email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "가입에 실패했습니다.");
      }

      setStep("success");
    } catch (error: any) {
      toast({
        title: "가입 실패",
        description: error.message || "가입 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep("select");
    setProvider(null);
    setName("");
    setPhone("");
    setEmail("");
    onOpenChange(false);
  };

  const handleBack = () => {
    setStep("select");
    setProvider(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-testid="signup-modal">
        {step === "select" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-lg">회원가입</DialogTitle>
              <DialogDescription className="text-center">
                소셜 계정으로 간편하게 가입하세요
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-4">
              <Button
                onClick={() => handleProviderSelect("naver")}
                className="w-full h-12 text-white"
                style={{ backgroundColor: "#03C75A" }}
                data-testid="button-signup-naver"
              >
                <SiNaver className="w-5 h-5 mr-2" />
                네이버로 가입하기
              </Button>
              <Button
                onClick={() => handleProviderSelect("kakao")}
                className="w-full h-12 text-black"
                style={{ backgroundColor: "#FEE500" }}
                data-testid="button-signup-kakao"
              >
                <SiKakaotalk className="w-5 h-5 mr-2" />
                카카오로 가입하기
              </Button>
            </div>
          </>
        )}

        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-lg flex items-center justify-center gap-2">
                {provider === "naver" ? (
                  <>
                    <SiNaver className="w-5 h-5" style={{ color: "#03C75A" }} />
                    네이버 가입
                  </>
                ) : (
                  <>
                    <SiKakaotalk className="w-5 h-5" style={{ color: "#3C1E1E" }} />
                    카카오 가입
                  </>
                )}
              </DialogTitle>
              <DialogDescription className="text-center">
                연락처 정보를 입력해주세요
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1">
                  <span className="text-red-500">*</span> 회원이름
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-testid="input-name"
                />
                <p className="text-xs text-muted-foreground">네이버/카카오 계정의 이름이 자동으로 입력됩니다</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1">
                  <span className="text-red-500">*</span> 휴대전화번호
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="010-1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  data-testid="input-phone"
                />
                <p className="text-xs text-muted-foreground">본인 확인 및 중요 알림 발송에 사용됩니다</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  <span className="text-red-500">*</span> 이메일 주소
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="input-email"
                />
                <p className="text-xs text-muted-foreground">계정 관련 알림 및 소식을 받아보실 수 있습니다</p>
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                  data-testid="button-back"
                >
                  뒤로
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                  data-testid="button-confirm-signup"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      처리 중...
                    </>
                  ) : (
                    "가입하기"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-lg">가입 완료</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-center text-muted-foreground">
                회원가입이 완료되었습니다!<br />
                이제 로그인하여 서비스를 이용하실 수 있습니다.
              </p>
              <Button
                onClick={handleClose}
                className="w-full mt-2"
                data-testid="button-close-success"
              >
                확인
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
