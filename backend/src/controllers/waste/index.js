const { createWasteText, getWasteHistory } = require("../../services/waste");
const ApiResponse = require("../../utils/apiResponse");
const { asyncHandler } = require("../../utils/asyncHandler/index");

exports.createWasteRecordText = asyncHandler(async(req,res)=>{
    const id = req.id;
    const {wastename}= req.body;

    const {message,statusCode,data}=await createWasteText(id,wastename);
    return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, data, message));

})
exports.getWastes=asyncHandler(async(req,res)=>{
    const id = req.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const {message,statusCode,data}=await getWasteHistory(id, page, limit);
    return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, data, message));
})

