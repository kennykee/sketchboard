import React from "react";
import { useCanvasContext } from "../canvas/useCanvasContext";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

function RightPanel() {
  const { state, actions } = useCanvasContext();
  const toolName = state.tool.charAt(0).toUpperCase() + state.tool.slice(1);

  return (
    <aside className="right-panel">
      <div className="panel-section">
        <h4>Properties - {toolName}</h4>
        <div className="prop-row">
          <label>Stroke</label>
          <input type="color" value={state.strokeColor} onChange={(e) => actions.setStrokeColor(e.target.value)} />
        </div>
        <div className="prop-row">
          <label>Fill</label>
          <input type="color" value={state.fillColor} onChange={(e) => actions.setFillColor(e.target.value)} />
        </div>
        <div className="prop-row">
          <FormControl
            fullWidth
            size="small"
            sx={{
              mt: 1,
              backgroundColor: "#000",
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": {
                  borderColor: "#fff",
                },
                "&:hover fieldset": {
                  borderColor: "#ccc",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#4caf50",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#fff",
              },
              "& .MuiSelect-icon": {
                color: "#fff",
              },
            }}
          >
            <InputLabel id="font-family-label" style={{ color: "#94a3b8" }}>
              Font Family
            </InputLabel>
            <Select
              labelId="font-family-label"
              id="font-family-select"
              value={state.fontFamily}
              label="Font Family"
              style={{ color: "#94a3b8" }}
              onChange={(e) => actions.setFontFamily(e.target.value)}
            >
              <MenuItem value="Arial">Arial</MenuItem>
              <MenuItem value="Helvetica">Helvetica</MenuItem>
              <MenuItem value="Times New Roman">Times New Roman</MenuItem>
              <MenuItem value="Courier New">Courier New</MenuItem>
              <MenuItem value="Verdana">Verdana</MenuItem>
              <MenuItem value="Tahoma">Tahoma</MenuItem>
              <MenuItem value="Trebuchet MS">Trebuchet MS</MenuItem>
              <MenuItem value="Georgia">Georgia</MenuItem>
              <MenuItem value="Palatino">Palatino</MenuItem>
              <MenuItem value="Garamond">Garamond</MenuItem>
              <MenuItem value="Comic Sans MS">Comic Sans MS</MenuItem>
              <MenuItem value="Impact">Impact</MenuItem>
              <MenuItem value="System-ui">System-ui</MenuItem>
            </Select>
          </FormControl>
        </div>
        {state.tool === "text" && (
          <div className="prop-row">
            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
              <TextField
                id="edit-text-field"
                label="Edit Text"
                variant="outlined"
                size="small"
                value={state.editText}
                onChange={(e) => {
                  actions.setEditText(e.target.value);
                  const obj = state.objects.find((o) => o.id === state.selectedId);
                  if (obj && obj.type === "text") {
                    actions.updateObject({ ...obj, text: e.target.value });
                  }
                }}
                placeholder="Enter text..."
                fullWidth
                InputProps={{
                  style: {
                    background: "#fff",
                    color: "#222",
                    borderRadius: 4,
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: "#222",
                    background: "#ffc107",
                    padding: "0 4px",
                    borderRadius: 4,
                  },
                }}
              />
            </FormControl>
          </div>
        )}
      </div>
    </aside>
  );
}

export default RightPanel;
