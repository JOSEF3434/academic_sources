const { GoogleGenerativeAI } = require("@google/generative-ai");
const { QdrantClient } = require("@qdrant/js-client-rest");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
let qdrant = null;
try {
  qdrant = new QdrantClient({
    url: process.env.QDRANT_URL || "http://localhost:6333",
  });
} catch (_) {
  qdrant = null;
}
const collection = process.env.QDRANT_COLLECTION || "academic_sources";

async function embedText(text) {
  const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const resp = await embedModel.embedContent(text);
  return resp.embedding.values;
}

async function searchSimilarSources(queryText, topK = 5) {
  try {
    if (!qdrant) return [];
    const vector = await embedText(queryText);
    const result = await qdrant.search(collection, {
      vector,
      limit: topK,
      with_payload: true,
    });
    return result.map((r) => ({ score: r.score, ...r.payload }));
  } catch (_) {
    return [];
  }
}

async function analyzeAssignment({ content, similarSources }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const system =
    "You are an academic assistant. Analyze the assignment, suggest sources, and flag potential plagiarism hints based on similarities.";
  const user = `Assignment content:\n${content.slice(
    0,
    8000
  )}\nRelevant sources:\n${similarSources
    .map((s) => `- ${s.title} (${s.publication_year || s.publicationYear})`)
    .join("\n")}`;
  const result = await model.generateContent([
    { text: system },
    { text: user },
  ]);
  const text = result.response.text() || "";
  return { summary: text };
}
module.exports = { embedText, searchSimilarSources, analyzeAssignment };
