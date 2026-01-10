import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Loader2, Save, Eye } from "lucide-react";

interface LogoSettings {
  logoText: string;
  logoTextKorean: string;
  logoTextHanja: string;
  logoColor: string;
  logoFontFamily: string;
}

const DEFAULT_SETTINGS: LogoSettings = {
  logoText: "ORAE",
  logoTextKorean: "오래",
  logoTextHanja: "",
  logoColor: "#0d7377",
  logoFontFamily: "Noto Sans KR",
};

export default function Admin() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<LogoSettings>(DEFAULT_SETTINGS);

  const { data: savedSettings, isLoading: settingsLoading } = useQuery<Record<string, string>>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (savedSettings) {
      setSettings({
        logoText: savedSettings.logoText || DEFAULT_SETTINGS.logoText,
        logoTextKorean: savedSettings.logoTextKorean || DEFAULT_SETTINGS.logoTextKorean,
        logoTextHanja: savedSettings.logoTextHanja || DEFAULT_SETTINGS.logoTextHanja,
        logoColor: savedSettings.logoColor || DEFAULT_SETTINGS.logoColor,
        logoFontFamily: savedSettings.logoFontFamily || DEFAULT_SETTINGS.logoFontFamily,
      });
    }
  }, [savedSettings]);

  const saveMutation = useMutation({
    mutationFn: async (data: { key: string; value: string }) => {
      return apiRequest("/api/settings", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  const handleSave = async () => {
    try {
      await Promise.all([
        saveMutation.mutateAsync({ key: "logoText", value: settings.logoText }),
        saveMutation.mutateAsync({ key: "logoTextKorean", value: settings.logoTextKorean }),
        saveMutation.mutateAsync({ key: "logoTextHanja", value: settings.logoTextHanja }),
        saveMutation.mutateAsync({ key: "logoColor", value: settings.logoColor }),
        saveMutation.mutateAsync({ key: "logoFontFamily", value: settings.logoFontFamily }),
      ]);
      toast({ title: "저장 완료", description: "로고 설정이 저장되었습니다." });
    } catch (err) {
      toast({ title: "오류", description: "설정 저장에 실패했습니다.", variant: "destructive" });
    }
  };

  if (authLoading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">로그인이 필요합니다.</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (user.isAdmin !== 1) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">관리자만 접근할 수 있습니다.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 max-w-[990px] mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold mb-6">관리자 설정</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>로고 설정</CardTitle>
            <CardDescription>사이트 로고 텍스트와 스타일을 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logoText">영문 텍스트</Label>
                <Input
                  id="logoText"
                  value={settings.logoText}
                  onChange={(e) => setSettings({ ...settings, logoText: e.target.value })}
                  placeholder="ORAE"
                  data-testid="input-logo-text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoTextKorean">한글 텍스트</Label>
                <Input
                  id="logoTextKorean"
                  value={settings.logoTextKorean}
                  onChange={(e) => setSettings({ ...settings, logoTextKorean: e.target.value })}
                  placeholder="오래"
                  data-testid="input-logo-korean"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoTextHanja">한자 텍스트</Label>
                <Input
                  id="logoTextHanja"
                  value={settings.logoTextHanja}
                  onChange={(e) => setSettings({ ...settings, logoTextHanja: e.target.value })}
                  placeholder="悠久"
                  data-testid="input-logo-hanja"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logoColor">로고 색상</Label>
                <div className="flex gap-2">
                  <Input
                    id="logoColor"
                    type="color"
                    value={settings.logoColor}
                    onChange={(e) => setSettings({ ...settings, logoColor: e.target.value })}
                    className="w-16 h-10 p-1"
                    data-testid="input-logo-color"
                  />
                  <Input
                    value={settings.logoColor}
                    onChange={(e) => setSettings({ ...settings, logoColor: e.target.value })}
                    placeholder="#0d7377"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoFontFamily">폰트</Label>
                <select
                  id="logoFontFamily"
                  value={settings.logoFontFamily}
                  onChange={(e) => setSettings({ ...settings, logoFontFamily: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  data-testid="select-logo-font"
                >
                  <option value="Noto Sans KR">Noto Sans KR (고딕)</option>
                  <option value="Nanum Gothic">Nanum Gothic (나눔고딕)</option>
                  <option value="Nanum Myeongjo">Nanum Myeongjo (나눔명조)</option>
                  <option value="serif">명조체 (Serif)</option>
                  <option value="sans-serif">고딕체 (Sans-Serif)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>미리보기</Label>
              <div className="p-4 border rounded-md bg-white dark:bg-card flex items-center gap-3">
                <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" stroke={settings.logoColor} strokeWidth="2.5" fill="none"/>
                  <circle cx="20" cy="20" r="14" stroke={settings.logoColor} strokeWidth="2.5" fill="none"/>
                  <circle cx="20" cy="20" r="10" stroke={settings.logoColor} strokeWidth="2.5" fill="none"/>
                  <circle cx="20" cy="20" r="6" stroke={settings.logoColor} strokeWidth="2.5" fill="none"/>
                  <circle cx="20" cy="20" r="2" fill={settings.logoColor}/>
                  <line x1="20" y1="2" x2="20" y2="10" stroke={settings.logoColor} strokeWidth="2.5"/>
                  <line x1="6" y1="12" x2="12" y2="16" stroke={settings.logoColor} strokeWidth="2.5"/>
                  <line x1="28" y1="16" x2="34" y2="12" stroke={settings.logoColor} strokeWidth="2.5"/>
                  <line x1="8" y1="28" x2="14" y2="24" stroke={settings.logoColor} strokeWidth="2.5"/>
                  <line x1="26" y1="24" x2="32" y2="28" stroke={settings.logoColor} strokeWidth="2.5"/>
                </svg>
                <div className="flex flex-col leading-tight" style={{ fontFamily: settings.logoFontFamily }}>
                  {settings.logoText && (
                    <span className="text-2xl font-bold" style={{ color: settings.logoColor }}>{settings.logoText}</span>
                  )}
                  {settings.logoTextKorean && (
                    <span className="text-sm font-medium" style={{ color: settings.logoColor }}>{settings.logoTextKorean}</span>
                  )}
                  {settings.logoTextHanja && (
                    <span className="text-xs" style={{ color: settings.logoColor }}>{settings.logoTextHanja}</span>
                  )}
                </div>
              </div>
            </div>

            <Button onClick={handleSave} disabled={saveMutation.isPending} data-testid="button-save-logo">
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              저장
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
