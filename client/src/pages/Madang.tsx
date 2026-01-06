import { TopBar } from "@/components/TopBar";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Grid, MessageSquare, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { SIXTY_GANJI } from "@/lib/calendarData";
import type { Post } from "@shared/schema";

type PostWithAuthor = Post & { author: string };
type GanjiGroup = { ganji: string; posts: PostWithAuthor[] };

export default function Madang() {
  const { data: ganjiGroups, isLoading } = useQuery<GanjiGroup[]>({
    queryKey: ["/api/madang/latest"],
  });

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navigation />
      
      <main className="max-w-[990px] mx-auto px-2 py-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid className="h-5 w-5" />
              60갑자 마당
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">60갑자별 커뮤니티 게시판입니다. 각 갑자를 클릭하여 해당 게시판으로 이동하세요.</p>
            
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-1">
              {SIXTY_GANJI.map((ganji) => (
                <Link key={ganji} href={`/madang/${ganji}`}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs font-medium"
                    data-testid={`ganji-button-${ganji}`}
                  >
                    {ganji}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              최신 글
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">로딩 중...</p>
            ) : !ganjiGroups || ganjiGroups.length === 0 ? (
              <p className="text-muted-foreground">아직 작성된 글이 없습니다.</p>
            ) : (
              <div className="space-y-4">
                {ganjiGroups.map((group) => (
                  <div key={group.ganji} className="border-b pb-3 last:border-b-0">
                    <Link href={`/madang/${group.ganji}`}>
                      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 cursor-pointer hover:text-primary">
                        <span className="px-2 py-0.5 rounded text-white text-sm" style={{ backgroundColor: 'hsl(215 50% 35%)' }}>
                          {group.ganji === "general" ? "일반" : group.ganji}
                        </span>
                        <span className="text-muted-foreground text-sm">({group.posts.length})</span>
                      </h3>
                    </Link>
                    <div className="space-y-2">
                      {group.posts.slice(0, 3).map((post) => (
                        <div key={post.id} className="flex items-center gap-2 text-sm">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium truncate flex-1">{post.title}</span>
                          <span className="text-muted-foreground text-xs">{post.author}</span>
                          <span className="text-muted-foreground text-xs">{formatDate(post.createdAt)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
