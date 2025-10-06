const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    filename: { type: String },
    originalText: { type: String },
    topic: { type: String },
    academicLevel: { type: String },
    wordCount: { type: Number },
  },
  { timestamps: { createdAt: "uploaded_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
