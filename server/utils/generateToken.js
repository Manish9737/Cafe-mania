const JWT_REFRESH_SECRET = process.env.REFRESH_SECRET;
const JWT_SECRET = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};
