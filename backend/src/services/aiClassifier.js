const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const PROMPT = `
You are a professional waste classification system.

You are NOT a chatbot.

You ONLY classify waste.

You behave like a garbage disposal expert.

Your job is to:

1. Identify what the object is
2. Classify waste type
3. Assign correct bin
4. Give disposal instruction

You MUST reject invalid images.

Invalid images include:

• humans
• animals
• faces
• body parts
• documents
• screenshots
• text-only images
• scenery
• buildings
• vehicles
• random objects not related to waste
• blank images
• unclear images

If image is NOT waste, return:

{
"isWaste": false,
"reason": "Not a waste item"
}

If image IS waste, return ONLY this JSON:

{
"isWaste": true,
"itemName": "Plastic Bottle",
"wasteType": "Recyclable",
"binColor": "Blue",
"suggestion": "Rinse and place in blue recycling bin",
"confidence": 92
}

Rules:

itemName must be specific and real-world name.

NOT generic words like:

"item"
"object"
"waste"

Be specific.

Examples of GOOD itemName:

Plastic Bottle
Banana Peel
Pizza Box
Glass Jar
Milk Carton

Examples of BAD itemName:

item
trash
waste

Return ONLY JSON.

No explanations.
No extra text.
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
    model: process.env.AI_MODEL || "gemini-2.5-flash",
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

  // Check if it's valid waste
  if (parsed.isWaste === false) {
    return {
      isWaste: false,
      reason: parsed.reason || "Not a waste item"
    };
  }

  // Validate required fields for waste items
  if (!parsed.itemName || !parsed.wasteType || !parsed.binColor) {
    throw new Error("Invalid AI response: missing required fields");
  }

  // Reject if confidence too low
  let confidence = Math.max(0, Math.min(100, Number(parsed.confidence) || 70));
  const threshold = process.env.AI_CONFIDENCE_THRESHOLD || 40;
  if (confidence < threshold) {
    throw new Error("AI confidence too low: " + confidence);
  }

  const itemName = parsed.itemName.trim();
  if (itemName.toLowerCase() === 'item' || itemName.toLowerCase() === 'object' || itemName.toLowerCase() === 'waste') {
    throw new Error("Invalid itemName: too generic");
  }

  const wasteType = normalizeWasteType(parsed.wasteType);
  const binColor = normalizeBinColor(parsed.binColor);

  const suggestion =
    parsed.suggestion ||
    "Dispose properly.";

   confidence =
    Math.max(
      0,
      Math.min(
        100,
        Number(parsed.confidence) || 70
      )
    );

  return {

    isWaste: true,

    itemName,

    wasteType,

    binColor,

    suggestion,

    confidence,

  };

};