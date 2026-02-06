const jwt = require("jsonwebtoken");
const ApiResponse = require("../../utils/apiResponse");

exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json(new ApiResponse(400, null, "Access Denied"));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.username = decodedToken.username;
    req.id = decodedToken.id;
    req.email = decodedToken.email;

    next();
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json(new ApiResponse(500, null, "Server Error"));
  }
};