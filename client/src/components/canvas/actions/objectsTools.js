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

  function addTextBox(opts = {}) {
    const id = Date.now();
    const txt = {
      id,
      type: "text",
      x: opts.x || 620,
      y: opts.y || 420,
      text: typeof opts.text === "string" ? opts.text : "Text",
      fontSize: opts.fontSize || getFontSize(),
      fontFamily: opts.fontFamily || getFontFamily(),
      fill: opts.fill || getColor(),
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

  function addRectangle(opts = {}) {
    addShape("rect", opts);
  }

  function addCircle(opts = {}) {
    // For Konva, circle needs x, y, radius, fill, stroke, strokeWidth
    const id = Date.now();
    const base = {
      id,
      type: "circle",
      x: opts.x || 600,
      y: opts.y || 400,
      radius: opts.radius || 50,
      fill: opts.fill || "#ffffff00",
      stroke: opts.stroke || "#000000",
      strokeWidth: opts.strokeWidth || 2,
    };
    const circle = { ...base, ...opts };
    setObjects((o) => {
      const next = [...o, circle];
      pushHistory(getLines(), next);
      return next;
    });
  }

  function addTriangle(opts = {}) {
    // For Konva, triangle is a Polygon with 3 points
    const id = Date.now();
    // Expect opts: { x, y, width, height }
    const x = opts.x || 600;
    const y = opts.y || 400;
    const width = opts.width || 100;
    const height = opts.height || 100;
    // Points for an upright triangle centered at (x, y)
    const points = [
      x,
      y - height / 2, // top
      x - width / 2,
      y + height / 2, // bottom left
      x + width / 2,
      y + height / 2, // bottom right
    ];
    const triangle = {
      id,
      type: "triangle",
      x,
      y,
      width,
      height,
      points,
      fill: opts.fill || "#ffffff00",
      stroke: opts.stroke || "#000000",
      strokeWidth: opts.strokeWidth || 2,
    };
    setObjects((o) => {
      const next = [...o, triangle];
      pushHistory(getLines(), next);
      return next;
    });
  }

  function addArrow(opts = {}) {
    // For Konva, Arrow needs points: [x1, y1, x2, y2]
    const id = Date.now();
    // Use points from opts if provided, else fallback to default
    const points =
      opts.points && opts.points.length === 4
        ? opts.points
        : [
            (opts.x || 600) - (opts.width || 100) / 2,
            (opts.y || 400) - (opts.height || 0) / 2,
            (opts.x || 600) + (opts.width || 100) / 2,
            (opts.y || 400) + (opts.height || 0) / 2,
          ];
    const arrow = {
      id,
      type: "arrow",
      x: opts.x || 600,
      y: opts.y || 400,
      width: opts.width || 100,
      height: opts.height || 0,
      points,
      fill: opts.fill || "#ffffff00",
      stroke: opts.stroke || "#000000",
      strokeWidth: opts.strokeWidth || 2,
      pointerLength: opts.pointerLength || 15,
      pointerWidth: opts.pointerWidth || 15,
    };
    setObjects((o) => {
      const next = [...o, arrow];
      pushHistory(getLines(), next);
      return next;
    });
  }

  return {
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
  };
}
