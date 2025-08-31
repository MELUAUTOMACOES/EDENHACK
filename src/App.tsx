import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Irrigacao from "./pages/Irrigacao";
import ChatIA from "./pages/ChatIA";
import Aprender from "./pages/Aprender";
import Perfil from "./pages/Perfil";
import Clima from "./pages/Clima";
import NotFound from "./pages/NotFound";
import { BottomNavigation } from "./components/layout/BottomNavigation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/irrigacao" element={<Irrigacao />} />
            <Route path="/chat" element={<ChatIA />} />
            <Route path="/aprender" element={<Aprender />} />
            <Route path="/clima" element={<Clima />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNavigation />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
