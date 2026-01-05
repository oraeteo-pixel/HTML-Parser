import { TopBar } from "@/components/TopBar";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid } from "lucide-react";

export default function Madang() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navigation />
      
      <main className="max-w-[990px] mx-auto px-2 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid className="h-5 w-5" />
              마당
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">마당 페이지입니다. 다양한 콘텐츠를 만나보세요.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
