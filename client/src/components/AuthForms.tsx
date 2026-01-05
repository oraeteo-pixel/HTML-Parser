import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Users, LogIn, Undo } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "아이디를 입력하세요"),
  password: z.string().min(1, "비밀번호를 입력하세요"),
});

export function AuthForms({ onSuccess }: { onSuccess: () => void }) {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

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
      setActiveTab("login");
      loginForm.setValue("username", data.username);
      loginForm.setFocus("password");
    } catch (e) {
      // Handled by mutation error
    }
  };

  return (
    <div className="p-2" data-testid="auth-forms">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-primary">
          <Users className="inline-block mr-2 h-6 w-6" />
          회원
        </h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="login" data-testid="tab-login">로그인</TabsTrigger>
          <TabsTrigger value="register" data-testid="tab-register">회원가입</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="space-y-4">
          <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
            <div className="space-y-2">
              <Input 
                placeholder="회원별명" 
                {...loginForm.register("username")} 
                className="bg-white"
                data-testid="input-login-username"
              />
              {loginForm.formState.errors.username && (
                <p className="text-xs text-destructive">{loginForm.formState.errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="비밀번호"
                {...loginForm.register("password")} 
                className="bg-white"
                data-testid="input-login-password"
              />
              {loginForm.formState.errors.password && (
                <p className="text-xs text-destructive">{loginForm.formState.errors.password.message}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="secondary" 
                size="sm"
                className="flex-1"
              >
                비번 찾기
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={login.isPending}
                data-testid="button-login-submit"
              >
                {login.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <LogIn className="mr-2 h-4 w-4" />
                로그인
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="register" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-2">
            <Users className="inline-block mr-1 h-4 w-4" />
            오리알터닷컴 회원가입
          </div>
          <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-3">
            <div>
              <Input 
                placeholder="회원별명을 입력하세요. (한글, 영문, 숫자)"
                {...registerForm.register("nickname")} 
                className="bg-white text-sm"
                data-testid="input-register-nickname"
              />
              {registerForm.formState.errors.nickname && (
                <p className="text-xs text-destructive mt-1">{registerForm.formState.errors.nickname.message}</p>
              )}
            </div>
            <div>
              <Input 
                placeholder="아이디를 입력하세요."
                {...registerForm.register("username")} 
                className="bg-white text-sm"
                data-testid="input-register-username"
              />
              {registerForm.formState.errors.username && (
                <p className="text-xs text-destructive mt-1">{registerForm.formState.errors.username.message}</p>
              )}
            </div>
            <div>
              <Input 
                type="password" 
                placeholder="비밀번호를 입력하세요."
                {...registerForm.register("password")} 
                className="bg-white text-sm"
                data-testid="input-register-password"
              />
              {registerForm.formState.errors.password && (
                <p className="text-xs text-destructive mt-1">{registerForm.formState.errors.password.message}</p>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => setActiveTab("login")}
                className="flex-1"
              >
                <Undo className="mr-2 h-4 w-4" />
                가입취소
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={register.isPending}
                data-testid="button-register-submit"
              >
                {register.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Users className="mr-2 h-4 w-4" />
                회원가입하기
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
