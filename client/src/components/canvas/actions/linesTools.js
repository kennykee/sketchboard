export function createLineActions({ getLines, setLines, getObjects, pushHistory, getColor, getBrushSize }) {
  function startLine(point) {
    const newLine = {
      id: Date.now(),
      points: [point.x, point.y],
      stroke: getColor(),
      strokeWidth: getBrushSize(),
      lineCap: "round",
      lineJoin: "round",
    };
    setLines((l) => [...l, newLine]);
  }

  function addPointToLine(point) {
    setLines((l) => {
      if (l.length === 0) return l;
      const copy = l.slice();
      const last = { ...copy[copy.length - 1] };
      last.points = last.points.concat([point.x, point.y]);
      copy[copy.length - 1] = last;
      return copy;
    });
  }

  function finishLine() {
    pushHistory(getLines(), getObjects());
  }

  // Helper: check if point (px, py) is near a segment (x1, y1)-(x2, y2)
  function isPointNearLine(px, py, x1, y1, x2, y2, threshold = 8) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) param = dot / len_sq;
    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    const dx = px - xx;
    const dy = py - yy;
    return dx * dx + dy * dy <= threshold * threshold;
  }

  function removeLineAtPoint(point) {
    setLines((lines) => {
      for (let i = lines.length - 1; i >= 0; i--) {
        const ln = lines[i];
        const pts = ln.points;
        for (let j = 0; j < pts.length - 2; j += 2) {
          if (isPointNearLine(point.x, point.y, pts[j], pts[j + 1], pts[j + 2], pts[j + 3])) {
            const next = lines.slice();
            next.splice(i, 1);
            pushHistory(next, getObjects());
            return next;
          }
        }
      }
      return lines;
    });
  }

  return { startLine, addPointToLine, finishLine, removeLineAtPoint };
}
