import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ReactNode } from "react";

import { AppProvider } from "@/contexts/AppContext";

import Index from "./pages/Index";
import ItemDetail from "./pages/ItemDetail";
import TimerPage from "./pages/TimerPage";
import HeatmapPage from "./pages/HeatmapPage";
import ItemCalendarPage from "./pages/ItemCalendarPage";
import ItemAnalyticsPage from "./pages/ItemAnalyticsPage";
import NotFound from "./pages/NotFound";

import Login from "./pages/Login";
import Register from "./pages/Register";

const queryClient = new QueryClient();

type ProtectedProps = {
  children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedProps) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <Routes>

              {/* AUTH ROUTES */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* PROTECTED ROUTES */}

              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/task/:id"
                element={
                  <ProtectedRoute>
                    <ItemDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/habit/:id"
                element={
                  <ProtectedRoute>
                    <ItemDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/task/:id/timer"
                element={
                  <ProtectedRoute>
                    <TimerPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/habit/:id/timer"
                element={
                  <ProtectedRoute>
                    <TimerPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/task/:id/heatmap"
                element={
                  <ProtectedRoute>
                    <HeatmapPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/habit/:id/heatmap"
                element={
                  <ProtectedRoute>
                    <HeatmapPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/task/:id/calendar"
                element={
                  <ProtectedRoute>
                    <ItemCalendarPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/habit/:id/calendar"
                element={
                  <ProtectedRoute>
                    <ItemCalendarPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/task/:id/analytics"
                element={
                  <ProtectedRoute>
                    <ItemAnalyticsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/habit/:id/analytics"
                element={
                  <ProtectedRoute>
                    <ItemAnalyticsPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />

            </Routes>
          </BrowserRouter>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;