import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, User, Lock, UserPlus, LogIn, ArrowLeft, Mail } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "아이디를 입력하세요"),
  password: z.string().min(1, "비밀번호를 입력하세요"),
});

export function AuthForms({ onSuccess }: { onSuccess: () => void }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const registerForm = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: { username: "", password: "", nickname: "" },
  });

  const onLogin = async (data: z.infer<typeof loginSchema>) => {
    try {
      await login.mutateAsync(data);
      onSuccess();
    } catch (e) {
      // Handled by mutation error
    }
  };

  const onRegister = async (data: z.infer<typeof insertUserSchema>) => {
    try {
      await register.mutateAsync(data);
      setMode("login");
      loginForm.setValue("username", data.username);
      loginForm.setFocus("password");
    } catch (e) {
      // Handled by mutation error
    }
  };

  return (
    <div data-testid="auth-forms" className="w-full">
      {mode === "login" ? (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">로그인</h2>
            <p className="text-sm text-muted-foreground">오리알터닷컴에 오신 것을 환영합니다</p>
          </div>

          <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="아이디" 
                  {...loginForm.register("username")} 
                  className="pl-10 h-11 bg-background border-input"
                  data-testid="input-login-username"
                />
              </div>
              {loginForm.formState.errors.username && (
                <p className="text-xs text-destructive pl-1">{loginForm.formState.errors.username.message}</p>
              )}

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  placeholder="비밀번호"
                  {...loginForm.register("password")} 
                  className="pl-10 h-11 bg-background border-input"
                  data-testid="input-login-password"
                />
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-xs text-destructive pl-1">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-11" 
              disabled={login.isPending}
              data-testid="button-login-submit"
            >
              {login.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              로그인
            </Button>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button 
                type="button"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-find-password"
              >
                비밀번호 찾기
              </button>
              <span className="text-muted-foreground">|</span>
              <button 
                type="button"
                onClick={() => setMode("register")}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                data-testid="button-go-register"
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-2">
              <UserPlus className="h-8 w-8 text-accent" />
            </div>
            <h2 className="text-xl font-bold text-foreground">회원가입</h2>
            <p className="text-sm text-muted-foreground">오리알터닷컴 회원이 되어주세요</p>
          </div>

          <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="별명 (표시될 이름)"
                  {...registerForm.register("nickname")} 
                  className="pl-10 h-11 bg-background border-input"
                  data-testid="input-register-nickname"
                />
              </div>
              {registerForm.formState.errors.nickname && (
                <p className="text-xs text-destructive pl-1">{registerForm.formState.errors.nickname.message}</p>
              )}

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="아이디"
                  {...registerForm.register("username")} 
                  className="pl-10 h-11 bg-background border-input"
                  data-testid="input-register-username"
                />
              </div>
              {registerForm.formState.errors.username && (
                <p className="text-xs text-destructive pl-1">{registerForm.formState.errors.username.message}</p>
              )}

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  placeholder="비밀번호"
                  {...registerForm.register("password")} 
                  className="pl-10 h-11 bg-background border-input"
                  data-testid="input-register-password"
                />
              </div>
              {registerForm.formState.errors.password && (
                <p className="text-xs text-destructive pl-1">{registerForm.formState.errors.password.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-accent hover:bg-accent/90" 
              disabled={register.isPending}
              data-testid="button-register-submit"
            >
              {register.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              회원가입
            </Button>

            <button 
              type="button"
              onClick={() => setMode("login")}
              className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors pt-2"
              data-testid="button-back-to-login"
            >
              <ArrowLeft className="h-4 w-4" />
              로그인으로 돌아가기
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
