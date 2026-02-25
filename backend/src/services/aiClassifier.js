const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

const PROMPT =
  "You are a waste classification assistant.\n\n" +
  "Analyze this waste image.\n\n" +
  "Return ONLY JSON:\n\n" +
  "{\n" +
  "wasteType:\n" +
  "Biodegradable or Recyclable or General Waste\n\n" +
  "binColor:\n" +
  "Green or Blue or Black\n\n" +
  "suggestion:\n" +
  "short disposal instruction\n\n" +
  "confidence:\n" +
  "0-100 number\n" +
  "}\n\n" +
  "Do not include explanations.";

const MIME_BY_EXT = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const normalizeWasteType = value => {
  const v = String(value || "").trim().toLowerCase();
  if (v === "biodegradable") return "Biodegradable";
  if (v === "recyclable") return "Recyclable";
  if (v === "general waste" || v === "general") return "General Waste";
  return null;
};

const normalizeBinColor = value => {
  const v = String(value || "").trim().toLowerCase();
  if (v === "green") return "Green";
  if (v === "blue") return "Blue";
  if (v === "black") return "Black";
  return null;
};

const safeParseJson = text => {
  const trimmed = String(text || "").trim();
  if (!trimmed) throw new Error("Empty AI response");
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Invalid JSON in AI response");
  return JSON.parse(match[0]);
};

module.exports = async function aiClassifier(imagePath) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const buffer = await fs.promises.readFile(imagePath);
  const ext = path.extname(imagePath).toLowerCase();
  const mime = MIME_BY_EXT[ext] || "image/jpeg";
  const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: PROMPT },
          { type: "image_url", image_url: { url: dataUrl } },
        ],
      },
    ],
  });

  const content = response?.choices?.[0]?.message?.content;
  const parsed = safeParseJson(content);

  const wasteType = normalizeWasteType(parsed.wasteType);
  const binColor = normalizeBinColor(parsed.binColor);
  const suggestion =
    typeof parsed.suggestion === "string" ? parsed.suggestion.trim() : "";
  const confidence = Number(parsed.confidence);

  if (!wasteType || !binColor || !suggestion || Number.isNaN(confidence)) {
    throw new Error("Invalid AI response format");
  }

  const boundedConfidence = Math.max(0, Math.min(100, Math.round(confidence)));

  return {
    wasteType,
    binColor,
    suggestion,
    confidence: boundedConfidence,
  };
};
