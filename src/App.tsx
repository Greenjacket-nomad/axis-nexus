import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SubscriptionModalProvider } from "@/contexts/SubscriptionModalContext";
import { AIChatProvider } from "@/contexts/AIChatContext";
import { GlobalSubscriptionModal } from "@/components/contact/GlobalSubscriptionModal";
import { AIChatModal } from "@/components/ai-chat/AIChatModal";
import { ChatTriggerButton } from "@/components/ai-chat/ChatTriggerButton";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SubscriptionModalProvider>
        <AIChatProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <GlobalSubscriptionModal />
          <AIChatModal />
          <ChatTriggerButton variant="floating" />
        </AIChatProvider>
      </SubscriptionModalProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
