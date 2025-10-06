const mongoose = require("mongoose");

const analysisResultSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    suggestedSources: { type: Array, default: [] },
    plagiarismScore: { type: Number, default: 0 },
    flaggedSections: { type: Array, default: [] },
    researchSuggestions: { type: String },
    citationRecommendations: { type: String },
    confidenceScore: { type: Number },
  },
  { timestamps: { createdAt: "analyzed_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("AnalysisResult", analysisResultSchema);
