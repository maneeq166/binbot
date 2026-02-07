const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const bcrypt = require("bcrypt");
const ApiError = require("../../utils/apiError");

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number, one special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

exports.registerService = async (username, email, password) => {
  if (!username || !email || !password) {
    throw new ApiError(400, "Required fields are missing");
  }

  const trimmedUsername = username.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (trimmedUsername.length < 3) {
    throw new ApiError(400, "Username must be at least 3 characters long");
  }

  if (!validateEmail(trimmedEmail)) {
    throw new ApiError(400, "Invalid email format");
  }

  if (!validatePassword(password)) {
    throw new ApiError(400, "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
  }

  let user = await User.findOne({ $or: [{ email: trimmedEmail }, { username: trimmedUsername }] });

  if (user) {
    throw new ApiError(409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  user = await User.create({ username: trimmedUsername, password: hashedPassword, email: trimmedEmail });

  console.log(`User registered: ${user.email}`);

  return {
    data: { id: user._id, email: user.email, username: user.username },
    message: "User created successfully",
    statusCode: 201,
  };
};

exports.loginService = async (email, password) => {
  if (!email || !password) {
    throw new ApiError(400, "Required fields are missing");
  }

  const trimmedEmail = email.trim().toLowerCase();

  let user = await User.findOne({ email: trimmedEmail });

  if (!user || !user.isActive) {
    console.log(`Failed login attempt for: ${trimmedEmail}`);
    throw new ApiError(401, "Invalid email or password");
  }

  const correctPassword = await bcrypt.compare(password, user.password);

  if (!correctPassword) {
    console.log(`Failed login attempt for: ${trimmedEmail}`);
    throw new ApiError(401, "Invalid email or password");
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

  console.log(`User logged in: ${user.email}`);

  return {
    data: token,
    message: "Logged in successfully",
    statusCode: 200,
  };
};

exports.getMeService = async (id) => {
  if (!id) {
    throw new ApiError(400, "Required fields are missing");
  }

  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  console.log(`User profile accessed: ${user.email}`);

  return {
    data: { id: user._id, username: user.username, email: user.email, isActive: user.isActive, createdAt: user.createdAt },
    message: "User found",
    statusCode: 200,
  };
};

