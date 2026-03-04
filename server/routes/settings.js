const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const adminAuth = require("../middlewares/adminAuth");

// Public route
router.get("/", settingsController.getSettings);

// Admin route
router.post("/", adminAuth, settingsController.upsertSettings);

module.exports = router;
