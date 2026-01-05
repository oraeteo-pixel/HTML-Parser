import { TopBar } from "@/components/TopBar";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

export default function StorePage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navigation />
      
      <main className="max-w-[990px] mx-auto px-2 py-4" data-testid="store-main">
        <Card className="p-8 text-center" data-testid="card-store">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 orae-pink" data-testid="icon-store" />
          <h1 className="text-2xl font-bold orae-pink mb-2" data-testid="text-store-title">문구몰</h1>
          <p className="text-muted-foreground" data-testid="text-store-status">
            문구몰 서비스 준비 중입니다.
          </p>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
