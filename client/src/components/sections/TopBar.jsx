import { useState } from "react";
import { Redo, Undo, Remove, Add, FitScreen, Save, FolderOpen } from "@mui/icons-material";
import Button from "@mui/material/Button";
import { useCanvasContext } from "../canvas/useCanvasContext";
import { saveCanvas, updateCanvas } from "../../data/db";
import SaveRecordModal from "../modals/SaveRecordModal";
import SimpleDialog from "../modals/RecordPickerModal";

const TopBar = () => {
  const { state, actions } = useCanvasContext();
  const [open, setOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  const handleSaveChanges = () => {
    // If recordId exists, overwrite, else show modal
    if (state.recordId) {
      handleOverwriteRecord();
    } else {
      setSaveModalOpen(true);
    }
  };

  const handleOverwriteRecord = async () => {
    try {
      const { objects, lines, recordName, recordId } = state;
      await updateCanvas(recordId, { name: recordName, objects, lines });
      // Optionally show a toast or feedback
    } catch (err) {
      alert("Failed to overwrite: " + err.message);
    }
  };

  const handleSaveRecord = async (name) => {
    try {
      const { objects, lines } = state;
      // Save new record, get new id
      const newId = await saveCanvas({ name, objects, lines });
      actions.setRecordName(name);
      actions.setRecordId(newId); // update recordId in state
      setSaveModalOpen(false);
    } catch (err) {
      alert("Failed to save: " + err.message);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="canvas-toolbar">
      <div className="breadcrumbs">Canvas • {state.recordName}</div>
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
      <SaveRecordModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={handleSaveRecord}
        defaultName={state.recordName}
      />
    </div>
  );
};

export default TopBar;
