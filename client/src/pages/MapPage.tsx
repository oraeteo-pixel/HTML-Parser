import { TopBar } from "@/components/TopBar";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";

export default function MapPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navigation />
      
      <main className="w-full max-w-[990px] mx-auto px-2 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              지도
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">지도 페이지입니다. 주변 정보를 확인하세요.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
