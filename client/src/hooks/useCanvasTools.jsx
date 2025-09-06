import { useCallback, useRef, useState } from "react";
import { createLineActions } from "./linesTools";
import { createObjectActions } from "./objectsTools";
import { createExportActions } from "./exportTools";

export default function useCanvasTools(opts = {}) {
  const { width = 1200, height = 800 } = opts;
  const stageRef = useRef(null);
  const layerRef = useRef(null);

  const [tool, setTool] = useState("brush");
  const [brushSize, setBrushSize] = useState(4);
  const [color, setColor] = useState("#1f6feb");
  const [fontFamily, setFontFamily] = useState("Inter, system-ui, sans-serif");
  const [fontSize, setFontSize] = useState(14);
  const [fillColor, setFillColor] = useState("#ffffff");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [opacity, setOpacity] = useState(1);

  const [lines, setLines] = useState([]);
  const [objects, setObjects] = useState([]);

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const getLines = useCallback(() => lines, [lines]);
  const getObjects = useCallback(() => objects, [objects]);
  const getColor = useCallback(() => color, [color]);
  const getBrushSize = useCallback(() => brushSize, [brushSize]);
  const getFontSize = useCallback(() => fontSize, [fontSize]);
  const getFontFamily = useCallback(() => fontFamily, [fontFamily]);

  const pushHistory = useCallback(
    (nextLines, nextObjects) => {
      const snapshot = JSON.parse(JSON.stringify({ lines: nextLines || getLines(), objects: nextObjects || getObjects() }));
      setHistory((h) => {
        const truncated = h.slice(0, historyIndex + 1);
        return [...truncated, snapshot];
      });
      setHistoryIndex((i) => i + 1);
    },
    [getLines, getObjects, historyIndex]
  );

  const { startLine, addPointToLine, finishLine } = createLineActions({
    getLines,
    setLines,
    getObjects,
    pushHistory,
    getColor,
    getBrushSize,
  });
  const { addShape, addTextBox, removeObjectAtPoint, bringForward, sendBackward, updateObject } = createObjectActions({
    setObjects,
    pushHistory,
    getLines,
    getColor,
    getFontSize,
    getFontFamily,
  });
  const { exportToJSON } = createExportActions({ stageRef, getLines, getObjects, width, height });

  const undo = useCallback(() => {
    setHistoryIndex((idx) => {
      const newIdx = Math.max(-1, idx - 1);
      if (newIdx === -1) {
        setLines([]);
        setObjects([]);
      } else {
        const snap = history[newIdx];
        if (snap) {
          setLines(JSON.parse(JSON.stringify(snap.lines)));
          setObjects(JSON.parse(JSON.stringify(snap.objects)));
        }
      }
      return newIdx;
    });
  }, [history]);

  const redo = useCallback(() => {
    setHistoryIndex((idx) => {
      const newIdx = Math.min(history.length - 1, idx + 1);
      if (newIdx >= 0 && history[newIdx]) {
        const snap = history[newIdx];
        setLines(JSON.parse(JSON.stringify(snap.lines)));
        setObjects(JSON.parse(JSON.stringify(snap.objects)));
      }
      return newIdx;
    });
  }, [history]);

  const clear = useCallback(() => {
    setLines([]);
    setObjects([]);
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

  return {
    refs: { stageRef, layerRef },
    state: {
      tool,
      brushSize,
      color,
      fontFamily,
      fontSize,
      fillColor,
      strokeColor,
      opacity,
      lines,
      objects,
      historyIndex,
      history,
    },
    actions: {
      setTool,
      setBrushSize,
      setColor,
      setFontFamily,
      setFontSize,
      setFillColor,
      setStrokeColor,
      setOpacity,
      startLine,
      addPointToLine,
      finishLine,
      undo,
      redo,
      clear,
      addShape,
      addTextBox,
      removeObjectAtPoint,
      bringForward,
      sendBackward,
      updateObject,
      exportToJSON,
    },
  };
}
