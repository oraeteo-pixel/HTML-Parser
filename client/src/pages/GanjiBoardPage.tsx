import { TopBar } from "@/components/TopBar";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, ArrowLeft, Send } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useState } from "react";
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
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: posts, isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/posts/ganji", ganji],
    queryFn: () => fetch(`/api/posts/ganji/${encodeURIComponent(ganji)}`).then(res => res.json()),
    enabled: !!ganji,
  });

  const createPost = useMutation({
    mutationFn: async (data: { title: string; content: string; ganji: string }) => {
      return apiRequest("POST", "/api/posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts/ganji", ganji] });
      queryClient.invalidateQueries({ queryKey: ["/api/madang/latest"] });
      setTitle("");
      setContent("");
      toast({ title: "글이 작성되었습니다." });
    },
    onError: () => {
      toast({ title: "글 작성에 실패했습니다.", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({ title: "제목과 내용을 입력해주세요.", variant: "destructive" });
      return;
    }
    createPost.mutate({ title, content, ganji });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navigation />
      
      <main className="max-w-[990px] mx-auto px-2 py-6">
        <div className="flex items-center gap-2 mb-4">
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
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">새 글 작성</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-3">
                <Input 
                  placeholder="제목" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  data-testid="input-title"
                />
                <Textarea 
                  placeholder="내용을 입력하세요..." 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  data-testid="textarea-content"
                />
                <Button 
                  type="submit" 
                  disabled={createPost.isPending}
                  data-testid="button-submit"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {createPost.isPending ? "작성 중..." : "글 작성"}
                </Button>
              </form>
            </CardContent>
          </Card>
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
                {posts.map((post) => (
                  <div 
                    key={post.id} 
                    className="border rounded-md p-3 hover-elevate cursor-pointer"
                    data-testid={`post-${post.id}`}
                  >
                    <h3 className="font-medium mb-1">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{post.content}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">{post.author}</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
