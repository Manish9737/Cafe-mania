const JWT = require("jsonwebtoken");
require("dotenv").config();


exports.generateAccessToken = (admin) => {
  return JWT.sign({ id: admin._id, role: "admin" }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
};

exports.generateRefreshToken = (admin) => {
  return JWT.sign({ id: admin._id, role: "admin" }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
};
