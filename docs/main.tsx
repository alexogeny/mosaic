import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

import {
  CommandPalette,
  ShortcutsProvider,
  ThemeProvider,
  ToastProvider,
} from "@mosaic";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider storageKey="mosaic-docs-theme">
      <ShortcutsProvider>
        <ToastProvider>
          <CommandPalette>
            <App />
          </CommandPalette>
        </ToastProvider>
      </ShortcutsProvider>
    </ThemeProvider>
  </StrictMode>,
);
