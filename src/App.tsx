
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Hostels from "./pages/Hostels";
import Food from "./pages/Food";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="cribn-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/hostels" element={<Hostels />} />
            <Route path="/food" element={<Food />} />
            <Route path="/events" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Events - Coming Soon</h1></div>} />
            <Route path="/errands" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Errands - Coming Soon</h1></div>} />
            <Route path="/marketplace" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Marketplace - Coming Soon</h1></div>} />
            <Route path="/attendance" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Attendance - Coming Soon</h1></div>} />
            <Route path="/wallet" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Wallet - Coming Soon</h1></div>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
