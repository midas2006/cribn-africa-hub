
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Notes from "./pages/Notes";
import Hostels from "./pages/Hostels";
import Food from "./pages/Food";
import Parties from "./pages/Parties";

import Wallet from "./pages/Wallet";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/hostels" element={<Hostels />} />
            <Route path="/food" element={<Food />} />
            <Route path="/events" element={<Parties />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/errands" element={<div className="min-h-screen flex items-center justify-center bg-background"><h1 className="text-2xl text-foreground">Errands - Coming Soon</h1></div>} />
            <Route path="/marketplace" element={<div className="min-h-screen flex items-center justify-center bg-background"><h1 className="text-2xl text-foreground">Marketplace - Coming Soon</h1></div>} />
            <Route path="/attendance" element={<div className="min-h-screen flex items-center justify-center bg-background"><h1 className="text-2xl text-foreground">Attendance - Coming Soon</h1></div>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
