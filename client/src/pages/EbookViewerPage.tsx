import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PdfViewer } from "@/components/PdfViewer";
import { RichEditor, type MediaItem } from "@/components/RichEditor";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, FileText, Download, Play, Mail, Pencil, Trash2, MessageSquare, Send, Reply } from "lucide-react";
import type { Post, Comment } from "@shared/schema";

type PostWithAuthor = Post & { author: string; authorEmail: string | null };
type CommentWithAuthor = Comment & { author: string };

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

function CommentSection({ postId, user }: { postId: number; user: any }) {
  const [commentText, setCommentText] = useState("");
  const [commentMedia, setCommentMedia] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyMedia, setReplyMedia] = useState<MediaItem[]>([]);
  const [showRootEditor, setShowRootEditor] = useState(false);
  const { toast } = useToast();
  
  const { data: comments, isLoading } = useQuery<CommentWithAuthor[]>({
    queryKey: ["/api/posts", postId, "comments"],
    queryFn: () => fetch(`/api/posts/${postId}/comments`).then(res => res.json()),
  });
  
  const createComment = useMutation({
    mutationFn: async (data: { content: string; mediaUrls?: string[]; parentId?: number }) => {
      return apiRequest("POST", `/api/posts/${postId}/comments`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", postId, "comments"] });
      setCommentText("");
      setCommentMedia([]);
      setReplyingTo(null);
      setReplyText("");
      setReplyMedia([]);
      setShowRootEditor(false);
      toast({ title: "답글이 작성되었습니다." });
    },
  });

  const handleSubmitComment = () => {
    const mediaUrls = commentMedia.map(item => item.url);
    createComment.mutate({ 
      content: commentText,
      mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
    });
  };

  const handleSubmitReply = (parentId: number) => {
    const mediaUrls = replyMedia.map(item => item.url);
    createComment.mutate({ 
      content: replyText,
      mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
      parentId,
    });
  };

  const rootComments = comments?.filter(c => !c.parentId) || [];
  const getReplies = (parentId: number) => comments?.filter(c => c.parentId === parentId) || [];

  const renderComment = (comment: CommentWithAuthor, depth = 0) => {
    const replies = getReplies(comment.id);
    const maxDepth = 2;
    const isReplying = replyingTo === comment.id;
    const canReply = depth < maxDepth;

    return (
      <div key={comment.id} className={`${depth > 0 ? 'ml-4 pl-3 border-l-2 border-muted' : ''}`}>
        <div className="py-2">
          <div className="flex items-center gap-2 text-sm mb-1">
            <span className="font-medium">{comment.author}</span>
            <span className="text-muted-foreground text-xs">
              {new Date(comment.createdAt!).toLocaleDateString('ko-KR')}
            </span>
          </div>
          <div className="text-sm whitespace-pre-wrap">{comment.content}</div>
          {user && canReply && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 h-6 px-2 text-xs"
              onClick={() => setReplyingTo(isReplying ? null : comment.id)}
            >
              <Reply className="h-3 w-3 mr-1" />
              답글
            </Button>
          )}
        </div>
        {isReplying && (
          <div className="ml-4 mt-2 space-y-2">
            <RichEditor
              content={replyText}
              onContentChange={setReplyText}
              mediaItems={replyMedia}
              onMediaItemsChange={setReplyMedia}
              placeholder={`${comment.author}님에게 답글...`}
              compact
            />
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>취소</Button>
              <Button size="sm" onClick={() => handleSubmitReply(comment.id)} disabled={(!replyText.trim() && replyMedia.length === 0) || createComment.isPending}>
                <Send className="h-3 w-3 mr-1" />
                답글
              </Button>
            </div>
          </div>
        )}
        {replies.length > 0 && (
          <div className="mt-2 space-y-2">
            {replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border-t pt-4 mt-4">
      <h3 className="font-bold mb-3 flex items-center gap-2 text-base">
        <MessageSquare className="h-5 w-5" />
        답글 {comments?.length || 0}
      </h3>
      
      {isLoading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : rootComments.length > 0 ? (
        <div className="space-y-3 mb-4">
          {rootComments.map(comment => renderComment(comment))}
        </div>
      ) : (
        <p className="text-muted-foreground mb-4">아직 답글이 없습니다.</p>
      )}
      
      {user && !showRootEditor && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowRootEditor(true)}
        >
          <Reply className="h-3 w-3 mr-1" />
          답글 작성
        </Button>
      )}
      {user && showRootEditor && (
        <div className="space-y-2 mt-2">
          <RichEditor
            content={commentText}
            onContentChange={setCommentText}
            mediaItems={commentMedia}
            onMediaItemsChange={setCommentMedia}
            onUploadingChange={setIsUploading}
            placeholder="답글을 입력하세요..."
            compact
          />
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="ghost" onClick={() => { setShowRootEditor(false); setCommentText(""); setCommentMedia([]); }}>취소</Button>
            <Button
              size="sm"
              onClick={handleSubmitComment}
              disabled={(!commentText.trim() && commentMedia.length === 0) || createComment.isPending || isUploading}
            >
              <Send className="h-4 w-4 mr-1" />
              답글 작성
            </Button>
          </div>
        </div>
      )}
      {!user && (
        <p className="text-muted-foreground">답글을 작성하려면 로그인해 주세요.</p>
      )}
    </div>
  );
}

export default function EbookViewerPage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const postId = parseInt(params.id || "0", 10);

  const { data: posts, isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/posts/section", "ebook"],
    queryFn: () => fetch("/api/posts/section/ebook").then(res => res.json()),
  });

  const post = posts?.find(p => p.id === postId);

  const deletePost = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts/section", "ebook"] });
      toast({ title: "전자책이 삭제되었습니다." });
      setLocation("/ebook");
    },
    onError: () => {
      toast({ title: "삭제에 실패했습니다.", variant: "destructive" });
    },
  });

  const handleDelete = () => {
    if (post && window.confirm("정말 삭제하시겠습니까?")) {
      deletePost.mutate(post.id);
    }
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
        const isImage = typeParam === "image" || imageExtensions.some(ext => lowerName.endsWith(ext));
        
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-4xl mx-auto px-2 py-4">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">로딩 중...</p>
          </Card>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-4xl mx-auto px-2 py-4">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">전자책을 찾을 수 없습니다.</p>
            <Button onClick={() => setLocation("/ebook")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              목록으로 돌아가기
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  const data = parseEbookData(post);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-2 py-2 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/ebook")} data-testid="button-back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold truncate" data-testid="text-ebook-viewer-title">{post.title}</h1>
            <p className="text-xs text-muted-foreground">{post.author}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        {data.file?.type === "pdf" ? (
          <div className="h-full">
            <PdfViewer url={data.file.url} fileName={data.file.name} />
          </div>
        ) : data.file ? (
          <div className="max-w-4xl mx-auto px-2 py-8">
            <Card className="p-8 text-center">
              <FileText className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">{data.file.name}</h3>
              <p className="text-muted-foreground mb-6">
                이 파일 형식은 브라우저에서 직접 볼 수 없습니다.
              </p>
              <Button asChild>
                <a 
                  href={data.file.url} 
                  download={data.file.name}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4 mr-2" />
                  다운로드
                </a>
              </Button>
            </Card>
          </div>
        ) : data.youtubeVideos.length > 0 ? (
          <div className="max-w-4xl mx-auto px-2 py-4 space-y-4">
            {data.youtubeVideos.map((videoId, index) => (
              <div key={index} className="aspect-video w-full rounded-md overflow-hidden bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`YouTube video ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ))}
            {post.content && (
              <Card className="p-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {post.content.split("\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </Card>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-2 py-8">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">표시할 콘텐츠가 없습니다.</p>
            </Card>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto px-2 py-4">
          <Card className="p-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p className="text-sm text-muted-foreground flex items-center gap-1 flex-wrap">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="font-medium hover:underline cursor-pointer"
                      data-testid={`ebook-author-${post.id}`}
                    >
                      {post.author}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <div className="flex flex-col gap-2">
                      {user && user.id !== post.authorId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start"
                          onClick={() => {
                            setLocation(`/messages?to=${post.authorId}&name=${encodeURIComponent(post.author)}`);
                          }}
                          data-testid={`ebook-message-author-${post.id}`}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          쪽지 보내기
                        </Button>
                      )}
                      {post.authorEmail && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start"
                          onClick={() => {
                            window.location.href = `mailto:${post.authorEmail}?subject=[오리알터] ${post.author}님께`;
                          }}
                          data-testid={`ebook-email-author-${post.id}`}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          이메일 보내기
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                <span> · {formatDate(post.createdAt)}</span>
              </p>
              {user && (user.id === post.authorId || user.isAdmin === 1) && (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocation(`/ebook?edit=${post.id}`)}
                    data-testid={`button-edit-ebook-${post.id}`}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    수정
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deletePost.isPending}
                    data-testid={`button-delete-ebook-${post.id}`}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    삭제
                  </Button>
                </div>
              )}
            </div>
            
            <CommentSection postId={post.id} user={user} />
          </Card>
        </div>
      </main>
    </div>
  );
}
