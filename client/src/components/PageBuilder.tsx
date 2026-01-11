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
} from "lucide-react";
import type { LayoutBlock } from "@shared/schema";

interface BlockPaletteItem {
  type: LayoutBlock["type"];
  label: string;
  icon: typeof LayoutTemplate;
  defaultProps: Record<string, any>;
}

const BLOCK_PALETTE: BlockPaletteItem[] = [
  { type: "header", label: "헤더", icon: LayoutTemplate, defaultProps: { height: "80px", backgroundColor: "#f8fafc" } },
  { type: "sidebar-left", label: "왼쪽 사이드바", icon: PanelLeft, defaultProps: { width: "250px", backgroundColor: "#f1f5f9" } },
  { type: "sidebar-right", label: "오른쪽 사이드바", icon: PanelRight, defaultProps: { width: "250px", backgroundColor: "#f1f5f9" } },
  { type: "body", label: "본문 영역", icon: Square, defaultProps: { minHeight: "400px", backgroundColor: "#ffffff" } },
  { type: "footer", label: "푸터", icon: LayoutTemplate, defaultProps: { height: "60px", backgroundColor: "#f8fafc" } },
  { type: "text", label: "텍스트", icon: Type, defaultProps: { content: "텍스트를 입력하세요", fontSize: "16px" } },
  { type: "image", label: "이미지", icon: Image, defaultProps: { src: "", alt: "", width: "100%" } },
  { type: "table", label: "테이블", icon: Table, defaultProps: { rows: 3, cols: 3, data: [] } },
  { type: "html", label: "HTML", icon: Code, defaultProps: { html: "<div>HTML 코드</div>" } },
  { type: "container", label: "컨테이너", icon: Square, defaultProps: { padding: "16px", backgroundColor: "transparent" } },
];

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
          html += `<p style="font-size: ${block.props.fontSize};">${block.props.content}</p>\n\n`;
          break;
        case "image":
          html += `<img src="${block.props.src}" alt="${block.props.alt}" style="width: ${block.props.width};" />\n\n`;
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
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-sm">블록 팔레트</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {BLOCK_PALETTE.map((item) => (
                  <Button
                    key={item.type}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => addBlock(item)}
                    data-testid={`button-add-${item.type}`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                ))}
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
    </div>
  );
}
