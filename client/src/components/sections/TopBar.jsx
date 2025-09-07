import { useState } from "react";
import { Redo, Undo, Remove, Add, FitScreen, Save, FolderOpen } from "@mui/icons-material";
import Button from "@mui/material/Button";
import { useCanvasContext } from "../canvas/useCanvasContext";
import SimpleDialog from "../modals/RecordPicker";

const TopBar = () => {
  const { state, actions } = useCanvasContext();
  const [open, setOpen] = useState(false);

  const handleSaveChanges = () => {
    alert("Save functionality not implemented yet.");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="canvas-toolbar">
      <div className="breadcrumbs">Canvas • Untitled</div>
      <div className="group" style={{ gap: "18px" }}>
        <Button variant="outlined" startIcon={<Save />} size="small" disableElevation onClick={handleSaveChanges}>
          Save Changes
        </Button>
        <Button variant="outlined" startIcon={<FolderOpen />} size="small" disableElevation onClick={handleClickOpen}>
          Open
        </Button>
      </div>
      <div className="top-controls">
        <div className="group">
          <button className="icon-btn" onClick={actions.undo} title="Undo">
            <Undo />
          </button>
          <button className="icon-btn" onClick={actions.redo} title="Redo">
            <Redo />
          </button>
        </div>
        <div className="group">
          <button className="icon-btn" onClick={() => actions.setZoom((z) => Math.max(0.1, z - 0.1))} title="Zoom out">
            <Remove />
          </button>
          <span className="zoom-level">{Math.round(state.zoom * 100)}%</span>
          <button className="icon-btn" onClick={() => actions.setZoom((z) => Math.min(4, z + 0.1))} title="Zoom in">
            <Add />
          </button>
          <button className="icon-btn" onClick={() => actions.setZoom(1)} title="Fit Screen">
            <FitScreen />
          </button>
        </div>
      </div>
      <SimpleDialog open={open} onClose={handleClose} />
    </div>
  );
};

export default TopBar;
