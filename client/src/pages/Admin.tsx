import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Loader2, Save, Plus, Trash2, Edit, Download, Upload, Settings, FolderTree, Calendar, FileCode } from "lucide-react";
import type { MadangCategory, PageContent } from "@shared/schema";

interface LogoSettings {
  logoText: string;
  logoTextKorean: string;
  logoTextHanja: string;
  logoColor: string;
  logoFontFamily: string;
  logoTextSize: string;
  logoTextKoreanSize: string;
  logoTextHanjaSize: string;
}

const DEFAULT_SETTINGS: LogoSettings = {
  logoText: "ORAE",
  logoTextKorean: "오래",
  logoTextHanja: "",
  logoColor: "#0d7377",
  logoFontFamily: "Noto Sans KR",
  logoTextSize: "2xl",
  logoTextKoreanSize: "sm",
  logoTextHanjaSize: "xs",
};

const getSizeValue = (size: string): string => {
  const sizeMap: Record<string, string> = {
    'xs': '0.75rem',
    'sm': '0.875rem',
    'base': '1rem',
    'lg': '1.125rem',
    'xl': '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  };
  return sizeMap[size] || '1rem';
};

export default function Admin() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<LogoSettings>(DEFAULT_SETTINGS);
  const [editingCategory, setEditingCategory] = useState<MadangCategory | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", description: "", parentId: null as number | null, level: 1 });
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [addingLevel, setAddingLevel] = useState<1 | 2 | 3>(1);
  const [editingPage, setEditingPage] = useState<PageContent | null>(null);

  const { data: savedSettings, isLoading: settingsLoading } = useQuery<Record<string, string>>({
    queryKey: ["/api/settings"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<MadangCategory[]>({
    queryKey: ["/api/admin/categories"],
  });

  const { data: pages, isLoading: pagesLoading } = useQuery<PageContent[]>({
    queryKey: ["/api/admin/pages"],
    enabled: isAuthenticated && user?.isAdmin === 1,
  });

  useEffect(() => {
    if (savedSettings) {
      setSettings({
        logoText: savedSettings.logoText || DEFAULT_SETTINGS.logoText,
        logoTextKorean: savedSettings.logoTextKorean || DEFAULT_SETTINGS.logoTextKorean,
        logoTextHanja: savedSettings.logoTextHanja || DEFAULT_SETTINGS.logoTextHanja,
        logoColor: savedSettings.logoColor || DEFAULT_SETTINGS.logoColor,
        logoFontFamily: savedSettings.logoFontFamily || DEFAULT_SETTINGS.logoFontFamily,
        logoTextSize: savedSettings.logoTextSize || DEFAULT_SETTINGS.logoTextSize,
        logoTextKoreanSize: savedSettings.logoTextKoreanSize || DEFAULT_SETTINGS.logoTextKoreanSize,
        logoTextHanjaSize: savedSettings.logoTextHanjaSize || DEFAULT_SETTINGS.logoTextHanjaSize,
      });
    }
  }, [savedSettings]);

  const saveMutation = useMutation({
    mutationFn: async (data: { key: string; value: string }) => {
      return apiRequest("POST", "/api/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: { name: string; slug: string; description: string; parentId?: number | null; level?: number }) => {
      return apiRequest("POST", "/api/admin/categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      setNewCategory({ name: "", slug: "", description: "", parentId: null, level: 1 });
      setSelectedParentId(null);
      setAddingLevel(1);
      toast({ title: "카테고리 생성 완료" });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (data: { id: number; name: string; slug: string; description?: string | null; isActive?: number | null }) => {
      return apiRequest("PUT", `/api/admin/categories/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      setEditingCategory(null);
      toast({ title: "카테고리 수정 완료" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      toast({ title: "카테고리 삭제 완료" });
    },
  });

  const savePageMutation = useMutation({
    mutationFn: async (data: Partial<PageContent>) => {
      return apiRequest("POST", "/api/admin/pages", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pages"] });
      setEditingPage(null);
      toast({ title: "페이지 저장 완료" });
    },
  });

  const handleSaveSettings = async () => {
    try {
      await Promise.all([
        saveMutation.mutateAsync({ key: "logoText", value: settings.logoText }),
        saveMutation.mutateAsync({ key: "logoTextKorean", value: settings.logoTextKorean }),
        saveMutation.mutateAsync({ key: "logoTextHanja", value: settings.logoTextHanja }),
        saveMutation.mutateAsync({ key: "logoColor", value: settings.logoColor }),
        saveMutation.mutateAsync({ key: "logoFontFamily", value: settings.logoFontFamily }),
        saveMutation.mutateAsync({ key: "logoTextSize", value: settings.logoTextSize }),
        saveMutation.mutateAsync({ key: "logoTextKoreanSize", value: settings.logoTextKoreanSize }),
        saveMutation.mutateAsync({ key: "logoTextHanjaSize", value: settings.logoTextHanjaSize }),
      ]);
      toast({ title: "저장 완료", description: "로고 설정이 저장되었습니다." });
    } catch (err) {
      toast({ title: "오류", description: "설정 저장에 실패했습니다.", variant: "destructive" });
    }
  };

  const handleDownloadCalendar = () => {
    window.open("/api/calendar/export", "_blank");
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

  const defaultPages = [
    { pageSlug: "calendar", title: "달력" },
    { pageSlug: "madang", title: "마당" },
    { pageSlug: "ebook", title: "전자책" },
    { pageSlug: "28su", title: "28수" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 max-w-[990px] mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold mb-6">관리자 설정</h1>

        <Tabs defaultValue="logo" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="logo" className="flex items-center gap-2" data-testid="tab-logo">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">로고</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2" data-testid="tab-categories">
              <FolderTree className="h-4 w-4" />
              <span className="hidden sm:inline">카테고리</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2" data-testid="tab-calendar">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">달력</span>
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2" data-testid="tab-pages">
              <FileCode className="h-4 w-4" />
              <span className="hidden sm:inline">페이지</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logo">
            <Card>
              <CardHeader>
                <CardTitle>로고 설정</CardTitle>
                <CardDescription>사이트 로고 텍스트와 스타일을 설정합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logoText">영문 텍스트</Label>
                    <div className="flex gap-2">
                      <Input
                        id="logoText"
                        value={settings.logoText}
                        onChange={(e) => setSettings({ ...settings, logoText: e.target.value })}
                        placeholder="ORAE"
                        className="flex-1"
                        data-testid="input-logo-text"
                      />
                      <select
                        value={settings.logoTextSize}
                        onChange={(e) => setSettings({ ...settings, logoTextSize: e.target.value })}
                        className="w-20 h-10 px-2 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="xs">XS</option>
                        <option value="sm">SM</option>
                        <option value="base">M</option>
                        <option value="lg">LG</option>
                        <option value="xl">XL</option>
                        <option value="2xl">2XL</option>
                        <option value="3xl">3XL</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logoTextKorean">한글 텍스트</Label>
                    <div className="flex gap-2">
                      <Input
                        id="logoTextKorean"
                        value={settings.logoTextKorean}
                        onChange={(e) => setSettings({ ...settings, logoTextKorean: e.target.value })}
                        placeholder="오래"
                        className="flex-1"
                        data-testid="input-logo-korean"
                      />
                      <select
                        value={settings.logoTextKoreanSize}
                        onChange={(e) => setSettings({ ...settings, logoTextKoreanSize: e.target.value })}
                        className="w-20 h-10 px-2 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="xs">XS</option>
                        <option value="sm">SM</option>
                        <option value="base">M</option>
                        <option value="lg">LG</option>
                        <option value="xl">XL</option>
                        <option value="2xl">2XL</option>
                        <option value="3xl">3XL</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logoTextHanja">한자 텍스트</Label>
                    <div className="flex gap-2">
                      <Input
                        id="logoTextHanja"
                        value={settings.logoTextHanja}
                        onChange={(e) => setSettings({ ...settings, logoTextHanja: e.target.value })}
                        placeholder="悠久"
                        className="flex-1"
                        data-testid="input-logo-hanja"
                      />
                      <select
                        value={settings.logoTextHanjaSize}
                        onChange={(e) => setSettings({ ...settings, logoTextHanjaSize: e.target.value })}
                        className="w-20 h-10 px-2 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="xs">XS</option>
                        <option value="sm">SM</option>
                        <option value="base">M</option>
                        <option value="lg">LG</option>
                        <option value="xl">XL</option>
                        <option value="2xl">2XL</option>
                        <option value="3xl">3XL</option>
                      </select>
                    </div>
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
                        <span className="font-bold" style={{ color: settings.logoColor, fontSize: getSizeValue(settings.logoTextSize) }}>{settings.logoText}</span>
                      )}
                      {settings.logoTextKorean && (
                        <span className="font-medium" style={{ color: settings.logoColor, fontSize: getSizeValue(settings.logoTextKoreanSize) }}>{settings.logoTextKorean}</span>
                      )}
                      {settings.logoTextHanja && (
                        <span style={{ color: settings.logoColor, fontSize: getSizeValue(settings.logoTextHanjaSize) }}>{settings.logoTextHanja}</span>
                      )}
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveSettings} disabled={saveMutation.isPending} data-testid="button-save-logo">
                  {saveMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  저장
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>마당 카테고리 관리</CardTitle>
                <CardDescription>마당 게시판의 카테고리를 관리합니다. (카테고리 → 서브 → 서브서브)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-md p-4 space-y-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <h3 className="font-medium">새 카테고리 추가</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={addingLevel === 1 ? "default" : "outline"}
                        onClick={() => { setAddingLevel(1); setSelectedParentId(null); setNewCategory({ ...newCategory, parentId: null, level: 1 }); }}
                      >
                        카테고리
                      </Button>
                      <Button
                        size="sm"
                        variant={addingLevel === 2 ? "default" : "outline"}
                        onClick={() => { setAddingLevel(2); setNewCategory({ ...newCategory, level: 2 }); }}
                      >
                        서브
                      </Button>
                      <Button
                        size="sm"
                        variant={addingLevel === 3 ? "default" : "outline"}
                        onClick={() => { setAddingLevel(3); setNewCategory({ ...newCategory, level: 3 }); }}
                      >
                        서브서브
                      </Button>
                    </div>
                  </div>
                  
                  {addingLevel >= 2 && (
                    <div className="space-y-2">
                      <Label>상위 카테고리 선택</Label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={selectedParentId || ""}
                        onChange={(e) => {
                          const pid = e.target.value ? Number(e.target.value) : null;
                          setSelectedParentId(pid);
                          setNewCategory({ ...newCategory, parentId: pid });
                        }}
                      >
                        <option value="">선택하세요</option>
                        {addingLevel === 2 && categories?.filter(c => c.level === 1).map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                        {addingLevel === 3 && categories?.filter(c => c.level === 2).map(c => {
                          const parent = categories?.find(p => p.id === c.parentId);
                          return <option key={c.id} value={c.id}>{parent?.name} → {c.name}</option>;
                        })}
                      </select>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="카테고리 이름"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      data-testid="input-new-category-name"
                    />
                    <Input
                      placeholder="슬러그 (영문)"
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                      data-testid="input-new-category-slug"
                    />
                    <Input
                      placeholder="설명 (선택)"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      data-testid="input-new-category-desc"
                    />
                  </div>
                  <Button
                    onClick={() => createCategoryMutation.mutate({
                      ...newCategory,
                      parentId: selectedParentId,
                      level: addingLevel,
                    })}
                    disabled={!newCategory.name || !newCategory.slug || (addingLevel >= 2 && !selectedParentId) || createCategoryMutation.isPending}
                    data-testid="button-add-category"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {addingLevel === 1 ? "카테고리" : addingLevel === 2 ? "서브카테고리" : "서브서브카테고리"} 추가
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">카테고리 목록</h3>
                  {categoriesLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : categories?.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">카테고리가 없습니다.</p>
                  ) : (
                    <div className="space-y-1">
                      {categories?.filter(c => c.level === 1 || !c.level).map((cat1) => (
                        <div key={cat1.id} className="border rounded-md overflow-hidden" data-testid={`category-item-${cat1.id}`}>
                          <div className="flex items-center justify-between p-3 bg-muted/30">
                            {editingCategory?.id === cat1.id ? (
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 mr-2">
                                <Input value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} />
                                <Input value={editingCategory.slug} onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })} />
                                <Input value={editingCategory.description || ""} onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })} />
                              </div>
                            ) : (
                              <div className="flex-1">
                                <span className="font-medium">{cat1.name}</span>
                                <span className="text-muted-foreground ml-2 text-sm">({cat1.slug})</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Switch checked={cat1.isActive === 1} onCheckedChange={(checked) => updateCategoryMutation.mutate({ ...cat1, isActive: checked ? 1 : 0 })} />
                              {editingCategory?.id === cat1.id ? (
                                <>
                                  <Button size="sm" onClick={() => updateCategoryMutation.mutate(editingCategory)}><Save className="h-4 w-4" /></Button>
                                  <Button size="sm" variant="ghost" onClick={() => setEditingCategory(null)}>취소</Button>
                                </>
                              ) : (
                                <>
                                  <Button size="icon" variant="ghost" onClick={() => setEditingCategory(cat1)}><Edit className="h-4 w-4" /></Button>
                                  <Button size="icon" variant="ghost" onClick={() => deleteCategoryMutation.mutate(cat1.id)}><Trash2 className="h-4 w-4" /></Button>
                                </>
                              )}
                            </div>
                          </div>
                          
                          {categories?.filter(c => c.level === 2 && c.parentId === cat1.id).map((cat2) => (
                            <div key={cat2.id} className="border-t">
                              <div className="flex items-center justify-between p-3 pl-8 bg-muted/10">
                                {editingCategory?.id === cat2.id ? (
                                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 mr-2">
                                    <Input value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} />
                                    <Input value={editingCategory.slug} onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })} />
                                    <Input value={editingCategory.description || ""} onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })} />
                                  </div>
                                ) : (
                                  <div className="flex-1">
                                    <span className="text-muted-foreground mr-2">└</span>
                                    <span className="font-medium">{cat2.name}</span>
                                    <span className="text-muted-foreground ml-2 text-sm">({cat2.slug})</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <Switch checked={cat2.isActive === 1} onCheckedChange={(checked) => updateCategoryMutation.mutate({ ...cat2, isActive: checked ? 1 : 0 })} />
                                  {editingCategory?.id === cat2.id ? (
                                    <>
                                      <Button size="sm" onClick={() => updateCategoryMutation.mutate(editingCategory)}><Save className="h-4 w-4" /></Button>
                                      <Button size="sm" variant="ghost" onClick={() => setEditingCategory(null)}>취소</Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button size="icon" variant="ghost" onClick={() => setEditingCategory(cat2)}><Edit className="h-4 w-4" /></Button>
                                      <Button size="icon" variant="ghost" onClick={() => deleteCategoryMutation.mutate(cat2.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              {categories?.filter(c => c.level === 3 && c.parentId === cat2.id).map((cat3) => (
                                <div key={cat3.id} className="flex items-center justify-between p-3 pl-14 border-t">
                                  {editingCategory?.id === cat3.id ? (
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 mr-2">
                                      <Input value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} />
                                      <Input value={editingCategory.slug} onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })} />
                                      <Input value={editingCategory.description || ""} onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })} />
                                    </div>
                                  ) : (
                                    <div className="flex-1">
                                      <span className="text-muted-foreground mr-2">└─</span>
                                      <span>{cat3.name}</span>
                                      <span className="text-muted-foreground ml-2 text-sm">({cat3.slug})</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <Switch checked={cat3.isActive === 1} onCheckedChange={(checked) => updateCategoryMutation.mutate({ ...cat3, isActive: checked ? 1 : 0 })} />
                                    {editingCategory?.id === cat3.id ? (
                                      <>
                                        <Button size="sm" onClick={() => updateCategoryMutation.mutate(editingCategory)}><Save className="h-4 w-4" /></Button>
                                        <Button size="sm" variant="ghost" onClick={() => setEditingCategory(null)}>취소</Button>
                                      </>
                                    ) : (
                                      <>
                                        <Button size="icon" variant="ghost" onClick={() => setEditingCategory(cat3)}><Edit className="h-4 w-4" /></Button>
                                        <Button size="icon" variant="ghost" onClick={() => deleteCategoryMutation.mutate(cat3.id)}><Trash2 className="h-4 w-4" /></Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>달력 데이터 관리</CardTitle>
                <CardDescription>달력 데이터를 다운로드하거나 업로드합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">데이터 다운로드</h3>
                  <p className="text-sm text-muted-foreground">
                    1989년부터 2050년까지의 달력 데이터를 엑셀 파일로 다운로드합니다.
                  </p>
                  <Button onClick={handleDownloadCalendar} data-testid="button-download-calendar">
                    <Download className="h-4 w-4 mr-2" />
                    엑셀 다운로드 (1989-2050)
                  </Button>
                </div>

                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">데이터 업로드</h3>
                  <p className="text-sm text-muted-foreground">
                    달력 데이터 업로드 기능은 추후 지원 예정입니다.
                  </p>
                  <Button disabled>
                    <Upload className="h-4 w-4 mr-2" />
                    엑셀 업로드 (준비 중)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle>페이지 콘텐츠 관리</CardTitle>
                <CardDescription>각 페이지의 콘텐츠와 스타일을 관리합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {pagesLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {defaultPages.map((page) => {
                      const savedPage = pages?.find(p => p.pageSlug === page.pageSlug);
                      const isEditing = editingPage?.pageSlug === page.pageSlug;
                      
                      return (
                        <div key={page.pageSlug} className="border rounded-md p-4" data-testid={`page-item-${page.pageSlug}`}>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-medium">{page.title}</h3>
                              <span className="text-sm text-muted-foreground">/{page.pageSlug}</span>
                            </div>
                            {!isEditing && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingPage(savedPage || {
                                  id: 0,
                                  pageSlug: page.pageSlug,
                                  title: page.title,
                                  content: "",
                                  customCss: "",
                                  customJs: "",
                                  updatedAt: null,
                                  updatedBy: null,
                                })}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                편집
                              </Button>
                            )}
                          </div>
                          
                          {isEditing && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>페이지 콘텐츠 (HTML)</Label>
                                <Textarea
                                  value={editingPage.content || ""}
                                  onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                                  rows={6}
                                  placeholder="<div>커스텀 콘텐츠...</div>"
                                  className="font-mono text-sm"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>커스텀 CSS</Label>
                                <Textarea
                                  value={editingPage.customCss || ""}
                                  onChange={(e) => setEditingPage({ ...editingPage, customCss: e.target.value })}
                                  rows={4}
                                  placeholder=".custom-class { color: red; }"
                                  className="font-mono text-sm"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>커스텀 JavaScript</Label>
                                <Textarea
                                  value={editingPage.customJs || ""}
                                  onChange={(e) => setEditingPage({ ...editingPage, customJs: e.target.value })}
                                  rows={4}
                                  placeholder="console.log('Hello');"
                                  className="font-mono text-sm"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => savePageMutation.mutate(editingPage)}
                                  disabled={savePageMutation.isPending}
                                >
                                  {savePageMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                  저장
                                </Button>
                                <Button variant="ghost" onClick={() => setEditingPage(null)}>
                                  취소
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
