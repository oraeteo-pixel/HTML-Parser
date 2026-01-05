import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Square from "@/pages/Square";
import MapPage from "@/pages/MapPage";
import Madang from "@/pages/Madang";
import UserPage from "@/pages/UserPage";
import MansionChart from "@/pages/MansionChart";
import EbookPage from "@/pages/EbookPage";
import StorePage from "@/pages/StorePage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/square" component={Square} />
      <Route path="/map" component={MapPage} />
      <Route path="/madang" component={Madang} />
      <Route path="/user" component={UserPage} />
      <Route path="/28su" component={MansionChart} />
      <Route path="/ebook" component={EbookPage} />
      <Route path="/store" component={StorePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
