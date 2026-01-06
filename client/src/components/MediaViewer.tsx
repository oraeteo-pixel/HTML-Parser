import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  AlertCircle,
  RotateCw
} from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface MediaViewerProps {
  src: string;
  type: "image" | "video";
  alt?: string;
  poster?: string;
  onClose?: () => void;
}

interface ImageLightboxProps {
  images: { src: string; alt?: string }[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageLightbox({ images, initialIndex = 0, open, onOpenChange }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (open) {
      const safeInitial = Math.min(initialIndex, Math.max(0, images.length - 1));
      setCurrentIndex(safeInitial);
      setScale(1);
    }
  }, [open, initialIndex, images.length]);

  useEffect(() => {
    if (images.length === 0 && open) {
      onOpenChange(false);
    } else if (currentIndex >= images.length) {
      setCurrentIndex(Math.max(0, images.length - 1));
    }
  }, [images.length, currentIndex, open, onOpenChange]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setScale(1);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setScale(1);
  };

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.5, 4));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.5, 0.5));
  const resetZoom = () => setScale(1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrev();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") onOpenChange(false);
  };

  if (images.length === 0) return null;

  const safeCurrentIndex = Math.min(currentIndex, images.length - 1);
  const currentImage = images[safeCurrentIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none"
        onKeyDown={handleKeyDown}
      >
        <VisuallyHidden>
          <DialogTitle>이미지 뷰어</DialogTitle>
        </VisuallyHidden>
        
        <div className="relative flex flex-col h-[90vh]">
          <div className="flex items-center justify-between gap-2 p-3 bg-black/50">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={zoomOut}
                disabled={scale <= 0.5}
                className="text-white hover:bg-white/20"
                data-testid="button-lightbox-zoom-out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-white text-sm min-w-[50px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={zoomIn}
                disabled={scale >= 4}
                className="text-white hover:bg-white/20"
                data-testid="button-lightbox-zoom-in"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={resetZoom}
                className="text-white hover:bg-white/20"
                data-testid="button-lightbox-reset"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-white text-sm">
              {safeCurrentIndex + 1} / {images.length}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                asChild
                className="text-white hover:bg-white/20"
              >
                <a 
                  href={currentImage.src} 
                  download 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-testid="button-lightbox-download"
                >
                  <Download className="h-4 w-4" />
                </a>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="text-white hover:bg-white/20"
                data-testid="button-lightbox-close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center overflow-auto relative">
            {images.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={goToPrev}
                  className="absolute left-2 z-10 text-white hover:bg-white/20 h-12 w-12"
                  data-testid="button-lightbox-prev"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={goToNext}
                  className="absolute right-2 z-10 text-white hover:bg-white/20 h-12 w-12"
                  data-testid="button-lightbox-next"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            <img
              src={currentImage.src}
              alt={currentImage.alt || "이미지"}
              style={{ transform: `scale(${scale})`, transition: "transform 0.2s" }}
              className="max-w-full max-h-full object-contain cursor-zoom-in"
              onClick={() => setScale((prev) => (prev < 2 ? prev + 0.5 : 1))}
              data-testid="img-lightbox-current"
            />
          </div>

          {images.length > 1 && (
            <div className="flex justify-center gap-2 p-3 bg-black/50 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setScale(1);
                  }}
                  className={`w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                    idx === safeCurrentIndex 
                      ? "border-white opacity-100" 
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  data-testid={`button-thumbnail-${idx}`}
                >
                  <img
                    src={img.src}
                    alt={img.alt || `썸네일 ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

export function VideoPlayer({ src, poster, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };
    const handleError = () => {
      setError("동영상을 재생할 수 없습니다.");
      setIsLoading(false);
    };
    const handleCanPlay = () => setIsLoading(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("error", handleError);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("error", handleError);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const doc = document as Document & {
      webkitFullscreenElement?: Element;
      webkitExitFullscreen?: () => void;
    };
    const vid = video as HTMLVideoElement & {
      webkitRequestFullscreen?: () => void;
      webkitEnterFullscreen?: () => void;
    };
    
    if (document.fullscreenElement || doc.webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
    } else {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (vid.webkitRequestFullscreen) {
        vid.webkitRequestFullscreen();
      } else if (vid.webkitEnterFullscreen) {
        vid.webkitEnterFullscreen();
      }
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (error) {
    return (
      <div className={`relative bg-muted/50 rounded-lg flex flex-col items-center justify-center p-6 ${className}`}>
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground mb-3">{error}</p>
        <Button asChild variant="outline" size="sm">
          <a href={src} download target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4 mr-2" />
            동영상 다운로드
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div 
      className={`relative bg-black rounded-lg overflow-hidden group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying && setShowControls(true)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full max-h-[70vh] object-contain"
        onClick={togglePlay}
        data-testid="video-player"
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
        </div>
      )}

      {!isPlaying && !isLoading && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
          data-testid="button-video-play-overlay"
        >
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
            <Play className="h-8 w-8 text-black ml-1" />
          </div>
        </button>
      )}

      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 transition-opacity ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 mb-2 accent-white cursor-pointer"
          data-testid="input-video-seek"
        />
        
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={togglePlay}
              className="h-8 w-8 text-white hover:bg-white/20"
              data-testid="button-video-play"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleMute}
              className="h-8 w-8 text-white hover:bg-white/20"
              data-testid="button-video-mute"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              asChild
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <a href={src} download target="_blank" rel="noopener noreferrer" data-testid="button-video-download">
                <Download className="h-4 w-4" />
              </a>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleFullscreen}
              className="h-8 w-8 text-white hover:bg-white/20"
              data-testid="button-video-fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ClickableImage({ 
  src, 
  alt, 
  className = "",
  onClick,
  testId
}: { 
  src: string; 
  alt?: string; 
  className?: string;
  onClick?: () => void;
  testId?: string;
}) {
  return (
    <div 
      className={`relative cursor-pointer group ${className}`}
      onClick={onClick}
      data-testid={testId || "clickable-image"}
    >
      <img
        src={src}
        alt={alt || "이미지"}
        className="max-w-full rounded-lg transition-transform group-hover:scale-[1.02]"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full p-2">
          <Maximize2 className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}
