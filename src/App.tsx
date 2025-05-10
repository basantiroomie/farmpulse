import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import LoginPage from "@/pages/Login";
import SignUpPage from "@/pages/SignUp";
import AdminLoginPage from "@/pages/AdminLogin";
import Index from "@/pages/Index";
import ROI from "@/pages/ROI";
import Support from "@/pages/Support";
import Contact from "@/pages/Contact";
import Dashboard from "@/pages/Dashboard";

// Admin Components
import { SystemOverview } from "@/components/Admin/SystemOverview";
import { CattleAnalytics } from "@/components/Admin/CattleAnalytics";
import { AlertsManagement } from "@/components/Admin/AlertsManagement";
import { UserManagement } from "@/components/Admin/UserManagement";
import { Reports } from "@/components/Admin/Reports";

import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="farmpulse-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/admin-login" element={<AdminLoginPage />} />
                  <Route path="/roi-calculator" element={<ROI />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin/overview"
                    element={
                      <ProtectedRoute requireAdmin>
                        <SystemOverview />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/analytics"
                    element={
                      <ProtectedRoute requireAdmin>
                        <CattleAnalytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/alerts"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AlertsManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute requireAdmin>
                        <UserManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/reports"
                    element={
                      <ProtectedRoute requireAdmin>
                        <Reports />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
