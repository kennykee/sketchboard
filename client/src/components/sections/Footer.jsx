import { GitHub } from "@mui/icons-material";

const footer = () => (
  <footer className="bottombar">
    <div>
      &copy; {new Date().getFullYear()} SketchBoard by{" "}
      <a href="https://schoolapp.sg/" target="_blank">
        SchoolApp.sg
      </a>
      . All rights reserved.
    </div>
    <a href="https://github.com/kennykee/sketchboard" target="_blank">
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <GitHub fontSize="small" color="inherit" />
        GitHub
      </div>
    </a>
  </footer>
);

export default footer;
