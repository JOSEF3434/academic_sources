const mongoose = require("mongoose");

const academicSourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    authors: { type: String },
    publicationYear: { type: Number },
    abstract: { type: String },
    fullText: { type: String },
    sourceType: {
      type: String,
      enum: ["paper", "textbook", "course_material"],
    },
    embedding: { type: [Number], index: "2dsphere" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AcademicSource", academicSourceSchema);
