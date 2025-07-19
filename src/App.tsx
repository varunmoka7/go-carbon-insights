
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Tracking from "./pages/Tracking";
import Scope1 from "./pages/Scope1";
import Scope2 from "./pages/Scope2";
import Scope3 from "./pages/Scope3";
import Decarbonization from "./pages/Decarbonization";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import ReportsAnalytics from "./pages/ReportsAnalytics";
import Methodology from "./pages/Methodology";
import Reference from "./pages/Reference";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import About from "./pages/About";
import Contact from "./pages/Contact";

import IndustryAnalysis from "./pages/IndustryAnalysis";
import PlasticPackaging from "./pages/PlasticPackaging";
import IndustryTaxonomy from "./pages/IndustryTaxonomy";
import IndustryGlossary from "./pages/IndustryGlossary";
import Community from "./pages/Community";
import AccessibilityPanel from "./components/AccessibilityPanel";
import FloatingActionButton from "./components/FloatingActionButton";
import NavigationDebugger from "./components/NavigationDebugger";
import NavigationLoader from "./components/NavigationLoader";
import EmissionTracking from "./pages/EmissionTracking";

// Admin components
import { AdminLayout } from "./features/admin/components/AdminLayout";
import { AdminDashboard } from "./features/admin/pages/AdminDashboard";
import { ReportsPage } from "./features/admin/pages/ReportsPage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <SidebarProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <NavigationDebugger />
                  <NavigationLoader />
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/update-password" element={<UpdatePassword />} />
                    <Route path="/about" element={
                      <Layout>
                        <About />
                      </Layout>
                    } />
                    <Route path="/contact" element={
                      <Layout>
                        <Contact />
                      </Layout>
                    } />
                    
                    {/* Protected routes - require authentication */}
                    <Route path="/community" element={
                      <PrivateRoute>
                        <Community />
                      </PrivateRoute>
                    } />
                    <Route path="/home" element={
                      <PrivateRoute>
                        <Layout>
                          <Home />
                        </Layout>
                      </PrivateRoute>
                    } />
                    <Route path="/dashboard" element={
                      <PrivateRoute>
                        <Layout>
                          <Dashboard />
                        </Layout>
                      </PrivateRoute>
                    } />
                    <Route path="/tracking" element={
                      <PrivateRoute>
                        <Layout>
                          <Tracking />
                        </Layout>
                      </PrivateRoute>
                    } />
                    <Route path="/emission-tracking" element={
                      <PrivateRoute>
                        <EmissionTracking />
                      </PrivateRoute>
                    } />
                    <Route path="/scope1" element={
                      <PrivateRoute>
                        <Layout>
                          <Scope1 />
                        </Layout>
                      </PrivateRoute>
                    } />
                    <Route path="/scope2" element={
                      <PrivateRoute>
                        <Layout>
                          <Scope2 />
                        </Layout>
                      </PrivateRoute>
                    } />
                    <Route path="/scope3" element={
                      <PrivateRoute>
                        <Layout>
                          <Scope3 />
                        </Layout>
                      </PrivateRoute>
                    } />
                    <Route path="/decarbonization" element={
                      <PrivateRoute>
                        <Layout>
                          <Decarbonization />
                        </Layout>
                      </PrivateRoute>
                    } />
                    <Route path="/profile" element={
                      <PrivateRoute>
                        <Layout>
                          <Profile />
                        </Layout>
                      </PrivateRoute>
                    } />
                    <Route path="/reports-analytics" element={
                      <PrivateRoute>
                        <Layout>
                          <ReportsAnalytics />
                        </Layout>
                      </PrivateRoute>
                    } />
                    
                    {/* Admin routes - require admin/moderator role */}
                    <Route path="/admin" element={
                      <ProtectedAdminRoute>
                        <AdminLayout />
                      </ProtectedAdminRoute>
                    }>
                      <Route index element={<AdminDashboard />} />
                      <Route path="reports" element={<ReportsPage />} />
                      <Route path="moderation" element={<div>Moderation Page - Coming Soon</div>} />
                      <Route path="users" element={<div>Users Management - Coming Soon</div>} />
                      <Route path="analytics" element={<div>Analytics - Coming Soon</div>} />
                      <Route path="settings" element={<div>Settings - Coming Soon</div>} />
                    </Route>
                    
                    {/* Public routes */}
                    <Route path="/industry-glossary" element={
                      <Layout>
                        <IndustryGlossary />
                      </Layout>
                    } />
                    <Route path="/industry-analysis" element={
                      <Layout>
                        <IndustryAnalysis />
                      </Layout>
                    } />
                    <Route path="/industry-analysis/plastic-packaging" element={
                      <Layout>
                        <PlasticPackaging />
                      </Layout>
                    } />
                    <Route path="/industry-taxonomy" element={
                      <Layout>
                        <IndustryTaxonomy />
                      </Layout>
                    } />
                    <Route path="/methodology" element={
                      <Layout>
                        <Methodology />
                      </Layout>
                    } />
                    <Route path="/reference" element={
                      <Layout>
                        <Reference />
                      </Layout>
                    } />
                    {/* Redirect old routes to new combined page */}
                    <Route path="/reports" element={<Navigate to="/reports-analytics" replace />} />
                    <Route path="/analysis" element={<Navigate to="/reports-analytics" replace />} />
                    {/* Only catch-all for undefined app routes, not static files */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  <AccessibilityPanel />
                  <FloatingActionButton />
                </BrowserRouter>
              </TooltipProvider>
            </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
