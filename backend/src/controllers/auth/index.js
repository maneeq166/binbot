const {
  registerService,
  loginService,
  getMeService,
} = require("../../services/auth");
const ApiResponse = require("../../utils/apiResponse");
const { asyncHandler } = require("../../utils/asyncHandler/index");
exports.register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const { message, data, statusCode } = await registerService(
    username,
    email,
    password,
  );
  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, data, message));
});
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { message, statusCode, data } = await loginService(email, password);
  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, data, message));
});
exports.me = asyncHandler(async (req, res) => {
  const id = req.id;
  const { message, statusCode, data } = await getMeService(id);
  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, data, message));
});
