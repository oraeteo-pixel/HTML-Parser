import { useState, useEffect, useMemo, Fragment } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichEditor, MediaDisplay, type MediaItem, type TextStyle, getFontFamilyCSS } from "@/components/RichEditor";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MessageSquare, ChevronDown, ChevronUp, X, Mail, Send, ThumbsUp, ThumbsDown, Pencil, Trash2, Plus, Reply, CornerDownRight, ArrowUp, ArrowDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useSearch, useLocation } from "wouter";
import { 
  getDayGanZhi,
  getKoreanDate,
  getHwanggeuk28Mansion,
  getHwanggeukDate,
  getHwanggeukHourGanZhi,
  getHwanggeukDayGanZhi,
  getSogungDaegung,
  get64HexagramName,
  getJeolguk,
  WEEKDAYS_HANJA,
} from "@/lib/calendarData";
import choisuun from "@assets/최수운_1768891647413.jpg";
import cheonjunim from "@assets/천주님_1768891653091.jpg";
import yu from "@assets/사본_-_yu_1768891659139.jpg";
import dodamIcon from "@assets/image_1768892173911.png";
import circleLogoIcon from "@assets/1000000061_1768892307348.png";
import moakroLogo from "@assets/logo192_1768892579399.png";
import type { Post, Comment, PageContent } from "@shared/schema";

type PostWithAuthor = Post & { author: string; authorEmail: string | null; commentCount?: number };
type CommentWithAuthor = Comment & { author: string; authorEmail: string | null };

function CommentSection({ postId, user }: { postId: number; user: any }) {
  const [commentText, setCommentText] = useState("");
  const [commentMedia, setCommentMedia] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyMedia, setReplyMedia] = useState<MediaItem[]>([]);
  const [editingComment, setEditingComment] = useState<CommentWithAuthor | null>(null);
  const [editText, setEditText] = useState("");
  const [editMedia, setEditMedia] = useState<MediaItem[]>([]);
  const [showRootEditor, setShowRootEditor] = useState(false);
  const { toast } = useToast();
  
  const { data: comments, isLoading } = useQuery<CommentWithAuthor[]>({
    queryKey: ["/api/posts", postId, "comments"],
    queryFn: () => fetch(`/api/posts/${postId}/comments`).then(res => res.json()),
  });

  const createComment = useMutation({
    mutationFn: async (data: { content: string; parentId?: number; mediaUrls?: string[]; youtubeUrls?: string[] }) => {
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
    onError: () => {
      toast({ title: "답글 작성에 실패했습니다.", variant: "destructive" });
    },
  });

  const updateComment = useMutation({
    mutationFn: async (data: { id: number; content: string; mediaUrls?: string[]; youtubeUrls?: string[] }) => {
      return apiRequest("PATCH", `/api/comments/${data.id}`, { content: data.content, mediaUrls: data.mediaUrls, youtubeUrls: data.youtubeUrls });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", postId, "comments"] });
      setEditingComment(null);
      setEditText("");
      setEditMedia([]);
      toast({ title: "답글이 수정되었습니다." });
    },
    onError: () => {
      toast({ title: "답글 수정에 실패했습니다.", variant: "destructive" });
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: number) => {
      return apiRequest("DELETE", `/api/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", postId, "comments"] });
      toast({ title: "답글이 삭제되었습니다." });
    },
    onError: () => {
      toast({ title: "답글 삭제에 실패했습니다.", variant: "destructive" });
    },
  });

  const handleSubmitComment = () => {
    if (commentText.trim() || commentMedia.length > 0) {
      const mediaUrls = commentMedia.filter(m => m.type !== 'youtube').map(m => m.url);
      const youtubeUrls = commentMedia.filter(m => m.type === 'youtube').map(m => m.url);
      createComment.mutate({
        content: commentText.trim(),
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
        youtubeUrls: youtubeUrls.length > 0 ? youtubeUrls : undefined,
      });
    }
  };

  const handleSubmitReply = (parentId: number) => {
    if (replyText.trim() || replyMedia.length > 0) {
      const mediaUrls = replyMedia.filter(m => m.type !== 'youtube').map(m => m.url);
      const youtubeUrls = replyMedia.filter(m => m.type === 'youtube').map(m => m.url);
      createComment.mutate({
        content: replyText.trim(),
        parentId,
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
        youtubeUrls: youtubeUrls.length > 0 ? youtubeUrls : undefined,
      });
    }
  };

  const handleEditSubmit = () => {
    if (editingComment && (editText.trim() || editMedia.length > 0)) {
      const mediaUrls = editMedia.filter(m => m.type !== 'youtube').map(m => m.url);
      const youtubeUrls = editMedia.filter(m => m.type === 'youtube').map(m => m.url);
      updateComment.mutate({
        id: editingComment.id,
        content: editText.trim(),
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
        youtubeUrls: youtubeUrls.length > 0 ? youtubeUrls : undefined,
      });
    }
  };

  const startEdit = (comment: CommentWithAuthor) => {
    setEditingComment(comment);
    setEditText(comment.content);
    setEditMedia(parseCommentMedia(comment));
    setReplyingTo(null);
  };

  const handleDelete = (comment: CommentWithAuthor) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteComment.mutate(comment.id);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getMonth() + 1}.${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const parseCommentMedia = (comment: CommentWithAuthor): MediaItem[] => {
    const items: MediaItem[] = [];
    if (comment.mediaUrls) {
      comment.mediaUrls.forEach(url => {
        if (url.match(/\.(mp4|webm|mov)$/i)) {
          items.push({ type: 'video', url });
        } else if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          items.push({ type: 'image', url });
        } else {
          items.push({ type: 'file', url, name: url.split('/').pop() || 'file' });
        }
      });
    }
    if (comment.youtubeUrls) {
      comment.youtubeUrls.forEach(url => items.push({ type: 'youtube', url }));
    }
    return items;
  };

  const canEditDelete = (comment: CommentWithAuthor) => {
    return user && (user.id === comment.authorId || user.isAdmin === 1);
  };

  const rootComments = (comments?.filter(c => !c.parentId) || []).sort((a, b) => 
    new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
  );
  const getReplies = (parentId: number) => (comments?.filter(c => c.parentId === parentId) || []).sort((a, b) => 
    new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
  );

  const renderComment = (comment: CommentWithAuthor, depth: number = 0) => {
    const media = parseCommentMedia(comment);
    const replies = getReplies(comment.id);
    const isEditing = editingComment?.id === comment.id;
    const isReplying = replyingTo === comment.id;
    const maxDepth = 2;

    return (
      <div key={comment.id} className={`${depth > 0 ? 'ml-4 border-l-2 border-muted pl-3' : ''}`}>
        <div className="bg-muted/50 rounded-md p-3 text-base">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {depth > 0 && <CornerDownRight className="h-3 w-3 text-muted-foreground" />}
            <span className="font-bold text-base">{comment.author}</span>
            <span className="text-muted-foreground text-sm">{formatDate(comment.createdAt)}</span>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <RichEditor
                content={editText}
                onContentChange={setEditText}
                mediaItems={editMedia}
                onMediaItemsChange={setEditMedia}
                placeholder="답글 수정..."
                compact
              />
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="ghost" className="!text-muted-foreground hover:!text-foreground" onClick={() => setEditingComment(null)}>취소</Button>
                <Button size="sm" onClick={handleEditSubmit} disabled={updateComment.isPending}>수정</Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-base">{comment.content}</p>
              {media.length > 0 && (
                <div className="mt-2">
                  <MediaDisplay items={media} />
                </div>
              )}
              <div className="flex gap-1 mt-2 flex-wrap">
                {depth < maxDepth && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="!text-muted-foreground hover:!text-foreground"
                    onClick={() => {
                      if (!user) {
                        toast({ title: "로그인이 필요합니다.", description: "답글을 작성하려면 로그인해 주세요." });
                        return;
                      }
                      setReplyingTo(isReplying ? null : comment.id); setReplyText(""); setReplyMedia([]);
                    }}
                    data-testid={`button-reply-${comment.id}`}
                  >
                    <Reply className="h-3 w-3 mr-1 text-inherit" />
                    답글
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="!text-muted-foreground hover:!text-foreground"
                  onClick={() => {
                    if (!user) {
                      toast({ title: "로그인이 필요합니다.", description: "수정하려면 로그인해 주세요." });
                      return;
                    }
                    if (user.id !== comment.authorId && user.isAdmin !== 1) {
                      toast({ title: "권한이 없습니다.", description: "본인의 답글만 수정할 수 있습니다." });
                      return;
                    }
                    startEdit(comment);
                  }}
                  data-testid={`button-edit-comment-${comment.id}`}
                >
                  <Pencil className="h-3 w-3 mr-1 text-inherit" />
                  수정
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="!text-muted-foreground hover:!text-foreground"
                  onClick={() => {
                    if (!user) {
                      toast({ title: "로그인이 필요합니다.", description: "삭제하려면 로그인해 주세요." });
                      return;
                    }
                    if (user.id !== comment.authorId && user.isAdmin !== 1) {
                      toast({ title: "권한이 없습니다.", description: "본인의 답글만 삭제할 수 있습니다." });
                      return;
                    }
                    handleDelete(comment);
                  }}
                  disabled={deleteComment.isPending}
                  data-testid={`button-delete-comment-${comment.id}`}
                >
                  <Trash2 className="h-3 w-3 mr-1 text-inherit" />
                  삭제
                </Button>
              </div>
            </>
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
              <Button size="sm" variant="ghost" className="!text-muted-foreground hover:!text-foreground" onClick={() => setReplyingTo(null)}>취소</Button>
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
      <Button
        variant="outline"
        size="sm"
        className={showRootEditor ? "hidden" : "invisible absolute"}
        onClick={() => {
          if (!user) {
            toast({ title: "로그인이 필요합니다.", description: "답글을 작성하려면 로그인해 주세요." });
            return;
          }
          setShowRootEditor(true);
        }}
        data-testid={`button-new-comment-${postId}`}
      >
        <Reply className="h-3 w-3 mr-1" />
        답글 작성
      </Button>
      {showRootEditor && user && (
        <div className="space-y-2 mb-4">
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
            <Button size="sm" variant="ghost" className="!text-muted-foreground hover:!text-foreground" onClick={() => { setShowRootEditor(false); setCommentText(""); setCommentMedia([]); }}>취소</Button>
            <Button
              size="sm"
              onClick={handleSubmitComment}
              disabled={(!commentText.trim() && commentMedia.length === 0) || createComment.isPending || isUploading}
              data-testid={`button-submit-comment-${postId}`}
            >
              <Send className="h-4 w-4 mr-1" />
              답글 작성
            </Button>
          </div>
        </div>
      )}
      
      <h3 className="font-bold mb-3 flex items-center gap-2 text-base">
        <MessageSquare className="h-5 w-5" />
        답글 {comments?.length || 0}
      </h3>
      
      {isLoading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : rootComments.length > 0 ? (
        <div className="space-y-3">
          {rootComments.map(comment => renderComment(comment))}
        </div>
      ) : (
        <p className="text-muted-foreground">아직 답글이 없습니다.</p>
      )}
    </div>
  );
}

function VoteButtons({ postId, likes, dislikes, user }: { postId: number; likes: number; dislikes: number; user: any }) {
  const { toast } = useToast();
  
  const { data: userVote } = useQuery<{ voteType: 'like' | 'dislike' | null }>({
    queryKey: ["/api/posts", postId, "vote"],
    queryFn: () => fetch(`/api/posts/${postId}/vote`, { credentials: 'include' }).then(res => res.json()),
    enabled: !!user,
  });

  const voteMutation = useMutation({
    mutationFn: async (voteType: 'like' | 'dislike') => {
      return apiRequest("POST", `/api/posts/${postId}/vote`, { voteType });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", postId, "vote"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/section/madang"] });
    },
    onError: () => {
      toast({ title: "투표에 실패했습니다.", variant: "destructive" });
    },
  });

  const handleVote = (voteType: 'like' | 'dislike') => {
    if (!user) {
      toast({ title: "로그인이 필요합니다." });
      return;
    }
    voteMutation.mutate(voteType);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={(e) => { e.stopPropagation(); handleVote('like'); }}
        className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${userVote?.voteType === 'like' ? 'bg-blue-500 text-white' : 'bg-muted hover:bg-muted/80'}`}
        disabled={voteMutation.isPending}
        data-testid={`button-like-${postId}`}
      >
        <ThumbsUp className="h-3 w-3" />
        <span>{likes || 0}</span>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); handleVote('dislike'); }}
        className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${userVote?.voteType === 'dislike' ? 'bg-red-500 text-white' : 'bg-muted hover:bg-muted/80'}`}
        disabled={voteMutation.isPending}
        data-testid={`button-dislike-${postId}`}
      >
        <ThumbsDown className="h-3 w-3" />
        <span>{dislikes || 0}</span>
      </button>
    </div>
  );
}

export default function Madang() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const ganjiFromUrl = params.get("ganji");
  const writeMode = params.get("write") === "true";
  
  // Get today's ganji
  const todayGanji = useMemo(() => {
    const today = new Date();
    return getDayGanZhi(today.getFullYear(), today.getMonth() + 1, today.getDate());
  }, []);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTalisman, setShowTalisman] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const calendarData = useMemo(() => {
    const koreanDate = getKoreanDate();
    const { year, month, day, hours, minutes } = koreanDate;
    const hwanggeuk = getHwanggeukDate(year, month, day, hours);
    const hwDayGanZhi = getHwanggeukDayGanZhi(hwanggeuk.year, hwanggeuk.month, hwanggeuk.day);
    const hwHourGanZhi = getHwanggeukHourGanZhi(year, month, day, hours, minutes);
    const jeolgukData = getJeolguk(hwanggeuk.year, hwanggeuk.month, hwanggeuk.day);
    const sogungDaegung = getSogungDaegung(new Date());
    const hexagram64 = get64HexagramName(sogungDaegung.sogung, sogungDaegung.daegung);
    const mansion = getHwanggeuk28Mansion(hwanggeuk.year, hwanggeuk.month, hwanggeuk.day);
    const weekdayHanja = WEEKDAYS_HANJA[new Date().getDay()];
    return { hwanggeuk, hwDayGanZhi, hwHourGanZhi, jeolguk: jeolgukData.name, sogungDaegung, hexagram64, mansion, weekdayHanja };
  }, [currentTime]);
  
  const [showEditor, setShowEditor] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [ganji, setGanji] = useState(ganjiFromUrl || todayGanji);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [textStyle, setTextStyle] = useState<TextStyle>({ fontFamily: "noto-sans", fontSize: "16px", lineHeight: "1.5", fontWeight: "400" });
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [filterGanji, setFilterGanji] = useState<string | null>(null);
  const [filterAuthor, setFilterAuthor] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<PostWithAuthor | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editMediaItems, setEditMediaItems] = useState<MediaItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  
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

  const { data: pageInfo } = useQuery<PageContent>({
    queryKey: ["/api/pages", "madang"],
    queryFn: () => fetch("/api/pages/madang").then(res => res.ok ? res.json() : null),
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

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage, postsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterGanji, filterAuthor]);

  const clearFilters = () => {
    setFilterGanji(null);
    setFilterAuthor(null);
  };

  const createPost = useMutation({
    mutationFn: async (data: { title: string; content: string; section: string; ganji?: string; mediaUrls?: string[]; youtubeUrls?: string[]; textStyle?: string }) => {
      return apiRequest("POST", "/api/posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts/section/madang"] });
      setTitle("");
      setTextStyle({ fontFamily: "noto-sans", fontSize: "16px", lineHeight: "1.5", fontWeight: "400" });
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

  const updatePost = useMutation({
    mutationFn: async (data: { id: number; title: string; content: string; mediaUrls?: string[]; youtubeUrls?: string[] }) => {
      return apiRequest("PUT", `/api/posts/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts/section/madang"] });
      setEditingPost(null);
      setEditTitle("");
      setEditContent("");
      setEditMediaItems([]);
      toast({ title: "글이 수정되었습니다." });
    },
    onError: () => {
      toast({ title: "글 수정에 실패했습니다.", variant: "destructive" });
    },
  });

  const deletePost = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts/section/madang"] });
      setExpandedPost(null);
      toast({ title: "글이 삭제되었습니다." });
    },
    onError: () => {
      toast({ title: "글 삭제에 실패했습니다.", variant: "destructive" });
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
      youtubeUrls: youtubeUrls.length > 0 ? youtubeUrls : undefined,
      textStyle: JSON.stringify(textStyle)
    });
  };

  const handleEditSubmit = () => {
    if (!editingPost) return;
    const mediaUrls = editMediaItems
      .filter(item => item.type !== "youtube")
      .map(item => item.url);
    const youtubeUrls = editMediaItems
      .filter(item => item.type === "youtube")
      .map(item => item.url);
    updatePost.mutate({
      id: editingPost.id,
      title: editTitle,
      content: editContent,
      mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
      youtubeUrls: youtubeUrls.length > 0 ? youtubeUrls : undefined
    });
  };

  const startEdit = (post: PostWithAuthor) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditMediaItems(parseMediaItems(post));
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setEditTitle("");
    setEditContent("");
    setEditMediaItems([]);
  };

  const handleDelete = (post: PostWithAuthor) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deletePost.mutate(post.id);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getMonth() + 1}.${d.getDate()}`;
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
    <div className="flex flex-col h-screen bg-background" style={{ fontFamily: "'Malgun Gothic', '맑은 고딕', sans-serif" }}>
      <Navigation />
      
      <main className="flex-1 overflow-auto">
        <div className="w-full max-w-[990px] mx-auto px-0 sm:px-2 py-4 text-base" data-testid="madang-main">
        <Card className="p-4 mb-4 bg-gradient-to-r from-slate-50/50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={dodamIcon} alt="도담" className="h-8 w-8 object-contain" />
              <h1 className="text-xl font-bold orae-navy" data-testid="text-madang-title">도담넷</h1>
            </div>
            <div className="flex items-center gap-2">
              <a href="https://cafe.daum.net/pusan7777/6pBc" target="_blank" rel="noopener noreferrer">
                <img src={circleLogoIcon} alt="원로고" className="h-8 w-8 object-contain hover:opacity-80 transition-opacity" />
              </a>
              <a href="https://moakro.com" target="_blank" rel="noopener noreferrer">
                <img src={moakroLogo} alt="모악로" className="h-8 w-8 object-contain hover:opacity-80 transition-opacity" />
              </a>
              {!showEditor && (
                <Button
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => {
                    if (!user) {
                      toast({ title: "로그인이 필요합니다.", description: "글을 작성하려면 로그인해 주세요." });
                      return;
                    }
                    setGanji(todayGanji);
                    setShowEditor(true);
                  }}
                  data-testid="button-write-post"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>

        <div className="slim-info-bar mb-2 mx-0 py-1.5 px-2" data-testid="madang-info-bar">
          <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-0.5 md:gap-2 text-sm">
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-bold text-gray-700 dark:text-gray-200">
                {calendarData.hwanggeuk.year}.{calendarData.hwanggeuk.month}.{calendarData.hwanggeuk.day}
              </span>
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                {calendarData.weekdayHanja}
              </span>
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                ({calendarData.hwanggeuk.yearGanZhi}年 {calendarData.hwanggeuk.monthGanZhi}月 {calendarData.hwDayGanZhi}日 {calendarData.hwHourGanZhi}時)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-bold text-gray-700 dark:text-gray-200">{calendarData.jeolguk}</span>
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                &lt;소궁,대궁&gt;{calendarData.sogungDaegung.isZungung ? "존궁" : `${calendarData.sogungDaegung.sogung},${calendarData.sogungDaegung.daegung}`} {calendarData.hexagram64?.fullName || ''}
              </span>
              <button 
                className="slim-badge-cyan cursor-pointer text-xs"
                onClick={() => setShowTalisman(!showTalisman)}
                data-testid="button-madang-mansion-toggle"
              >
                {calendarData.mansion.isZunkong ? calendarData.mansion.mansion : `${calendarData.mansion.mansion}, ${calendarData.mansion.general}`}
              </button>
            </div>
          </div>
        </div>

        {!calendarData.mansion.isZunkong && (
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out talisman-box rounded-lg ${showTalisman ? 'max-h-[400px] opacity-100 p-4 my-2' : 'max-h-0 opacity-0 p-0 my-0'}`}
          >
            <div className="flex flex-col items-center">
              <img 
                src={`/img/${calendarData.mansion.image}.jpg`}
                alt={`${calendarData.mansion.mansion} 부적`}
                className="max-w-[200px] max-h-[280px] object-contain border border-border rounded-lg shadow-lg bg-white"
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-none overflow-hidden flex items-center justify-center gap-4 py-4 mb-4 flex-wrap">
          <div className="w-[140px] h-[180px] overflow-hidden">
            <img src={choisuun} alt="최수운" className="w-[160px] h-[200px] object-cover object-center -ml-[10px] -mt-[10px]" />
          </div>
          <div className="w-[140px] h-[180px] overflow-hidden">
            <img src={cheonjunim} alt="천주님" className="w-[160px] h-[200px] object-cover object-center -ml-[10px] -mt-[10px]" />
          </div>
          <div className="w-[140px] h-[180px] overflow-hidden">
            <img src={yu} alt="유" className="w-[160px] h-[200px] object-cover object-center -ml-[10px] -mt-[10px]" />
          </div>
        </div>

        {showEditor && user && (
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {ganji && (
                  <>
                    <span className="text-sm text-muted-foreground">간지:</span>
                    <span className="px-2 py-1 rounded text-white text-sm font-medium" style={{ backgroundColor: 'hsl(215 50% 35%)' }}>
                      {ganji}
                    </span>
                  </>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowEditor(false);
                  setTitle("");
                  setContent("");
                  setMediaItems([]);
                }}
                data-testid="button-cancel-post"
              >
                취소
              </Button>
            </div>
            <RichEditor
              title={title}
              content={content}
              mediaItems={mediaItems}
              textStyle={textStyle}
              onTitleChange={setTitle}
              onContentChange={setContent}
              onMediaItemsChange={setMediaItems}
              onTextStyleChange={setTextStyle}
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
            <table className="w-full border-collapse">
              <thead className="sr-only">
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginatedPosts.map((post, index) => {
                  const postMediaItems = parseMediaItems(post);
                  const isExpanded = expandedPost === post.id;
                  const isLast = index === paginatedPosts.length - 1;
                  const postNumber = filteredPosts.length - ((currentPage - 1) * postsPerPage + index);
                  
                  return (
                    <Fragment key={post.id}>
                    <tr
                      className={`${!isLast && !isExpanded ? 'border-b' : ''} hover-elevate cursor-pointer`}
                      onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                      data-testid={`post-${post.id}`}
                    >
                      <td className="p-1 text-center align-top text-sm text-muted-foreground w-10 border-r">
                        {postNumber}
                      </td>
                      <td className="p-1 text-center align-top border-r">
                        {post.ganji ? (
                          <button
                            className="px-1 py-0.5 rounded text-white text-xs font-medium cursor-pointer hover:opacity-80"
                            style={{ backgroundColor: 'hsl(215 50% 35%)', writingMode: 'horizontal-tb' }}
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
                          <span className="font-bold line-clamp-1">
                            <span className="sm:hidden">{post.title.length > 20 ? post.title.slice(0, 20) + '...' : post.title}</span>
                            <span className="hidden sm:inline">{post.title.length > 40 ? post.title.slice(0, 40) + '...' : post.title}</span>
                          </span>
                          {(post.commentCount ?? 0) > 0 && (
                            <span className="text-muted-foreground text-xs flex-shrink-0 flex items-center gap-0.5">
                              <MessageSquare className="h-3 w-3" />{post.commentCount}
                            </span>
                          )}
                          {postMediaItems.length > 0 && (
                            <span className="text-primary text-xs flex-shrink-0">[{postMediaItems.length}]</span>
                          )}
                          {isExpanded ? <ChevronUp className="h-3 w-3 flex-shrink-0 text-muted-foreground ml-auto" /> : <ChevronDown className="h-3 w-3 flex-shrink-0 text-muted-foreground ml-auto" />}
                        </div>
                        <span className="sm:hidden text-sm text-muted-foreground">{post.author}</span>
                      </td>
                      <td className="p-1 hidden sm:table-cell align-top border-r">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              className="text-sm hover:underline cursor-pointer"
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
                              {user && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="justify-start"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setLocation(`/messages?to=${post.authorId}&name=${encodeURIComponent(post.author)}`);
                                  }}
                                  data-testid={`message-author-${post.id}`}
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
                      <td className="p-1 text-sm text-muted-foreground hidden md:table-cell whitespace-nowrap align-top">
                        {formatDate(post.createdAt)}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className={!isLast ? 'border-b' : ''}>
                        <td colSpan={5} className="p-3" onClick={(e) => e.stopPropagation()}>
                          {editingPost?.id === post.id ? (
                            <div className="mb-4">
                              <div className="flex justify-end mb-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="!text-muted-foreground hover:!text-foreground"
                                  onClick={cancelEdit}
                                  data-testid="button-cancel-edit"
                                >
                                  취소
                                </Button>
                              </div>
                              <RichEditor
                                title={editTitle}
                                content={editContent}
                                mediaItems={editMediaItems}
                                onTitleChange={setEditTitle}
                                onContentChange={setEditContent}
                                onMediaItemsChange={setEditMediaItems}
                                onSubmit={handleEditSubmit}
                                isSubmitting={updatePost.isPending}
                                submitText="수정 완료"
                                placeholder="내용을 입력하세요."
                              />
                            </div>
                          ) : (
                            <>
                              <div 
                                className="prose prose-base dark:prose-invert max-w-none mb-3"
                                style={(() => {
                                  try {
                                    const textStyle: TextStyle = post.textStyle ? JSON.parse(post.textStyle) : null;
                                    if (textStyle) {
                                      return {
                                        fontFamily: getFontFamilyCSS(textStyle.fontFamily),
                                        fontSize: textStyle.fontSize,
                                        lineHeight: textStyle.lineHeight,
                                        fontWeight: textStyle.fontWeight,
                                      };
                                    }
                                  } catch (e) {}
                                  return {};
                                })()}
                              >
                                {post.content.split("\n").map((paragraph, i) => (
                                  <p key={i} style={{ margin: '0.5em 0' }}>{paragraph}</p>
                                ))}
                              </div>
                              {postMediaItems.length > 0 && (
                                <MediaDisplay items={postMediaItems} />
                              )}
                              <div className="my-3 flex items-center justify-between flex-wrap gap-2">
                                <VoteButtons postId={post.id} likes={post.likes || 0} dislikes={post.dislikes || 0} user={user} />
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="!text-muted-foreground hover:!text-foreground"
                                    onClick={() => {
                                      if (!user) {
                                        toast({ title: "로그인이 필요합니다.", description: "답글을 작성하려면 로그인해 주세요." });
                                        return;
                                      }
                                      setExpandedPost(post.id);
                                      setTimeout(() => {
                                        const commentBtn = document.querySelector(`[data-testid="button-new-comment-${post.id}"]`) as HTMLButtonElement;
                                        if (commentBtn) commentBtn.click();
                                      }, 100);
                                    }}
                                    data-testid={`button-reply-post-${post.id}`}
                                  >
                                    <Reply className="h-4 w-4 mr-1 text-inherit" />
                                    답글
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="!text-muted-foreground hover:!text-foreground"
                                    onClick={() => {
                                      if (!user) {
                                        toast({ title: "로그인이 필요합니다.", description: "수정하려면 로그인해 주세요." });
                                        return;
                                      }
                                      if (user.id !== post.authorId && user.isAdmin !== 1) {
                                        toast({ title: "권한이 없습니다.", description: "본인의 글만 수정할 수 있습니다." });
                                        return;
                                      }
                                      startEdit(post);
                                    }}
                                    data-testid={`button-edit-${post.id}`}
                                  >
                                    <Pencil className="h-4 w-4 mr-1 text-inherit" />
                                    수정
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="!text-muted-foreground hover:!text-foreground"
                                    onClick={() => {
                                      if (!user) {
                                        toast({ title: "로그인이 필요합니다.", description: "삭제하려면 로그인해 주세요." });
                                        return;
                                      }
                                      if (user.id !== post.authorId && user.isAdmin !== 1) {
                                        toast({ title: "권한이 없습니다.", description: "본인의 글만 삭제할 수 있습니다." });
                                        return;
                                      }
                                      handleDelete(post);
                                    }}
                                    disabled={deletePost.isPending}
                                    data-testid={`button-delete-${post.id}`}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1 text-inherit" />
                                    삭제
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}
                          <CommentSection postId={post.id} user={user} />
                        </td>
                      </tr>
                    )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1 p-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  data-testid="button-page-first"
                >
                  처음
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  data-testid="button-page-prev"
                >
                  이전
                </Button>
                <span className="px-3 text-sm text-muted-foreground">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  data-testid="button-page-next"
                >
                  다음
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  data-testid="button-page-last"
                >
                  마지막
                </Button>
              </div>
            )}
          </Card>
        )}
        </div>

        {/* 스크롤 네비게이션 화살표 */}
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
          <Button
            size="icon"
            variant="outline"
            className="rounded-full shadow-lg"
            onClick={() => {
              const mainContainer = document.querySelector('main');
              if (mainContainer) {
                mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            data-testid="button-scroll-top"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full shadow-lg"
            onClick={() => {
              const mainContainer = document.querySelector('main');
              if (mainContainer) {
                mainContainer.scrollTo({ top: mainContainer.scrollHeight, behavior: 'smooth' });
              }
            }}
            data-testid="button-scroll-bottom"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
