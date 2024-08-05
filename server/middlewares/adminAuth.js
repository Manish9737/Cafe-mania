const jwt = require("jsonwebtoken");
require('dotenv').config();

const JWT_SECRET = process.env.SECRET_KEY;

const adminAuth = (req, res, next) => {
    const token = req.cookies.adminToken || req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = adminAuth;