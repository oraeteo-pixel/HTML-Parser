import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Square from "@/pages/Square";
import MapPage from "@/pages/MapPage";
import Madang from "@/pages/Madang";
import UserPage from "@/pages/UserPage";
import MansionChart from "@/pages/MansionChart";
import EbookPage from "@/pages/EbookPage";
import EbookViewerPage from "@/pages/EbookViewerPage";
import StorePage from "@/pages/StorePage";
import CalendarPage from "@/pages/CalendarPage";
import CommunityPage from "@/pages/CommunityPage";
import Messages from "@/pages/Messages";
import Admin from "@/pages/Admin";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";

function Router() {
  return (
    <Switch>
      <Route path="/">{() => <Redirect to="/calendar" />}</Route>
      <Route path="/square" component={Square} />
      <Route path="/map" component={MapPage} />
      <Route path="/madang" component={Madang} />
      <Route path="/user" component={UserPage} />
      <Route path="/28su" component={MansionChart} />
      <Route path="/ebook" component={EbookPage} />
      <Route path="/ebook/:id" component={EbookViewerPage} />
      <Route path="/store" component={StorePage} />
      <Route path="/calendar" component={CalendarPage} />
      <Route path="/community" component={CommunityPage} />
      <Route path="/messages" component={Messages} />
      <Route path="/admin" component={Admin} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
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
