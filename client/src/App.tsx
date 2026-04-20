import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "@/pages/MainLayout";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={MainLayout} />
      <Route component={NotFound} />
    </Switch>
  );
}

function ThemeApplier() {
  const { settings } = useSettings();
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", settings.colorMode);
  }, [settings.colorMode]);
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeApplier />
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;