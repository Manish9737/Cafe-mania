const JWT = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.SECRET_KEY;
const JWT_REFRESH_SECRET = process.env.REFRESH_SECRET;

exports.generateAccessToken = (admin) => {
  return JWT.sign({ id: admin._id, role: "admin" }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

exports.generateRefreshToken = (admin) => {
  return JWT.sign({ id: admin._id, role: "admin" }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};
