import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Rect, Circle, Text, Transformer } from "react-konva";
import useCanvasTools from "./hooks/useCanvasTools";
import "./app.css";
import GitHubIcon from "@mui/icons-material/GitHub";
import BrushIcon from "@mui/icons-material/Brush";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import AutoFixOffIcon from "@mui/icons-material/AutoFixOff";
import Redo from "@mui/icons-material/Redo";
import Undo from "@mui/icons-material/Undo";
import Minus from "@mui/icons-material/Remove";
import Plus from "@mui/icons-material/Add";
import Logo from "./assets/Icon128.png";
import LeftToolbar from "./components/LeftToolbar";

export default function App() {
  const canvas = useCanvasTools({ width: 1200, height: 800 });
  const { refs, state, actions } = canvas;
  const stageRef = refs.stageRef;
  const layerRef = refs.layerRef;
  const transformerRef = useRef(null);
  const isDrawingRef = useRef(false);
  const [selectedId, setSelectedId] = useState(null);

  // local zoom state
  const [zoom, setZoom] = useState(1);
  // canvas size state
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleResize() {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setCanvasSize({
          width: Math.max(400, rect.width - 40),
          height: Math.max(300, rect.height - 40),
        });
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const stage = stageRef && stageRef.current;
    const tr = transformerRef && transformerRef.current;
    if (!tr || !stage) return;
    if (selectedId) {
      const node = stage.findOne(`#shape-${selectedId}`);
      if (node) {
        tr.nodes([node]);
        tr.getLayer().batchDraw();
      } else {
        tr.nodes([]);
        tr.getLayer().batchDraw();
      }
    } else {
      tr.nodes([]);
      tr.getLayer().batchDraw();
    }
  }, [selectedId, stageRef, state.objects]);

  const localActions = {
    ...actions,
    selectTool: (name) => {
      actions.setTool(name);
      console.log("Tool selected", name);
    },
    setBrushSize: (e) => actions.setBrushSize(e),
    onColorChange: (e) => actions.setColor(e),
    onAddTextToShape: () => console.log("Add text to shape (placeholder)"),
    onAddTextBox: () => console.log("Add text box (placeholder)"),
    onFontSizeChange: (e) => actions.setFontSize(Number(e.target.value)),
    onEraser: () => {
      actions.setTool("eraser");
      setSelectedId(null);
      console.log("Eraser selected");
    },
    onBringForward: (id) => {
      if (id) actions.bringForward(id);
    },
    onSendBackward: (id) => {
      if (id) actions.sendBackward(id);
    },
    onUndo: () => actions.undo(),
    onRedo: () => actions.redo(),
    onZoomIn: () => setZoom((z) => Math.min(4, z + 0.1)),
    onZoomOut: () => setZoom((z) => Math.max(0.1, z - 0.1)),
    onFitToScreen: () => setZoom(1),
    onExport: () => {
      const json = actions.exportToJSON();
      console.log("Export JSON:", json);
      try {
        navigator.clipboard && navigator.clipboard.writeText(json);
      } catch (err) {
        console.warn("clipboard write failed", err);
      }
    },
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <img src={Logo} className="logo" />
          SketchBoard by SchoolApp.sg
        </div>
        <div className="top-controls">
          <div className="group">
            <button className="icon-btn" onClick={localActions.onUndo} title="Undo">
              <Undo />
            </button>
            <button className="icon-btn" onClick={localActions.onRedo} title="Redo">
              <Redo />
            </button>
          </div>
          <div className="group">
            <button className="icon-btn" onClick={localActions.onZoomOut} title="Zoom out">
              <Minus />
            </button>
            <span className="zoom-level">{Math.round(zoom * 100)}%</span>
            <button className="icon-btn" onClick={localActions.onZoomIn} title="Zoom in">
              <Plus />
            </button>
          </div>
        </div>
      </header>

      <div className="workspace">
        <LeftToolbar state={{ ...state }} actions={localActions} />
        <main className="canvas-area">
          <div className="canvas-toolbar">
            <div className="breadcrumbs">Canvas • Untitled</div>
            <div className="canvas-actions">
              <button onClick={localActions.onFitToScreen}>Fit</button>
              <button onClick={localActions.onZoomIn}>+</button>
              <button onClick={localActions.onZoomOut}>−</button>
              <button onClick={localActions.onExport}>Export JSON</button>
            </div>
          </div>

          <div className="canvas-wrapper" id="canvasWrapper" ref={wrapperRef}>
            <Stage
              width={canvasSize.width}
              height={canvasSize.height}
              ref={stageRef}
              scaleX={zoom}
              scaleY={zoom}
              onMouseDown={(e) => {
                if (state.tool && state.tool !== "brush") return;
                isDrawingRef.current = true;
                const pos = e.target.getStage().getPointerPosition();
                actions.startLine(pos);
              }}
              onMouseMove={(e) => {
                if (!isDrawingRef.current) return;
                const pos = e.target.getStage().getPointerPosition();
                actions.addPointToLine(pos);
              }}
              onMouseUp={() => {
                if (isDrawingRef.current) {
                  isDrawingRef.current = false;
                  actions.finishLine();
                }
              }}
            >
              <Layer ref={layerRef}>
                {state.lines.map((ln) => (
                  <Line
                    key={ln.id}
                    points={ln.points}
                    stroke={ln.stroke}
                    strokeWidth={ln.strokeWidth}
                    tension={0.5}
                    lineCap={ln.lineCap}
                    lineJoin={ln.lineJoin}
                  />
                ))}
                {state.objects.map((o) => {
                  if (o.type === "rect") {
                    return (
                      <Rect
                        id={`shape-${o.id}`}
                        key={o.id}
                        x={o.x - (o.width || 0) / 2}
                        y={o.y - (o.height || 0) / 2}
                        width={o.width}
                        height={o.height}
                        fill={o.fill}
                        stroke={o.stroke}
                        strokeWidth={o.strokeWidth || 2}
                        draggable
                        onClick={() => setSelectedId(o.id)}
                        onDragEnd={(e) =>
                          actions.updateObject({ ...o, x: e.target.x() + (o.width || 0) / 2, y: e.target.y() + (o.height || 0) / 2 })
                        }
                      />
                    );
                  }
                  if (o.type === "circle") {
                    return (
                      <Circle
                        id={`shape-${o.id}`}
                        key={o.id}
                        x={o.x}
                        y={o.y}
                        radius={Math.max((o.width || 60) / 2, 10)}
                        fill={o.fill}
                        stroke={o.stroke}
                        strokeWidth={o.strokeWidth || 2}
                        draggable
                        onClick={() => setSelectedId(o.id)}
                        onDragEnd={(e) => actions.updateObject({ ...o, x: e.target.x(), y: e.target.y() })}
                      />
                    );
                  }
                  if (o.type === "text") {
                    return (
                      <Text
                        id={`shape-${o.id}`}
                        key={o.id}
                        x={o.x - 60}
                        y={o.y - (o.fontSize || 14)}
                        text={o.text}
                        fontSize={o.fontSize}
                        fontFamily={o.fontFamily}
                        fill={o.fill}
                        draggable
                        onClick={() => setSelectedId(o.id)}
                        onDragEnd={(e) => actions.updateObject({ ...o, x: e.target.x() + 60, y: e.target.y() + (o.fontSize || 14) })}
                      />
                    );
                  }
                  return null;
                })}
                <Transformer ref={transformerRef} rotateEnabled={false} />
              </Layer>
            </Stage>
          </div>
        </main>
      </div>

      <footer className="bottombar">
        <GitHubIcon fontSize="large" color="secondary" />
        <div>Ready • {state.lines.length} elements</div>
        <div className="help">Use brush to draw, Undo/Redo works on strokes. Export copies JSON to clipboard.</div>
      </footer>
    </div>
  );
}
