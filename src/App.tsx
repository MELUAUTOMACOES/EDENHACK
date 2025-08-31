import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { BottomNavigation } from "./components/layout/BottomNavigation";

// Lazy load pages for better code splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Irrigacao = lazy(() => import("./pages/Irrigacao"));
const ChatIA = lazy(() => import("./pages/ChatIA"));
const Aprender = lazy(() => import("./pages/Aprender"));
const Perfil = lazy(() => import("./pages/Perfil"));
const Clima = lazy(() => import("./pages/Clima"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="relative">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/irrigacao" element={<Irrigacao />} />
              <Route path="/chat" element={<ChatIA />} />
              <Route path="/aprender" element={<Aprender />} />
              <Route path="/clima" element={<Clima />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <BottomNavigation />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
