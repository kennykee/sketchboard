import BrushIcon from "@mui/icons-material/Brush";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import AutoFixOffIcon from "@mui/icons-material/AutoFixOff";
import styles from "./Toolbar.module.css";
import { useCanvasContext } from "../canvas/useCanvasContext";
import React, { useRef } from "react";

const LeftToolbar = () => {
  const { state, actions } = useCanvasContext();
  const fileInputRef = useRef();

  const ToolIcon = (Icon, active, onClick, label) => (
    <button className={`tool-btn icon-only${active ? " active" : ""}`} onClick={onClick} title={label}>
      <Icon fontSize="medium" />
    </button>
  );

  const handleImageClick = () => {
    actions.setTool("image");
    if (fileInputRef.current) fileInputRef.current.value = null;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      actions.addImage({ url: ev.target.result });
    };
    reader.readAsDataURL(file);
  };
  return (
    <aside className={styles.leftToolbar}>
      <div className="toolbar-section">
        {ToolIcon(BrushIcon, state.tool === "brush", () => actions.setTool("brush"), "Brush")}
        {ToolIcon(CropSquareIcon, state.tool === "rectangle", () => actions.setTool("rectangle"), "Rectangle")}
        {ToolIcon(RadioButtonUncheckedIcon, state.tool === "circle", () => actions.setTool("circle"), "Circle")}
        {ToolIcon(ChangeHistoryIcon, state.tool === "triangle", () => actions.setTool("triangle"), "Triangle")}
        {ToolIcon(ArrowForwardIcon, state.tool === "arrow", () => actions.setTool("arrow"), "Arrow")}
        {ToolIcon(TextFieldsIcon, state.tool === "text", () => actions.setTool("text"), "Text")}
        {ToolIcon(InsertPhotoIcon, state.tool === "image", handleImageClick, "Image")}
        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
        {ToolIcon(AutoFixOffIcon, state.tool === "eraser", () => actions.setTool("eraser"), "Eraser")}
      </div>
    </aside>
  );
};

export default LeftToolbar;
