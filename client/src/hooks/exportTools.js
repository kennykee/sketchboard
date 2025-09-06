export function createExportActions({ stageRef, getLines, getObjects, width = 1200, height = 800 }) {
  function exportToJSON() {
    try {
      if (stageRef && stageRef.current && typeof stageRef.current.toJSON === "function") {
        return stageRef.current.toJSON();
      }
    } catch (err) {
      console.warn("exportToJSON failed", err);
    }
    return JSON.stringify({ width, height, lines: getLines(), objects: getObjects() });
  }

  return { exportToJSON };
}
