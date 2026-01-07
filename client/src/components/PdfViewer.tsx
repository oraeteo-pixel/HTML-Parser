import { useState, useEffect, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Loader2,
  Maximize2,
  Minimize2,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
  fileName?: string;
}

export function PdfViewer({ url, fileName }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [fitMode, setFitMode] = useState<"width" | "custom">("width");
  const [pageInput, setPageInput] = useState<string>("1");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  const storageKey = `pdf-page-${url.split("/").pop()?.split("?")[0] || "default"}`;

  useEffect(() => {
    const savedPage = localStorage.getItem(storageKey);
    if (savedPage) {
      const page = parseInt(savedPage, 10);
      if (!isNaN(page) && page > 0) {
        setPageNumber(page);
        setPageInput(savedPage);
      }
    }
  }, [storageKey]);

  useEffect(() => {
    if (numPages > 0 && pageNumber > 0) {
      localStorage.setItem(storageKey, String(pageNumber));
    }
  }, [pageNumber, numPages, storageKey]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth - 32);
      }
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [isFullscreen]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    const savedPage = localStorage.getItem(storageKey);
    if (savedPage) {
      const page = parseInt(savedPage, 10);
      if (!isNaN(page) && page > 0 && page <= numPages) {
        setPageNumber(page);
        setPageInput(savedPage);
      }
    }
    setLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    setLoading(false);
    setError("PDF를 불러올 수 없습니다.");
    console.error("PDF load error:", error);
  }

  const goToPrevPage = () => {
    const newPage = Math.max(pageNumber - 1, 1);
    setPageNumber(newPage);
    setPageInput(String(newPage));
  };

  const goToNextPage = () => {
    const newPage = Math.min(pageNumber + 1, numPages);
    setPageNumber(newPage);
    setPageInput(String(newPage));
  };

  const goToFirstPage = () => {
    setPageNumber(1);
    setPageInput("1");
  };

  const goToLastPage = () => {
    setPageNumber(numPages);
    setPageInput(String(numPages));
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(pageInput, 10);
    if (!isNaN(page) && page >= 1 && page <= numPages) {
      setPageNumber(page);
    } else {
      setPageInput(String(pageNumber));
    }
  };

  const zoomIn = () => {
    setFitMode("custom");
    setScale(prev => Math.min(prev + 0.25, 3.0));
  };

  const zoomOut = () => {
    setFitMode("custom");
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const toggleFitWidth = () => {
    if (fitMode === "width") {
      setFitMode("custom");
    } else {
      setFitMode("width");
    }
  };

  const toggleFullscreen = useCallback(() => {
    if (!viewerRef.current) return;

    if (!isFullscreen) {
      if (viewerRef.current.requestFullscreen) {
        viewerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goToPrevPage();
      } else if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === "Home") {
        e.preventDefault();
        goToFirstPage();
      } else if (e.key === "End") {
        e.preventDefault();
        goToLastPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [numPages, pageNumber]);

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button asChild variant="outline">
          <a href={url} download={fileName} target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4 mr-2" />
            PDF 다운로드
          </a>
        </Button>
      </Card>
    );
  }

  const pageWidth = fitMode === "width" && containerWidth > 0 ? containerWidth : undefined;
  const pageScale = fitMode === "custom" ? scale : undefined;

  return (
    <div 
      ref={viewerRef}
      className={`flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-background" : ""}`}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap bg-muted/50 rounded-md p-2 sticky top-0 z-10">
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={goToFirstPage}
            disabled={pageNumber <= 1}
            title="처음 페이지"
            data-testid="button-pdf-first"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            title="이전 페이지"
            data-testid="button-pdf-prev"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1">
            <Input
              type="text"
              value={pageInput}
              onChange={handlePageInputChange}
              onBlur={handlePageInputSubmit}
              className="w-12 h-8 text-center text-sm p-1"
              data-testid="input-pdf-page"
            />
            <span className="text-sm text-muted-foreground">/ {numPages}</span>
          </form>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            title="다음 페이지"
            data-testid="button-pdf-next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={goToLastPage}
            disabled={pageNumber >= numPages}
            title="마지막 페이지"
            data-testid="button-pdf-last"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant={fitMode === "width" ? "secondary" : "ghost"}
            onClick={toggleFitWidth}
            title="너비에 맞춤"
            data-testid="button-pdf-fit-width"
          >
            너비맞춤
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={zoomOut}
            disabled={fitMode === "custom" && scale <= 0.5}
            title="축소"
            data-testid="button-pdf-zoom-out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          {fitMode === "custom" && (
            <span className="text-sm px-1 min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={zoomIn}
            disabled={fitMode === "custom" && scale >= 3.0}
            title="확대"
            data-testid="button-pdf-zoom-in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleFullscreen}
            title={isFullscreen ? "전체화면 종료" : "전체화면"}
            data-testid="button-pdf-fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button asChild size="icon" variant="ghost" title="다운로드">
            <a href={url} download={fileName} target="_blank" rel="noopener noreferrer" data-testid="button-pdf-download">
              <Download className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className={`overflow-auto border rounded-md bg-muted/30 flex justify-center p-4 ${isFullscreen ? "flex-1" : "max-h-[75vh]"}`}
      >
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading=""
          className="flex justify-center"
        >
          <Page
            pageNumber={pageNumber}
            width={pageWidth}
            scale={pageScale}
            renderTextLayer={true}
            renderAnnotationLayer={false}
            className="shadow-lg"
          />
        </Document>
      </div>

      <div className="text-center text-xs text-muted-foreground mt-2 px-2">
        방향키 또는 스페이스바로 페이지 이동 | Home/End로 처음/끝 이동
      </div>
    </div>
  );
}
