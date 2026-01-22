import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RichEditor, type MediaItem, type TextStyle, getFontFamilyCSS } from "@/components/RichEditor";
import { PdfViewer } from "@/components/PdfViewer";
import { HyunmugyeongGallery } from "@/components/HyunmugyeongGallery";
import { SomyeoleumhaebuGallery } from "@/components/SomyeoleumhaebuGallery";
import { DeukchaebuGallery } from "@/components/DeukchaebuGallery";
import { IlgijangGallery } from "@/components/IlgijangGallery";
import { GwangjechansaengbuGallery } from "@/components/GwangjechansaengbuGallery";
import { GugunghaengdoGallery } from "@/components/GugunghaengdoGallery";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useSearch, useLocation } from "wouter";
import { BookOpen, FileText, Download, Play, Pencil, MessageSquare, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import type { Post, PageContent } from "@shared/schema";

type PostWithAuthor = Post & { author: string; authorEmail: string | null; commentCount?: number };

interface EbookFile {
  type: "pdf" | "file";
  url: string;
  name: string;
}

interface EbookData {
  file: EbookFile | null;
  coverImage: string | null;
  youtubeVideos: string[];
}

export default function EbookPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const writeMode = params.get("write") === "true";
  const currentSection = params.get("section") || "";
  
  const [showEditor, setShowEditor] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [viewingEbook, setViewingEbook] = useState<{ post: PostWithAuthor; data: EbookData } | null>(null);
  const [editingPost, setEditingPost] = useState<PostWithAuthor | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editMediaItems, setEditMediaItems] = useState<MediaItem[]>([]);
  const [textStyle, setTextStyle] = useState<TextStyle>({ fontFamily: "noto-sans", fontSize: "16px", lineHeight: "1.5", fontWeight: "400" });
  const [editTextStyle, setEditTextStyle] = useState<TextStyle>({ fontFamily: "noto-sans", fontSize: "16px", lineHeight: "1.5", fontWeight: "400" });
  const mainRef = useRef<HTMLElement>(null);

  // Restore scroll position when returning to page
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('ebook-scroll-position');
    if (savedPosition && mainRef.current) {
      setTimeout(() => {
        mainRef.current?.scrollTo(0, parseInt(savedPosition, 10));
        sessionStorage.removeItem('ebook-scroll-position');
      }, 100);
    }
  }, []);

  // Auto-open editor when write=true
  useEffect(() => {
    if (user && writeMode) {
      setShowEditor(true);
    }
  }, [writeMode, user]);

  const { data: posts, isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/posts/section", "ebook"],
    queryFn: () => fetch("/api/posts/section/ebook").then(res => res.json()),
  });

  const { data: pageInfo } = useQuery<PageContent>({
    queryKey: ["/api/pages", "ebook"],
    queryFn: () => fetch("/api/pages/ebook").then(res => res.ok ? res.json() : null),
  });

  const createPost = useMutation({
    mutationFn: async (data: { title: string; content: string; section: string; mediaUrls?: string[]; youtubeUrls?: string[]; textStyle?: string }) => {
      return apiRequest("POST", "/api/posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts/section", "ebook"] });
      setTitle("");
      setContent("");
      setMediaItems([]);
      setTextStyle({ fontFamily: "noto-sans", fontSize: "16px", lineHeight: "1.5", fontWeight: "400" });
      setShowEditor(false);
      toast({ title: "전자책이 등록되었습니다." });
    },
    onError: () => {
      toast({ title: "등록에 실패했습니다.", variant: "destructive" });
    },
  });

  const updatePost = useMutation({
    mutationFn: async (data: { id: number; title: string; content: string; mediaUrls?: string[]; youtubeUrls?: string[]; textStyle?: string }) => {
      return apiRequest("PUT", `/api/posts/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts/section", "ebook"] });
      setEditingPost(null);
      setEditTitle("");
      setEditContent("");
      setEditMediaItems([]);
      setEditTextStyle({ fontFamily: "noto-sans", fontSize: "16px", lineHeight: "1.5", fontWeight: "400" });
      toast({ title: "전자책이 수정되었습니다." });
    },
    onError: () => {
      toast({ title: "수정에 실패했습니다.", variant: "destructive" });
    },
  });

  const deletePost = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts/section", "ebook"] });
      toast({ title: "전자책이 삭제되었습니다." });
    },
    onError: () => {
      toast({ title: "삭제에 실패했습니다.", variant: "destructive" });
    },
  });

  const handleSubmit = () => {
    const mediaUrls = mediaItems
      .filter(item => item.type !== "youtube")
      .map(item => item.url);
    const youtubeUrls = mediaItems
      .filter(item => item.type === "youtube")
      .map(item => item.url);

    createPost.mutate({ 
      title, 
      content, 
      section: "ebook",
      mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
      youtubeUrls: youtubeUrls.length > 0 ? youtubeUrls : undefined,
      textStyle: JSON.stringify(textStyle)
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
  };

  const parseEbookData = (post: PostWithAuthor): EbookData => {
    let file: EbookFile | null = null;
    let coverImage: string | null = null;
    const youtubeVideos: string[] = [];
    
    if (post.mediaUrls && post.mediaUrls.length > 0) {
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      
      for (const fullUrl of post.mediaUrls) {
        const [baseUrl, queryString] = fullUrl.split("?");
        const params = new URLSearchParams(queryString || "");
        const typeParam = params.get("type");
        const nameParam = params.get("name");
        const lowerName = (nameParam || baseUrl).toLowerCase();
        
        const isImage = imageExtensions.some(ext => lowerName.endsWith(ext)) || 
                        typeParam?.startsWith("image");
        
        if (isImage && !coverImage) {
          coverImage = fullUrl;
        } else if (!file) {
          const isPdf = typeParam === "pdf" || lowerName.endsWith(".pdf");
          file = {
            type: isPdf ? "pdf" : "file",
            url: fullUrl,
            name: nameParam || baseUrl.split("/").pop() || "파일"
          };
        }
      }
    }
    
    if (post.youtubeUrls && post.youtubeUrls.length > 0) {
      youtubeVideos.push(...post.youtubeUrls);
    }
    
    return { file, coverImage, youtubeVideos };
  };

  const [, setLocation] = useLocation();

  const openEbookViewer = (post: PostWithAuthor) => {
    const data = parseEbookData(post);
    if (data.file || data.youtubeVideos.length > 0) {
      // Save scroll position before navigating
      if (mainRef.current) {
        sessionStorage.setItem('ebook-scroll-position', mainRef.current.scrollTop.toString());
      }
      setLocation(`/ebook/${post.id}`);
    }
  };

  const hasContent = (data: EbookData) => {
    return data.file || data.youtubeVideos.length > 0;
  };

  const parseMediaItems = (post: PostWithAuthor): MediaItem[] => {
    const items: MediaItem[] = [];
    if (post.mediaUrls) {
      post.mediaUrls.forEach(fullUrl => {
        const [baseUrl, queryString] = fullUrl.split("?");
        const params = new URLSearchParams(queryString || "");
        const typeParam = params.get("type");
        const nameParam = params.get("name");
        
        let type: "image" | "video" | "pdf" | "file";
        if (typeParam && ["image", "video", "pdf", "file"].includes(typeParam)) {
          type = typeParam as "image" | "video" | "pdf" | "file";
        } else if (baseUrl.includes("/objects/")) {
          type = "image";
        } else {
          type = baseUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? "image" 
            : baseUrl.match(/\.(mp4|webm|mov)$/i) ? "video"
            : baseUrl.match(/\.pdf$/i) ? "pdf"
            : "file";
        }
        
        const fileName = nameParam || baseUrl.split("/").pop() || "";
        items.push({ type, url: fullUrl, name: fileName });
      });
    }
    if (post.youtubeUrls) {
      post.youtubeUrls.forEach(videoId => {
        items.push({ 
          type: "youtube", 
          url: videoId,
          thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
        });
      });
    }
    return items;
  };

  const handleEditSubmit = () => {
    if (!editingPost) return;
    const mediaUrls = editMediaItems
      .filter(item => item.type !== "youtube")
      .map(item => item.url);
    const youtubeUrls = editMediaItems
      .filter(item => item.type === "youtube")
      .map(item => item.url);
    updatePost.mutate({
      id: editingPost.id,
      title: editTitle,
      content: editContent,
      mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
      youtubeUrls: youtubeUrls.length > 0 ? youtubeUrls : undefined,
      textStyle: JSON.stringify(editTextStyle)
    });
  };

  const startEdit = (post: PostWithAuthor) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditMediaItems(parseMediaItems(post));
    try {
      const ts = post.textStyle ? JSON.parse(post.textStyle) : null;
      if (ts) setEditTextStyle(ts);
    } catch (e) {}
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setEditTitle("");
    setEditContent("");
    setEditMediaItems([]);
  };

  const handleDelete = (post: PostWithAuthor) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deletePost.mutate(post.id);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navigation />
      
      <main ref={mainRef} className="flex-1 overflow-auto">
        <div className="w-full max-w-[990px] mx-auto px-0 sm:px-2 py-4" data-testid="ebook-main">
        <Card className="p-2 sm:p-4 mb-2 bg-gradient-to-r from-slate-50/50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20">
          <div className="flex items-center justify-between flex-wrap gap-1.5">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 orae-navy" />
              <h1 className="text-sm sm:text-base font-bold orae-navy" data-testid="text-ebook-title">{pageInfo?.title || "현무경"}</h1>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <Button 
                size="sm"
                variant={currentSection === "hyunmugyeong" ? "default" : "ghost"} 
                onClick={() => setLocation("/ebook?section=hyunmugyeong")}
                data-testid="button-nav-hyunmugyeong"
              >
                현무경
              </Button>
              <Button 
                size="sm"
                variant={currentSection === "somyeoleumhaebu" ? "default" : "ghost"} 
                onClick={() => setLocation("/ebook?section=somyeoleumhaebu")}
                data-testid="button-nav-somyeoleumhaebu"
              >
                소멸음해부
              </Button>
              <Button 
                size="sm"
                variant={currentSection === "deukchaebu" ? "default" : "ghost"} 
                onClick={() => setLocation("/ebook?section=deukchaebu")}
                data-testid="button-nav-deukchaebu"
              >
                득체부
              </Button>
              <Button 
                size="sm"
                variant={currentSection === "gugunghaengdo" ? "default" : "ghost"} 
                onClick={() => setLocation("/ebook?section=gugunghaengdo")}
                data-testid="button-nav-gugunghaengdo"
              >
                구궁행로도
              </Button>
              <Button 
                size="sm"
                variant={currentSection === "diary" ? "default" : "ghost"} 
                onClick={() => setLocation("/ebook?section=diary")}
                data-testid="button-nav-diary"
              >
                일기장
              </Button>
              <Button 
                size="sm"
                variant={currentSection === "gwangjechansaengbu" ? "default" : "ghost"} 
                onClick={() => setLocation("/ebook?section=gwangjechansaengbu")}
                data-testid="button-nav-gwangjechansaengbu"
              >
                광제창생부
              </Button>
              {!showEditor && (
                <Button
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => {
                    if (!user) {
                      toast({ title: "로그인이 필요합니다.", description: "전자책을 등록하려면 로그인해 주세요." });
                      return;
                    }
                    setShowEditor(true);
                  }}
                  data-testid="button-write-ebook"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>

        {showEditor && user && (
          <div className="mb-4">
            <div className="flex justify-end mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowEditor(false);
                  setTitle("");
                  setContent("");
                  setMediaItems([]);
                }}
                data-testid="button-cancel-ebook"
              >
                취소
              </Button>
            </div>
            <Card className="p-3 mb-3 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800 dark:text-blue-300">PDF 파일 + 표지 이미지 권장</p>
                  <p className="text-blue-700 dark:text-blue-400">
                    웹에서 바로 읽으려면 PDF 형식으로 업로드해 주세요. 
                    표지 이미지(JPG, PNG)를 함께 업로드하면 책장에 표지가 표시됩니다.
                    YouTube 영상도 추가할 수 있습니다.
                  </p>
                </div>
              </div>
            </Card>
            <RichEditor
              title={title}
              content={content}
              mediaItems={mediaItems}
              onTitleChange={setTitle}
              onContentChange={setContent}
              onMediaItemsChange={setMediaItems}
              onSubmit={handleSubmit}
              isSubmitting={createPost.isPending}
              submitText="전자책 등록"
              placeholder="전자책 설명을 입력하세요. PDF 파일과 표지 이미지를 함께 업로드하세요."
              textStyle={textStyle}
              onTextStyleChange={setTextStyle}
            />
          </div>
        )}

        {editingPost && (
          <Dialog open={!!editingPost} onOpenChange={(open) => !open && cancelEdit()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>전자책 수정</DialogTitle>
              </DialogHeader>
              <RichEditor
                title={editTitle}
                content={editContent}
                mediaItems={editMediaItems}
                onTitleChange={setEditTitle}
                onContentChange={setEditContent}
                onMediaItemsChange={setEditMediaItems}
                onSubmit={handleEditSubmit}
                isSubmitting={updatePost.isPending}
                submitText="수정 완료"
                placeholder="전자책 설명을 입력하세요."
                textStyle={editTextStyle}
                onTextStyleChange={setEditTextStyle}
              />
            </DialogContent>
          </Dialog>
        )}


        {(currentSection === "hyunmugyeong" || currentSection === "") && (
          <div className="mb-2">
            <HyunmugyeongGallery />
          </div>
        )}

        {currentSection === "somyeoleumhaebu" && (
          <div className="mb-2">
            <SomyeoleumhaebuGallery />
          </div>
        )}

        {currentSection === "deukchaebu" && (
          <div className="mb-2">
            <DeukchaebuGallery />
          </div>
        )}

        {currentSection === "diary" && (
          <div className="mb-2">
            <IlgijangGallery />
          </div>
        )}

        {currentSection === "gwangjechansaengbu" && (
          <div className="mb-2">
            <GwangjechansaengbuGallery />
          </div>
        )}

        {currentSection === "gugunghaengdo" && (
          <div className="mb-2">
            <GugunghaengdoGallery />
          </div>
        )}

        {isLoading ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">로딩 중...</p>
          </Card>
        ) : !posts || posts.length === 0 ? (
          <Card className="p-8 text-center" data-testid="card-ebook-empty">
            <BookOpen className="h-16 w-16 mx-auto mb-4 orae-navy opacity-50" />
            <p className="text-muted-foreground mb-2">아직 등록된 전자책이 없습니다.</p>
            {user ? (
              <p className="text-sm text-muted-foreground">새 전자책을 등록해 보세요!</p>
            ) : (
              <p className="text-sm text-muted-foreground">전자책을 등록하려면 로그인해 주세요.</p>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
            {posts.map((post) => {
              const data = parseEbookData(post);
              
              return (
                <Card 
                  key={post.id} 
                  className={`overflow-hidden rounded-none sm:rounded-md ${hasContent(data) ? 'hover-elevate cursor-pointer' : 'opacity-70'}`}
                  onClick={() => hasContent(data) && openEbookViewer(post)}
                  data-testid={`ebook-${post.id}`}
                >
                  <div className="aspect-[4/5] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center relative overflow-hidden">
                    {data.coverImage ? (
                      <img 
                        src={data.coverImage} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : data.youtubeVideos.length > 0 ? (
                      <div className="w-full h-full relative">
                        <img 
                          src={`https://img.youtube.com/vi/${data.youtubeVideos[0]}/maxresdefault.jpg`}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://img.youtube.com/vi/${data.youtubeVideos[0]}/hqdefault.jpg`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                            <Play className="h-8 w-8 text-white ml-1" />
                          </div>
                        </div>
                      </div>
                    ) : data.file?.type === "pdf" ? (
                      <div className="text-center p-4">
                        <FileText className="h-16 w-16 mx-auto mb-2 orae-navy opacity-70" />
                        <span className="text-xs px-2 py-1 rounded bg-red-500 text-white font-medium">PDF</span>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <BookOpen className="h-16 w-16 mx-auto mb-2 orae-navy opacity-70" />
                        {data.file && (
                          <span className="text-xs px-2 py-1 rounded bg-slate-500 text-white font-medium">
                            {data.file.name.split('.').pop()?.toUpperCase() || "FILE"}
                          </span>
                        )}
                      </div>
                    )}
                    {data.coverImage && data.file?.type === "pdf" && (
                      <span className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded bg-red-500 text-white font-medium shadow">PDF</span>
                    )}
                    {data.coverImage && data.youtubeVideos.length > 0 && !data.file && (
                      <span className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded bg-red-600 text-white font-medium shadow flex items-center gap-1">
                        <Play className="h-3 w-3" /> YouTube
                      </span>
                    )}
                  </div>
                  <CardHeader className="p-3">
                    <CardTitle className="text-base line-clamp-2 flex items-center gap-1">
                      <span className="sm:hidden">{post.title.length > 20 ? post.title.slice(0, 20) + '...' : post.title}</span>
                      <span className="hidden sm:inline">{post.title.length > 40 ? post.title.slice(0, 40) + '...' : post.title}</span>
                      {(post.commentCount ?? 0) > 0 && (
                        <span className="text-muted-foreground text-xs flex-shrink-0 flex items-center gap-0.5 font-normal">
                          <MessageSquare className="h-3 w-3" />{post.commentCount}
                        </span>
                      )}
                    </CardTitle>
                    {post.content && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {post.content}
                      </p>
                    )}
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}

      <Dialog open={!!viewingEbook} onOpenChange={(open) => !open && setViewingEbook(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center justify-between gap-2 pr-8">
              <span className="truncate">{viewingEbook?.post.title}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto">
            {viewingEbook?.data.file?.type === "pdf" ? (
              <PdfViewer 
                url={viewingEbook.data.file.url} 
                fileName={viewingEbook.data.file.name} 
              />
            ) : viewingEbook?.data.file ? (
              <div className="text-center py-12">
                <FileText className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">{viewingEbook.data.file.name}</h3>
                <p className="text-muted-foreground mb-6">
                  이 파일 형식은 브라우저에서 직접 볼 수 없습니다.
                </p>
                <Button asChild>
                  <a 
                    href={viewingEbook.data.file.url} 
                    download={viewingEbook.data.file.name}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    다운로드
                  </a>
                </Button>
              </div>
            ) : null}
            
            {viewingEbook?.data.youtubeVideos && viewingEbook.data.youtubeVideos.length > 0 && (
              <div className={viewingEbook?.data.file ? "mt-4" : ""}>
                {viewingEbook.data.youtubeVideos.map((videoId, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden mb-4">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={`YouTube video ${index + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ))}
              </div>
            )}
            
            {viewingEbook?.post.content && (
              <div className="mt-4 p-4 border-t">
                <h4 className="text-sm font-medium mb-2">설명</h4>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {viewingEbook.post.content.split("\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
            
            {user && viewingEbook && (user.id === viewingEbook.post.authorId || user.isAdmin) && (
              <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 !text-muted-foreground hover:!text-foreground"
                  onClick={() => { setViewingEbook(null); startEdit(viewingEbook.post); }}
                  data-testid={`button-edit-ebook-dialog`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 !text-muted-foreground hover:!text-foreground"
                  onClick={() => { setViewingEbook(null); handleDelete(viewingEbook.post); }}
                  data-testid={`button-delete-ebook-dialog`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      </div>
      <Footer />

      {/* 스크롤 네비게이션 화살표 */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        <Button
          size="icon"
          variant="outline"
          className="rounded-full shadow-lg"
          onClick={() => {
            if (mainRef.current) {
              mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          data-testid="button-scroll-top"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full shadow-lg"
          onClick={() => {
            if (mainRef.current) {
              mainRef.current.scrollTo({ top: mainRef.current.scrollHeight, behavior: 'smooth' });
            }
          }}
          data-testid="button-scroll-bottom"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>
      </main>
    </div>
  );
}
