import React, { useRef, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { AccountCircle, ConnectWithoutContact } from "@mui/icons-material";
import { useCanvasContext } from "./components/canvas/useCanvasContext";
import Logo from "./assets/Icon128.png";
import LeftToolbar from "./components/sections/Toolbar";
import RightPanel from "./components/sections/PropertyBar";
import CanvasBoard from "./components/canvas/CanvasBoard";
import TopBar from "./components/sections/TopBar";
import FooterComponent from "./components/sections/Footer";
import LoginModal from "./components/modals/LoginModal";
import "./app.css";

export default function App() {
  const wrapperRef = useRef(null);
  const { state, actions } = useCanvasContext();
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (wrapperRef.current) {
      const { width, height } = wrapperRef.current.getBoundingClientRect();
      actions.setCanvasSize({ width, height });
    }
  }, []);

  const handleShareClick = () => {
    alert("Live Share functionality not implemented yet.");
  };

  const handleAccountClick = () => {
    setLoginOpen(true);
  };

  const handleLogin = (username) => {
    actions.login(username);
    setLoginOpen(false);
  };

  const handleSignOut = () => {
    actions.logout();
    setLoginOpen(false);
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <img src={Logo} className="logo" />
          Collaborative SketchBoard
        </div>
        <div className="topbar-actions" style={{ display: "none" }}>
          <button className="icon-btn live-share" onClick={handleShareClick} title="Live Share">
            <ConnectWithoutContact fontSize="large" color="inherit" />
          </button>
        </div>
        <div className="topbar-actions">
          <button className="icon-btn account-button" onClick={handleAccountClick} title="User Account Login">
            <AccountCircle fontSize="large" color="inherit" />
          </button>
        </div>
        <LoginModal
          open={loginOpen}
          onClose={() => setLoginOpen(false)}
          username={state.username}
          onLogin={handleLogin}
          onSignOut={handleSignOut}
        />
      </header>

      <div className="workspace">
        <LeftToolbar />
        <main className="canvas-area">
          <TopBar />
          <div className="canvas-wrapper" id="canvasWrapper" ref={wrapperRef}>
            {state.canvasSize && <CanvasBoard />}
          </div>
        </main>
        <RightPanel />
      </div>
      <FooterComponent />
    </div>
  );
}
