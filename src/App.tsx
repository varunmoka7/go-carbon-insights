
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { DonationProvider } from "./contexts/DonationContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import Layout from "./components/Layout";
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
import About from "./pages/About";
import Contact from "./pages/Contact";
import Donate from "./pages/Donate";
import IndustryAnalysis from "./pages/IndustryAnalysis";
import PlasticPackaging from "./pages/PlasticPackaging";
import AccessibilityPanel from "./components/AccessibilityPanel";
import FloatingActionButton from "./components/FloatingActionButton";
import NavigationDebugger from "./components/NavigationDebugger";
import NavigationLoader from "./components/NavigationLoader";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <DonationProvider>
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
                    <Route path="/donate" element={
                      <Layout>
                        <Donate />
                      </Layout>
                    } />
                    {/* Demo mode: All pages accessible without authentication */}
                    <Route path="/home" element={
                      <Layout>
                        <Home />
                      </Layout>
                    } />
                    <Route path="/dashboard" element={
                      <Layout>
                        <Dashboard />
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
                    <Route path="/tracking" element={
                      <Layout>
                        <Tracking />
                      </Layout>
                    } />
                    <Route path="/scope1" element={
                      <Layout>
                        <Scope1 />
                      </Layout>
                    } />
                    <Route path="/scope2" element={
                      <Layout>
                        <Scope2 />
                      </Layout>
                    } />
                    <Route path="/scope3" element={
                      <Layout>
                        <Scope3 />
                      </Layout>
                    } />
                    <Route path="/decarbonization" element={
                      <Layout>
                        <Decarbonization />
                      </Layout>
                    } />
                    <Route path="/profile" element={
                      <Layout>
                        <Profile />
                      </Layout>
                    } />
                    <Route path="/reports-analytics" element={
                      <Layout>
                        <ReportsAnalytics />
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
          </DonationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
