const mongoose = require('mongoose');
const Waste = require('../../models/waste.model');

exports.getDashboardSummary = async (userId) => {
    try {
        const summary = await Waste.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalItems: { $sum: 1 },
                    biodegradableCount: { $sum: { $cond: [{ $eq: ["$wasteType", "biodegradable"] }, 1, 0] } },
                    nonBiodegradableCount: { $sum: { $cond: [{ $eq: ["$wasteType", "non-biodegradable"] }, 1, 0] } },
                    greenBinUsage: { $sum: { $cond: [{ $eq: ["$binColor", "green"] }, 1, 0] } },
                    blueBinUsage: { $sum: { $cond: [{ $eq: ["$binColor", "blue"] }, 1, 0] } },
                    blackBinUsage: { $sum: { $cond: [{ $eq: ["$binColor", "black"] }, 1, 0] } }
                }
            }
        ]);

        if (summary.length === 0) {
            return {
                data: {
                    totalItems: 0,
                    biodegradableCount: 0,
                    nonBiodegradableCount: 0,
                    binUsage: { green: 0, blue: 0, black: 0 }
                },
                message: "No data found",
                statusCode: 200
            };
        }

        const result = summary[0];
        result.binUsage = {
            green: result.greenBinUsage || 0,
            blue: result.blueBinUsage || 0,
            black: result.blackBinUsage || 0
        };
        delete result.greenBinUsage;
        delete result.blueBinUsage;
        delete result.blackBinUsage;

        return { data: result, message: "success", statusCode: 200 };
    } catch (error) {
        console.error("Error in getDashboardSummary:", error);
        return { data: null, message: "Server error", statusCode: 500 };
    }
}
