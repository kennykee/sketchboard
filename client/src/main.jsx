import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { CanvasProvider } from "./components/canvas/CanvasContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CanvasProvider>
      <App />
    </CanvasProvider>
  </StrictMode>
);
