import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import AcademicSource from "../models/AcademicSource.js";
import { embedText } from "../services/ragService.js";
import { QdrantClient } from "qdrant-js";

const QDRANT_URL = process.env.QDRANT_URL || "http://localhost:6333";
const COLLECTION = process.env.QDRANT_COLLECTION || "academic_sources";

async function ensureQdrantCollection(qdrant, dim) {
  try {
    await qdrant.getCollection(COLLECTION);
  } catch {
    await qdrant.createCollection(COLLECTION, {
      vectors: { size: dim, distance: "Cosine" },
    });
  }
}

async function main() {
  const MONGO_URI =
    process.env.MONGO_URI || "mongodb://localhost:27017/academic_helper";
  await mongoose.connect(MONGO_URI);

  const qdrant = new QdrantClient({ url: QDRANT_URL });

  const dataPath = path.join(
    process.cwd(),
    "data",
    "sample_academic_sources.json"
  );
  const raw = fs.readFileSync(dataPath, "utf-8");
  const items = JSON.parse(raw);

  const firstEmbedding = await embedText(
    items[0].abstract || items[0].full_text || items[0].title
  );
  await ensureQdrantCollection(qdrant, firstEmbedding.length);

  let idx = 0;
  for (const item of items) {
    const doc = await AcademicSource.create({
      title: item.title,
      authors: item.authors,
      publicationYear: item.publication_year,
      abstract: item.abstract,
      fullText: item.full_text,
      sourceType: item.source_type,
      embedding: [],
    });

    const vector = await embedText(
      item.abstract || item.full_text || item.title
    );

    await qdrant.upsert(COLLECTION, {
      points: [
        {
          id: doc._id.toString(),
          vector,
          payload: {
            mongo_id: doc._id.toString(),
            title: doc.title,
            authors: doc.authors,
            publication_year: doc.publicationYear,
            abstract: doc.abstract,
            source_type: doc.sourceType,
          },
        },
      ],
    });

    idx += 1;
  }

  console.log("Seed complete");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
