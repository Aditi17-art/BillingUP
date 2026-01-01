import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import PartyStatement from "./pages/PartyStatement";
import PartySettings from "./pages/PartySettings";
import InviteParty from "./pages/InviteParty";
import PartywisePnL from "./pages/PartywisePnL";
import AllPartiesReport from "./pages/AllPartiesReport";
import PartyReminders from "./pages/PartyReminders";
import WhatsAppMarketing from "./pages/WhatsAppMarketing";
import ImportParty from "./pages/ImportParty";
import Items from "./pages/Items";
import Menu from "./pages/Menu";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import BusinessProfile from "./pages/BusinessProfile";
import AddSale from "./pages/AddSale";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/items" element={<ProtectedRoute><Items /></ProtectedRoute>} />
            <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/settings/party" element={<ProtectedRoute><PartySettings /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><BusinessProfile /></ProtectedRoute>} />
            <Route path="/add-sale" element={<ProtectedRoute><AddSale /></ProtectedRoute>} />
            <Route path="/parties/statement" element={<ProtectedRoute><PartyStatement /></ProtectedRoute>} />
            <Route path="/parties/invite" element={<ProtectedRoute><InviteParty /></ProtectedRoute>} />
            <Route path="/parties/pnl" element={<ProtectedRoute><PartywisePnL /></ProtectedRoute>} />
            <Route path="/parties/report" element={<ProtectedRoute><AllPartiesReport /></ProtectedRoute>} />
            <Route path="/parties/reminders" element={<ProtectedRoute><PartyReminders /></ProtectedRoute>} />
            <Route path="/parties/whatsapp" element={<ProtectedRoute><WhatsAppMarketing /></ProtectedRoute>} />
            <Route path="/parties/import" element={<ProtectedRoute><ImportParty /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
