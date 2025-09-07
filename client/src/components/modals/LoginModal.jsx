import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

export default function LoginModal({ open, onClose, username, onLogin, onSignOut }) {
  const [inputUser, setInputUser] = useState("");
  const [inputPass, setInputPass] = useState("");

  const handleLogin = () => {
    if (inputUser) {
      onLogin(inputUser);
      setInputUser("");
      setInputPass("");
    }
  };

  const handleClose = () => {
    setInputUser("");
    setInputPass("");
    onClose();
  };

  const handleSignOut = () => {
    setInputUser("");
    setInputPass("");
    if (onSignOut) onSignOut();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Account Login</DialogTitle>
      <DialogContent>
        <Alert severity="warning">This is a mock login. Any username/password will work.</Alert>
        {username ? (
          <Box display="flex" flexDirection="column" alignItems="center" minWidth={240} py={2}>
            <Avatar sx={{ bgcolor: "#1976d2", width: 64, height: 64, mb: 1 }}>{username[0]?.toUpperCase()}</Avatar>
            <div style={{ fontWeight: 500, fontSize: 18, marginBottom: 8 }}>
              Logged On as <span style={{ color: "#1976d2" }}>{username}</span>
            </div>
          </Box>
        ) : (
          <>
            <TextField
              autoFocus
              margin="dense"
              label="Username"
              fullWidth
              value={inputUser}
              onChange={(e) => setInputUser(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              value={inputPass}
              onChange={(e) => setInputPass(e.target.value)}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
        {username ? (
          <Button onClick={handleSignOut} color="error" variant="outlined">
            Sign Out
          </Button>
        ) : (
          <Button onClick={handleLogin} variant="contained" color="primary">
            Login
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
