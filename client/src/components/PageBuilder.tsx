import { useState, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LayoutTemplate,
  Type,
  Image,
  Table,
  Code,
  Square,
  PanelLeft,
  PanelRight,
  GripVertical,
  Trash2,
  Settings,
  Eye,
  Save,
  Plus,
  X,
  Newspaper,
  BookOpen,
  Clock,
  TrendingUp,
  FolderTree,
  CalendarDays,
  ImageIcon,
  Youtube,
  Minus,
  Search,
  Share2,
  Tags,
  AlertCircle,
  Move,
  Quote,
  BarChart3,
  User,
  Layers,
  LayoutGrid,
  ChevronDown,
  GalleryHorizontal,
  LogIn,
  Download,
  ExternalLink,
  FileCode,
  Globe,
  Upload,
  Loader2,
} from "lucide-react";
import type { LayoutBlock } from "@shared/schema";

interface BlockPaletteItem {
  type: LayoutBlock["type"];
  label: string;
  icon: typeof LayoutTemplate;
  defaultProps: Record<string, any>;
}

// 블록 카테고리 분류
const LAYOUT_BLOCKS: BlockPaletteItem[] = [
  { type: "header", label: "헤더", icon: LayoutTemplate, defaultProps: { height: "80px", backgroundColor: "#f8fafc" } },
  { type: "sidebar-left", label: "왼쪽 사이드바", icon: PanelLeft, defaultProps: { width: "250px", backgroundColor: "#f1f5f9" } },
  { type: "sidebar-right", label: "오른쪽 사이드바", icon: PanelRight, defaultProps: { width: "250px", backgroundColor: "#f1f5f9" } },
  { type: "body", label: "본문 영역", icon: Square, defaultProps: { minHeight: "400px", backgroundColor: "#ffffff" } },
  { type: "footer", label: "푸터", icon: LayoutTemplate, defaultProps: { height: "60px", backgroundColor: "#f8fafc" } },
  { type: "container", label: "컨테이너", icon: Square, defaultProps: { padding: "16px", backgroundColor: "transparent" } },
  { type: "divider", label: "구분선", icon: Minus, defaultProps: { height: "1px", color: "#e2e8f0", margin: "16px 0" } },
];

const CONTENT_BLOCKS: BlockPaletteItem[] = [
  { type: "text", label: "텍스트", icon: Type, defaultProps: { content: "텍스트를 입력하세요", fontSize: "16px", fontWeight: "normal" } },
  { type: "image", label: "이미지", icon: Image, defaultProps: { src: "", alt: "", width: "100%", borderRadius: "0" } },
  { type: "table", label: "테이블", icon: Table, defaultProps: { rows: 3, cols: 3, data: [] } },
  { type: "html", label: "HTML", icon: Code, defaultProps: { html: "<div>HTML 코드</div>" } },
  { type: "banner", label: "배너", icon: ImageIcon, defaultProps: { imageUrl: "", linkUrl: "", altText: "배너", height: "200px" } },
  { type: "youtube-embed", label: "유튜브", icon: Youtube, defaultProps: { videoId: "", width: "100%", height: "315px" } },
  { type: "quote", label: "인용문", icon: Quote, defaultProps: { content: "인용문을 입력하세요", author: "", style: "default" } },
  { type: "notice", label: "알림박스", icon: AlertCircle, defaultProps: { content: "알림 내용", type: "info", dismissible: false } },
  { type: "spacer", label: "여백", icon: Move, defaultProps: { height: "32px" } },
  { type: "slider", label: "슬라이더", icon: Layers, defaultProps: { images: [], autoPlay: true, interval: 5000, height: "300px" } },
  { type: "gallery", label: "갤러리", icon: GalleryHorizontal, defaultProps: { images: [], columns: 3, gap: "8px" } },
  { type: "tabs", label: "탭", icon: LayoutGrid, defaultProps: { tabs: [{ title: "탭1", content: "내용1" }] } },
  { type: "accordion", label: "아코디언", icon: ChevronDown, defaultProps: { items: [{ title: "제목", content: "내용" }] } },
];

const WIDGET_BLOCKS: BlockPaletteItem[] = [
  { type: "madang-posts", label: "마당 게시판", icon: Newspaper, defaultProps: { limit: 10, showPagination: true, style: "list", categoryId: null } },
  { type: "ebook-posts", label: "전자책 목록", icon: BookOpen, defaultProps: { limit: 10, showPagination: true, style: "grid" } },
  { type: "recent-posts", label: "최신글", icon: Clock, defaultProps: { limit: 5, section: "all", showDate: true } },
  { type: "popular-posts", label: "인기글", icon: TrendingUp, defaultProps: { limit: 5, section: "all", sortBy: "likes" } },
  { type: "categories", label: "카테고리 메뉴", icon: FolderTree, defaultProps: { style: "list", showCount: true } },
  { type: "calendar-widget", label: "달력 위젯", icon: CalendarDays, defaultProps: { showLunar: true, compact: false } },
  { type: "search-widget", label: "검색", icon: Search, defaultProps: { placeholder: "검색어를 입력하세요", section: "all" } },
  { type: "social-links", label: "소셜 링크", icon: Share2, defaultProps: { links: [], style: "icons" } },
  { type: "tag-cloud", label: "태그 클라우드", icon: Tags, defaultProps: { limit: 20, minSize: 12, maxSize: 24 } },
  { type: "stats", label: "통계", icon: BarChart3, defaultProps: { items: [], style: "cards" } },
  { type: "member-profile", label: "회원 프로필", icon: User, defaultProps: { showAvatar: true, showBio: true } },
  { type: "login-widget", label: "로그인", icon: LogIn, defaultProps: { showRegister: true, redirectUrl: "/" } },
];

const BLOCK_PALETTE: BlockPaletteItem[] = [...LAYOUT_BLOCKS, ...CONTENT_BLOCKS, ...WIDGET_BLOCKS];

interface SortableBlockProps {
  block: LayoutBlock;
  onEdit: (block: LayoutBlock) => void;
  onDelete: (id: string) => void;
}

function SortableBlock({ block, onEdit, onDelete }: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getBlockLabel = (type: LayoutBlock["type"]) => {
    const item = BLOCK_PALETTE.find((p) => p.type === type);
    return item?.label || type;
  };

  const getBlockIcon = (type: LayoutBlock["type"]) => {
    const item = BLOCK_PALETTE.find((p) => p.type === type);
    const Icon = item?.icon || Square;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 bg-card border rounded-md mb-2 group"
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex items-center gap-2 flex-1">
        {getBlockIcon(block.type)}
        <span className="text-sm font-medium">{getBlockLabel(block.type)}</span>
        {block.props.content && (
          <span className="text-xs text-muted-foreground truncate max-w-[150px]">
            {block.props.content}
          </span>
        )}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="icon" variant="ghost" onClick={() => onEdit(block)} data-testid={`button-edit-block-${block.id}`}>
          <Settings className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => onDelete(block.id)} data-testid={`button-delete-block-${block.id}`}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

interface PageBuilderProps {
  initialBlocks?: LayoutBlock[];
  initialHtml?: string;
  initialCss?: string;
  onSave: (data: { blocks: LayoutBlock[]; html: string; css: string }) => void;
  onCancel?: () => void;
  layoutName?: string;
}

export default function PageBuilder({ initialBlocks = [], initialHtml = "", initialCss = "", onSave, onCancel, layoutName }: PageBuilderProps) {
  const [blocks, setBlocks] = useState<LayoutBlock[]>(initialBlocks);
  const [htmlContent, setHtmlContent] = useState(initialHtml);
  const [cssContent, setCssContent] = useState(initialCss);
  const [activeTab, setActiveTab] = useState<"visual" | "html" | "preview">("visual");
  const [editingBlock, setEditingBlock] = useState<LayoutBlock | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importType, setImportType] = useState<"url" | "code">("code");
  const [importUrl, setImportUrl] = useState("");
  const [importHtml, setImportHtml] = useState("");
  const [importCss, setImportCss] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importDragOver, setImportDragOver] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const generateId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addBlock = (paletteItem: BlockPaletteItem) => {
    const newBlock: LayoutBlock = {
      id: generateId(),
      type: paletteItem.type,
      props: { ...paletteItem.defaultProps },
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (updatedBlock: LayoutBlock) => {
    setBlocks(blocks.map((b) => (b.id === updatedBlock.id ? updatedBlock : b)));
    setEditingBlock(null);
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  // 드래그 앤 드롭으로 파일 가져오기 핸들러
  const handleImportDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImportDragOver(true);
  };

  const handleImportDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImportDragOver(false);
  };

  const handleImportDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImportDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    setIsImporting(true);
    
    try {
      for (const file of files) {
        const ext = file.name.split('.').pop()?.toLowerCase();
        const content = await file.text();
        
        if (ext === 'html' || ext === 'htm') {
          setImportHtml(prev => prev ? prev + "\n\n" + content : content);
        } else if (ext === 'css') {
          setImportCss(prev => prev ? prev + "\n\n" + content : content);
        }
      }
    } catch (error) {
      console.error("파일 읽기 오류:", error);
    }
    
    setIsImporting(false);
  };

  const handleImportFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsImporting(true);
    
    try {
      for (const file of files) {
        const ext = file.name.split('.').pop()?.toLowerCase();
        const content = await file.text();
        
        if (ext === 'html' || ext === 'htm') {
          setImportHtml(prev => prev ? prev + "\n\n" + content : content);
        } else if (ext === 'css') {
          setImportCss(prev => prev ? prev + "\n\n" + content : content);
        }
      }
    } catch (error) {
      console.error("파일 읽기 오류:", error);
    }
    
    setIsImporting(false);
    e.target.value = "";
  };

  const generateHtmlFromBlocks = useCallback(() => {
    let html = "";
    
    blocks.forEach((block) => {
      switch (block.type) {
        case "header":
          html += `<header style="height: ${block.props.height}; background-color: ${block.props.backgroundColor}; padding: 16px;">\n  <!-- 헤더 내용 -->\n</header>\n\n`;
          break;
        case "sidebar-left":
          html += `<aside class="sidebar-left" style="width: ${block.props.width}; background-color: ${block.props.backgroundColor}; padding: 16px;">\n  <!-- 왼쪽 사이드바 -->\n</aside>\n\n`;
          break;
        case "sidebar-right":
          html += `<aside class="sidebar-right" style="width: ${block.props.width}; background-color: ${block.props.backgroundColor}; padding: 16px;">\n  <!-- 오른쪽 사이드바 -->\n</aside>\n\n`;
          break;
        case "body":
          html += `<main style="min-height: ${block.props.minHeight}; background-color: ${block.props.backgroundColor}; padding: 16px;">\n  <!-- 본문 내용 -->\n</main>\n\n`;
          break;
        case "footer":
          html += `<footer style="height: ${block.props.height}; background-color: ${block.props.backgroundColor}; padding: 16px;">\n  <!-- 푸터 내용 -->\n</footer>\n\n`;
          break;
        case "text":
          html += `<p style="font-size: ${block.props.fontSize}; font-weight: ${block.props.fontWeight || 'normal'};">${block.props.content}</p>\n\n`;
          break;
        case "image":
          html += `<img src="${block.props.src}" alt="${block.props.alt}" style="width: ${block.props.width}; border-radius: ${block.props.borderRadius || '0'};" />\n\n`;
          break;
        case "table":
          html += generateTableHtml(block.props.rows, block.props.cols, block.props.data);
          break;
        case "html":
          html += `${block.props.html}\n\n`;
          break;
        case "container":
          html += `<div style="padding: ${block.props.padding}; background-color: ${block.props.backgroundColor};">\n  <!-- 컨테이너 내용 -->\n</div>\n\n`;
          break;
        case "divider":
          html += `<hr style="height: ${block.props.height}; background-color: ${block.props.color}; border: none; margin: ${block.props.margin};" />\n\n`;
          break;
        case "banner":
          html += `<div class="banner-block" style="height: ${block.props.height};">\n  <a href="${block.props.linkUrl}">\n    <img src="${block.props.imageUrl}" alt="${block.props.altText}" style="width: 100%; height: 100%; object-fit: cover;" />\n  </a>\n</div>\n\n`;
          break;
        case "youtube-embed":
          html += `<div class="youtube-embed" style="width: ${block.props.width};">\n  <iframe width="100%" height="${block.props.height}" src="https://www.youtube.com/embed/${block.props.videoId}" frameborder="0" allowfullscreen></iframe>\n</div>\n\n`;
          break;
        case "madang-posts":
          html += `<div class="madang-posts-widget" data-limit="${block.props.limit}" data-style="${block.props.style}" data-category="${block.props.categoryId || ''}" data-pagination="${block.props.showPagination}">\n  <!-- 마당 게시판 위젯 (서버에서 렌더링) -->\n</div>\n\n`;
          break;
        case "ebook-posts":
          html += `<div class="ebook-posts-widget" data-limit="${block.props.limit}" data-style="${block.props.style}" data-pagination="${block.props.showPagination}">\n  <!-- 전자책 목록 위젯 (서버에서 렌더링) -->\n</div>\n\n`;
          break;
        case "recent-posts":
          html += `<div class="recent-posts-widget" data-limit="${block.props.limit}" data-section="${block.props.section}" data-show-date="${block.props.showDate}">\n  <!-- 최신글 위젯 (서버에서 렌더링) -->\n</div>\n\n`;
          break;
        case "popular-posts":
          html += `<div class="popular-posts-widget" data-limit="${block.props.limit}" data-section="${block.props.section}" data-sort="${block.props.sortBy}">\n  <!-- 인기글 위젯 (서버에서 렌더링) -->\n</div>\n\n`;
          break;
        case "categories":
          html += `<div class="categories-widget" data-style="${block.props.style}" data-show-count="${block.props.showCount}">\n  <!-- 카테고리 위젯 (서버에서 렌더링) -->\n</div>\n\n`;
          break;
        case "calendar-widget":
          html += `<div class="calendar-widget" data-show-lunar="${block.props.showLunar}" data-compact="${block.props.compact}">\n  <!-- 달력 위젯 (서버에서 렌더링) -->\n</div>\n\n`;
          break;
        case "search-widget":
          html += `<div class="search-widget" data-placeholder="${block.props.placeholder}" data-section="${block.props.section}">\n  <!-- 검색 위젯 (서버에서 렌더링) -->\n</div>\n\n`;
          break;
        case "social-links":
          html += `<div class="social-links-widget" data-style="${block.props.style}" data-links='${JSON.stringify(block.props.links || [])}'>\n  <!-- 소셜 링크 (서버에서 렌더링) -->\n</div>\n\n`;
          break;
        case "tag-cloud":
          html += `<div class="tag-cloud-widget" data-limit="${block.props.limit}" data-min-size="${block.props.minSize}" data-max-size="${block.props.maxSize}">\n  <!-- 태그 클라우드 (서버에서 렌더링) -->\n</div>\n\n`;
          break;
        case "stats":
          html += `<div class="stats-widget" data-style="${block.props.style}" data-items='${JSON.stringify(block.props.items || [])}'>\n  <!-- 통계 위젯 (서버에서 렌더링) -->\n</div>\n\n`;
          break;
        case "member-profile":
          html += `<div class="member-profile-widget" data-show-avatar="${block.props.showAvatar}" data-show-bio="${block.props.showBio}">\n  <!-- 회원 프로필 (서버에서 렌더링) -->\n</div>\n\n`;
          break;
        case "login-widget":
          html += `<div class="login-widget" data-show-register="${block.props.showRegister}" data-redirect="${block.props.redirectUrl}">\n  <!-- 로그인 위젯 (서버에서 렌더링) -->\n</div>\n\n`;
          break;
        case "quote":
          html += `<blockquote class="quote-block" style="font-style: italic; border-left: 4px solid #ccc; padding-left: 16px; margin: 16px 0;">\n  <p>${block.props.content}</p>\n  ${block.props.author ? `<footer>— ${block.props.author}</footer>` : ''}\n</blockquote>\n\n`;
          break;
        case "notice":
          html += `<div class="notice-block notice-${block.props.type}" style="padding: 16px; border-radius: 4px; margin: 16px 0;">\n  ${block.props.content}\n</div>\n\n`;
          break;
        case "spacer":
          html += `<div class="spacer" style="height: ${block.props.height};"></div>\n\n`;
          break;
        case "slider":
          html += `<div class="slider-widget" data-autoplay="${block.props.autoPlay}" data-interval="${block.props.interval}" data-height="${block.props.height}" data-images='${JSON.stringify(block.props.images || [])}'>\n  <!-- 슬라이더 (서버에서 렌더링) -->\n</div>\n\n`;
          break;
        case "gallery":
          html += `<div class="gallery-widget" data-columns="${block.props.columns}" data-gap="${block.props.gap}" data-images='${JSON.stringify(block.props.images || [])}'>\n  <!-- 갤러리 (서버에서 렌더링) -->\n</div>\n\n`;
          break;
        case "tabs":
          html += `<div class="tabs-widget" data-tabs='${JSON.stringify(block.props.tabs || [])}'>\n  <!-- 탭 (서버에서 렌더링) -->\n</div>\n\n`;
          break;
        case "accordion":
          html += `<div class="accordion-widget" data-items='${JSON.stringify(block.props.items || [])}'>\n  <!-- 아코디언 (서버에서 렌더링) -->\n</div>\n\n`;
          break;
      }
    });

    return html;
  }, [blocks]);

  const generateTableHtml = (rows: number, cols: number, data: string[][]) => {
    let html = '<table style="width: 100%; border-collapse: collapse;">\n';
    for (let i = 0; i < rows; i++) {
      html += "  <tr>\n";
      for (let j = 0; j < cols; j++) {
        const cellContent = data?.[i]?.[j] || "";
        html += `    <td style="border: 1px solid #ddd; padding: 8px;">${cellContent}</td>\n`;
      }
      html += "  </tr>\n";
    }
    html += "</table>\n\n";
    return html;
  };

  const syncHtmlFromBlocks = () => {
    const generatedHtml = generateHtmlFromBlocks();
    setHtmlContent(generatedHtml);
    setActiveTab("html");
  };

  const handleSave = () => {
    onSave({
      blocks,
      html: htmlContent || generateHtmlFromBlocks(),
      css: cssContent,
    });
  };

  const renderPreview = () => {
    const html = htmlContent || generateHtmlFromBlocks();
    return (
      <div className="border rounded-md p-4 bg-white min-h-[400px]">
        <style>{cssContent}</style>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{layoutName ? `"${layoutName}" 편집` : "페이지 빌더"}</h2>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              취소
            </Button>
          )}
          <Button onClick={handleSave} data-testid="button-save-layout">
            <Save className="h-4 w-4 mr-2" />
            저장
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="visual" data-testid="tab-visual">
            <LayoutTemplate className="h-4 w-4 mr-2" />
            비주얼 편집
          </TabsTrigger>
          <TabsTrigger value="html" data-testid="tab-html">
            <Code className="h-4 w-4 mr-2" />
            HTML/CSS
          </TabsTrigger>
          <TabsTrigger value="preview" data-testid="tab-preview">
            <Eye className="h-4 w-4 mr-2" />
            미리보기
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1 max-h-[600px] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-sm">블록 팔레트</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">레이아웃</h4>
                  <div className="space-y-1">
                    {LAYOUT_BLOCKS.map((item) => (
                      <Button
                        key={item.type}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => addBlock(item)}
                        data-testid={`button-add-${item.type}`}
                      >
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">콘텐츠</h4>
                  <div className="space-y-1">
                    {CONTENT_BLOCKS.map((item) => (
                      <Button
                        key={item.type}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => addBlock(item)}
                        data-testid={`button-add-${item.type}`}
                      >
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">위젯</h4>
                  <div className="space-y-1">
                    {WIDGET_BLOCKS.map((item) => (
                      <Button
                        key={item.type}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start bg-primary/5"
                        onClick={() => addBlock(item)}
                        data-testid={`button-add-${item.type}`}
                      >
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">외부 코드</h4>
                  <div className="space-y-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-accent/50"
                      onClick={() => setShowImportModal(true)}
                      data-testid="button-import-external"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      외부 코드 가져오기
                    </Button>
                    <div className="text-xs text-muted-foreground mt-2 space-y-1">
                      <p className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        HTML/CSS 템플릿
                      </p>
                      <p className="flex items-center gap-1">
                        <FileCode className="h-3 w-3" />
                        무료 UI 코드
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">레이아웃 구조</CardTitle>
                <Button size="sm" variant="outline" onClick={syncHtmlFromBlocks}>
                  <Code className="h-4 w-4 mr-2" />
                  HTML 생성
                </Button>
              </CardHeader>
              <CardContent>
                {blocks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-md">
                    <LayoutTemplate className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>왼쪽 팔레트에서 블록을 추가하세요</p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                      {blocks.map((block) => (
                        <SortableBlock
                          key={block.id}
                          block={block}
                          onEdit={setEditingBlock}
                          onDelete={deleteBlock}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="html" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">HTML</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  className="font-mono text-sm min-h-[400px]"
                  placeholder="HTML 코드를 작성하세요..."
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">CSS</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={cssContent}
                  onChange={(e) => setCssContent(e.target.value)}
                  className="font-mono text-sm min-h-[400px]"
                  placeholder="CSS 스타일을 작성하세요..."
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">미리보기</CardTitle>
            </CardHeader>
            <CardContent>
              {renderPreview()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!editingBlock} onOpenChange={(open) => !open && setEditingBlock(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>블록 설정</DialogTitle>
          </DialogHeader>
          {editingBlock && (
            <div className="space-y-4">
              {editingBlock.type === "text" && (
                <>
                  <div className="space-y-2">
                    <Label>텍스트 내용</Label>
                    <Textarea
                      value={editingBlock.props.content || ""}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, content: e.target.value },
                        })
                      }
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>글꼴 크기</Label>
                    <Input
                      value={editingBlock.props.fontSize || "16px"}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, fontSize: e.target.value },
                        })
                      }
                    />
                  </div>
                </>
              )}

              {editingBlock.type === "image" && (
                <>
                  <div className="space-y-2">
                    <Label>이미지 URL</Label>
                    <Input
                      value={editingBlock.props.src || ""}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, src: e.target.value },
                        })
                      }
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>대체 텍스트</Label>
                    <Input
                      value={editingBlock.props.alt || ""}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, alt: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>너비</Label>
                    <Input
                      value={editingBlock.props.width || "100%"}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, width: e.target.value },
                        })
                      }
                    />
                  </div>
                </>
              )}

              {editingBlock.type === "table" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>행 수</Label>
                      <Input
                        type="number"
                        min={1}
                        max={20}
                        value={editingBlock.props.rows || 3}
                        onChange={(e) =>
                          setEditingBlock({
                            ...editingBlock,
                            props: { ...editingBlock.props, rows: parseInt(e.target.value) },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>열 수</Label>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        value={editingBlock.props.cols || 3}
                        onChange={(e) =>
                          setEditingBlock({
                            ...editingBlock,
                            props: { ...editingBlock.props, cols: parseInt(e.target.value) },
                          })
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              {editingBlock.type === "html" && (
                <div className="space-y-2">
                  <Label>HTML 코드</Label>
                  <Textarea
                    value={editingBlock.props.html || ""}
                    onChange={(e) =>
                      setEditingBlock({
                        ...editingBlock,
                        props: { ...editingBlock.props, html: e.target.value },
                      })
                    }
                    className="font-mono text-sm"
                    rows={8}
                  />
                </div>
              )}

              {(editingBlock.type === "header" || editingBlock.type === "footer") && (
                <>
                  <div className="space-y-2">
                    <Label>높이</Label>
                    <Input
                      value={editingBlock.props.height || "60px"}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, height: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>배경색</Label>
                    <Input
                      type="color"
                      value={editingBlock.props.backgroundColor || "#f8fafc"}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, backgroundColor: e.target.value },
                        })
                      }
                    />
                  </div>
                </>
              )}

              {(editingBlock.type === "sidebar-left" || editingBlock.type === "sidebar-right") && (
                <>
                  <div className="space-y-2">
                    <Label>너비</Label>
                    <Input
                      value={editingBlock.props.width || "250px"}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, width: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>배경색</Label>
                    <Input
                      type="color"
                      value={editingBlock.props.backgroundColor || "#f1f5f9"}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, backgroundColor: e.target.value },
                        })
                      }
                    />
                  </div>
                </>
              )}

              {editingBlock.type === "body" && (
                <>
                  <div className="space-y-2">
                    <Label>최소 높이</Label>
                    <Input
                      value={editingBlock.props.minHeight || "400px"}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, minHeight: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>배경색</Label>
                    <Input
                      type="color"
                      value={editingBlock.props.backgroundColor || "#ffffff"}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, backgroundColor: e.target.value },
                        })
                      }
                    />
                  </div>
                </>
              )}

              {editingBlock.type === "container" && (
                <>
                  <div className="space-y-2">
                    <Label>패딩</Label>
                    <Input
                      value={editingBlock.props.padding || "16px"}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, padding: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>배경색</Label>
                    <Input
                      type="color"
                      value={editingBlock.props.backgroundColor || "#ffffff"}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, backgroundColor: e.target.value },
                        })
                      }
                    />
                  </div>
                </>
              )}

              {editingBlock.type === "divider" && (
                <>
                  <div className="space-y-2">
                    <Label>두께</Label>
                    <Input
                      value={editingBlock.props.height || "1px"}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, height: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>색상</Label>
                    <Input
                      type="color"
                      value={editingBlock.props.color || "#e2e8f0"}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, color: e.target.value },
                        })
                      }
                    />
                  </div>
                </>
              )}

              {editingBlock.type === "banner" && (
                <>
                  <div className="space-y-2">
                    <Label>배너 이미지 URL</Label>
                    <Input
                      value={editingBlock.props.imageUrl || ""}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, imageUrl: e.target.value },
                        })
                      }
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>링크 URL</Label>
                    <Input
                      value={editingBlock.props.linkUrl || ""}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, linkUrl: e.target.value },
                        })
                      }
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>높이</Label>
                    <Input
                      value={editingBlock.props.height || "200px"}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, height: e.target.value },
                        })
                      }
                    />
                  </div>
                </>
              )}

              {editingBlock.type === "youtube-embed" && (
                <>
                  <div className="space-y-2">
                    <Label>유튜브 영상 ID</Label>
                    <Input
                      value={editingBlock.props.videoId || ""}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, videoId: e.target.value },
                        })
                      }
                      placeholder="dQw4w9WgXcQ"
                    />
                    <p className="text-xs text-muted-foreground">URL에서 v= 뒤의 값을 입력하세요</p>
                  </div>
                  <div className="space-y-2">
                    <Label>높이</Label>
                    <Input
                      value={editingBlock.props.height || "315px"}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, height: e.target.value },
                        })
                      }
                    />
                  </div>
                </>
              )}

              {(editingBlock.type === "madang-posts" || editingBlock.type === "ebook-posts") && (
                <>
                  <div className="space-y-2">
                    <Label>표시 개수</Label>
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      value={editingBlock.props.limit || 10}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, limit: isNaN(val) ? 10 : val },
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>스타일</Label>
                    <Select
                      value={editingBlock.props.style || "list"}
                      onValueChange={(v) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, style: v },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="list">리스트</SelectItem>
                        <SelectItem value="grid">그리드</SelectItem>
                        <SelectItem value="card">카드</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>페이지네이션</Label>
                    <Select
                      value={editingBlock.props.showPagination ? "true" : "false"}
                      onValueChange={(v) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, showPagination: v === "true" },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">표시</SelectItem>
                        <SelectItem value="false">숨김</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {editingBlock.type === "recent-posts" && (
                <>
                  <div className="space-y-2">
                    <Label>표시 개수</Label>
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      value={editingBlock.props.limit || 5}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, limit: isNaN(val) ? 5 : val },
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>섹션</Label>
                    <Select
                      value={editingBlock.props.section || "all"}
                      onValueChange={(v) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, section: v },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="madang">마당</SelectItem>
                        <SelectItem value="ebook">전자책</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>날짜 표시</Label>
                    <Select
                      value={editingBlock.props.showDate ? "true" : "false"}
                      onValueChange={(v) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, showDate: v === "true" },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">표시</SelectItem>
                        <SelectItem value="false">숨김</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {editingBlock.type === "popular-posts" && (
                <>
                  <div className="space-y-2">
                    <Label>표시 개수</Label>
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      value={editingBlock.props.limit || 5}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, limit: isNaN(val) ? 5 : val },
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>섹션</Label>
                    <Select
                      value={editingBlock.props.section || "all"}
                      onValueChange={(v) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, section: v },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="madang">마당</SelectItem>
                        <SelectItem value="ebook">전자책</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>정렬 기준</Label>
                    <Select
                      value={editingBlock.props.sortBy || "likes"}
                      onValueChange={(v) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, sortBy: v },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="likes">좋아요</SelectItem>
                        <SelectItem value="views">조회수</SelectItem>
                        <SelectItem value="comments">댓글수</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {editingBlock.type === "categories" && (
                <>
                  <div className="space-y-2">
                    <Label>스타일</Label>
                    <Select
                      value={editingBlock.props.style || "list"}
                      onValueChange={(v) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, style: v },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="list">리스트</SelectItem>
                        <SelectItem value="accordion">아코디언</SelectItem>
                        <SelectItem value="pills">태그</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>글 개수 표시</Label>
                    <Select
                      value={editingBlock.props.showCount ? "true" : "false"}
                      onValueChange={(v) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, showCount: v === "true" },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">표시</SelectItem>
                        <SelectItem value="false">숨김</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {editingBlock.type === "calendar-widget" && (
                <>
                  <div className="space-y-2">
                    <Label>음력 표시</Label>
                    <Select
                      value={editingBlock.props.showLunar ? "true" : "false"}
                      onValueChange={(v) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, showLunar: v === "true" },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">표시</SelectItem>
                        <SelectItem value="false">숨김</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>간략 표시</Label>
                    <Select
                      value={editingBlock.props.compact ? "true" : "false"}
                      onValueChange={(v) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, compact: v === "true" },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">간략</SelectItem>
                        <SelectItem value="false">전체</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {editingBlock.type === "search-widget" && (
                <>
                  <div className="space-y-2">
                    <Label>플레이스홀더</Label>
                    <Input
                      value={editingBlock.props.placeholder || ""}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, placeholder: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>검색 범위</Label>
                    <Select
                      value={editingBlock.props.section || "all"}
                      onValueChange={(v) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, section: v },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="madang">마당</SelectItem>
                        <SelectItem value="ebook">전자책</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {editingBlock.type === "social-links" && (
                <>
                  <div className="space-y-2">
                    <Label>표시 스타일</Label>
                    <Select
                      value={editingBlock.props.style || "icons"}
                      onValueChange={(v) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, style: v },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="icons">아이콘만</SelectItem>
                        <SelectItem value="buttons">버튼</SelectItem>
                        <SelectItem value="text">텍스트</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {editingBlock.type === "tag-cloud" && (
                <>
                  <div className="space-y-2">
                    <Label>표시 개수</Label>
                    <Input
                      type="number"
                      min={5}
                      max={50}
                      value={editingBlock.props.limit || 20}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, limit: isNaN(val) ? 20 : val },
                        });
                      }}
                    />
                  </div>
                </>
              )}

              {editingBlock.type === "stats" && (
                <>
                  <div className="space-y-2">
                    <Label>표시 스타일</Label>
                    <Select
                      value={editingBlock.props.style || "cards"}
                      onValueChange={(v) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, style: v },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cards">카드</SelectItem>
                        <SelectItem value="inline">인라인</SelectItem>
                        <SelectItem value="list">리스트</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {editingBlock.type === "member-profile" && (
                <>
                  <div className="space-y-2">
                    <Label>아바타 표시</Label>
                    <Select
                      value={editingBlock.props.showAvatar ? "true" : "false"}
                      onValueChange={(v) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, showAvatar: v === "true" },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">표시</SelectItem>
                        <SelectItem value="false">숨김</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>소개글 표시</Label>
                    <Select
                      value={editingBlock.props.showBio ? "true" : "false"}
                      onValueChange={(v) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, showBio: v === "true" },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">표시</SelectItem>
                        <SelectItem value="false">숨김</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {editingBlock.type === "login-widget" && (
                <>
                  <div className="space-y-2">
                    <Label>회원가입 링크</Label>
                    <Select
                      value={editingBlock.props.showRegister ? "true" : "false"}
                      onValueChange={(v) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, showRegister: v === "true" },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">표시</SelectItem>
                        <SelectItem value="false">숨김</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>로그인 후 이동 URL</Label>
                    <Input
                      value={editingBlock.props.redirectUrl || "/"}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, redirectUrl: e.target.value },
                        })
                      }
                    />
                  </div>
                </>
              )}

              {editingBlock.type === "quote" && (
                <>
                  <div className="space-y-2">
                    <Label>인용문</Label>
                    <Textarea
                      value={editingBlock.props.content || ""}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, content: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>출처/저자</Label>
                    <Input
                      value={editingBlock.props.author || ""}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, author: e.target.value },
                        })
                      }
                    />
                  </div>
                </>
              )}

              {editingBlock.type === "notice" && (
                <>
                  <div className="space-y-2">
                    <Label>내용</Label>
                    <Textarea
                      value={editingBlock.props.content || ""}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, content: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>유형</Label>
                    <Select
                      value={editingBlock.props.type || "info"}
                      onValueChange={(v) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, type: v },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">정보</SelectItem>
                        <SelectItem value="success">성공</SelectItem>
                        <SelectItem value="warning">경고</SelectItem>
                        <SelectItem value="error">오류</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {editingBlock.type === "spacer" && (
                <div className="space-y-2">
                  <Label>높이</Label>
                  <Input
                    value={editingBlock.props.height || "32px"}
                    onChange={(e) =>
                      setEditingBlock({
                        ...editingBlock,
                        props: { ...editingBlock.props, height: e.target.value },
                      })
                    }
                  />
                </div>
              )}

              {editingBlock.type === "slider" && (
                <>
                  <div className="space-y-2">
                    <Label>높이</Label>
                    <Input
                      value={editingBlock.props.height || "300px"}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, height: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>자동 재생</Label>
                    <Select
                      value={editingBlock.props.autoPlay ? "true" : "false"}
                      onValueChange={(v) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, autoPlay: v === "true" },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">사용</SelectItem>
                        <SelectItem value="false">사용 안함</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>전환 간격 (ms)</Label>
                    <Input
                      type="number"
                      min={1000}
                      max={10000}
                      value={editingBlock.props.interval || 5000}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, interval: isNaN(val) ? 5000 : val },
                        });
                      }}
                    />
                  </div>
                </>
              )}

              {editingBlock.type === "gallery" && (
                <>
                  <div className="space-y-2">
                    <Label>열 개수</Label>
                    <Input
                      type="number"
                      min={1}
                      max={6}
                      value={editingBlock.props.columns || 3}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, columns: isNaN(val) ? 3 : val },
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>간격</Label>
                    <Input
                      value={editingBlock.props.gap || "8px"}
                      onChange={(e) =>
                        setEditingBlock({
                          ...editingBlock,
                          props: { ...editingBlock.props, gap: e.target.value },
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBlock(null)}>
              취소
            </Button>
            <Button onClick={() => editingBlock && updateBlock(editingBlock)}>
              적용
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>외부 코드 가져오기</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              HTML/CSS 파일을 드래그하여 놓거나, 파일을 선택하거나, 직접 코드를 붙여넣으세요.
            </p>

            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                importDragOver 
                  ? "border-primary bg-primary/10" 
                  : "border-muted-foreground/30 hover:border-primary/50"
              }`}
              onDragOver={handleImportDragOver}
              onDragLeave={handleImportDragLeave}
              onDrop={handleImportDrop}
              data-testid="import-drop-zone"
            >
              {isImporting ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">파일 처리 중...</p>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">
                    HTML/CSS 파일을 여기에 드래그하세요
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    또는 컴퓨터에서 파일 선택
                  </p>
                  <label>
                    <input
                      type="file"
                      accept=".html,.htm,.css"
                      multiple
                      className="hidden"
                      onChange={handleImportFileInput}
                      data-testid="input-import-file"
                    />
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        파일 선택
                      </span>
                    </Button>
                  </label>
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label>HTML 코드</Label>
              <Textarea
                value={importHtml}
                onChange={(e) => setImportHtml(e.target.value)}
                placeholder="HTML 코드를 붙여넣거나 파일을 드롭하세요..."
                className="font-mono text-sm min-h-[150px]"
                data-testid="textarea-import-html"
              />
            </div>
            <div className="space-y-2">
              <Label>CSS 코드 (선택사항)</Label>
              <Textarea
                value={importCss}
                onChange={(e) => setImportCss(e.target.value)}
                placeholder="CSS 코드를 붙여넣거나 파일을 드롭하세요..."
                className="font-mono text-sm min-h-[100px]"
                data-testid="textarea-import-css"
              />
            </div>

            <div className="bg-muted/50 p-3 rounded-md">
              <h4 className="text-sm font-medium mb-2">추천 무료 템플릿 사이트</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a href="https://html5up.net" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                  <ExternalLink className="h-3 w-3" /> HTML5 UP
                </a>
                <a href="https://templated.co" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                  <ExternalLink className="h-3 w-3" /> Templated
                </a>
                <a href="https://bootstrapmade.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                  <ExternalLink className="h-3 w-3" /> BootstrapMade
                </a>
                <a href="https://codepen.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                  <ExternalLink className="h-3 w-3" /> CodePen
                </a>
                <a href="https://uiverse.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                  <ExternalLink className="h-3 w-3" /> UIverse
                </a>
                <a href="https://tailwindcomponents.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                  <ExternalLink className="h-3 w-3" /> Tailwind Components
                </a>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowImportModal(false);
              setImportHtml("");
              setImportCss("");
              setImportUrl("");
            }} data-testid="button-import-cancel">
              취소
            </Button>
            <Button
              onClick={() => {
                if (importHtml) {
                  setHtmlContent((prev) => prev + "\n\n" + importHtml);
                }
                if (importCss) {
                  setCssContent((prev) => prev + "\n\n" + importCss);
                }
                setShowImportModal(false);
                setImportHtml("");
                setImportCss("");
                setImportUrl("");
                setActiveTab("html");
              }}
              disabled={!importHtml}
              data-testid="button-import-apply"
            >
              코드 적용
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
