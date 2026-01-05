import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function EbookPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-[990px] mx-auto px-2 py-4" data-testid="ebook-main">
        <Card className="p-8 text-center" data-testid="card-ebook">
          <BookOpen className="h-16 w-16 mx-auto mb-4 orae-pink" data-testid="icon-ebook" />
          <h1 className="text-2xl font-bold orae-pink mb-2" data-testid="text-ebook-title">전자책</h1>
          <p className="text-muted-foreground" data-testid="text-ebook-status">
            전자책 서비스 준비 중입니다.
          </p>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
