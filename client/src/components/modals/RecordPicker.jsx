import * as React from "react";
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

const emails = ["Record 1", "Record 2", "Record 3", "Record 4", "Record 5"];

function SimpleDialog(props) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value) => {
    console.log(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Load saved sketch board</DialogTitle>
      <List sx={{ pt: 0 }}>
        {emails.map((email) => (
          <ListItem disablePadding key={email}>
            <ListItemButton onClick={() => handleListItemClick(email)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: orange[100], color: orange[600] }}>
                  <Draw />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={email} />
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
