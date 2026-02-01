const express = require("express");
const { registerAdmin, signIn, sendEmail, changePassword } = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminAuth");
const router = express.Router();

router.post("/", registerAdmin);
router.post("/signIn", signIn);
router.post("/sendEmail", adminAuth, sendEmail);

router.patch("/change-password", adminAuth, changePassword);

module.exports = router;
