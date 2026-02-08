const mongoose = require('mongoose');
const Waste = require('../../models/waste.model');
const ApiError = require('../../utils/apiError');

exports.getDashboardSummary = async (userId) => {
    if (!userId) {
        throw new ApiError(400, "Required fields are missing");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

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
}

exports.getAnalytics = async (userId) => {
    if (!userId) {
        throw new ApiError(400, "Required fields are missing");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const analytics = await Waste.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
            $facet: {
                bioVsNonBio: [
                    {
                        $group: {
                            _id: "$wasteType",
                            count: { $sum: 1 }
                        }
                    }
                ],
                binUsage: [
                    {
                        $group: {
                            _id: "$binColor",
                            count: { $sum: 1 }
                        }
                    }
                ],
                totalClassificationsOverTime: [
                    {
                        $group: {
                            _id: {
                                $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: "$createdAt"
                                }
                            },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { "_id": 1 } }
                ]
            }
        }
    ]);

    const result = analytics[0];
    
    // Check if there's actually data
    const hasData = result && (
        (result.bioVsNonBio && result.bioVsNonBio.length > 0) ||
        (result.binUsage && result.binUsage.length > 0) ||
        (result.totalClassificationsOverTime && result.totalClassificationsOverTime.length > 0)
    );
    
    if (!hasData) {
        return {
            data: {
                bioVsNonBioPercentage: { biodegradable: 0, "non-biodegradable": 0 },
                binUsagePercentage: { green: 0, blue: 0, black: 0 },
                totalClassificationsOverTime: []
            },
            message: "No data found",
            statusCode: 200
        };
    }

    // Calculate bio vs non-bio percentages
    const bioVsNonBio = result.bioVsNonBio;
    const totalBioNonBio = bioVsNonBio.reduce((sum, item) => sum + item.count, 0);
    const bioVsNonBioPercentage = {
        biodegradable: 0,
        "non-biodegradable": 0
    };
    bioVsNonBio.forEach(item => {
        bioVsNonBioPercentage[item._id] = totalBioNonBio > 0 ? (item.count / totalBioNonBio) * 100 : 0;
    });

    // Calculate bin usage percentages
    const binUsage = result.binUsage;
    const totalBins = binUsage.reduce((sum, item) => sum + item.count, 0);
    const binUsagePercentage = { green: 0, blue: 0, black: 0 };
    binUsage.forEach(item => {
        binUsagePercentage[item._id] = totalBins > 0 ? (item.count / totalBins) * 100 : 0;
    });

    // Total classifications over time
    const totalClassificationsOverTime = result.totalClassificationsOverTime.map(item => ({
        date: item._id,
        count: item.count
    }));

    return {
        data: {
            bioVsNonBioPercentage,
            binUsagePercentage,
            totalClassificationsOverTime
        },
        message: "success",
        statusCode: 200
    };
}
