import { TopBar } from "@/components/TopBar";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function UserPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navigation />
      
      <main className="max-w-[990px] mx-auto px-2 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              회원
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">회원 페이지입니다. 회원 정보를 관리하세요.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
