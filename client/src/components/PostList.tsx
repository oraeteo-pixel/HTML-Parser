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
import { Loader2, MessageSquare, Send, User, Image, X, Film } from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { useUpload } from "@/hooks/use-upload";

export function PostList() {
  const { data: posts, isLoading } = usePosts();
  const { mutate: createPost, isPending } = useCreatePost();
  const { user } = useAuth();
  const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading } = useUpload({
    onSuccess: (response) => {
      setUploadedMedia(prev => [...prev, response.objectPath]);
    },
  });

  const form = useForm({
    resolver: zodResolver(insertPostSchema),
    defaultValues: { title: "", content: "", authorId: 0, mediaUrls: [] as string[] },
  });

  const handleFileDrop = useCallback(async (files: FileList) => {
    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        await uploadFile(file);
      }
    }
  }, [uploadFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileDrop(e.dataTransfer.files);
    }
  }, [handleFileDrop]);

  const removeMedia = (index: number) => {
    setUploadedMedia(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: z.infer<typeof insertPostSchema>) => {
    if (!user) return;
    createPost({ ...data, authorId: user.id, mediaUrls: uploadedMedia.length > 0 ? uploadedMedia : undefined }, {
      onSuccess: () => {
        form.reset();
        setUploadedMedia([]);
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
              className="bg-white dark:bg-slate-800"
              data-testid="input-post-title"
            />
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative transition-colors ${isDragging ? 'ring-2 ring-primary bg-primary/5' : ''}`}
            >
              <Textarea 
                placeholder="무슨 생각을 하고 계신가요? 이미지/동영상을 드래그해서 첨부할 수 있습니다." 
                {...form.register("content")} 
                className="bg-white dark:bg-slate-800 min-h-[80px] resize-none"
                data-testid="input-post-content"
              />
              {isDragging && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/10 border-2 border-dashed border-primary rounded pointer-events-none">
                  <div className="text-primary font-medium flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    파일을 여기에 놓으세요
                  </div>
                </div>
              )}
            </div>
            
            {uploadedMedia.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {uploadedMedia.map((url, index) => (
                  <div key={index} className="relative group">
                    {url.includes('video') ? (
                      <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center">
                        <Film className="h-8 w-8 text-muted-foreground" />
                      </div>
                    ) : (
                      <img 
                        src={url} 
                        alt={`첨부 ${index + 1}`} 
                        className="w-20 h-20 object-cover rounded border"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      data-testid={`button-remove-media-${index}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleFileDrop(e.target.files)}
                  data-testid="input-file-upload"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  data-testid="button-attach-media"
                >
                  {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Image className="mr-2 h-4 w-4" />}
                  사진/동영상
                </Button>
              </div>
              <Button type="submit" disabled={isPending || isUploading} data-testid="button-post-submit">
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
              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.mediaUrls.map((url, idx) => (
                    url.includes('video') ? (
                      <video 
                        key={idx}
                        src={url} 
                        controls 
                        className="max-w-full max-h-64 rounded border"
                        data-testid={`post-video-${post.id}-${idx}`}
                      />
                    ) : (
                      <img 
                        key={idx}
                        src={url} 
                        alt={`미디어 ${idx + 1}`} 
                        className="max-w-full max-h-64 rounded border cursor-pointer hover:opacity-90"
                        onClick={() => window.open(url, '_blank')}
                        data-testid={`post-image-${post.id}-${idx}`}
                      />
                    )
                  ))}
                </div>
              )}
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
