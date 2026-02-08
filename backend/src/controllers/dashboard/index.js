const { getDashboardSummary, getAnalytics } = require("../../services/dashboard/index");
const ApiResponse = require("../../utils/apiResponse");
const { asyncHandler } = require("../../utils/asyncHandler/index");

exports.getDashboardSummary = asyncHandler(async (req, res) => {
    const userId = req.id;

    const { message, statusCode, data } = await getDashboardSummary(userId);
    return res
        .status(statusCode)
        .json(new ApiResponse(statusCode, data, message));
});

exports.getAnalytics = asyncHandler(async (req, res) => {
    const userId = req.id;

    const { message, statusCode, data } = await getAnalytics(userId);
    return res
        .status(statusCode)
        .json(new ApiResponse(statusCode, data, message));
});
