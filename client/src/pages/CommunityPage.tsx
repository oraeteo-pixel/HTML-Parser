import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PostList } from "@/components/PostList";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="w-full max-w-[990px] mx-auto px-2 py-4" data-testid="community-main">
        <PostList />
      </main>
      
      <Footer />
    </div>
  );
}
