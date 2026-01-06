import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichEditor, MediaDisplay } from "@/components/RichEditor";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Plus, ChevronDown, ChevronUp } from "lucide-react";
import type { Post } from "@shared/schema";

type PostWithAuthor = Post & { author: string };

interface MediaItem {
  type: "image" | "video" | "file" | "youtube";
  url: string;
  name?: string;
  thumbnailUrl?: string;
}

export default function EbookPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showEditor, setShowEditor] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

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

  const parseMediaItems = (post: PostWithAuthor): MediaItem[] => {
    const items: MediaItem[] = [];
    if (post.mediaUrls) {
      post.mediaUrls.forEach(url => {
        const type = url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? "image" 
          : url.match(/\.(mp4|webm|mov)$/i) ? "video" 
          : "file";
        items.push({ type, url, name: url.split("/").pop() });
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
      
      <main className="max-w-[990px] mx-auto px-2 py-4" data-testid="ebook-main">
        <Card className="p-4 mb-4 bg-gradient-to-r from-slate-50/50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 orae-navy" />
              <div>
                <h1 className="text-xl font-bold orae-navy" data-testid="text-ebook-title">전자책</h1>
                <p className="text-sm text-muted-foreground">오리알터닷컴 전자책 컬렉션</p>
              </div>
            </div>
            {user && (
              <Button 
                onClick={() => setShowEditor(!showEditor)}
                data-testid="button-new-ebook"
              >
                <Plus className="h-4 w-4 mr-2" />
                새 전자책 등록
              </Button>
            )}
          </div>
        </Card>

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
              submitText="전자책 등록"
              placeholder="전자책 내용을 입력하세요. 이미지, 동영상, 파일을 드래그하여 추가할 수 있습니다."
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
          <div className="space-y-4">
            {posts.map((post) => {
              const postMediaItems = parseMediaItems(post);
              const isExpanded = expandedPost === post.id;
              
              return (
                <Card key={post.id} data-testid={`ebook-${post.id}`}>
                  <CardHeader 
                    className="cursor-pointer hover-elevate"
                    onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{post.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {post.author} · {formatDate(post.createdAt)}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
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
      
      <Footer />
    </div>
  );
}
