const jwt = require("jsonwebtoken");
const ApiResponse = require("../utils/apiResponse/index");

exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json(new ApiResponse(401, null, "Access denied. No token provided."));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.username = decodedToken.username;
    req.id = decodedToken.id;
    req.email = decodedToken.email;

    next();
  } catch (error) {
    console.log("Error:", error);
    return res.status(401).json(new ApiResponse(401, null, "Invalid token"));
  }
};
