import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import page1 from "@assets/deukchae-1-trimmed.jpg";

const pages = [page1];

export function DeukchaebuGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const openFullscreen = (index: number) => {
    setFullscreenImage(index);
    setIsZoomed(false);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
    setIsZoomed(false);
  };

  const navigateFullscreen = (direction: "prev" | "next") => {
    if (fullscreenImage === null) return;
    const newIndex = direction === "prev" 
      ? Math.max(0, fullscreenImage - 1)
      : Math.min(pages.length - 1, fullscreenImage + 1);
    setFullscreenImage(newIndex);
    setIsZoomed(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreenImage === null) return;
      if (e.key === "Escape") closeFullscreen();
      if (e.key === "ArrowLeft") navigateFullscreen("prev");
      if (e.key === "ArrowRight") navigateFullscreen("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenImage]);

  return (
    <div className="w-full" data-testid="deukchaebu-gallery">
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {pages.map((page, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 px-1"
              >
                <div 
                  className="min-h-[85vh] bg-white rounded-md overflow-hidden cursor-pointer hover-elevate flex items-center justify-center"
                  onClick={() => openFullscreen(index)}
                  data-testid={`gallery-deukchae-page-${index + 1}`}
                >
                  <img
                    src={page}
                    alt={`득체부 ${index + 1}쪽`}
                    className="w-full h-auto max-h-[85vh] object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {pages.length > 1 && (
          <>
            <Button
              size="icon"
              variant="secondary"
              className="absolute left-1 top-1/2 -translate-y-1/2 z-10 opacity-80 hover:opacity-100"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              data-testid="button-deukchae-gallery-prev"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              variant="secondary"
              className="absolute right-1 top-1/2 -translate-y-1/2 z-10 opacity-80 hover:opacity-100"
              onClick={scrollNext}
              disabled={!canScrollNext}
              data-testid="button-deukchae-gallery-next"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      <Dialog open={fullscreenImage !== null} onOpenChange={() => closeFullscreen()}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 z-20 text-white hover:bg-white/20"
              onClick={closeFullscreen}
              data-testid="button-deukchae-fullscreen-close"
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-14 z-20 text-white hover:bg-white/20"
              onClick={() => setIsZoomed(!isZoomed)}
              data-testid="button-deukchae-fullscreen-zoom"
            >
              {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
            </Button>

            {fullscreenImage !== null && fullscreenImage > 0 && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20"
                onClick={() => navigateFullscreen("prev")}
                data-testid="button-deukchae-fullscreen-prev"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}

            {fullscreenImage !== null && fullscreenImage < pages.length - 1 && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20"
                onClick={() => navigateFullscreen("next")}
                data-testid="button-deukchae-fullscreen-next"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}

            {fullscreenImage !== null && (
              <div 
                className={`transition-transform duration-300 ${isZoomed ? 'overflow-auto' : 'overflow-hidden'}`}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              >
                <img
                  src={pages[fullscreenImage]}
                  alt={`득체부 ${fullscreenImage + 1}쪽`}
                  className={`transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-move' : 'max-h-[85vh] max-w-full object-contain cursor-zoom-in'}`}
                  onClick={() => !isZoomed && setIsZoomed(true)}
                  data-testid="img-deukchae-fullscreen"
                />
              </div>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {fullscreenImage !== null ? `${fullscreenImage + 1} / ${pages.length}` : ""}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
