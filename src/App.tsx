import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import ServiceRequest from "./pages/ServiceRequest";
import AdminDashboard from "./pages/AdminDashboard";
import ChatInterface from "./pages/ChatInterface";
import LandingPage from "./pages/LandingPage";
import UpgradePage from "./pages/Upgrade";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  if (isAuthenticated === null) {
    return null; // Or a loading spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Index />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/auth"
              element={
                !isAuthenticated ? (
                  <Auth />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/onboarding"
              element={
                isAuthenticated ? (
                  <Onboarding />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/landing"
              element={<LandingPage />}
            />
            <Route
              path="/upgrade"
              element={<UpgradePage />}
            />
            {/* Service Request Routes */}
            {[
              "/hotel-request",
              "/flight-request",
              "/dining-request",
              "/transport-request",
              "/event-request"
            ].map((path) => (
              <Route
                key={path}
                path={path}
                element={
                  isAuthenticated ? (
                    <ServiceRequest />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
            ))}
            <Route
              path="/admin-dashboard"
              element={
                isAuthenticated ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/chat"
              element={
                isAuthenticated ? (
                  <ChatInterface />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
