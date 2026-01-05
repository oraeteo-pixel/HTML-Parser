import { TopBar } from "@/components/TopBar";
import { Navigation } from "@/components/Navigation";
import { Calendar } from "@/components/Calendar";
import { PostList } from "@/components/PostList";
import { Search, Home as HomeIcon, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "wouter";

export default function Home() {
  const [showSearch, setShowSearch] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navigation />
      
      <main 
        id="con-wrap"
        className="max-w-[990px] mx-auto bg-white border border-border min-h-[850px] relative mt-2 p-4"
        data-testid="main-content"
      >
        <div className="space-y-6">
          <section data-testid="calendar-section">
            <Calendar />
          </section>

          <div id="commentsBox" />
          
          <section data-testid="posts-section">
            <PostList />
          </section>
        </div>
      </main>

      <footer className="max-w-[990px] mx-auto py-6 text-center text-muted-foreground text-xs">
        <p>© 2026 오리알터닷컴. All rights reserved.</p>
      </footer>

      <div className="fixed bottom-1 right-2 z-50">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={scrollToTop}
          className="h-12 w-12 text-muted-foreground hover:text-primary"
          data-testid="button-scroll-top"
        >
          <ArrowUp className="h-8 w-8" />
        </Button>
      </div>

      <div className="fixed bottom-14 left-2 z-50">
        <Link href="/">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 text-muted-foreground hover:text-primary"
            data-testid="button-home"
          >
            <HomeIcon className="h-8 w-8" />
          </Button>
        </Link>
      </div>

      <div className="fixed bottom-1 left-2 z-50 flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowSearch(!showSearch)}
          className="h-12 w-12 text-muted-foreground hover:text-primary"
          data-testid="button-search-toggle"
        >
          <Search className="h-8 w-8" />
        </Button>
        
        {showSearch && (
          <div className="flex gap-1 animate-in slide-in-from-left">
            <Input 
              placeholder="검색어를 넣으세요" 
              className="w-[200px] h-9"
              data-testid="input-search"
            />
            <Button size="sm" data-testid="button-search-submit">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
