const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");
const axios = require("axios");
const { requireAuth } = require("../middleware/auth.js");
const Assignment = require("../models/Assignment.js");
const AnalysisResult = require("../models/AnalysisResult.js");

const router = express.Router();
const uploadDir = path.join(process.cwd(), "backend", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });

async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  try {
    if (ext === ".pdf") {
      const pdfParse = require("pdf-parse");
      const dataBuffer = await fsp.readFile(filePath);
      const parsed = await pdfParse(dataBuffer);
      return parsed.text || "";
    }
    if (ext === ".docx") {
      const mammoth = require("mammoth");
      const dataBuffer = await fsp.readFile(filePath);
      const { value } = await mammoth.extractRawText({ buffer: dataBuffer });
      return value || "";
    }
    // Fallback: treat as plain text
    const raw = await fsp.readFile(filePath, "utf8").catch(() => "");
    return raw;
  } catch (_) {
    return "";
  }
}

function countWords(text) {
  if (!text) return 0;
  const words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  return words.length;
}

router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  const file = req.file;
  const { topic, academicLevel } = req.body;
  if (!file) return res.status(400).json({ message: "File is required" });

  // Extract text and compute word count
  const originalText = await extractTextFromFile(file.path);
  const wordCount = countWords(originalText);

  const assignment = await Assignment.create({
    student: req.user.id,
    filename: file.filename,
    originalText,
    topic,
    academicLevel,
    wordCount,
  });

  const webhookUrl =
    process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/assignment";
  // Fire-and-forget n8n trigger
  axios
    .post(webhookUrl, {
      assignmentId: assignment._id.toString(),
      filePath: file.path,
      metadata: { topic, academicLevel, studentId: req.user.id },
    })
    .catch(() => {});

  return res.json({ id: assignment._id, wordCount });
});

router.get("/analysis/:id", requireAuth, async (req, res) => {
  const analysis = await AnalysisResult.findOne({
    assignment: req.params.id,
  }).lean();
  if (!analysis) return res.status(404).json({ message: "Not found" });
  return res.json(analysis);
});

module.exports = router;
