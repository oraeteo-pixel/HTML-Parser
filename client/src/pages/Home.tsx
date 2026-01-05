import { TopBar } from "@/components/TopBar";
import { Navigation } from "@/components/Navigation";
import { Calendar } from "@/components/Calendar";
import { PostList } from "@/components/PostList";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col pb-12">
      <TopBar />
      <Navigation />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column / Main Content */}
        <div className="lg:col-span-8 space-y-10">
          <section>
            <Calendar />
          </section>
          
          <section>
            <PostList />
          </section>
        </div>

        {/* Right Column / Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Info Card 1 */}
          <div className="bg-primary text-primary-foreground p-6 rounded-sm shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-serif leading-none select-none">運</div>
            <h3 className="text-xl font-bold font-display mb-2 text-accent">오늘의 운세</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              Today's Fortune: Good things come to those who wait, but better things come to those who build.
            </p>
            <div className="mt-4 pt-4 border-t border-primary-foreground/20 text-xs font-mono opacity-60">
              Updated: Just now
            </div>
          </div>

          {/* Info Card 2 */}
          <div className="border border-border bg-white p-6 rounded-sm shadow-sm">
            <h3 className="text-lg font-bold font-display mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              공지사항 (Notice)
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                "시스템 점검 안내 (System Maintenance)",
                "새로운 기능 업데이트 (New Features)",
                "커뮤니티 가이드라인 (Community Guidelines)",
                "개인정보 처리방침 변경 (Privacy Policy)"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-muted-foreground hover:text-primary cursor-pointer transition-colors group">
                  <span className="text-xs text-accent opacity-50 group-hover:opacity-100">▶</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Ad Placeholder (Retro web style) */}
          <div className="h-48 bg-muted/30 border-2 border-dashed border-muted flex flex-col items-center justify-center text-muted-foreground text-xs gap-2">
             <span className="font-display text-lg opacity-30">ADVERTISEMENT</span>
             <span className="opacity-50">배너 영역 (Banner Area)</span>
          </div>
        </aside>
      </main>

      <footer className="mt-20 border-t border-border py-8 text-center text-muted-foreground text-xs font-mono">
        <p>© 2026 ORIE ALTER DOT COM. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2 opacity-60">
          <span>Terms</span>
          <span>Privacy</span>
          <span>Contact</span>
        </div>
      </footer>
    </div>
  );
}
