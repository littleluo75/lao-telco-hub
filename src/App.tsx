import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import Licenses from "./pages/Licenses";
import NumberRanges from "./pages/NumberRanges";
import Subscribers from "./pages/Subscribers";
import Violations from "./pages/Violations";
import UploadData from "./pages/UploadData";
import Enterprises from "./pages/Enterprises";
import LicenseTypes from "./pages/LicenseTypes";
import ServiceTypes from "./pages/ServiceTypes";
import Users from "./pages/Users";
import AuditLogs from "./pages/AuditLogs";
import Login from "./pages/Login";
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
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
            <Route path="/applications" element={<ProtectedRoute><MainLayout><Applications /></MainLayout></ProtectedRoute>} />
            <Route path="/licenses" element={<ProtectedRoute><MainLayout><Licenses /></MainLayout></ProtectedRoute>} />
            <Route path="/number-ranges" element={<ProtectedRoute><MainLayout><NumberRanges /></MainLayout></ProtectedRoute>} />
            <Route path="/subscribers" element={<ProtectedRoute><MainLayout><Subscribers /></MainLayout></ProtectedRoute>} />
            <Route path="/violations" element={<ProtectedRoute><MainLayout><Violations /></MainLayout></ProtectedRoute>} />
            <Route path="/upload-data" element={<ProtectedRoute><MainLayout><UploadData /></MainLayout></ProtectedRoute>} />
            <Route path="/enterprises" element={<ProtectedRoute><MainLayout><Enterprises /></MainLayout></ProtectedRoute>} />
            <Route path="/license-types" element={<ProtectedRoute><MainLayout><LicenseTypes /></MainLayout></ProtectedRoute>} />
            <Route path="/service-types" element={<ProtectedRoute><MainLayout><ServiceTypes /></MainLayout></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><MainLayout><Users /></MainLayout></ProtectedRoute>} />
            <Route path="/audit-logs" element={<ProtectedRoute><MainLayout><AuditLogs /></MainLayout></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
