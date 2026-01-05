import { Grid, Map, User, Layout, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function Navigation() {
  const menuItems = [
    { icon: Layout, label: "Square" },
    { icon: Map, label: "Map" },
    { icon: Grid, label: "Madang" },
    { icon: User, label: "User" },
  ];

  return (
    <div className="py-8 border-b border-border bg-white/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo Area */}
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tighter hover:text-accent transition-colors cursor-pointer select-none">
              오리알터닷컴
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 font-mono tracking-widest">
              ORIE ALTER DOT COM PORTAL
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-md relative group">
            <div className="absolute inset-0 bg-primary/10 transform translate-x-1 translate-y-1 rounded transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
            <div className="relative flex shadow-sm">
              <Input 
                placeholder="검색어를 입력하세요 (Search)..." 
                className="rounded-none border-2 border-primary h-12 text-lg font-display placeholder:font-sans focus-visible:ring-0 focus-visible:border-accent bg-white"
              />
              <Button size="icon" className="h-12 w-12 rounded-none border-2 border-l-0 border-primary bg-primary text-white hover:bg-accent hover:border-accent hover:text-white transition-all">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Icons Menu */}
          <div className="flex gap-4">
            {menuItems.map((item) => (
              <button 
                key={item.label}
                className="flex flex-col items-center gap-1 group"
              >
                <div className="w-12 h-12 flex items-center justify-center border-2 border-primary rounded bg-white shadow-sm transition-all group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-accent group-hover:border-accent group-active:translate-y-0 group-active:shadow-none">
                  <item.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
