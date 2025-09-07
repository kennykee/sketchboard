import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Line, Rect, Circle, Text, Transformer, Line as KonvaLine, Arrow as KonvaArrow } from "react-konva";
import { useCanvasContext } from "./useCanvasContext";

export default function CanvasBoard() {
  const canvasContext = useCanvasContext();
  const width = canvasContext.state.canvasSize ? canvasContext.state.canvasSize.width : 800;
  const height = canvasContext.state.canvasSize ? canvasContext.state.canvasSize.height : 600;
  const zoom = canvasContext.state.zoom || 1;
  const selectedId = canvasContext.state.selectedId;
  const setSelectedId = canvasContext.actions.setSelectedId;

  const transformerRef = useRef(null);
  const isDrawingRef = useRef(false);
  // For rectangle drag-to-draw
  const [rectPreview, setRectPreview] = useState(null);
  const rectStartRef = useRef(null);
  // For circle drag-to-draw
  const [circlePreview, setCirclePreview] = useState(null);
  const circleStartRef = useRef(null);
  // For triangle drag-to-draw
  const [trianglePreview, setTrianglePreview] = useState(null);
  const triangleStartRef = useRef(null);
  // For arrow drag-to-draw
  const [arrowPreview, setArrowPreview] = useState(null);
  const arrowStartRef = useRef(null);
  // For editing text
  const [editingTextId, setEditingTextId] = useState(null);
  const [editingTextValue, setEditingTextValue] = useState("");

  const state = canvasContext.state;
  const actions = canvasContext.actions;
  const stageRef = useRef(null);
  const layerRef = useRef(null);

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

  return (
    <Stage
      width={width}
      height={height}
      ref={stageRef}
      scaleX={zoom}
      scaleY={zoom}
      onMouseDown={(e) => {
        const pos = e.target.getStage().getPointerPosition();
        if (state.tool === "eraser") {
          actions.removeObjectAtPoint(pos);
          actions.removeLineAtPoint(pos);
          return;
        }
        if (state.tool === "rectangle") {
          isDrawingRef.current = true;
          rectStartRef.current = pos;
          setRectPreview({ x: pos.x, y: pos.y, width: 0, height: 0 });
        } else if (state.tool === "circle") {
          isDrawingRef.current = true;
          circleStartRef.current = pos;
          setCirclePreview({ x: pos.x, y: pos.y, radius: 0 });
        } else if (state.tool === "triangle") {
          isDrawingRef.current = true;
          triangleStartRef.current = pos;
          setTrianglePreview({ x: pos.x, y: pos.y, width: 0, height: 0 });
        } else if (state.tool === "arrow") {
          isDrawingRef.current = true;
          arrowStartRef.current = pos;
          setArrowPreview({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
        } else if (state.tool === "text") {
          // Place a text object at the clicked position
          actions.addTextBox({
            x: pos.x,
            y: pos.y,
            text: "Text",
            fontSize: state.fontSize,
            fontFamily: state.fontFamily,
            fill: state.fillColor,
          });
        } else if (!state.tool || state.tool === "brush") {
          isDrawingRef.current = true;
          actions.startLine(pos);
        }
      }}
      onMouseMove={(e) => {
        if (!isDrawingRef.current) return;
        const pos = e.target.getStage().getPointerPosition();
        if (state.tool === "rectangle" && rectStartRef.current) {
          const start = rectStartRef.current;
          setRectPreview({
            x: Math.min(start.x, pos.x),
            y: Math.min(start.y, pos.y),
            width: Math.abs(pos.x - start.x),
            height: Math.abs(pos.y - start.y),
          });
        } else if (state.tool === "circle" && circleStartRef.current) {
          const start = circleStartRef.current;
          const dx = pos.x - start.x;
          const dy = pos.y - start.y;
          const radius = Math.sqrt(dx * dx + dy * dy);
          setCirclePreview({ x: start.x, y: start.y, radius });
        } else if (state.tool === "triangle" && triangleStartRef.current) {
          const start = triangleStartRef.current;
          const width = pos.x - start.x;
          const height = pos.y - start.y;
          setTrianglePreview({ x: start.x, y: start.y, width, height });
        } else if (state.tool === "arrow" && arrowStartRef.current) {
          const start = arrowStartRef.current;
          setArrowPreview({ x1: start.x, y1: start.y, x2: pos.x, y2: pos.y });
        } else if (!state.tool || state.tool === "brush") {
          actions.addPointToLine(pos);
        }
      }}
      onMouseUp={(e) => {
        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;
        if (state.tool === "rectangle" && rectPreview && rectPreview.width > 2 && rectPreview.height > 2) {
          actions.addRectangle({
            x: rectPreview.x + rectPreview.width / 2,
            y: rectPreview.y + rectPreview.height / 2,
            width: rectPreview.width,
            height: rectPreview.height,
            fill: state.fillColor,
            stroke: state.strokeColor,
            strokeWidth: 2,
          });
        }
        if (state.tool === "circle" && circlePreview && circlePreview.radius > 2) {
          actions.addCircle({
            x: circlePreview.x,
            y: circlePreview.y,
            radius: circlePreview.radius,
            fill: state.fillColor,
            stroke: state.strokeColor,
            strokeWidth: 2,
          });
        }
        if (
          state.tool === "triangle" &&
          trianglePreview &&
          Math.abs(trianglePreview.width) > 2 &&
          Math.abs(trianglePreview.height) > 2
        ) {
          // Center and size
          const x = trianglePreview.x + trianglePreview.width / 2;
          const y = trianglePreview.y + trianglePreview.height / 2;
          actions.addTriangle({
            x,
            y,
            width: Math.abs(trianglePreview.width),
            height: Math.abs(trianglePreview.height),
            fill: state.fillColor,
            stroke: state.strokeColor,
            strokeWidth: 2,
          });
        }
        if (
          state.tool === "arrow" &&
          arrowPreview &&
          (Math.abs(arrowPreview.x2 - arrowPreview.x1) > 2 || Math.abs(arrowPreview.y2 - arrowPreview.y1) > 2)
        ) {
          actions.addArrow({
            x: (arrowPreview.x1 + arrowPreview.x2) / 2,
            y: (arrowPreview.y1 + arrowPreview.y2) / 2,
            width: Math.abs(arrowPreview.x2 - arrowPreview.x1),
            height: Math.abs(arrowPreview.y2 - arrowPreview.y1),
            points: [arrowPreview.x1, arrowPreview.y1, arrowPreview.x2, arrowPreview.y2],
            fill: state.fillColor,
            stroke: state.strokeColor,
            strokeWidth: 2,
          });
        }
        setRectPreview(null);
        rectStartRef.current = null;
        setCirclePreview(null);
        circleStartRef.current = null;
        setTrianglePreview(null);
        triangleStartRef.current = null;
        setArrowPreview(null);
        arrowStartRef.current = null;
        if (!state.tool || state.tool === "brush") {
          actions.finishLine();
        }

        {
          arrowPreview && state.tool === "arrow" && (
            <KonvaArrow
              points={[arrowPreview.x1, arrowPreview.y1, arrowPreview.x2, arrowPreview.y2]}
              fill={state.fillColor}
              stroke={state.strokeColor}
              strokeWidth={2}
              pointerLength={15}
              pointerWidth={15}
              opacity={0.4}
              dash={[8, 4]}
              listening={false}
            />
          );
        }
      }}
    >
      <Layer ref={layerRef}>
        {state.lines &&
          state.lines.map((ln) => (
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
        {rectPreview && state.tool === "rectangle" && (
          <Rect
            x={rectPreview.x}
            y={rectPreview.y}
            width={rectPreview.width}
            height={rectPreview.height}
            fill={state.fillColor}
            stroke={state.strokeColor}
            strokeWidth={2}
            opacity={0.4}
            dash={[8, 4]}
            listening={false}
          />
        )}
        {/* Circle preview while dragging */}
        {circlePreview && state.tool === "circle" && (
          <Circle
            x={circlePreview.x}
            y={circlePreview.y}
            radius={circlePreview.radius}
            fill={state.fillColor}
            stroke={state.strokeColor}
            strokeWidth={2}
            opacity={0.4}
            dash={[8, 4]}
            listening={false}
          />
        )}
        {state.objects &&
          state.objects.map((o) => {
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
                  onDragEnd={(e) => actions.updateObject({ ...o, x: e.target.x(), y: e.target.y() })}
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
                  radius={o.radius || 10}
                  fill={o.fill}
                  stroke={o.stroke}
                  strokeWidth={o.strokeWidth || 2}
                  draggable
                  onClick={() => setSelectedId(o.id)}
                  onDragEnd={(e) => actions.updateObject({ ...o, x: e.target.x(), y: e.target.y() })}
                />
              );
            }
            if (o.type === "triangle") {
              // o.points is [x1, y1, x2, y2, x3, y3]
              return (
                <KonvaLine
                  id={`shape-${o.id}`}
                  key={o.id}
                  points={o.points}
                  closed
                  fill={o.fill}
                  stroke={o.stroke}
                  strokeWidth={o.strokeWidth || 2}
                  draggable
                  onClick={() => setSelectedId(o.id)}
                  onDragEnd={(e) => actions.updateObject({ ...o, x: e.target.x(), y: e.target.y() })}
                />
              );
            }
            if (o.type === "arrow") {
              return (
                <KonvaArrow
                  id={`shape-${o.id}`}
                  key={o.id}
                  points={o.points}
                  fill={o.fill}
                  stroke={o.stroke}
                  strokeWidth={o.strokeWidth || 2}
                  pointerLength={o.pointerLength || 15}
                  pointerWidth={o.pointerWidth || 15}
                  draggable
                  onClick={() => setSelectedId(o.id)}
                  onDragEnd={(e) => actions.updateObject({ ...o, x: e.target.x(), y: e.target.y() })}
                />
              );
            }
            if (o.type === "text") {
              if (editingTextId === o.id) {
                // Render HTML input for editing
                return (
                  <foreignObject
                    key={o.id}
                    x={o.x - 60}
                    y={o.y - (o.fontSize || 14)}
                    width={120}
                    height={o.fontSize ? o.fontSize + 16 : 30}
                  >
                    <input
                      style={{
                        width: "100%",
                        fontSize: o.fontSize,
                        fontFamily: o.fontFamily,
                        color: o.fill,
                        border: "1px solid #888",
                        background: "#fff",
                        padding: 2,
                      }}
                      value={editingTextValue}
                      autoFocus
                      onChange={(e) => setEditingTextValue(e.target.value)}
                      onBlur={() => {
                        actions.updateObject({ ...o, text: editingTextValue });
                        setEditingTextId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          actions.updateObject({ ...o, text: editingTextValue });
                          setEditingTextId(null);
                        }
                      }}
                    />
                  </foreignObject>
                );
              }
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
                  onDblClick={() => {
                    setEditingTextId(o.id);
                    setEditingTextValue(o.text);
                  }}
                  onDragEnd={(e) => actions.updateObject({ ...o, x: e.target.x(), y: e.target.y() })}
                />
              );
            }
            return null;
          })}
        <Transformer ref={transformerRef} rotateEnabled={false} />
      </Layer>
    </Stage>
  );
}
