import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichEditor, MediaDisplay, type MediaItem } from "@/components/RichEditor";
import { MessageSquare, ArrowLeft, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Post } from "@shared/schema";

type PostWithAuthor = Post & { author: string };

export default function GanjiBoardPage() {
  const [, params] = useRoute("/madang/:ganji");
  const ganji = params?.ganji ? decodeURIComponent(params.ganji) : "";
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [showEditor, setShowEditor] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  const { data: posts, isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/posts/ganji", ganji],
    queryFn: () => fetch(`/api/posts/ganji/${encodeURIComponent(ganji)}`).then(res => res.json()),
    enabled: !!ganji,
  });

  const createPost = useMutation({
    mutationFn: async (data: { title: string; content: string; ganji: string; section: string; mediaUrls?: string[]; youtubeUrls?: string[] }) => {
      return apiRequest("POST", "/api/posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts/ganji", ganji] });
      queryClient.invalidateQueries({ queryKey: ["/api/madang/latest"] });
      setTitle("");
      setContent("");
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
      ganji,
      section: "madang",
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
        // Parse type and name from query params if present
        const [baseUrl, queryString] = fullUrl.split("?");
        const params = new URLSearchParams(queryString || "");
        const typeParam = params.get("type");
        const nameParam = params.get("name");
        
        let type: "image" | "video" | "pdf" | "file";
        if (typeParam && ["image", "video", "pdf", "file"].includes(typeParam)) {
          type = typeParam as "image" | "video" | "pdf" | "file";
        } else if (baseUrl.includes("/objects/")) {
          // Object storage URLs without type param - default to image (most common)
          type = "image";
        } else {
          // Fallback to extension-based detection
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
      <TopBar />
      <Navigation />
      
      <main className="w-full max-w-[990px] mx-auto px-2 py-6">
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Link href="/madang">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span className="px-3 py-1 rounded text-white" style={{ backgroundColor: 'hsl(215 50% 35%)' }}>
                {ganji}
              </span>
              마당
            </h1>
          </div>
          {user && (
            <Button 
              onClick={() => setShowEditor(!showEditor)}
              data-testid="button-new-post"
            >
              <Plus className="h-4 w-4 mr-2" />
              새 글 작성
            </Button>
          )}
        </div>

        {showEditor && user && (
          <div className="mb-4">
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              게시글 목록
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">로딩 중...</p>
            ) : !posts || posts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>아직 작성된 글이 없습니다.</p>
                {user ? (
                  <p className="text-sm">첫 번째 글을 작성해 보세요!</p>
                ) : (
                  <p className="text-sm">글을 작성하려면 로그인해 주세요.</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => {
                  const postMediaItems = parseMediaItems(post);
                  const isExpanded = expandedPost === post.id;
                  
                  return (
                    <div 
                      key={post.id} 
                      className="border rounded-md overflow-hidden"
                      data-testid={`post-${post.id}`}
                    >
                      <div 
                        className="p-3 hover-elevate cursor-pointer"
                        onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{post.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span className="font-medium">{post.author}</span>
                              <span>{formatDate(post.createdAt)}</span>
                              {postMediaItems.length > 0 && (
                                <span className="text-primary">
                                  첨부 {postMediaItems.length}개
                                </span>
                              )}
                            </div>
                          </div>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="px-3 pb-3 border-t pt-3">
                          <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
                            {post.content.split("\n").map((paragraph, i) => (
                              <p key={i}>{paragraph}</p>
                            ))}
                          </div>
                          {postMediaItems.length > 0 && (
                            <MediaDisplay items={postMediaItems} />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
