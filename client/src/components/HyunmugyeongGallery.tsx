import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import page1 from "@assets/玄武經1쪽_1768798346130.jpg";
import page2 from "@assets/玄武經2쪽_1768798346131.jpg";
import page3 from "@assets/玄武經3쪽_1768798346132.jpg";
import page4 from "@assets/玄武經4쪽_1768798346133.jpg";
import page5 from "@assets/玄武經5쪽_1768798346133.jpg";
import page6 from "@assets/玄武經6쪽_1768798346136.jpg";
import page7 from "@assets/玄武經7쪽_1768798346137.jpg";
import page8 from "@assets/玄武經8쪽_1768798346138.jpg";
import page9 from "@assets/玄武經9쪽_1768798346139.jpg";
import page10 from "@assets/玄武經10쪽_1768798346140.jpg";
import page11 from "@assets/玄武經11쪽_1768798346141.jpg";
import page12 from "@assets/玄武經12쪽_1768798346141.jpg";
import page13 from "@assets/玄武經13쪽_1768798346142.jpg";
import page14 from "@assets/玄武經14쪽_1768798346143.jpg";
import page15 from "@assets/玄武經15쪽_1768798374396.jpg";
import page16 from "@assets/玄武經16쪽_1768798374398.jpg";
import page17 from "@assets/玄武經17쪽_1768798374399.jpg";
import page18 from "@assets/玄武經18쪽_1768798374400.jpg";
import page19 from "@assets/玄武經19쪽_1768798374401.jpg";
import page20 from "@assets/玄武經20쪽_1768798374402.jpg";
import page21 from "@assets/玄武經21쪽_1768798374403.jpg";
import page22 from "@assets/玄武經22쪽_1768798374404.jpg";
import page23 from "@assets/玄武經23쪽_1768798374404.jpg";
import page24 from "@assets/玄武經24쪽_1768798374405.jpg";
import page25 from "@assets/玄武經25쪽_1768798374406.jpg";
import page26 from "@assets/玄武經26쪽_1768798374407.jpg";
import page27 from "@assets/玄武經27쪽_1768798374407.jpg";
import page28 from "@assets/玄武經28쪽_1768798374408.jpg";
import page29 from "@assets/玄武經29쪽_1768798400003.jpg";
import page30 from "@assets/玄武經30쪽_1768798400006.jpg";
import page31 from "@assets/玄武經31쪽_1768798400007.jpg";
import page32 from "@assets/玄武經32쪽_1768798400008.jpg";
import page33 from "@assets/玄武經33쪽_1768798400008.jpg";
import page34 from "@assets/玄武經34쪽_1768798400009.jpg";
import page35 from "@assets/玄武經35쪽_1768798400010.jpg";
import page36 from "@assets/玄武經36쪽_1768798400011.jpg";

const pages = [
  page1, page2, page3, page4, page5, page6, page7, page8, page9, page10,
  page11, page12, page13, page14, page15, page16, page17, page18, page19, page20,
  page21, page22, page23, page24, page25, page26, page27, page28, page29, page30,
  page31, page32, page33, page34, page35, page36
];

export function HyunmugyeongGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
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
    <div className="w-full" data-testid="hyunmugyeong-gallery">
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {pages.map((page, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 px-1"
              >
                <div 
                  className="aspect-[3/4] bg-white rounded-md overflow-hidden cursor-pointer hover-elevate"
                  onClick={() => openFullscreen(index)}
                  data-testid={`gallery-page-${index + 1}`}
                >
                  <img
                    src={page}
                    alt={`현무경 ${index + 1}쪽`}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          size="icon"
          variant="secondary"
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 opacity-80 hover:opacity-100"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          data-testid="button-gallery-prev"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          variant="secondary"
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 opacity-80 hover:opacity-100"
          onClick={scrollNext}
          disabled={!canScrollNext}
          data-testid="button-gallery-next"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center justify-center mt-4">
        <span className="text-sm text-muted-foreground">
          {selectedIndex + 1} / {pages.length}
        </span>
      </div>

      <Dialog open={fullscreenImage !== null} onOpenChange={() => closeFullscreen()}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 z-20 text-white hover:bg-white/20"
              onClick={closeFullscreen}
              data-testid="button-fullscreen-close"
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-14 z-20 text-white hover:bg-white/20"
              onClick={() => setIsZoomed(!isZoomed)}
              data-testid="button-fullscreen-zoom"
            >
              {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
            </Button>

            {fullscreenImage !== null && fullscreenImage > 0 && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20"
                onClick={() => navigateFullscreen("prev")}
                data-testid="button-fullscreen-prev"
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
                data-testid="button-fullscreen-next"
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
                  alt={`현무경 ${fullscreenImage + 1}쪽`}
                  className={`transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-move' : 'max-h-[85vh] max-w-full object-contain cursor-zoom-in'}`}
                  onClick={() => !isZoomed && setIsZoomed(true)}
                  data-testid="img-fullscreen"
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
