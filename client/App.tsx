import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MeritOne from "./pages/MeritOne";
import Interpret from "./pages/Interpret";
import AutomationSystem from "./pages/AutomationSystem";
import Movella from "./pages/Movella";
import NotFound from "./pages/NotFound";
import { ClerkProvider } from "@clerk/clerk-react";

const queryClient = new QueryClient();

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.error("❌ ERROR: Missing VITE_CLERK_PUBLISHABLE_KEY. The application will not function correctly without authentication. Please add it to your environment variables (local .env or AWS Amplify settings).");
}

const App = () => {
  if (!PUBLISHABLE_KEY) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 text-center">
        <div className="max-w-md p-8 rounded-xl border border-destructive/30 bg-destructive/5 shadow-2xl">
          <h1 className="text-2xl font-bold text-destructive mb-4">Configuration Required</h1>
          <p className="text-muted-foreground mb-6">
            The <code>VITE_CLERK_PUBLISHABLE_KEY</code> is missing from your environment variables.
          </p>
          <div className="text-left bg-black/5 p-4 rounded-lg mb-6 overflow-auto">
            <p className="text-sm font-semibold mb-2">How to fix:</p>
            <ol className="text-sm list-decimal list-inside space-y-1">
              <li>Go to your Clerk Dashboard</li>
              <li>Copy your Publishable Key</li>
              <li>Add it to your environment variables in your deployment settings</li>
            </ol>
          </div>
          <p className="text-xs text-muted-foreground">
            Once added, please redeploy your application.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/merit-one" element={<MeritOne />} />
              <Route path="/interpret" element={<Interpret />} />
              <Route path="/automation-system" element={<AutomationSystem />} />
              <Route path="/movella" element={<Movella />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
