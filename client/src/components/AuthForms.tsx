import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { api } from "@shared/routes";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
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
    <div className="p-2">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-display font-bold text-primary">오리알터닷컴</h2>
        <p className="text-sm text-muted-foreground mt-1">Welcome to the portal.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted/50">
          <TabsTrigger value="login" className="font-display">로그인</TabsTrigger>
          <TabsTrigger value="register" className="font-display">회원가입</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="space-y-4">
          <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-username">아이디</Label>
              <Input id="login-username" {...loginForm.register("username")} className="font-mono bg-white" />
              {loginForm.formState.errors.username && (
                <p className="text-xs text-destructive">{loginForm.formState.errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">비밀번호</Label>
              <Input id="login-password" type="password" {...loginForm.register("password")} className="font-mono bg-white" />
              {loginForm.formState.errors.password && (
                <p className="text-xs text-destructive">{loginForm.formState.errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full font-bold" disabled={login.isPending}>
              {login.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              로그인
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="register" className="space-y-4">
          <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reg-username">아이디</Label>
              <Input id="reg-username" {...registerForm.register("username")} className="font-mono bg-white" />
              {registerForm.formState.errors.username && (
                <p className="text-xs text-destructive">{registerForm.formState.errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-nickname">별명 (Nickname)</Label>
              <Input id="reg-nickname" {...registerForm.register("nickname")} className="bg-white" />
              {registerForm.formState.errors.nickname && (
                <p className="text-xs text-destructive">{registerForm.formState.errors.nickname.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-password">비밀번호</Label>
              <Input id="reg-password" type="password" {...registerForm.register("password")} className="font-mono bg-white" />
              {registerForm.formState.errors.password && (
                <p className="text-xs text-destructive">{registerForm.formState.errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full font-bold" disabled={register.isPending}>
              {register.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              가입하기
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
