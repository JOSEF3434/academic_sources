require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const authRouter = require("./routes/auth.js");
const assignmentRouter = require("./routes/assignments.js");
const sourcesRouter = require("./routes/sources.js");

// Initialize DB connection
require("./db");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Basic health route
app.use("/auth", authRouter);
app.use("/", assignmentRouter);
app.use("/", sourcesRouter);

// Health endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is running on ${PORT}`));
//docker compose watch
