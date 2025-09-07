# Sketchboard App

A modern, collaborative sketchboard built with React, React Konva, and Material UI. Draw, annotate, and brainstorm visually with a variety of tools in a fast, intuitive interface.

## Features

- **Drawing Tools:** Brush, Rectangle, Circle, Triangle, Arrow, and Text
- **Eraser:** Remove any object or brush stroke with a click
- **Drag-to-Draw:** Click and drag to create shapes with live preview
- **Text Tool:** Add text with customizable font family and size
- **Undo/Redo:** Step backward and forward through your drawing history
- **Zoom:** Zoom in/out and fit to screen
- **Color & Style:** Choose fill and stroke colors, opacity, and more
- **History:** All actions are undoable and redoable
- **Responsive UI:** Built with Material UI for a clean, modern look

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/kennykee/sketchboard-app.git
   cd sketchboard-app
   ```
2. **Install dependencies:**
   ```sh
   cd client
   npm install
   # or
   yarn install
   ```
3. **Start the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:5173` (or as shown in your terminal).

### Server (Optional)

If you want to use the backend server (for future collaboration features):

```sh
cd ../server
npm install
npm run dev
```

## Project Structure

```
client/    # Frontend React app
server/    # Node.js backend (optional)
```

## Tech Stack

- React
- React Konva
- Material UI (MUI)
- Vite
- Node.js (server)

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

---

Enjoy sketching! ✏️
