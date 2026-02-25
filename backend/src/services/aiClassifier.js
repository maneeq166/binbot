const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const PROMPT = `
You are a waste classification assistant.

Analyze this waste image.

Return ONLY JSON:

{
"wasteType": "Biodegradable or Recyclable or General Waste",
"binColor": "Green or Blue or Black",
"suggestion": "short disposal instruction",
"confidence": number between 0 and 100
}

No explanation.
`;

const MIME_BY_EXT = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

function safeParseJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Invalid JSON response");
  return JSON.parse(match[0]);
}

function normalizeWasteType(value) {
  const v = String(value || "").toLowerCase();

  if (v.includes("bio")) return "Biodegradable";
  if (v.includes("recycl")) return "Recyclable";
  return "General Waste";
}

function normalizeBinColor(value) {
  const v = String(value || "").toLowerCase();

  if (v.includes("green")) return "Green";
  if (v.includes("blue")) return "Blue";
  return "Black";
}

module.exports = async function aiClassifier(imagePath) {

  if (!process.env.GEMINI_API_KEY)
    throw new Error("GEMINI_API_KEY missing");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const buffer = await fs.promises.readFile(imagePath);

  const ext = path.extname(imagePath).toLowerCase();

  const mimeType = MIME_BY_EXT[ext] || "image/jpeg";

  const imagePart = {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };

  const result = await model.generateContent([
    PROMPT,
    imagePart,
  ]);

  const text = result.response.text();

  const parsed = safeParseJson(text);

  const wasteType = normalizeWasteType(parsed.wasteType);

  const binColor = normalizeBinColor(parsed.binColor);

  const suggestion =
    parsed.suggestion ||
    "Dispose properly.";

  const confidence =
    Math.max(
      0,
      Math.min(
        100,
        Number(parsed.confidence) || 70
      )
    );

  return {

    wasteType,

    binColor,

    suggestion,

    confidence,

  };

};