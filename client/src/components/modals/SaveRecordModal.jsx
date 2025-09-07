import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

function SaveRecordModal({ open, onClose, onSave, defaultName = "Untitled" }) {
  const [name, setName] = useState(defaultName);

  const handleSave = () => {
    onSave(name);
    setName(defaultName); // reset for next open
  };

  const handleClose = () => {
    setName(defaultName);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Save Sketchboard</DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="dense" label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SaveRecordModal;
