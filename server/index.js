import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(process.cwd(), "public")));

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
