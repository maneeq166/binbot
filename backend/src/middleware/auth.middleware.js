const jwt = require("jsonwebtoken");
const ApiResponse = require("../utils/apiResponse/index");

exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json(new ApiResponse(401, null, "Access denied. No token provided."));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.id = decodedToken.id;

    next();
  } catch (error) {
    console.log("Error:", error);
    return res.status(401).json(new ApiResponse(401, null, "Invalid token"));
  }
};
