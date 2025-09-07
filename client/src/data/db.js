import Dexie from "dexie";

// Define the database
export const db = new Dexie("SketchboardDB");

db.version(1).stores({
  canvases: "++id, name, createdAt, updatedAt", // id is auto-incremented
});

// Save a canvas (objects and lines)
export async function saveCanvas({ name = "Untitled", objects = [], lines = [] }) {
  const now = new Date().toISOString();
  return db.canvases.add({
    name,
    objects,
    lines,
    createdAt: now,
    updatedAt: now,
  });
}

// Update a canvas by id
export async function updateCanvas(id, { name, objects, lines }) {
  const now = new Date().toISOString();
  return db.canvases.update(id, {
    name,
    objects,
    lines,
    updatedAt: now,
  });
}

// Get all canvases
export async function getAllCanvases() {
  return db.canvases.toArray();
}

// Get a canvas by id
export async function getCanvas(id) {
  return db.canvases.get(id);
}

// Delete a canvas by id
export async function deleteCanvas(id) {
  return db.canvases.delete(id);
}
