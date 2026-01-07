import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RichEditor, type MediaItem } from "@/components/RichEditor";
import { PdfViewer } from "@/components/PdfViewer";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useSearch } from "wouter";
import { BookOpen, FileText, Download, Play, Mail } from "lucide-react";
import type { Post } from "@shared/schema";

type PostWithAuthor = Post & { author: string; authorEmail: string | null };

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
  
  const [showEditor, setShowEditor] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [viewingEbook, setViewingEbook] = useState<{ post: PostWithAuthor; data: EbookData } | null>(null);

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

  const createPost = useMutation({
    mutationFn: async (data: { title: string; content: string; section: string; mediaUrls?: string[]; youtubeUrls?: string[] }) => {
      return apiRequest("POST", "/api/posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts/section", "ebook"] });
      setTitle("");
      setContent("");
      setMediaItems([]);
      setShowEditor(false);
      toast({ title: "전자책이 등록되었습니다." });
    },
    onError: () => {
      toast({ title: "등록에 실패했습니다.", variant: "destructive" });
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
      youtubeUrls: youtubeUrls.length > 0 ? youtubeUrls : undefined
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

  const openEbookViewer = (post: PostWithAuthor) => {
    const data = parseEbookData(post);
    if (data.file || data.youtubeVideos.length > 0) {
      setViewingEbook({ post, data });
    }
  };

  const hasContent = (data: EbookData) => {
    return data.file || data.youtubeVideos.length > 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-[990px] mx-auto px-2 py-4" data-testid="ebook-main">
        <Card className="p-4 mb-4 bg-gradient-to-r from-slate-50/50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 orae-navy" />
            <div>
              <h1 className="text-xl font-bold orae-navy" data-testid="text-ebook-title">전자책</h1>
              <p className="text-sm text-muted-foreground">오리알터닷컴 전자책 컬렉션</p>
            </div>
          </div>
        </Card>

        {showEditor && user && (
          <div className="mb-4">
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
            />
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
          <Card className="overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-1.5 font-medium border-r">형식</th>
                  <th className="text-left p-1.5 font-medium border-r">제목</th>
                  <th className="text-left p-1.5 font-medium border-r hidden sm:table-cell">작성자</th>
                  <th className="text-left p-1.5 font-medium hidden md:table-cell">날짜</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, index) => {
                  const data = parseEbookData(post);
                  const isLast = index === posts.length - 1;
                  
                  return (
                    <tr 
                      key={post.id}
                      className={`${!isLast ? 'border-b' : ''} ${hasContent(data) ? 'hover-elevate cursor-pointer' : 'opacity-70'}`}
                      onClick={() => hasContent(data) && openEbookViewer(post)}
                      data-testid={`ebook-${post.id}`}
                    >
                      <td className="p-1.5 border-r w-12 text-center">
                        {data.file?.type === "pdf" ? (
                          <span className="text-[10px] px-1 py-0.5 rounded bg-red-500 text-white font-medium">PDF</span>
                        ) : data.youtubeVideos.length > 0 ? (
                          <Play className="h-3.5 w-3.5 text-red-600 mx-auto" />
                        ) : data.file ? (
                          <span className="text-[10px] px-1 py-0.5 rounded bg-slate-500 text-white font-medium">
                            {data.file.name.split('.').pop()?.toUpperCase().slice(0, 4) || "FILE"}
                          </span>
                        ) : (
                          <FileText className="h-3.5 w-3.5 text-muted-foreground mx-auto" />
                        )}
                      </td>
                      <td className="p-1.5 border-r">
                        <span className="line-clamp-1 font-medium">{post.title}</span>
                        <span className="sm:hidden text-xs text-muted-foreground block">{post.author}</span>
                      </td>
                      <td className="p-1.5 border-r hidden sm:table-cell">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              className="text-xs hover:underline cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                              data-testid={`ebook-author-${post.id}`}
                            >
                              {post.author}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-2" align="start">
                            {post.authorEmail && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.location.href = `mailto:${post.authorEmail}?subject=[오리알터] ${post.author}님께`;
                                }}
                                data-testid={`ebook-email-author-${post.id}`}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                이메일 보내기
                              </Button>
                            )}
                          </PopoverContent>
                        </Popover>
                      </td>
                      <td className="p-1.5 text-xs text-muted-foreground hidden md:table-cell whitespace-nowrap">
                        {formatDate(post.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}
      </main>

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
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
