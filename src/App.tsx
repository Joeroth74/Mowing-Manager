
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import ClientForm from "./pages/ClientForm";
import Jobs from "./pages/Jobs";
import JobForm from "./pages/JobForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Client routes */}
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/new" element={<ClientForm />} />
          <Route path="/clients/:id" element={<ClientDetail />} />
          <Route path="/clients/edit/:id" element={<ClientForm />} />
          
          {/* Job routes */}
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/new" element={<JobForm />} />
          <Route path="/jobs/new/:clientId" element={<JobForm />} />
          <Route path="/jobs/edit/:id" element={<JobForm />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
