
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/auth/AuthContext";
import Index from "./pages/Index";
import EmbedChat from "./pages/EmbedChat";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ChatSettingsList from "./pages/admin/ChatSettingsList";
import ChatSettingsForm from "./pages/admin/ChatSettingsForm";
import Auth from "./pages/Auth";
import AuthGuard from "./components/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/embed/chat" element={<EmbedChat />} />
            
            {/* Protected Admin routes */}
            <Route path="/admin" element={
              <AuthGuard>
                <AdminLayout />
              </AuthGuard>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="chats" element={<ChatSettingsList />} />
              <Route path="chats/new" element={<ChatSettingsForm />} />
              <Route path="chats/:id" element={<ChatSettingsForm />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
