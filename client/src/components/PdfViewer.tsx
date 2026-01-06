import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Loader2 } from "lucide-react";

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

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    setLoading(false);
    setError("PDF를 불러올 수 없습니다.");
    console.error("PDF load error:", error);
  }

  const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages));
  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.5));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 flex-wrap bg-muted/50 rounded-md p-2">
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            data-testid="button-pdf-prev"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm px-2">
            {pageNumber} / {numPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            data-testid="button-pdf-next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={zoomOut}
            disabled={scale <= 0.5}
            data-testid="button-pdf-zoom-out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm px-2">{Math.round(scale * 100)}%</span>
          <Button
            size="sm"
            variant="outline"
            onClick={zoomIn}
            disabled={scale >= 2.5}
            data-testid="button-pdf-zoom-in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <Button asChild size="sm" variant="outline">
          <a href={url} download={fileName} target="_blank" rel="noopener noreferrer" data-testid="button-pdf-download">
            <Download className="h-4 w-4 mr-1" />
            다운로드
          </a>
        </Button>
      </div>

      <div className="overflow-auto max-h-[70vh] border rounded-md bg-muted/30 flex justify-center">
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
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </div>
  );
}
