const express = require("express");
const { requireAuth } = require("../middleware/auth.js");
const { searchSimilarSources } = require("../services/ragService.js");

const router = express.Router();

router.get("/sources", requireAuth, async (req, res) => {
  const q = (req.query.q || "").toString();
  if (!q) return res.status(400).json({ message: "Missing query" });
  const results = await searchSimilarSources(q, 8);
  return res.json({ results });
});

module.exports = router;
