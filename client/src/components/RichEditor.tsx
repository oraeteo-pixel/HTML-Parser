import { useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useUpload } from "@/hooks/use-upload";
import { useToast } from "@/hooks/use-toast";
import { PdfViewer } from "@/components/PdfViewer";
import { 
  ImagePlus, 
  Video, 
  FileUp, 
  Youtube, 
  X, 
  Loader2,
  Upload,
  Link as LinkIcon,
  AlertCircle,
  FileText,
  Download
} from "lucide-react";

export interface MediaItem {
  type: "image" | "video" | "file" | "youtube" | "pdf";
  url: string;
  name?: string;
  thumbnailUrl?: string;
}

interface RichEditorProps {
  title: string;
  content: string;
  mediaItems: MediaItem[];
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onMediaItemsChange: (items: MediaItem[]) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitText?: string;
  placeholder?: string;
}

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function RichEditor({
  title,
  content,
  mediaItems,
  onTitleChange,
  onContentChange,
  onMediaItemsChange,
  onSubmit,
  isSubmitting = false,
  submitText = "저장",
  placeholder = "내용을 입력하세요..."
}: RichEditorProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadingCount, setUploadingCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { uploadFile, isUploading, progress, error } = useUpload({
    onSuccess: (response) => {
      const fileType = getFileType(response.metadata.contentType);
      const newItem: MediaItem = {
        type: fileType,
        url: response.objectPath,
        name: response.metadata.name
      };
      onMediaItemsChange([...mediaItems, newItem]);
      setUploadError(null);
    },
    onError: (err) => {
      setUploadError(err.message);
      toast({
        title: "업로드 실패",
        description: err.message,
        variant: "destructive"
      });
    }
  });

  const getFileType = (contentType: string): "image" | "video" | "file" => {
    if (contentType.startsWith("image/")) return "image";
    if (contentType.startsWith("video/")) return "video";
    return "file";
  };

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setUploadError(null);
    setUploadingCount(files.length);
    
    const results: { success: boolean; name: string; error?: string }[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        await uploadFile(file);
        results.push({ success: true, name: file.name });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "업로드 실패";
        results.push({ success: false, name: file.name, error: errorMessage });
      }
    }
    
    setUploadingCount(0);
    
    const failedUploads = results.filter(r => !r.success);
    if (failedUploads.length > 0) {
      const errorMsg = failedUploads.map(f => f.name).join(", ") + " 업로드 실패";
      setUploadError(errorMsg);
      toast({
        title: "일부 파일 업로드 실패",
        description: `${failedUploads.length}개 파일 업로드에 실패했습니다.`,
        variant: "destructive"
      });
    }
  }, [uploadFile, toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    await handleFileUpload(files);
  }, [handleFileUpload]);

  const handleAddYoutubeVideo = () => {
    const videoId = extractYoutubeId(youtubeUrl);
    if (videoId) {
      const newItem: MediaItem = {
        type: "youtube",
        url: videoId,
        name: `YouTube: ${videoId}`,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
      };
      onMediaItemsChange([...mediaItems, newItem]);
      setYoutubeUrl("");
      setShowYoutubeInput(false);
    }
  };

  const removeMediaItem = (index: number) => {
    const newItems = [...mediaItems];
    newItems.splice(index, 1);
    onMediaItemsChange(newItems);
  };

  const isCurrentlyUploading = isUploading || uploadingCount > 0;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <Input
          placeholder="제목"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-lg font-semibold"
          data-testid="input-title"
        />

        <div
          className={`relative border-2 border-dashed rounded-lg transition-colors ${
            isDragOver 
              ? "border-primary bg-primary/5" 
              : uploadError 
                ? "border-destructive/50"
                : "border-muted-foreground/25"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Textarea
            placeholder={placeholder}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="min-h-[200px] border-0 resize-none focus-visible:ring-0"
            data-testid="textarea-content"
          />
          
          {isDragOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-lg">
              <div className="text-center">
                <Upload className="h-12 w-12 mx-auto mb-2 text-primary" />
                <p className="text-primary font-medium">파일을 여기에 놓으세요</p>
              </div>
            </div>
          )}

          {isCurrentlyUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
              <div className="text-center">
                <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
                <p className="text-muted-foreground">업로드 중... {progress}%</p>
              </div>
            </div>
          )}
        </div>

        {uploadError && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{uploadError}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setUploadError(null)}
              className="h-6 px-2"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {mediaItems.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">첨부된 미디어</p>
            <div className="flex flex-wrap gap-2">
              {mediaItems.map((item, index) => (
                <div key={index} className="relative group">
                  {item.type === "image" && (
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-muted">
                      <img 
                        src={item.url} 
                        alt={item.name || "uploaded image"} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {item.type === "video" && (
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                      <Video className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  {item.type === "youtube" && (
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-muted">
                      <img 
                        src={item.thumbnailUrl} 
                        alt="YouTube thumbnail" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {item.type === "file" && (
                    <Badge variant="secondary" className="h-auto py-2">
                      <FileUp className="h-4 w-4 mr-1" />
                      <span className="max-w-[100px] truncate">{item.name}</span>
                    </Badge>
                  )}
                  <button
                    onClick={() => removeMediaItem(index)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    data-testid={`button-remove-media-${index}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {showYoutubeInput && (
          <div className="flex gap-2 items-center">
            <Input
              placeholder="YouTube URL 또는 영상 ID"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="flex-1"
              data-testid="input-youtube-url"
            />
            <Button 
              size="sm" 
              onClick={handleAddYoutubeVideo}
              disabled={!extractYoutubeId(youtubeUrl)}
              data-testid="button-add-youtube"
            >
              <LinkIcon className="h-4 w-4 mr-1" />
              추가
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => {
                setShowYoutubeInput(false);
                setYoutubeUrl("");
              }}
              data-testid="button-cancel-youtube"
            >
              취소
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex gap-1">
            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <input
              type="file"
              ref={videoInputRef}
              accept="video/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <input
              type="file"
              ref={fileInputRef}
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />

            <Button
              size="sm"
              variant="outline"
              onClick={() => imageInputRef.current?.click()}
              disabled={isCurrentlyUploading}
              data-testid="button-upload-image"
            >
              <ImagePlus className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => videoInputRef.current?.click()}
              disabled={isCurrentlyUploading}
              data-testid="button-upload-video"
            >
              <Video className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isCurrentlyUploading}
              data-testid="button-upload-file"
            >
              <FileUp className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowYoutubeInput(true)}
              disabled={showYoutubeInput}
              data-testid="button-youtube"
            >
              <Youtube className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={onSubmit}
            disabled={isSubmitting || isCurrentlyUploading || !title.trim() || !content.trim()}
            data-testid="button-submit-post"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                저장 중...
              </>
            ) : isCurrentlyUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                업로드 중...
              </>
            ) : (
              submitText
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function MediaDisplay({ items }: { items: MediaItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index}>
          {item.type === "image" && (
            <img 
              src={item.url} 
              alt={item.name || "uploaded image"} 
              className="max-w-full rounded-lg"
            />
          )}
          {item.type === "video" && (
            <video 
              src={item.url} 
              controls 
              className="max-w-full rounded-lg"
            />
          )}
          {item.type === "youtube" && (
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${item.url}`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          {item.type === "pdf" && (
            <PdfViewer url={item.url} fileName={item.name} />
          )}
          {item.type === "file" && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
              <FileText className="h-6 w-6 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-sm text-muted-foreground">파일을 다운로드하여 열어주세요</p>
              </div>
              <Button asChild size="sm" variant="outline">
                <a 
                  href={item.url} 
                  download={item.name}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4 mr-1" />
                  다운로드
                </a>
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
