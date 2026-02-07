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

exports.getWasteHistory = async (id, page = 1, limit = 10)=>{
    if(!id){
        throw new ApiError(400, "Required fields are missing");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const skip = (page - 1) * limit;
    const history = await Waste.find({userId:id})
        .select('inputValue binColor wasteType createdAt')
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit);

    const total = await Waste.countDocuments({userId:id});

    return {
        data: {
            history,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        },
        message:"Fetched Waste History",
        statusCode:200
    }
}
