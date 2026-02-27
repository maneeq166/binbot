const mongoose = require('mongoose');
const wasteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  inputType: {
    type: String,
    enum: ["text", "image"],
    required: true,
  },
  inputValue: {
    type: String, // text or image URL
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  wasteType: {
    type: String,
    enum: ["biodegradable", "non-biodegradable"],
    required: true,
  },
  binColor: {
    type: String,
    enum: ["green", "blue", "black"],
    required: true,
  },
  suggestion: {
    type: String,
    required: true,
  },
  source: {
      type: String,
      enum: ["rule-based", "ai"],
      default: "rule-based",
    },
  audioUrl: {
    type: String,
    default: null,
  },
}, { 
  timestamps: true,
  indexes: [
    { key: { userId: 1 } },
    { key: { createdAt: -1 } },
    { key: { wasteType: 1 } },
    { key: { binColor: 1 } },
  ]
});

const Waste = mongoose.model("waste",wasteSchema);

module.exports=Waste;