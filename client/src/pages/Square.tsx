import { TopBar } from "@/components/TopBar";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid } from "lucide-react";

export default function Square() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navigation />
      
      <main className="w-full max-w-[990px] mx-auto px-2 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5" />
              광장
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">광장 페이지입니다. 커뮤니티 소식과 공지사항을 확인하세요.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
