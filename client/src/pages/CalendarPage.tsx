import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Calendar } from "@/components/Calendar";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";

export default function CalendarPage() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadExcel = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('/api/calendar/export');
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'calendar_1989_2050.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="w-full max-w-[990px] mx-auto px-0 sm:px-2 py-2 sm:py-4" data-testid="calendar-main">
        <div className="flex justify-end mb-2 px-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadExcel}
            disabled={isDownloading}
            data-testid="button-download-excel"
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? "다운로드 중..." : "달력 데이터 다운로드 (1989-2050)"}
          </Button>
        </div>
        <Calendar />
      </main>
      
      <Footer />
    </div>
  );
}
