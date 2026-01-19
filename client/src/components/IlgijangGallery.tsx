import { useState, useEffect } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import page1 from "@assets/ilgijang-final.png";

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
        className="bg-white rounded-md overflow-hidden cursor-pointer hover-elevate flex items-center justify-center py-8"
        onClick={openFullscreen}
        data-testid="gallery-ilgijang-page-1"
      >
        <img
          src={page1}
          alt="일기장"
          className="h-auto object-contain"
          style={{ maxWidth: '100%' }}
        />
      </div>

      <Dialog open={fullscreenOpen} onOpenChange={() => closeFullscreen()}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
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
              className={`transition-transform duration-300 ${isZoomed ? 'overflow-auto' : 'overflow-hidden'}`}
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            >
              <img
                src={page1}
                alt="일기장"
                className={`transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-move' : 'max-w-full object-contain cursor-zoom-in'}`}
                onClick={() => !isZoomed && setIsZoomed(true)}
                data-testid="img-ilgijang-fullscreen"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
