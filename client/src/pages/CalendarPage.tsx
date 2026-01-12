import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Calendar } from "@/components/Calendar";

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <Navigation />
      
      <main className="w-full max-w-[990px] mx-auto px-0 sm:px-2 py-2 sm:py-4 bg-white dark:bg-background" data-testid="calendar-main">
        <Calendar />
      </main>
      
      <Footer />
    </div>
  );
}
