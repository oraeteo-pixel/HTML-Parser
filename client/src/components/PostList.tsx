import { usePosts, useCreatePost } from "@/hooks/use-posts";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPostSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Loader2, MessageSquare, Send } from "lucide-react";

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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b-2 border-primary pb-2">
        <h3 className="text-xl font-bold font-display flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-accent" />
          마당 (Madang / Community)
        </h3>
        <span className="text-sm text-muted-foreground font-mono">
          Total {posts?.length || 0} posts
        </span>
      </div>

      {/* Write Post Form */}
      {user ? (
        <Card className="p-4 border-2 border-muted bg-muted/10">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <Input 
              placeholder="제목 (Title)" 
              {...form.register("title")} 
              className="bg-white border-muted-foreground/30 focus-visible:border-primary"
            />
            <Textarea 
              placeholder="무슨 생각을 하고 계신가요? (What's on your mind?)" 
              {...form.register("content")} 
              className="bg-white min-h-[100px] border-muted-foreground/30 focus-visible:border-primary resize-none"
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending} className="font-bold">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                게시하기 (Post)
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="bg-muted/20 p-4 rounded text-center text-sm text-muted-foreground border border-dashed border-muted-foreground/30">
          로그인 후 글을 작성할 수 있습니다. (Please login to post)
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {posts?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No posts yet. Be the first to write in the Madang!
          </div>
        ) : (
          posts?.map((post) => (
            <div 
              key={post.id} 
              className="group bg-white p-5 rounded border border-border hover:border-primary hover:shadow-md transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-primary group-hover:text-accent transition-colors">
                  {post.title}
                </h4>
                <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                  {formatDistanceToNow(new Date(post.createdAt || ""), { addSuffix: true, locale: ko })}
                </span>
              </div>
              <p className="text-foreground/80 leading-relaxed text-sm whitespace-pre-wrap">
                {post.content}
              </p>
              <div className="mt-4 pt-3 border-t border-dashed border-muted flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {post.author ? post.author[0].toUpperCase() : "?"}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {post.author}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-accent">
                  답글달기 (Reply)
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
