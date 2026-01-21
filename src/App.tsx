import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/licenses" element={<Licenses />} />
            <Route path="/number-ranges" element={<NumberRanges />} />
            <Route path="/subscribers" element={<Subscribers />} />
            <Route path="/violations" element={<Violations />} />
            <Route path="/upload-data" element={<UploadData />} />
            <Route path="/enterprises" element={<Enterprises />} />
            <Route path="/license-types" element={<LicenseTypes />} />
            <Route path="/service-types" element={<ServiceTypes />} />
            <Route path="/users" element={<Users />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
