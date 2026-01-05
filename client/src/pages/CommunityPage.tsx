import { TopBar } from "@/components/TopBar";
import { Navigation } from "@/components/Navigation";
import { PostList } from "@/components/PostList";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navigation />
      
      <main className="max-w-[990px] mx-auto px-2 py-4" data-testid="community-main">
        <PostList />
      </main>
    </div>
  );
}
