
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import ScamRankings from "./pages/ScamRankings";
import CommunityAlerts from "./pages/CommunityAlerts";
import Help from "./pages/Help";
import Moderation from "./pages/Moderation";
import Appeal from "./pages/Appeal";
import AuthPage from "./components/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <Layout showHeader={false} showFooter={true} showBottomNav={true}>
                  <Index />
                </Layout>
              } />
              <Route path="/auth" element={
                <Layout showHeader={false} showFooter={false} showBottomNav={false}>
                  <AuthPage onBack={() => window.history.back()} />
                </Layout>
              } />
              <Route path="/about" element={
                <Layout>
                  <About />
                </Layout>
              } />
              <Route path="/contact" element={
                <Layout>
                  <Contact />
                </Layout>
              } />
              <Route path="/privacy" element={
                <Layout>
                  <Privacy />
                </Layout>
              } />
              <Route path="/safety" element={<Navigate to="/tro-giup" replace />} />
              <Route path="/scam-rankings" element={
                <Layout>
                  <ScamRankings />
                </Layout>
              } />
              <Route path="/community-alerts" element={
                <Layout>
                  <CommunityAlerts />
                </Layout>
              } />
              <Route path="/tro-giup" element={
                <Layout>
                  <Help />
                </Layout>
              } />
              <Route path="/authorities" element={<Navigate to="/tro-giup" replace />} />
              <Route path="/khieu-nai" element={
                <Layout>
                  <Appeal />
                </Layout>
              } />
              <Route path="/kiem-duyet" element={
                <Layout>
                  <Moderation />
                </Layout>
              } />
              <Route path="*" element={
                <Layout>
                  <NotFound />
                </Layout>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
