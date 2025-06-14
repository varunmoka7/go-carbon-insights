import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
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
import Analysis from "./pages/Analysis";
import Methodology from "./pages/Methodology";
import Reference from "./pages/Reference";
import Reports from "./pages/Reports";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Contact from "./pages/Contact";
// import Funding from "./pages/Funding"; // Disabled for demo mode
import AccessibilityPanel from "./components/AccessibilityPanel";
import FloatingActionButton from "./components/FloatingActionButton";

const queryClient = new QueryClient();

const App = () => {
  // Check if the current path is for static files that should not be handled by React Router
  const isStaticFile = () => {
    const path = window.location.pathname;
    console.log('Checking path:', path); // Debug log
    
    // Check for .well-known paths first (most important)
    if (path.startsWith('/.well-known/')) {
      console.log('Detected .well-known path, redirecting to static file');
      return true;
    }
    
    // Check for funding.json
    if (path === '/funding.json') {
      console.log('Detected funding.json, redirecting to static file');
      return true;
    }
    
    // Other static file extensions
    if (path.endsWith('.json') || 
        path.endsWith('.txt') || 
        path.endsWith('.xml') ||
        path.endsWith('.ico') ||
        path.endsWith('.png') ||
        path.endsWith('.jpg') ||
        path.endsWith('.svg')) {
      console.log('Detected static file extension, redirecting to static file');
      return true;
    }
    
    return false;
  };

  // If it's a static file request, don't render the React app
  if (isStaticFile()) {
    console.log('Static file detected, reloading to serve static content');
    // Force a hard reload to let the server handle the static file
    window.location.reload();
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
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
                {/* Funding route disabled for demo mode */}
                {/* <Route path="/funding" element={
                  <Layout>
                    <Funding />
                  </Layout>
                } /> */}
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
                <Route path="/reports" element={
                  <Layout>
                    <Reports />
                  </Layout>
                } />
                <Route path="/analysis" element={
                  <Layout>
                    <Analysis />
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
                {/* Only catch-all for undefined app routes, not static files */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <AccessibilityPanel />
              <FloatingActionButton />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
