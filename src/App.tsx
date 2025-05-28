
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
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
              <div className="p-8 text-center text-gray-600">Reports page coming soon</div>
            </Layout>
          } />
          <Route path="/analysis" element={
            <Layout>
              <div className="p-8 text-center text-gray-600">Analysis page coming soon</div>
            </Layout>
          } />
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
