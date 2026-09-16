import "@/assets/main.css";
import "./global.css";

import App from "@/app/App";
import { ThemeProvider } from "@/providers/theme-provider";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <App />
        </ThemeProvider>
    </StrictMode>,
);
