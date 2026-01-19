import { useState, useEffect } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import ilgijangImage from "@assets/ilgijang-final.png";

export function IlgijangGallery() {
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const openFullscreen = () => {
    setFullscreenOpen(true);
    setIsZoomed(false);
  };

  const closeFullscreen = () => {
    setFullscreenOpen(false);
    setIsZoomed(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fullscreenOpen) return;
      if (e.key === "Escape") closeFullscreen();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenOpen]);

  return (
    <div className="w-full" data-testid="ilgijang-gallery">
      <div 
        className="bg-white rounded-md overflow-hidden cursor-pointer hover-elevate flex items-center justify-center py-4"
        onClick={openFullscreen}
        data-testid="gallery-ilgijang-page-1"
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center center' }}
      >
        <img
          src={ilgijangImage}
          alt="황극력 일기장"
          style={{ 
            maxHeight: '60vw',
            objectFit: 'contain'
          }}
        />
      </div>

      <Dialog open={fullscreenOpen} onOpenChange={() => closeFullscreen()}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <VisuallyHidden>
            <DialogTitle>황극력 일기장</DialogTitle>
          </VisuallyHidden>
          <div className="relative w-full h-[90vh] flex items-center justify-center overflow-auto">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 z-20 text-white hover:bg-white/20"
              onClick={closeFullscreen}
              data-testid="button-ilgijang-fullscreen-close"
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-14 z-20 text-white hover:bg-white/20"
              onClick={() => setIsZoomed(!isZoomed)}
              data-testid="button-ilgijang-fullscreen-zoom"
            >
              {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
            </Button>

            <div 
              className={`transition-transform duration-300 ${isZoomed ? 'scale-150' : ''}`}
              style={{ transform: `rotate(90deg) ${isZoomed ? 'scale(1.5)' : ''}` }}
            >
              <img
                src={ilgijangImage}
                alt="황극력 일기장"
                className="max-h-[85vh] object-contain"
                data-testid="img-ilgijang-fullscreen"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
