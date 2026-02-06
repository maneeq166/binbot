const { registerService, loginService } = require("../../services/auth");
const ApiResponse = require("../../utils/apiResponse");
const {asyncHandler} = require("../../utils/asyncHandler/index")
exports.register = asyncHandler(async(req,res)=>{
    const {input} = req.body;
    const {message,data,statusCode} = await registerService(input);
    return res.status(statusCode).json(new ApiResponse(statusCode,data,message))
})
exports.login = asyncHandler(async(req,res)=>{
    const {input} = req.body
    const {message,statusCode,data} = await loginService(input);
    return res.status(statusCode).json(new ApiResponse(statusCode,data,message))
})
