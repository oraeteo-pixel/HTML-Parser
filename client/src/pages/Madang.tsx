import { useState, useEffect, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichEditor, MediaDisplay, type MediaItem } from "@/components/RichEditor";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MessageSquare, ChevronDown, ChevronUp, X, Mail } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useSearch } from "wouter";
import { getDayGanZhi } from "@/lib/calendarData";
import type { Post } from "@shared/schema";

type PostWithAuthor = Post & { author: string; authorEmail: string | null };

export default function Madang() {
  const { user } = useAuth();
  const { toast } = useToast();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const ganjiFromUrl = params.get("ganji");
  const writeMode = params.get("write") === "true";
  
  // Get today's ganji
  const todayGanji = useMemo(() => {
    const today = new Date();
    return getDayGanZhi(today.getFullYear(), today.getMonth() + 1, today.getDate());
  }, []);
  
  const [showEditor, setShowEditor] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [ganji, setGanji] = useState(ganjiFromUrl || todayGanji);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [filterGanji, setFilterGanji] = useState<string | null>(null);
  const [filterAuthor, setFilterAuthor] = useState<string | null>(null);
  
  // Auto-open editor when coming from calendar with ganji or when write=true
  useEffect(() => {
    if (user && (ganjiFromUrl || writeMode)) {
      if (ganjiFromUrl) setGanji(ganjiFromUrl);
      setShowEditor(true);
    }
  }, [ganjiFromUrl, writeMode, user]);

  const { data: posts, isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/posts/section/madang"],
  });

  // Filter posts based on selected ganji or author
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter(post => {
      if (filterGanji && post.ganji !== filterGanji) return false;
      if (filterAuthor && post.author !== filterAuthor) return false;
      return true;
    });
  }, [posts, filterGanji, filterAuthor]);

  const clearFilters = () => {
    setFilterGanji(null);
    setFilterAuthor(null);
  };

  const createPost = useMutation({
    mutationFn: async (data: { title: string; content: string; section: string; ganji?: string; mediaUrls?: string[]; youtubeUrls?: string[] }) => {
      return apiRequest("POST", "/api/posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts/section/madang"] });
      setTitle("");
      setContent("");
      setGanji(todayGanji);
      setMediaItems([]);
      setShowEditor(false);
      toast({ title: "글이 작성되었습니다." });
    },
    onError: () => {
      toast({ title: "글 작성에 실패했습니다.", variant: "destructive" });
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
      section: "madang",
      ganji: ganji || undefined,
      mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
      youtubeUrls: youtubeUrls.length > 0 ? youtubeUrls : undefined
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-[990px] mx-auto px-2 py-4" data-testid="madang-main">
        <Card className="p-4 mb-4 bg-gradient-to-r from-slate-50/50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-8 w-8 orae-navy" />
            <div>
              <h1 className="text-xl font-bold orae-navy" data-testid="text-madang-title">마당</h1>
              <p className="text-sm text-muted-foreground">오리알터닷컴 커뮤니티</p>
            </div>
          </div>
        </Card>

        {showEditor && user && (
          <div className="mb-4">
            {ganji && (
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">간지:</span>
                <span className="px-2 py-1 rounded text-white text-sm font-medium" style={{ backgroundColor: 'hsl(215 50% 35%)' }}>
                  {ganji}
                </span>
              </div>
            )}
            <RichEditor
              title={title}
              content={content}
              mediaItems={mediaItems}
              onTitleChange={setTitle}
              onContentChange={setContent}
              onMediaItemsChange={setMediaItems}
              onSubmit={handleSubmit}
              isSubmitting={createPost.isPending}
              submitText="글 작성"
              placeholder="내용을 입력하세요. 이미지, 동영상, 파일을 드래그하여 추가할 수 있습니다."
            />
          </div>
        )}

        {(filterGanji || filterAuthor) && (
          <Card className="p-3 mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">필터:</span>
            {filterGanji && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setFilterGanji(null)}
                className="gap-1"
              >
                간지: {filterGanji}
                <X className="h-3 w-3" />
              </Button>
            )}
            {filterAuthor && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setFilterAuthor(null)}
                className="gap-1"
              >
                작성자: {filterAuthor}
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              전체 보기
            </Button>
          </Card>
        )}

        {isLoading ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">로딩 중...</p>
          </Card>
        ) : !posts || posts.length === 0 ? (
          <Card className="p-8 text-center" data-testid="card-madang-empty">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 orae-navy opacity-50" />
            <p className="text-muted-foreground mb-2">아직 작성된 글이 없습니다.</p>
            {user ? (
              <p className="text-sm text-muted-foreground">첫 번째 글을 작성해 보세요!</p>
            ) : (
              <p className="text-sm text-muted-foreground">글을 작성하려면 로그인해 주세요.</p>
            )}
          </Card>
        ) : filteredPosts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">검색 결과가 없습니다.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const postMediaItems = parseMediaItems(post);
              const isExpanded = expandedPost === post.id;
              
              const firstImage = postMediaItems.find(item => item.type === "image");
              const firstYoutube = postMediaItems.find(item => item.type === "youtube");
              const thumbnailUrl = firstImage?.url || (firstYoutube ? `https://img.youtube.com/vi/${firstYoutube.url}/mqdefault.jpg` : null);
              
              return (
                <Card key={post.id} data-testid={`post-${post.id}`}>
                  <CardHeader 
                    className="cursor-pointer hover-elevate"
                    onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                  >
                    <div className="flex gap-3">
                      {thumbnailUrl && (
                        <div className="flex-shrink-0 w-20 h-20 rounded overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <img 
                            src={thumbnailUrl} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg line-clamp-1 flex items-center gap-2 flex-wrap">
                            {post.title}
                            {post.ganji && (
                              <button
                                className="px-1.5 py-0.5 rounded text-white text-xs font-normal cursor-pointer hover:opacity-80"
                                style={{ backgroundColor: 'hsl(215 50% 35%)' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFilterGanji(post.ganji);
                                }}
                                data-testid={`filter-ganji-${post.ganji}`}
                              >
                                {post.ganji}
                              </button>
                            )}
                          </CardTitle>
                          <Button variant="ghost" size="icon" className="flex-shrink-0">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {post.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 flex-wrap">
                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                className="font-medium hover:underline cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                                data-testid={`author-${post.id}`}
                              >
                                {post.author}
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2" align="start">
                              <div className="flex flex-col gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="justify-start"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFilterAuthor(post.author);
                                  }}
                                  data-testid={`filter-author-${post.id}`}
                                >
                                  이 작성자의 글만 보기
                                </Button>
                                {post.authorEmail && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="justify-start"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.location.href = `mailto:${post.authorEmail}?subject=[오리알터] ${post.author}님께`;
                                    }}
                                    data-testid={`email-author-${post.id}`}
                                  >
                                    <Mail className="h-4 w-4 mr-2" />
                                    이메일 보내기
                                  </Button>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                          <span> · {formatDate(post.createdAt)}</span>
                          {postMediaItems.length > 0 && (
                            <span className="text-primary ml-2">첨부 {postMediaItems.length}개</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  {isExpanded && (
                    <CardContent>
                      <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
                        {post.content.split("\n").map((paragraph, i) => (
                          <p key={i}>{paragraph}</p>
                        ))}
                      </div>
                      {postMediaItems.length > 0 && (
                        <MediaDisplay items={postMediaItems} />
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
