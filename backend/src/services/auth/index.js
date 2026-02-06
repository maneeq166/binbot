const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const bcrypt = require("bcrypt");

exports.registerService = async (username, email, password) => {
  if (!username || !email || !password) {
    return {
      data: null,
      message: "Required fields are missing",
      statusCode: 400,
    };
  }

  let user = await User.findOne({ email });

  if (user) {
    return {
      data: null,
      message: "User already exists",
      statusCode: 409,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  user = await User.create({ username, password: hashedPassword, email });

  return {
    data: { id: user._id, email: user.email, username: user.username },
    message: "User created successfully",
    statusCode: 201,
  };
};

exports.loginService = async (email, password ) => {
  if (!email || !password) {
    return {
      data: null,
      message: "Required fields are missing",
      statusCode: 400,
    };
  }

  let user = await User.findOne({ email });

  if (!user || !user.isActive) {
    return {
      data: null,
      message: "Invalid email or password",
      statusCode: 401,
    };
  }

  const correctPassword = await bcrypt.compare(password, user.password);

  if (!correctPassword) {
    return {
      data: null,
      message: "Invalid email or password",
      statusCode: 401,
    };
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET
  );

  return {
    data: token,
    message: "Logged in successfully",
    statusCode: 200,
  };
};
