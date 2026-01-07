import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

interface PdfViewerProps {
  url: string;
  fileName?: string;
}

export function PdfViewer({ url, fileName }: PdfViewerProps) {
  const [error, setError] = useState<string | null>(null);
  
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => defaultTabs,
    toolbarPlugin: {
      fullScreenPlugin: {
        onEnterFullScreen: (zoom) => {
          zoom(SpecialZoomLevel.PageWidth);
        },
        onExitFullScreen: (zoom) => {
          zoom(SpecialZoomLevel.PageWidth);
        },
      },
    },
  });

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
    <div className="h-[85vh] w-full border rounded-md overflow-hidden">
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`}>
        <Viewer
          fileUrl={url}
          plugins={[defaultLayoutPluginInstance]}
          defaultScale={SpecialZoomLevel.PageWidth}
          renderLoader={(percentages: number) => (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                로딩 중... {Math.round(percentages)}%
              </span>
            </div>
          )}
          onDocumentLoad={() => setError(null)}
        />
      </Worker>
    </div>
  );
}
