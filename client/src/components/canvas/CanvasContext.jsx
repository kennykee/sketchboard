import React, { createContext, useState, useCallback, useRef, useEffect } from "react";
import { createLineActions } from "./actions/linesTools";
import { createObjectActions } from "./actions/objectsTools";
import { createExportActions } from "./actions/exportTools";

const CanvasContext = createContext(null);

const CanvasProvider = ({ children }) => {
  const stageRef = useRef(null);
  const layerRef = useRef(null);

  const [tool, setTool] = useState("brush");
  const [brushSize, setBrushSize] = useState(5);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(16);
  const [fillColor, setFillColor] = useState("#B3E5FC");
  const [strokeColor, setStrokeColor] = useState("#0288D1");
  const [opacity, setOpacity] = useState(1);
  const [lines, setLines] = useState([]);
  const [objects, setObjects] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [canvasSize, setCanvasSize] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [recordName, setRecordName] = useState("Untitled");

  const width = canvasSize ? canvasSize.width : 1200;
  const height = canvasSize ? canvasSize.height : 800;

  const undo = useCallback(() => {
    setHistoryIndex((idx) => {
      const newIdx = Math.max(0, idx - 1);
      const snap = history[newIdx];
      if (snap) {
        setLines(JSON.parse(JSON.stringify(snap.lines)));
        setObjects(JSON.parse(JSON.stringify(snap.objects)));
      }
      return newIdx;
    });
  }, [history]);

  const redo = useCallback(() => {
    setHistoryIndex((idx) => {
      const newIdx = Math.min(history.length - 1, idx + 1);
      const snap = history[newIdx];
      if (snap) {
        setLines(JSON.parse(JSON.stringify(snap.lines)));
        setObjects(JSON.parse(JSON.stringify(snap.objects)));
      }
      return newIdx;
    });
  }, [history]);

  const getLines = useCallback(() => lines, [lines]);
  const getObjects = useCallback(() => objects, [objects]);
  const getColor = useCallback(() => strokeColor, [strokeColor]);
  const getBrushSize = useCallback(() => brushSize, [brushSize]);
  const getFontSize = useCallback(() => fontSize, [fontSize]);
  const getFontFamily = useCallback(() => fontFamily, [fontFamily]);
  const pushHistory = useCallback(
    (nextLines, nextObjects) => {
      const snapshot = JSON.parse(JSON.stringify({ lines: nextLines || getLines(), objects: nextObjects || getObjects() }));
      setHistory((h) => {
        // Always use latest historyIndex
        const idx = historyIndex;
        const truncated = h.slice(0, idx + 1);
        return [...truncated, snapshot];
      });
      setHistoryIndex((i) => i + 1);
    },
    [getLines, getObjects, historyIndex]
  );

  // Push initial state to history on mount
  useEffect(() => {
    setHistory([JSON.parse(JSON.stringify({ lines, objects }))]);
    setHistoryIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { startLine, addPointToLine, finishLine, removeLineAtPoint } = createLineActions({
    getLines,
    setLines,
    getObjects,
    pushHistory,
    getColor,
    getBrushSize,
  });
  const {
    addShape,
    addRectangle,
    addCircle,
    addTriangle,
    addArrow,
    addTextBox,
    removeObjectAtPoint,
    bringForward,
    sendBackward,
    updateObject,
  } = createObjectActions({
    setObjects,
    pushHistory,
    getLines,
    getColor,
    getFontSize,
    getFontFamily,
  });
  const { exportToJSON } = createExportActions({ stageRef, getLines, getObjects, width, height });
  const clear = useCallback(() => {
    setLines([]);
    setObjects([]);
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

  const refs = { stageRef, layerRef };

  const state = {
    tool,
    brushSize,
    fontFamily,
    fontSize,
    fillColor,
    strokeColor,
    opacity,
    lines,
    objects,
    historyIndex,
    history,
    zoom,
    canvasSize,
    selectedId,
    recordName,
  };

  const actions = {
    setTool,
    setBrushSize,
    setFontFamily,
    setFontSize,
    setFillColor,
    setStrokeColor,
    setOpacity,
    startLine,
    addPointToLine,
    finishLine,
    removeLineAtPoint,
    undo,
    redo,
    clear,
    addShape,
    addRectangle,
    addCircle,
    addTriangle,
    addArrow,
    addTextBox,
    removeObjectAtPoint,
    bringForward,
    sendBackward,
    updateObject,
    exportToJSON,
    setZoom,
    setCanvasSize,
    setSelectedId,
    setHistory,
    setHistoryIndex,
    setRecordName,
  };

  return <CanvasContext.Provider value={{ refs, state, actions }}>{children}</CanvasContext.Provider>;
};

export { CanvasContext, CanvasProvider };
