
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import SOPDashboard from "@/pages/SOPDashboard";
import SOPDetail from "@/pages/SOPDetail";
import UploadSOP from "@/pages/UploadSOP";
import CategoryManager from "@/pages/CategoryManager";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<SOPDashboard />} />
                  <Route path="/sop/:id" element={<SOPDetail />} />
                  <Route path="/upload" element={<UploadSOP />} />
                  <Route path="/categories" element={<CategoryManager />} />
                  <Route path="/profile" element={<div className="p-6">Profile coming soon...</div>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
