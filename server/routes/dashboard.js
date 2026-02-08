const express = require("express")
const router = express.Router()
const adminAuth = require("../middlewares/adminAuth")
const { getAdminDashboardStats } = require("../controllers/dashboardController")

router.get("/", adminAuth, getAdminDashboardStats)

module.exports = router
