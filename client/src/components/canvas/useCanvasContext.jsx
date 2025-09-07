import { useContext } from "react";
import { CanvasContext } from "./CanvasContext";

export const useCanvasContext = () => {
  const ctx = useContext(CanvasContext);
  if (!ctx) throw new Error("useCanvas must be used inside CanvasProvider");
  return ctx;
};
