import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Loader2, Save, Plus, Trash2, Edit, Download, 
  Settings, FolderTree, Calendar, FileCode, Users, 
  LayoutDashboard, ChevronRight, ChevronDown, Search,
  Home, Shield, FileText, Palette, Database, Menu, X,
  Mail, Phone, Check, MessageSquare, Code2, Copy,
  Upload, Link2, Image, ExternalLink
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MadangCategory, PageContent, User, PageLayout, LayoutBlock, CodeSnippet, SiteLogo } from "@shared/schema";
import { Link } from "wouter";
import PageBuilder from "@/components/PageBuilder";

interface SnippetFormProps {
  snippet: CodeSnippet | null;
  languageOptions: { value: string; label: string; color: string }[];
  categoryOptions: { value: string; label: string }[];
  onSave: (data: { name: string; description?: string; language: string; category?: string; code: string; tags?: string[]; isPublic?: number }) => void;
  onCancel: () => void;
  isPending: boolean;
}

function SnippetForm({ snippet, languageOptions, categoryOptions, onSave, onCancel, isPending }: SnippetFormProps) {
  const [name, setName] = useState(snippet?.name || "");
  const [description, setDescription] = useState(snippet?.description || "");
  const [language, setLanguage] = useState(snippet?.language || "javascript");
  const [category, setCategory] = useState(snippet?.category || "");
  const [code, setCode] = useState(snippet?.code || "");
  const [tagsInput, setTagsInput] = useState(snippet?.tags?.join(", ") || "");
  const [isPublic, setIsPublic] = useState(snippet?.isPublic !== 0);

  const handleSubmit = () => {
    if (!name || !code || !language) return;
    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    onSave({
      name,
      description: description || undefined,
      language,
      category: category || undefined,
      code,
      tags: tags.length > 0 ? tags : undefined,
      isPublic: isPublic ? 1 : 0,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="snippet-name">이름 *</Label>
          <Input
            id="snippet-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="스니펫 이름"
            data-testid="input-snippet-name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="snippet-language">언어 *</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger data-testid="select-snippet-language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map(lang => (
                <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="snippet-category">카테고리</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger data-testid="select-snippet-category">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">없음</SelectItem>
              {categoryOptions.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="snippet-tags">태그 (쉼표로 구분)</Label>
          <Input
            id="snippet-tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="태그1, 태그2, 태그3"
            data-testid="input-snippet-tags"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="snippet-description">설명</Label>
        <Input
          id="snippet-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="스니펫에 대한 설명"
          data-testid="input-snippet-description"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="snippet-code">코드 *</Label>
        <Textarea
          id="snippet-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="코드를 입력하세요..."
          rows={12}
          className="font-mono text-sm"
          data-testid="textarea-snippet-code"
        />
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="snippet-public"
          checked={isPublic}
          onCheckedChange={setIsPublic}
          data-testid="switch-snippet-public"
        />
        <Label htmlFor="snippet-public">공개</Label>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSubmit} disabled={isPending || !name || !code} data-testid="button-save-snippet">
          {isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          저장
        </Button>
        <Button variant="outline" onClick={onCancel} data-testid="button-cancel-snippet">
          취소
        </Button>
      </div>
    </div>
  );
}

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

type MenuSection = "dashboard" | "logo" | "categories" | "calendar" | "pages" | "members" | "layouts" | "snippets";

interface MenuItem {
  id: MenuSection;
  label: string;
  icon: typeof Settings;
  description?: string;
}

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "대시보드", icon: LayoutDashboard, description: "관리자 현황" },
  { id: "logo", label: "로고 설정", icon: Palette, description: "사이트 로고" },
  { id: "members", label: "회원 관리", icon: Users, description: "회원 목록" },
  { id: "categories", label: "마당 카테고리", icon: FolderTree, description: "카테고리 관리" },
  { id: "layouts", label: "페이지 빌더", icon: FileText, description: "드래그앤드롭 편집" },
  { id: "snippets", label: "코드 스니펫", icon: Code2, description: "코드 저장소" },
  { id: "calendar", label: "달력 데이터", icon: Calendar, description: "엑셀 다운로드" },
  { id: "pages", label: "페이지 관리", icon: FileCode, description: "콘텐츠 편집" },
];

export default function Admin() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<MenuSection>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const [settings, setSettings] = useState<LogoSettings>(DEFAULT_SETTINGS);
  const [editingCategory, setEditingCategory] = useState<MadangCategory | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", description: "", parentId: null as number | null, level: 1 });
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [addingLevel, setAddingLevel] = useState<1 | 2 | 3>(1);
  const [editingPage, setEditingPage] = useState<PageContent | null>(null);
  
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [emailContent, setEmailContent] = useState({ subject: "", body: "" });
  const [smsContent, setSmsContent] = useState("");
  
  const [editingLayout, setEditingLayout] = useState<PageLayout | null>(null);
  const [creatingLayout, setCreatingLayout] = useState(false);
  const [newLayoutName, setNewLayoutName] = useState("");
  const [newLayoutSlug, setNewLayoutSlug] = useState("");
  const [newLayoutType, setNewLayoutType] = useState<"madang" | "ebook">("madang");

  const [editingSnippet, setEditingSnippet] = useState<CodeSnippet | null>(null);
  const [creatingSnippet, setCreatingSnippet] = useState(false);
  const [snippetFilter, setSnippetFilter] = useState<string>("all");

  const [logoImageUrl, setLogoImageUrl] = useState<string>("");
  const [showLogoUrlInput, setShowLogoUrlInput] = useState(false);
  const [logoUrlInput, setLogoUrlInput] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoDragOver, setLogoDragOver] = useState(false);

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

  const { data: members, isLoading: membersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated && user?.isAdmin === 1,
  });

  const { data: recentPosts } = useQuery<any[]>({
    queryKey: ["/api/posts"],
    enabled: isAuthenticated && user?.isAdmin === 1,
  });

  const { data: layouts, isLoading: layoutsLoading } = useQuery<PageLayout[]>({
    queryKey: ["/api/admin/layouts"],
    enabled: isAuthenticated && user?.isAdmin === 1,
  });

  const { data: codeSnippets, isLoading: snippetsLoading } = useQuery<CodeSnippet[]>({
    queryKey: ["/api/admin/code-snippets"],
    enabled: isAuthenticated && user?.isAdmin === 1,
  });

  const { data: siteLogos, isLoading: logosLoading } = useQuery<SiteLogo[]>({
    queryKey: ["/api/admin/logos"],
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
      if (savedSettings.logoImageUrl) {
        setLogoImageUrl(savedSettings.logoImageUrl);
      }
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

  const toggleAdminMutation = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: number }) => {
      return apiRequest("PUT", `/api/admin/users/${userId}/admin`, { isAdmin });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "관리자 권한 변경 완료" });
    },
  });

  const updateMemberMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: { firstName?: string; lastName?: string; phone?: string; email?: string } }) => {
      return apiRequest("PUT", `/api/admin/users/${userId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setEditingMember(null);
      toast({ title: "회원 정보 수정 완료" });
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      return apiRequest("DELETE", `/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setSelectedMembers(new Set());
      toast({ title: "회원 삭제 완료" });
    },
  });

  const handleSelectMember = (memberId: string, checked: boolean) => {
    const newSet = new Set(selectedMembers);
    if (checked) {
      newSet.add(memberId);
    } else {
      newSet.delete(memberId);
    }
    setSelectedMembers(newSet);
  };

  const handleSelectAllMembers = (checked: boolean) => {
    if (checked && members) {
      setSelectedMembers(new Set(members.map(m => m.id)));
    } else {
      setSelectedMembers(new Set());
    }
  };

  const getSelectedMembersData = () => {
    if (!members) return [];
    return members.filter(m => selectedMembers.has(m.id));
  };

  const handleSendEmail = () => {
    const selectedData = getSelectedMembersData();
    const emails = selectedData.map(m => m.email).filter(Boolean);
    toast({ 
      title: "이메일 발송 준비", 
      description: `${emails.length}명의 회원에게 이메일을 발송합니다. (기능 준비 중)` 
    });
    setShowEmailModal(false);
    setEmailContent({ subject: "", body: "" });
  };

  const handleSendSms = () => {
    const selectedData = getSelectedMembersData();
    const phones = selectedData.map(m => m.phone).filter(Boolean);
    toast({ 
      title: "문자 발송 준비", 
      description: `${phones.length}명의 회원에게 문자를 발송합니다. (기능 준비 중)` 
    });
    setShowSmsModal(false);
    setSmsContent("");
  };

  const createLayoutMutation = useMutation({
    mutationFn: async (data: { name: string; slug: string; layoutJson: string; htmlContent?: string; customCss?: string }) => {
      return apiRequest("POST", "/api/admin/layouts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/layouts"] });
      setCreatingLayout(false);
      setNewLayoutName("");
      setNewLayoutSlug("");
      toast({ title: "레이아웃 생성 완료" });
    },
  });

  const updateLayoutMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { name?: string; slug?: string; layoutJson?: string; htmlContent?: string; customCss?: string; isPublished?: number } }) => {
      return apiRequest("PUT", `/api/admin/layouts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/layouts"] });
      setEditingLayout(null);
      toast({ title: "레이아웃 저장 완료" });
    },
  });

  const deleteLayoutMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/layouts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/layouts"] });
      toast({ title: "레이아웃 삭제 완료" });
    },
  });

  const createSnippetMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string; language: string; category?: string; code: string; tags?: string[]; isPublic?: number }) => {
      return apiRequest("POST", "/api/admin/code-snippets", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/code-snippets"] });
      setCreatingSnippet(false);
      toast({ title: "코드 스니펫 생성 완료" });
    },
  });

  const updateSnippetMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<{ name: string; description: string; language: string; category: string; code: string; tags: string[]; isPublic: number }> }) => {
      return apiRequest("PUT", `/api/admin/code-snippets/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/code-snippets"] });
      setEditingSnippet(null);
      toast({ title: "코드 스니펫 수정 완료" });
    },
  });

  const deleteSnippetMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/code-snippets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/code-snippets"] });
      toast({ title: "코드 스니펫 삭제 완료" });
    },
  });

  const createLogoMutation = useMutation({
    mutationFn: async (data: { name: string; objectPath: string }) => {
      return apiRequest("POST", "/api/admin/logos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/logos"] });
      toast({ title: "로고가 갤러리에 저장되었습니다." });
    },
  });

  const activateLogoMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PUT", `/api/admin/logos/${id}/activate`);
      return res.json();
    },
    onSuccess: async (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/logos"] });
      if (data?.objectPath) {
        setLogoImageUrl(data.objectPath);
        await saveMutation.mutateAsync({ key: "logoImageUrl", value: data.objectPath });
        queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      }
      toast({ title: "활성 로고가 변경되었습니다." });
    },
    onError: () => {
      toast({ title: "오류", description: "로고 활성화에 실패했습니다.", variant: "destructive" });
    },
  });

  const deleteLogoMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/logos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/logos"] });
      toast({ title: "로고가 삭제되었습니다." });
    },
    onError: () => {
      toast({ title: "오류", description: "로고 삭제에 실패했습니다.", variant: "destructive" });
    },
  });

  const handleCreateLayout = () => {
    if (!newLayoutName || !newLayoutSlug) {
      toast({ title: "오류", description: "이름과 슬러그를 입력하세요.", variant: "destructive" });
      return;
    }
    const defaultBlocks: LayoutBlock[] = [
      { id: "block_header", type: "header", props: { height: "80px", backgroundColor: "#f8fafc" } },
      { id: "block_body", type: "body", props: { minHeight: "400px", backgroundColor: "#ffffff" } },
      { id: "block_footer", type: "footer", props: { height: "60px", backgroundColor: "#f8fafc" } },
    ];
    createLayoutMutation.mutate({
      name: newLayoutName,
      slug: `${newLayoutType}-${newLayoutSlug}`,
      layoutJson: JSON.stringify(defaultBlocks),
    });
  };

  const handleSaveLayout = (layoutId: number, data: { blocks: LayoutBlock[]; html: string; css: string }) => {
    updateLayoutMutation.mutate({
      id: layoutId,
      data: {
        layoutJson: JSON.stringify(data.blocks),
        htmlContent: data.html,
        customCss: data.css,
      },
    });
  };

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

  const uploadLogoFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "오류", description: "이미지 파일만 업로드할 수 있습니다.", variant: "destructive" });
      return;
    }

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) throw new Error("업로드 실패");
      
      const data = await response.json();
      const imageUrl = data.url;
      
      setLogoImageUrl(imageUrl);
      await saveMutation.mutateAsync({ key: "logoImageUrl", value: imageUrl });
      
      const logoName = file.name.replace(/\.[^/.]+$/, "") || "로고";
      await createLogoMutation.mutateAsync({ name: logoName, objectPath: imageUrl });
      
      toast({ title: "로고가 갤러리에 저장되었습니다." });
    } catch (err) {
      toast({ title: "오류", description: "로고 업로드에 실패했습니다.", variant: "destructive" });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadLogoFile(file);
  };

  const handleLogoDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setLogoDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await uploadLogoFile(file);
  };

  const handleLogoDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setLogoDragOver(true);
  };

  const handleLogoDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setLogoDragOver(false);
  };

  const handleLogoUrlSave = async () => {
    if (!logoUrlInput) return;
    try {
      setLogoImageUrl(logoUrlInput);
      await saveMutation.mutateAsync({ key: "logoImageUrl", value: logoUrlInput });
      setShowLogoUrlInput(false);
      setLogoUrlInput("");
      toast({ title: "로고 URL 저장 완료" });
    } catch (err) {
      toast({ title: "오류", description: "로고 URL 저장에 실패했습니다.", variant: "destructive" });
    }
  };

  const handleRemoveLogo = async () => {
    try {
      setLogoImageUrl("");
      await saveMutation.mutateAsync({ key: "logoImageUrl", value: "" });
      toast({ title: "로고 이미지 삭제 완료" });
    } catch (err) {
      toast({ title: "오류", description: "로고 삭제에 실패했습니다.", variant: "destructive" });
    }
  };

  const freeLogoSites = [
    { name: "Canva", url: "https://www.canva.com/ko_kr/create/logos/", description: "무료 로고 제작" },
    { name: "Logomaster.ai", url: "https://logomaster.ai/", description: "AI 로고 생성" },
    { name: "Hatchful", url: "https://www.shopify.com/tools/logo-maker", description: "Shopify 로고 메이커" },
    { name: "Looka", url: "https://looka.com/", description: "AI 브랜드 로고" },
    { name: "Flaticon", url: "https://www.flaticon.com/", description: "무료 아이콘/로고" },
    { name: "Icons8", url: "https://icons8.com/icons", description: "무료 아이콘" },
  ];

  if (authLoading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <Card className="p-8">
          <p className="text-muted-foreground">로그인이 필요합니다.</p>
          <Link href="/">
            <Button className="mt-4 w-full">홈으로 돌아가기</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (user.isAdmin !== 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <Card className="p-8">
          <p className="text-muted-foreground">관리자만 접근할 수 있습니다.</p>
          <Link href="/">
            <Button className="mt-4 w-full">홈으로 돌아가기</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const defaultPages = [
    { pageSlug: "calendar", title: "달력" },
    { pageSlug: "madang", title: "마당" },
    { pageSlug: "ebook", title: "전자책" },
    { pageSlug: "28su", title: "28수" },
  ];

  const renderTopMenu = () => (
    <div className="bg-slate-800 text-white">
      <div className="flex items-center justify-between px-4 h-12">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyan-400" />
            <span className="font-bold text-lg">관리자모드</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-cyan-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  data-testid={`menu-${item.id}`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <Home className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">사이트로</span>
            </Button>
          </Link>
          
          <Button
            size="icon"
            variant="ghost"
            className="md:hidden text-white hover:bg-slate-700"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {mobileSidebarOpen && (
        <div className="md:hidden border-t border-slate-700 py-2 px-4">
          <div className="flex flex-wrap gap-2">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-cyan-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  data-testid={`menu-mobile-${item.id}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">대시보드</h2>
        <p className="text-muted-foreground">관리자 현황을 한눈에 확인하세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-0" data-testid="card-total-members">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100">전체 회원</p>
                <p className="text-3xl font-bold" data-testid="text-total-members-count">{members?.length || 0}</p>
              </div>
              <Users className="h-10 w-10 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0" data-testid="card-admin-count">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100">관리자 수</p>
                <p className="text-3xl font-bold" data-testid="text-admin-count">{members?.filter(m => m.isAdmin === 1).length || 0}</p>
              </div>
              <Shield className="h-10 w-10 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-500 to-violet-600 text-white border-0" data-testid="card-categories">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-100">카테고리</p>
                <p className="text-3xl font-bold" data-testid="text-categories-count">{categories?.length || 0}</p>
              </div>
              <FolderTree className="h-10 w-10 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0" data-testid="card-posts">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100">게시글 수</p>
                <p className="text-3xl font-bold" data-testid="text-posts-count">{recentPosts?.length || 0}</p>
              </div>
              <FileText className="h-10 w-10 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              최근 가입 회원
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">닉네임</th>
                    <th className="text-left py-2 px-3">아이디</th>
                    <th className="text-left py-2 px-3">가입일</th>
                    <th className="text-left py-2 px-3">권한</th>
                  </tr>
                </thead>
                <tbody>
                  {members?.slice(0, 5).map((member) => (
                    <tr key={member.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-3">{member.firstName || member.lastName ? `${member.firstName || ''} ${member.lastName || ''}`.trim() : member.email}</td>
                      <td className="py-2 px-3 text-muted-foreground">{member.email || '-'}</td>
                      <td className="py-2 px-3 text-muted-foreground">
                        {member.createdAt ? new Date(member.createdAt).toLocaleDateString('ko-KR') : '-'}
                      </td>
                      <td className="py-2 px-3">
                        {member.isAdmin === 1 ? (
                          <Badge variant="default" className="bg-cyan-600">관리자</Badge>
                        ) : (
                          <Badge variant="secondary">일반</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                  {(!members || members.length === 0) && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-muted-foreground">
                        회원이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => setActiveSection("members")}
            >
              전체 회원 보기
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              최근 게시글
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">제목</th>
                    <th className="text-left py-2 px-3">작성자</th>
                    <th className="text-left py-2 px-3">날짜</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPosts?.slice(0, 5).map((post: any) => (
                    <tr key={post.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-3 truncate max-w-[200px]">{post.title}</td>
                      <td className="py-2 px-3 text-muted-foreground">{post.author}</td>
                      <td className="py-2 px-3 text-muted-foreground">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString('ko-KR') : '-'}
                      </td>
                    </tr>
                  ))}
                  {(!recentPosts || recentPosts.length === 0) && (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-muted-foreground">
                        게시글이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const logoPresets = [
    { id: "style1", name: "스타일 1", text: "오래오라이", korean: "", hanja: "悟來", suffix: "닷컴" },
    { id: "style2", name: "스타일 2", text: "오래", korean: "오라이悟", hanja: "來", suffix: "닷컴" },
    { id: "style3", name: "스타일 3", text: "오래", korean: "오라이悟", hanja: "來", suffix: "닷컴" },
    { id: "style4", name: "스타일 4", text: "悟來", korean: "오라이오래닷컴", hanja: "", suffix: "" },
  ];

  const applyPreset = (preset: typeof logoPresets[0]) => {
    setSettings({
      ...settings,
      logoText: preset.text,
      logoTextKorean: preset.korean,
      logoTextHanja: preset.hanja + (preset.suffix ? " " + preset.suffix : ""),
    });
  };

  const renderLogoSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">로고 설정</h2>
        <p className="text-muted-foreground">사이트 로고 텍스트와 스타일을 설정합니다.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            로고 이미지 가져오기
          </CardTitle>
          <CardDescription>컴퓨터에서 업로드하거나 URL로 로고 이미지를 가져옵니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {logoImageUrl && (
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
              <img 
                src={logoImageUrl} 
                alt="현재 로고" 
                className="h-16 w-auto max-w-[200px] object-contain"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">현재 로고 이미지</p>
                <p className="text-xs text-muted-foreground truncate max-w-[300px]">{logoImageUrl}</p>
              </div>
              <Button size="sm" variant="outline" onClick={handleRemoveLogo} data-testid="button-remove-logo">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              logoDragOver 
                ? "border-primary bg-primary/10" 
                : "border-muted-foreground/30 hover:border-muted-foreground/50"
            }`}
            onDrop={handleLogoDrop}
            onDragOver={handleLogoDragOver}
            onDragLeave={handleLogoDragLeave}
            data-testid="dropzone-logo"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              disabled={uploadingLogo}
              data-testid="input-logo-file"
            />
            {uploadingLogo ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">업로드 중...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="font-medium">이미지를 여기에 드래그 앤 드롭하세요</p>
                  <p className="text-sm text-muted-foreground">또는 클릭하여 파일 선택</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 border-t" />
            <span className="text-sm text-muted-foreground">또는</span>
            <div className="flex-1 border-t" />
          </div>

          <div className="space-y-3">
            <Label>URL로 가져오기</Label>
            {showLogoUrlInput ? (
              <div className="flex gap-2">
                <Input
                  value={logoUrlInput}
                  onChange={(e) => setLogoUrlInput(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="flex-1"
                  data-testid="input-logo-url"
                />
                <Button size="icon" onClick={handleLogoUrlSave} data-testid="button-save-logo-url">
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={() => setShowLogoUrlInput(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setShowLogoUrlInput(true)} className="w-full" data-testid="button-show-url-input">
                <Link2 className="h-4 w-4 mr-2" />
                URL 입력
              </Button>
            )}
          </div>

          <div className="pt-4 border-t">
            <Label className="mb-3 block">무료 로고 제작 사이트</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {freeLogoSites.map((site) => (
                <a
                  key={site.name}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 border rounded-lg text-sm hover:bg-muted/50 transition-colors"
                  data-testid={`link-logo-site-${site.name.toLowerCase()}`}
                >
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  <div>
                    <span className="font-medium">{site.name}</span>
                    <span className="text-xs text-muted-foreground ml-1">- {site.description}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            로고 갤러리
          </CardTitle>
          <CardDescription>여러 로고를 저장하고 원하는 로고를 선택하여 사용할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {logosLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : siteLogos && siteLogos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {siteLogos.map((logo) => (
                <div
                  key={logo.id}
                  className={`relative border rounded-lg p-4 flex flex-col items-center gap-3 transition-colors ${
                    logo.isActive === 1 ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                >
                  {logo.isActive === 1 && (
                    <Badge className="absolute top-2 right-2" data-testid={`badge-active-logo-${logo.id}`}>활성</Badge>
                  )}
                  <img
                    src={logo.objectPath}
                    alt={logo.name}
                    className="h-16 w-auto max-w-full object-contain"
                  />
                  <p className="text-sm font-medium text-center truncate w-full">{logo.name}</p>
                  <div className="flex gap-2">
                    {logo.isActive !== 1 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => activateLogoMutation.mutate(logo.id)}
                        disabled={activateLogoMutation.isPending}
                        data-testid={`button-activate-logo-${logo.id}`}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        선택
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm(`"${logo.name}" 로고를 삭제하시겠습니까?`)) {
                          deleteLogoMutation.mutate(logo.id);
                        }
                      }}
                      disabled={deleteLogoMutation.isPending}
                      data-testid={`button-delete-logo-${logo.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Image className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>저장된 로고가 없습니다.</p>
              <p className="text-sm">위의 업로드 기능을 사용하여 로고를 업로드한 후 갤러리에 저장하세요.</p>
            </div>
          )}
          {logoImageUrl && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">현재 업로드된 로고를 갤러리에 저장합니다.</p>
              <div className="flex gap-2">
                <Input
                  placeholder="로고 이름 (예: 메인 로고, 크리스마스 로고)"
                  id="new-logo-name"
                  data-testid="input-new-logo-name"
                  className="flex-1"
                />
                <Button
                  onClick={() => {
                    const nameInput = document.getElementById("new-logo-name") as HTMLInputElement;
                    const name = nameInput?.value?.trim();
                    if (!name) {
                      toast({ title: "오류", description: "로고 이름을 입력하세요.", variant: "destructive" });
                      return;
                    }
                    createLogoMutation.mutate({ name, objectPath: logoImageUrl });
                    if (nameInput) nameInput.value = "";
                  }}
                  disabled={createLogoMutation.isPending}
                  data-testid="button-save-to-gallery"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  갤러리에 저장
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>현재 적용된 로고</CardTitle>
          <CardDescription>홈페이지에 표시되는 로고입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900">
            {logoImageUrl ? (
              <img 
                src={logoImageUrl} 
                alt="현재 로고" 
                className="h-10 w-auto max-w-[200px] object-contain"
              />
            ) : (
              <div className="flex items-center gap-3" style={{ fontFamily: `${settings.logoFontFamily}, sans-serif` }}>
                <svg viewBox="0 0 40 40" className="h-12 w-12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" stroke={settings.logoColor} strokeWidth="2.5" fill="none"/>
                  <circle cx="20" cy="20" r="14" stroke={settings.logoColor} strokeWidth="2.5" fill="none"/>
                  <circle cx="20" cy="20" r="10" stroke={settings.logoColor} strokeWidth="2.5" fill="none"/>
                  <circle cx="20" cy="20" r="6" stroke={settings.logoColor} strokeWidth="2.5" fill="none"/>
                  <circle cx="20" cy="20" r="2" fill={settings.logoColor}/>
                </svg>
                <div className="flex flex-col leading-tight">
                  {settings.logoText && <span className="font-bold text-2xl" style={{ color: settings.logoColor }}>{settings.logoText}</span>}
                  {settings.logoTextKorean && <span className="font-bold text-3xl" style={{ color: settings.logoColor }}>{settings.logoTextKorean}</span>}
                  {settings.logoTextHanja && <span className="text-sm" style={{ color: settings.logoColor }}>{settings.logoTextHanja}</span>}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>로고 스타일 프리셋</CardTitle>
          <CardDescription>미리 정의된 스타일 중 하나를 선택하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {logoPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="p-4 border rounded-lg text-left hover:bg-muted/50 transition-colors"
                data-testid={`preset-${preset.id}`}
              >
                <div className="text-lg font-bold text-primary mb-1" style={{ color: settings.logoColor }}>
                  {preset.text} {preset.korean} {preset.hanja} {preset.suffix}
                </div>
                <div className="text-sm text-muted-foreground">{preset.name}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-6">
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
    </div>
  );

  const renderMembers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">회원 관리</h2>
          <p className="text-muted-foreground">회원 목록을 관리하고 관리자 권한을 부여합니다.</p>
        </div>
        
        {selectedMembers.size > 0 && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowEmailModal(true)} data-testid="button-send-email">
              <Mail className="h-4 w-4 mr-1" />
              이메일 ({selectedMembers.size})
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowSmsModal(true)} data-testid="button-send-sms">
              <MessageSquare className="h-4 w-4 mr-1" />
              문자 ({selectedMembers.size})
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="py-3 px-2 w-10">
                    <Checkbox
                      checked={members && members.length > 0 && selectedMembers.size === members.length}
                      onCheckedChange={handleSelectAllMembers}
                      data-testid="checkbox-select-all"
                    />
                  </th>
                  <th className="text-left py-3 px-3 font-medium">이름</th>
                  <th className="text-left py-3 px-3 font-medium">이메일</th>
                  <th className="text-left py-3 px-3 font-medium">전화번호</th>
                  <th className="text-left py-3 px-3 font-medium">가입일</th>
                  <th className="text-left py-3 px-3 font-medium">관리자</th>
                  <th className="text-left py-3 px-3 font-medium">관리</th>
                </tr>
              </thead>
              <tbody>
                {membersLoading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : members?.map((member) => (
                  <tr key={member.id} className={`border-b hover:bg-muted/30 ${selectedMembers.has(member.id) ? 'bg-muted/20' : ''}`}>
                    <td className="py-3 px-2">
                      <Checkbox
                        checked={selectedMembers.has(member.id)}
                        onCheckedChange={(checked) => handleSelectMember(member.id, checked as boolean)}
                        data-testid={`checkbox-member-${member.id}`}
                      />
                    </td>
                    <td className="py-3 px-3 font-medium">
                      {member.firstName || member.lastName ? `${member.firstName || ''} ${member.lastName || ''}`.trim() : '-'}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{member.email || '-'}</td>
                    <td className="py-3 px-3 text-muted-foreground">{member.phone || '-'}</td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {member.createdAt ? new Date(member.createdAt).toLocaleDateString('ko-KR') : '-'}
                    </td>
                    <td className="py-3 px-3">
                      {member.id !== user?.id ? (
                        <Switch
                          checked={member.isAdmin === 1}
                          onCheckedChange={(checked) => 
                            toggleAdminMutation.mutate({ userId: member.id, isAdmin: checked ? 1 : 0 })
                          }
                          disabled={toggleAdminMutation.isPending}
                          data-testid={`switch-admin-${member.id}`}
                        />
                      ) : (
                        <Badge variant="default" className="bg-cyan-600">본인</Badge>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => setEditingMember(member)}
                          data-testid={`button-edit-member-${member.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {member.id !== user?.id && (
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              if (confirm('정말 이 회원을 삭제하시겠습니까?')) {
                                deleteMemberMutation.mutate(member.id);
                              }
                            }}
                            disabled={deleteMemberMutation.isPending}
                            data-testid={`button-delete-member-${member.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {(!members || members.length === 0) && !membersLoading && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      회원이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>회원 정보 수정</DialogTitle>
            <DialogDescription>회원의 이름, 이메일, 전화번호를 수정합니다.</DialogDescription>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>이름</Label>
                  <Input
                    value={editingMember.firstName || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, firstName: e.target.value })}
                    placeholder="이름"
                  />
                </div>
                <div className="space-y-2">
                  <Label>성</Label>
                  <Input
                    value={editingMember.lastName || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, lastName: e.target.value })}
                    placeholder="성"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>이메일</Label>
                <Input
                  value={editingMember.email || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  placeholder="이메일"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label>전화번호</Label>
                <Input
                  value={editingMember.phone || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                  placeholder="010-0000-0000"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMember(null)}>취소</Button>
            <Button 
              onClick={() => editingMember && updateMemberMutation.mutate({
                userId: editingMember.id,
                data: {
                  firstName: editingMember.firstName || undefined,
                  lastName: editingMember.lastName || undefined,
                  email: editingMember.email || undefined,
                  phone: editingMember.phone || undefined,
                }
              })}
              disabled={updateMemberMutation.isPending}
            >
              {updateMemberMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>이메일 작성</DialogTitle>
            <DialogDescription>{selectedMembers.size}명의 회원에게 이메일을 발송합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>제목</Label>
              <Input
                value={emailContent.subject}
                onChange={(e) => setEmailContent({ ...emailContent, subject: e.target.value })}
                placeholder="이메일 제목"
              />
            </div>
            <div className="space-y-2">
              <Label>내용</Label>
              <Textarea
                value={emailContent.body}
                onChange={(e) => setEmailContent({ ...emailContent, body: e.target.value })}
                placeholder="이메일 내용을 입력하세요"
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailModal(false)}>취소</Button>
            <Button onClick={handleSendEmail}>
              <Mail className="h-4 w-4 mr-2" />
              발송
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSmsModal} onOpenChange={setShowSmsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>문자 작성</DialogTitle>
            <DialogDescription>{selectedMembers.size}명의 회원에게 문자를 발송합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>내용</Label>
              <Textarea
                value={smsContent}
                onChange={(e) => setSmsContent(e.target.value)}
                placeholder="문자 내용을 입력하세요 (90자 이내)"
                rows={4}
                maxLength={90}
              />
              <p className="text-xs text-muted-foreground">{smsContent.length}/90자</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSmsModal(false)}>취소</Button>
            <Button onClick={handleSendSms}>
              <MessageSquare className="h-4 w-4 mr-2" />
              발송
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderLayouts = () => {
    if (editingLayout) {
      const blocks: LayoutBlock[] = editingLayout.layoutJson ? JSON.parse(editingLayout.layoutJson) : [];
      return (
        <PageBuilder
          initialBlocks={blocks}
          initialHtml={editingLayout.htmlContent || ""}
          initialCss={editingLayout.customCss || ""}
          layoutName={editingLayout.name}
          onSave={(data) => handleSaveLayout(editingLayout.id, data)}
          onCancel={() => setEditingLayout(null)}
        />
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold">페이지 빌더</h2>
            <p className="text-muted-foreground">마당/전자책 페이지 레이아웃을 드래그 앤 드롭으로 디자인합니다.</p>
          </div>
          <Button onClick={() => setCreatingLayout(true)} data-testid="button-create-layout">
            <Plus className="h-4 w-4 mr-2" />
            새 레이아웃
          </Button>
        </div>

        {creatingLayout && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">새 레이아웃 만들기</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>페이지 타입</Label>
                  <Select value={newLayoutType} onValueChange={(v) => setNewLayoutType(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="madang">마당</SelectItem>
                      <SelectItem value="ebook">전자책</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>레이아웃 이름</Label>
                  <Input
                    value={newLayoutName}
                    onChange={(e) => setNewLayoutName(e.target.value)}
                    placeholder="예: 메인 페이지"
                  />
                </div>
                <div className="space-y-2">
                  <Label>슬러그</Label>
                  <Input
                    value={newLayoutSlug}
                    onChange={(e) => setNewLayoutSlug(e.target.value)}
                    placeholder="예: main"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateLayout} disabled={createLayoutMutation.isPending}>
                  {createLayoutMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  생성
                </Button>
                <Button variant="outline" onClick={() => setCreatingLayout(false)}>
                  취소
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">이름</th>
                    <th className="text-left py-3 px-4 font-medium">슬러그</th>
                    <th className="text-left py-3 px-4 font-medium">타입</th>
                    <th className="text-left py-3 px-4 font-medium">발행</th>
                    <th className="text-left py-3 px-4 font-medium">수정일</th>
                    <th className="text-left py-3 px-4 font-medium">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {layoutsLoading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : layouts?.map((layout) => (
                    <tr key={layout.id} className="border-b hover:bg-muted/30">
                      <td className="py-3 px-4 font-medium">{layout.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{layout.slug}</td>
                      <td className="py-3 px-4">
                        <Badge variant={layout.slug.startsWith('madang') ? 'default' : 'secondary'}>
                          {layout.slug.startsWith('madang') ? '마당' : '전자책'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Switch
                          checked={layout.isPublished === 1}
                          onCheckedChange={(checked) => {
                            updateLayoutMutation.mutate({
                              id: layout.id,
                              data: { isPublished: checked ? 1 : 0 }
                            });
                          }}
                          data-testid={`switch-publish-layout-${layout.id}`}
                        />
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {layout.updatedAt ? new Date(layout.updatedAt).toLocaleDateString('ko-KR') : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => setEditingLayout(layout)}
                            data-testid={`button-edit-layout-${layout.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              if (confirm('정말 이 레이아웃을 삭제하시겠습니까?')) {
                                deleteLayoutMutation.mutate(layout.id);
                              }
                            }}
                            disabled={deleteLayoutMutation.isPending}
                            data-testid={`button-delete-layout-${layout.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!layouts || layouts.length === 0) && !layoutsLoading && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        레이아웃이 없습니다. 새 레이아웃을 만들어보세요.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCategories = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">마당 카테고리 관리</h2>
        <p className="text-muted-foreground">마당 게시판의 카테고리를 관리합니다. (카테고리 → 서브 → 서브서브)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>새 카테고리 추가</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>카테고리 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {categoriesLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : categories?.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">카테고리가 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {categories?.filter(c => c.level === 1).map((category) => (
                <div key={category.id} className="border rounded-lg">
                  <div className="flex items-center justify-between p-3 bg-muted/30">
                    {editingCategory?.id === category.id ? (
                      <div className="flex-1 flex gap-2">
                        <Input value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} />
                        <Input value={editingCategory.slug} onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })} />
                        <Button size="sm" onClick={() => updateCategoryMutation.mutate(editingCategory)}>저장</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingCategory(null)}>취소</Button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="font-medium">{category.name}</span>
                          <span className="text-muted-foreground ml-2">({category.slug})</span>
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => setEditingCategory(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteCategoryMutation.mutate(category.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {categories?.filter(c => c.level === 2 && c.parentId === category.id).map((sub) => (
                    <div key={sub.id} className="border-t">
                      <div className="flex items-center justify-between p-3 pl-8 bg-muted/10">
                        {editingCategory?.id === sub.id ? (
                          <div className="flex-1 flex gap-2">
                            <Input value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} />
                            <Input value={editingCategory.slug} onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })} />
                            <Button size="sm" onClick={() => updateCategoryMutation.mutate(editingCategory)}>저장</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingCategory(null)}>취소</Button>
                          </div>
                        ) : (
                          <>
                            <div>
                              <span className="text-muted-foreground mr-2">└</span>
                              <span className="font-medium">{sub.name}</span>
                              <span className="text-muted-foreground ml-2">({sub.slug})</span>
                            </div>
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" onClick={() => setEditingCategory(sub)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => deleteCategoryMutation.mutate(sub.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {categories?.filter(c => c.level === 3 && c.parentId === sub.id).map((subsub) => (
                        <div key={subsub.id} className="flex items-center justify-between p-3 pl-14 border-t bg-background">
                          {editingCategory?.id === subsub.id ? (
                            <div className="flex-1 flex gap-2">
                              <Input value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} />
                              <Input value={editingCategory.slug} onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })} />
                              <Button size="sm" onClick={() => updateCategoryMutation.mutate(editingCategory)}>저장</Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingCategory(null)}>취소</Button>
                            </div>
                          ) : (
                            <>
                              <div>
                                <span className="text-muted-foreground mr-2">└</span>
                                <span>{subsub.name}</span>
                                <span className="text-muted-foreground ml-2">({subsub.slug})</span>
                              </div>
                              <div className="flex gap-1">
                                <Button size="icon" variant="ghost" onClick={() => setEditingCategory(subsub)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => deleteCategoryMutation.mutate(subsub.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderCalendar = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">달력 데이터</h2>
        <p className="text-muted-foreground">달력 데이터를 엑셀 파일로 다운로드합니다.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            엑셀 다운로드
          </CardTitle>
          <CardDescription>1989년 1월 1일 ~ 2050년 12월 31일까지의 달력 데이터</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
            <h4 className="font-medium">포함 데이터:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>날짜 (양력, 황극력)</li>
              <li>60간지 (干支)</li>
              <li>28수 (二十八宿)</li>
              <li>28장 (二十八章)</li>
              <li>오전/오후 소궁, 대궁, 81궁 이름</li>
              <li>오전/오후 팔괘 (소궁/대궁 기반)</li>
            </ul>
          </div>
          <Button onClick={handleDownloadCalendar} className="w-full sm:w-auto" data-testid="button-download-calendar">
            <Download className="h-4 w-4 mr-2" />
            엑셀 파일 다운로드
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderPages = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">페이지 관리</h2>
        <p className="text-muted-foreground">페이지 콘텐츠를 편집합니다.</p>
      </div>

      {editingPage ? (
        <Card>
          <CardHeader>
            <CardTitle>페이지 편집: {editingPage.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>제목</Label>
              <Input
                value={editingPage.title || ""}
                onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>콘텐츠 (HTML)</Label>
              <Textarea
                value={editingPage.content || ""}
                onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                rows={10}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>커스텀 CSS</Label>
              <Textarea
                value={editingPage.customCss || ""}
                onChange={(e) => setEditingPage({ ...editingPage, customCss: e.target.value })}
                rows={5}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>커스텀 JavaScript</Label>
              <Textarea
                value={editingPage.customJs || ""}
                onChange={(e) => setEditingPage({ ...editingPage, customJs: e.target.value })}
                rows={5}
                className="font-mono text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => savePageMutation.mutate(editingPage)} disabled={savePageMutation.isPending}>
                {savePageMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                저장
              </Button>
              <Button variant="outline" onClick={() => setEditingPage(null)}>취소</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>페이지 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {defaultPages.map((page) => {
                const savedPage = pages?.find(p => p.pageSlug === page.pageSlug);
                return (
                  <div key={page.pageSlug} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30">
                    <div>
                      <span className="font-medium">{page.title}</span>
                      <span className="text-muted-foreground ml-2">/{page.pageSlug}</span>
                      {savedPage && (
                        <Badge variant="secondary" className="ml-2">편집됨</Badge>
                      )}
                    </div>
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
                        updatedBy: user?.id || null,
                        updatedAt: null 
                      })}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      편집
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const filteredSnippets = codeSnippets?.filter(s => 
    snippetFilter === "all" || s.language === snippetFilter
  ) || [];

  const languageOptions = [
    { value: "html", label: "HTML", color: "bg-orange-500" },
    { value: "css", label: "CSS", color: "bg-blue-500" },
    { value: "javascript", label: "JavaScript", color: "bg-yellow-500" },
    { value: "python", label: "Python", color: "bg-green-500" },
  ];

  const categoryOptions = [
    { value: "ui", label: "UI 컴포넌트" },
    { value: "data", label: "데이터 처리" },
    { value: "api", label: "API 연동" },
    { value: "utility", label: "유틸리티" },
  ];

  const renderSnippets = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">코드 스니펫 관리</h2>
          <p className="text-muted-foreground">HTML, CSS, JavaScript, Python 코드 저장소</p>
        </div>
        <Button onClick={() => setCreatingSnippet(true)} data-testid="button-create-snippet">
          <Plus className="h-4 w-4 mr-2" />
          새 스니펫
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Select value={snippetFilter} onValueChange={setSnippetFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-snippet-filter">
            <SelectValue placeholder="언어 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 언어</SelectItem>
            {languageOptions.map(lang => (
              <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {filteredSnippets.length}개 스니펫
        </span>
      </div>

      {(creatingSnippet || editingSnippet) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingSnippet ? "스니펫 수정" : "새 스니펫 생성"}</CardTitle>
          </CardHeader>
          <CardContent>
            <SnippetForm
              snippet={editingSnippet}
              languageOptions={languageOptions}
              categoryOptions={categoryOptions}
              onSave={(data) => {
                if (editingSnippet) {
                  updateSnippetMutation.mutate({ id: editingSnippet.id, data });
                } else {
                  createSnippetMutation.mutate(data);
                }
              }}
              onCancel={() => {
                setEditingSnippet(null);
                setCreatingSnippet(false);
              }}
              isPending={createSnippetMutation.isPending || updateSnippetMutation.isPending}
            />
          </CardContent>
        </Card>
      )}

      {snippetsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredSnippets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Code2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">저장된 코드 스니펫이 없습니다.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredSnippets.map((snippet) => {
            const langInfo = languageOptions.find(l => l.value === snippet.language);
            return (
              <Card key={snippet.id} data-testid={`card-snippet-${snippet.id}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-lg">{snippet.name}</CardTitle>
                        <Badge className={`${langInfo?.color || "bg-gray-500"} text-white`}>
                          {langInfo?.label || snippet.language}
                        </Badge>
                        {snippet.category && (
                          <Badge variant="outline">
                            {categoryOptions.find(c => c.value === snippet.category)?.label || snippet.category}
                          </Badge>
                        )}
                        {snippet.isPublic === 0 && (
                          <Badge variant="secondary">비공개</Badge>
                        )}
                      </div>
                      {snippet.description && (
                        <p className="text-sm text-muted-foreground mt-1">{snippet.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(snippet.code);
                          toast({ title: "코드가 클립보드에 복사되었습니다." });
                        }}
                        data-testid={`button-copy-snippet-${snippet.id}`}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingSnippet(snippet)}
                        data-testid={`button-edit-snippet-${snippet.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          if (confirm("정말 삭제하시겠습니까?")) {
                            deleteSnippetMutation.mutate(snippet.id);
                          }
                        }}
                        data-testid={`button-delete-snippet-${snippet.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm max-h-48">
                    <code>{snippet.code}</code>
                  </pre>
                  {snippet.tags && snippet.tags.length > 0 && (
                    <div className="flex gap-1 mt-3 flex-wrap">
                      {snippet.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "logo":
        return renderLogoSettings();
      case "members":
        return renderMembers();
      case "categories":
        return renderCategories();
      case "layouts":
        return renderLayouts();
      case "snippets":
        return renderSnippets();
      case "calendar":
        return renderCalendar();
      case "pages":
        return renderPages();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900">
      {renderTopMenu()}
      
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {renderContent()}
      </main>
    </div>
  );
}
