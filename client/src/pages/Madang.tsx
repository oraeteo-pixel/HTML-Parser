import { useState, useEffect, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichEditor, MediaDisplay, type MediaItem } from "@/components/RichEditor";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MessageSquare, ChevronDown, ChevronUp, X, Mail, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useSearch } from "wouter";
import { getDayGanZhi } from "@/lib/calendarData";
import type { Post, Comment } from "@shared/schema";

type PostWithAuthor = Post & { author: string; authorEmail: string | null };
type CommentWithAuthor = Comment & { author: string; authorEmail: string | null };

function CommentSection({ postId, user }: { postId: number; user: any }) {
  const [commentText, setCommentText] = useState("");
  const { toast } = useToast();
  
  const { data: comments, isLoading } = useQuery<CommentWithAuthor[]>({
    queryKey: ["/api/posts", postId, "comments"],
    queryFn: () => fetch(`/api/posts/${postId}/comments`).then(res => res.json()),
  });

  const createComment = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", `/api/posts/${postId}/comments`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", postId, "comments"] });
      setCommentText("");
      toast({ title: "답글이 작성되었습니다." });
    },
    onError: () => {
      toast({ title: "답글 작성에 실패했습니다.", variant: "destructive" });
    },
  });

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      createComment.mutate(commentText.trim());
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getMonth() + 1}.${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="border-t pt-4 mt-4">
      <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        답글 {comments?.length || 0}
      </h3>
      
      {isLoading ? (
        <p className="text-sm text-muted-foreground">로딩 중...</p>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-3 mb-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-muted/50 rounded-md p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{comment.author}</span>
                <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-4">아직 답글이 없습니다.</p>
      )}
      
      {user ? (
        <div className="flex gap-2">
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="답글을 입력하세요..."
            className="min-h-[60px] text-sm"
            data-testid={`input-comment-${postId}`}
          />
          <Button
            size="icon"
            onClick={handleSubmitComment}
            disabled={!commentText.trim() || createComment.isPending}
            data-testid={`button-submit-comment-${postId}`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">답글을 작성하려면 로그인해 주세요.</p>
      )}
    </div>
  );
}

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
      
      <main className="max-w-[990px] mx-auto px-0 sm:px-2 py-4" data-testid="madang-main">
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
          <Card className="overflow-hidden rounded-none sm:rounded-md">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-1 font-medium border-r w-8"></th>
                  <th className="text-left p-1 font-medium border-r">제목</th>
                  <th className="text-left p-1 font-medium border-r hidden sm:table-cell w-16">작성자</th>
                  <th className="text-left p-1 font-medium hidden md:table-cell w-16">날짜</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post, index) => {
                  const postMediaItems = parseMediaItems(post);
                  const isExpanded = expandedPost === post.id;
                  const isLast = index === filteredPosts.length - 1;
                  
                  return (
                    <tr 
                      key={post.id}
                      className={`${!isLast && !isExpanded ? 'border-b' : ''} hover-elevate cursor-pointer`}
                      onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                      data-testid={`post-${post.id}`}
                    >
                      <td className="p-1 border-r text-center align-top">
                        {post.ganji ? (
                          <button
                            className="px-1 py-0.5 rounded text-white text-xs font-medium cursor-pointer hover:opacity-80"
                            style={{ backgroundColor: 'hsl(215 50% 35%)' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setFilterGanji(post.ganji);
                            }}
                            data-testid={`filter-ganji-${post.ganji}`}
                          >
                            {post.ganji}
                          </button>
                        ) : (
                          <span className="text-muted-foreground text-[9px]">-</span>
                        )}
                      </td>
                      <td className="p-1 border-r">
                        <div className="flex items-center gap-1">
                          <span className="font-medium line-clamp-1">{post.title}</span>
                          {postMediaItems.length > 0 && (
                            <span className="text-primary text-xs flex-shrink-0">[{postMediaItems.length}]</span>
                          )}
                          {isExpanded ? <ChevronUp className="h-3 w-3 flex-shrink-0 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 flex-shrink-0 text-muted-foreground" />}
                        </div>
                        <span className="sm:hidden text-xs text-muted-foreground">{post.author}</span>
                        {isExpanded && (
                          <div className="mt-3 border-t pt-3" onClick={(e) => e.stopPropagation()}>
                            <div className="prose prose-sm dark:prose-invert max-w-none mb-3">
                              {post.content.split("\n").map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                              ))}
                            </div>
                            {postMediaItems.length > 0 && (
                              <MediaDisplay items={postMediaItems} />
                            )}
                            <CommentSection postId={post.id} user={user} />
                          </div>
                        )}
                      </td>
                      <td className="p-1 border-r hidden sm:table-cell align-top">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              className="text-[10px] hover:underline cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                              data-testid={`author-${post.id}`}
                            >
                              {post.author}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-2" align="start">
                            <div className="flex flex-col gap-1">
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
                      </td>
                      <td className="p-1 text-[10px] text-muted-foreground hidden md:table-cell whitespace-nowrap align-top">
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
    </div>
  );
}
