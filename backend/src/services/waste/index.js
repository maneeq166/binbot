const mongoose = require("mongoose");
const Waste = require("../../models/waste.model");
const { RULES } = require("../../utils/rules/index");
const ApiError = require("../../utils/apiError");
exports.createWasteText = async (id, wastename) => {
  if (!wastename || !id) {
    throw new ApiError(400, "Required fields are missing");
  }

  if (typeof wastename !== 'string') {
    throw new ApiError(400, "Wastename must be a string");
  }

  const trimmedWastename = wastename.trim();
  if (trimmedWastename.length === 0) {
    throw new ApiError(400, "Wastename cannot be empty");
  }

  const key = trimmedWastename.toLowerCase();

  const result = RULES[key] || {
    wasteType: "non-biodegradable",
    binColor: "black",
    suggestion: "Dispose according to local waste guidelines",
  };

  const record = await Waste.create({
    userId: id,
    inputType: "text",
    inputValue: trimmedWastename,
    itemName: trimmedWastename,
    wasteType: result.wasteType,
    binColor: result.binColor,
    suggestion: result.suggestion,
  });

  return {
    data: record,
    message: "Waste Record Created!",
    statusCode: 201
  };
};

exports.classifyWasteText = async (wastename) => {
  if (!wastename) {
    throw new ApiError(400, "Required fields are missing");
  }

  if (typeof wastename !== 'string') {
    throw new ApiError(400, "Wastename must be a string");
  }

  const trimmedWastename = wastename.trim();
  if (trimmedWastename.length === 0) {
    throw new ApiError(400, "Wastename cannot be empty");
  }

  const key = trimmedWastename.toLowerCase();

  const result = RULES[key] || {
    wasteType: "non-biodegradable",
    binColor: "black",
    suggestion: "Dispose according to local waste guidelines",
  };

  return {
    itemName: trimmedWastename,
    wasteType: result.wasteType,
    binColor: result.binColor,
    suggestion: result.suggestion,
    confidence: 100, // since rule-based
  };
};

exports.getWasteHistory = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const total = await Waste.countDocuments({ userId });

  const history = await Waste.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-__v');

  const totalPages = Math.ceil(total / limit);

  return {
    data: {
      history,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
      },
    },
    message: "Fetched Waste History",
    statusCode: 200,
  };
};
