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
    // push a history snapshot for undo/redo
    pushHistory(getLines(), getObjects());
  }

  return { startLine, addPointToLine, finishLine };
}
