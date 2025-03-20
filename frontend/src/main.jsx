import React from "react";
import { createRoot } from "react-dom/client"; // Correção na importação
import App from "./components/App";
import { GastosProvider } from "./components/GastosContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GastosProvider>
      <App />
    </GastosProvider>
  </React.StrictMode>
);
