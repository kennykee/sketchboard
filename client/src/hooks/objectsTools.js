// objectsTools.js
// Provides object manipulation actions for the canvas

export function createObjectActions({ setObjects, pushHistory, getLines, getColor, getFontSize, getFontFamily }) {
  function addShape(type, opts = {}) {
    const id = Date.now();
    const base = {
      id,
      type,
      x: opts.x || 600,
      y: opts.y || 400,
      width: opts.width || 160,
      height: opts.height || 100,
      fill: opts.fill || "#ffffff00",
      stroke: opts.stroke || "#000000",
      strokeWidth: opts.strokeWidth || 2,
    };
    const shape = { ...base, ...opts };
    setObjects((o) => {
      const next = [...o, shape];
      pushHistory(getLines(), next);
      return next;
    });
  }

  function addTextBox(text = "Text") {
    const id = Date.now();
    const txt = {
      id,
      type: "text",
      x: 620,
      y: 420,
      text,
      fontSize: getFontSize(),
      fontFamily: getFontFamily(),
      fill: getColor(),
    };
    setObjects((o) => {
      const next = [...o, txt];
      pushHistory(getLines(), next);
      return next;
    });
  }

  function removeObjectAtPoint(point) {
    setObjects((o) => {
      for (let i = o.length - 1; i >= 0; i--) {
        const item = o[i];
        const left = item.x - (item.width || 0) / 2;
        const top = item.y - (item.height || 0) / 2;
        const right = left + (item.width || 0);
        const bottom = top + (item.height || 0);
        if (item.type === "text") {
          const l = item.x - 60,
            r = item.x + 60,
            t = item.y - item.fontSize,
            b = item.y + 10;
          if (point.x >= l && point.x <= r && point.y >= t && point.y <= b) {
            const next = o.slice();
            next.splice(i, 1);
            pushHistory(getLines(), next);
            return next;
          }
        } else {
          if (point.x >= left && point.x <= right && point.y >= top && point.y <= bottom) {
            const next = o.slice();
            next.splice(i, 1);
            pushHistory(getLines(), next);
            return next;
          }
        }
      }
      return o;
    });
  }

  function bringForward(id) {
    setObjects((o) => {
      const idx = o.findIndex((it) => it.id === id);
      if (idx === -1 || idx === o.length - 1) return o;
      const copy = o.slice();
      const [item] = copy.splice(idx, 1);
      copy.splice(idx + 1, 0, item);
      pushHistory(getLines(), copy);
      return copy;
    });
  }

  function sendBackward(id) {
    setObjects((o) => {
      const idx = o.findIndex((it) => it.id === id);
      if (idx <= 0) return o;
      const copy = o.slice();
      const [item] = copy.splice(idx, 1);
      copy.splice(idx - 1, 0, item);
      pushHistory(getLines(), copy);
      return copy;
    });
  }

  function updateObject(updated) {
    setObjects((o) => {
      const copy = o.map((it) => (it.id === updated.id ? { ...it, ...updated } : it));
      pushHistory(getLines(), copy);
      return copy;
    });
  }

  return { addShape, addTextBox, removeObjectAtPoint, bringForward, sendBackward, updateObject };
}
