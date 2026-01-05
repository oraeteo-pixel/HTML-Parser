import { usePosts, useCreatePost } from "@/hooks/use-posts";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPostSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Loader2, MessageSquare, Send, User } from "lucide-react";

export function PostList() {
  const { data: posts, isLoading } = usePosts();
  const { mutate: createPost, isPending } = useCreatePost();
  const { user } = useAuth();

  const form = useForm({
    resolver: zodResolver(insertPostSchema),
    defaultValues: { title: "", content: "", authorId: 0 },
  });

  const onSubmit = (data: z.infer<typeof insertPostSchema>) => {
    if (!user) return;
    createPost({ ...data, authorId: user.id }, {
      onSuccess: () => {
        form.reset();
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" data-testid="posts-loading" />
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="post-list">
      <div className="flex items-center justify-between border-b-2 border-primary pb-2">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-accent" />
          마당 (Community)
        </h3>
        <span className="text-sm text-muted-foreground">
          Total {posts?.length || 0} posts
        </span>
      </div>

      {user ? (
        <div className="bg-muted/30 border border-border rounded p-4" data-testid="post-form">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <Input 
              placeholder="제목 (Title)" 
              {...form.register("title")} 
              className="bg-white"
              data-testid="input-post-title"
            />
            <Textarea 
              placeholder="무슨 생각을 하고 계신가요?" 
              {...form.register("content")} 
              className="bg-white min-h-[80px] resize-none"
              data-testid="input-post-content"
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending} data-testid="button-post-submit">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                게시하기
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div 
          className="bg-muted/20 p-4 rounded text-center text-sm text-muted-foreground border border-dashed border-border"
          data-testid="login-prompt"
        >
          로그인 후 글을 작성할 수 있습니다.
        </div>
      )}

      <div className="space-y-3">
        {posts?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground" data-testid="no-posts">
            아직 게시물이 없습니다. 첫 번째 글을 작성해보세요!
          </div>
        ) : (
          posts?.map((post) => (
            <div 
              key={post.id} 
              className="bg-white p-4 rounded border border-border hover:border-primary transition-colors"
              data-testid={`post-item-${post.id}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-foreground hover:text-primary cursor-pointer">
                  {post.title}
                </h4>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {formatDistanceToNow(new Date(post.createdAt || ""), { addSuffix: true, locale: ko })}
                </span>
              </div>
              <p className="text-foreground/80 text-sm whitespace-pre-wrap">
                {post.content}
              </p>
              <div className="mt-3 pt-2 border-t border-dashed border-muted flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {post.author}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                  답글
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
