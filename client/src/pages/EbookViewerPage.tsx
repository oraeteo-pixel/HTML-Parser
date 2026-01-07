import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PdfViewer } from "@/components/PdfViewer";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, FileText, Download, Play } from "lucide-react";
import type { Post } from "@shared/schema";

type PostWithAuthor = Post & { author: string; authorEmail: string | null };

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

export default function EbookViewerPage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const postId = parseInt(params.id || "0", 10);

  const { data: posts, isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/posts/section", "ebook"],
    queryFn: () => fetch("/api/posts/section/ebook").then(res => res.json()),
  });

  const post = posts?.find(p => p.id === postId);

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
      </main>
    </div>
  );
}
