const express = require("express");
const { registerAdmin, signIn, sendEmail } = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminAuth");
const router = express.Router();

router.post("/", registerAdmin);
router.post("/signIn", signIn);
router.post("/sendEmail", adminAuth, sendEmail);

module.exports = router;
