import "@/app/global.css";

import App from "@/app/App";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider, SocketIoProvider, StorageAdapter } from "@package/react/providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const queryClient = new QueryClient();

const storage: StorageAdapter = {
    getItem: async () => await window.api.invoke("auth:get-token"),
    removeItem: async () => await window.api.invoke("auth:clear-token"),
    setItem: async (token) => await window.api.invoke("auth:set-token", { token }),
};

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <QueryClientProvider client={queryClient}>
                <AuthProvider storage={storage}>
                    <SocketIoProvider>
                        <App />
                    </SocketIoProvider>
                </AuthProvider>
            </QueryClientProvider>
        </ThemeProvider>
    </StrictMode>,
);
