import BrushIcon from "@mui/icons-material/Brush";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import AutoFixOffIcon from "@mui/icons-material/AutoFixOff";
import styles from "./LeftToolbar.module.css";

const LeftToolbar = ({ state, actions }) => {
  const ToolIcon = (Icon, active, onClick, label) => (
    <button className={`tool-btn icon-only${active ? " active" : ""}`} onClick={onClick} title={label}>
      <Icon fontSize="medium" />
    </button>
  );
  return (
    <aside className={styles.leftToolbar}>
      <div className="toolbar-section">
        {ToolIcon(BrushIcon, state.tool === "brush", () => actions.selectTool("brush"), "Brush")}
        {ToolIcon(CropSquareIcon, state.tool === "rectangle", () => actions.selectTool("rectangle"), "Rectangle")}
        {ToolIcon(RadioButtonUncheckedIcon, state.tool === "circle", () => actions.selectTool("circle"), "Circle")}
        {ToolIcon(ChangeHistoryIcon, state.tool === "triangle", () => actions.selectTool("triangle"), "Triangle")}
        {ToolIcon(ArrowForwardIcon, state.tool === "arrow", () => actions.selectTool("arrow"), "Arrow")}
        {ToolIcon(TextFieldsIcon, state.tool === "text", () => actions.selectTool("text"), "Text")}
        {ToolIcon(AutoFixOffIcon, state.tool === "eraser", actions.onEraser, "Eraser")}
      </div>
      <div className="toolbar-section">
        <div className="control-row">
          <input type="range" min="1" max="80" value={state.brushSize} onChange={actions.setBrushSize} title="Thickness" />
        </div>
        <div className="control-row color-row">
          <input type="color" value={state.color} onChange={actions.onColorChange} title="Color" />
        </div>
      </div>
    </aside>
  );
};

export default LeftToolbar;
