
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
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
import AccessibilityPanel from "./components/AccessibilityPanel";
import FloatingActionButton from "./components/FloatingActionButton";

const queryClient = new QueryClient();

const App = () => (
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
              <Route path="/home" element={
                <ProtectedRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/tracking" element={
                <ProtectedRoute>
                  <Layout>
                    <Tracking />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/scope1" element={
                <ProtectedRoute>
                  <Layout>
                    <Scope1 />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/scope2" element={
                <ProtectedRoute>
                  <Layout>
                    <Scope2 />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/scope3" element={
                <ProtectedRoute>
                  <Layout>
                    <Scope3 />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/decarbonization" element={
                <ProtectedRoute>
                  <Layout>
                    <Decarbonization />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Layout>
                    <Reports />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/analysis" element={
                <ProtectedRoute>
                  <Layout>
                    <Analysis />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/methodology" element={
                <ProtectedRoute>
                  <Layout>
                    <Methodology />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reference" element={
                <ProtectedRoute>
                  <Layout>
                    <Reference />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<Landing />} />
            </Routes>
            <AccessibilityPanel />
            <FloatingActionButton />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
