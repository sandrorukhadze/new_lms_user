// src/main.tsx
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import KeycloakProvider from "./keycloack/KeycloakProvider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <KeycloakProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </KeycloakProvider>
);
