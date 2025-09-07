import * as React from "react";
import { useEffect, useState } from "react";
import { getAllCanvases } from "../../data/db";
import { useCanvasContext } from "../canvas/useCanvasContext";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { orange } from "@mui/material/colors";
import Draw from "@mui/icons-material/Draw";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteCanvas } from "../../data/db";

// emails replaced by canvases from IndexedDB

function SimpleDialog(props) {
  const { onClose, open } = props;
  const [canvases, setCanvases] = useState([]);
  const { actions } = useCanvasContext();

  useEffect(() => {
    if (open) {
      getAllCanvases().then(setCanvases);
    }
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await deleteCanvas(id);
    setCanvases((prev) => prev.filter((c) => c.id !== id));
  };

  const handleListItemClick = async (canvas) => {
    // Load the selected canvas into the stage
    actions.clear();
    actions.setHistory([]);
    actions.setHistoryIndex(0);
    actions.setRecordName(canvas.name || "Untitled");
    actions.setRecordId(canvas.id); // set recordId to loaded record
    if (canvas.objects) actions.setObjects(canvas.objects);
    if (canvas.lines) actions.setLines(canvas.lines);
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Load saved sketch board</DialogTitle>
      <List sx={{ pt: 0 }}>
        {canvases.length === 0 && (
          <ListItem>
            <ListItemText primary="No saved canvases found." />
          </ListItem>
        )}
        {canvases.map((canvas) => (
          <ListItem
            disablePadding
            key={canvas.id}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={(e) => handleDelete(e, canvas.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemButton onClick={() => handleListItemClick(canvas)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: orange[100], color: orange[600] }}>
                  <Draw />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={canvas.name || `Untitled (${canvas.id})`} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <DialogActions>
        <Button onClick={handleClose} disableElevation>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SimpleDialog;
