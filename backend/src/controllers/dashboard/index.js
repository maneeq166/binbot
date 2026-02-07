const { getDashboardSummary } = require("../../services/dashboard");
const ApiResponse = require("../../utils/apiResponse");
const { asyncHandler } = require("../../utils/asyncHandler/index");

exports.getDashboardSummary = asyncHandler(async (req, res) => {
    const userId = req.id;

    const { message, statusCode, data } = await getDashboardSummary(userId);
    return res
        .status(statusCode)
        .json(new ApiResponse(statusCode, data, message));
});
