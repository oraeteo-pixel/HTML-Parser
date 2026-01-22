import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Calendar } from "@/components/Calendar";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-background">
      <Navigation />
      
      <main className="flex-1 overflow-auto">
        <div className="w-full max-w-[990px] mx-auto px-0 sm:px-2 py-2 sm:py-4 bg-white dark:bg-background" data-testid="calendar-main">
          <Calendar />
        </div>
        <Footer />

        {/* 스크롤 네비게이션 화살표 */}
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
          <Button
            size="icon"
            variant="outline"
            className="rounded-full shadow-lg"
            onClick={() => {
              const mainContainer = document.querySelector('main');
              if (mainContainer) {
                mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            data-testid="button-scroll-top"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full shadow-lg"
            onClick={() => {
              const mainContainer = document.querySelector('main');
              if (mainContainer) {
                mainContainer.scrollTo({ top: mainContainer.scrollHeight, behavior: 'smooth' });
              }
            }}
            data-testid="button-scroll-bottom"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
