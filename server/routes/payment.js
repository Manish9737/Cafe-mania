const express = require('express');
const { createRazorpayOrder, paymentVerification, allPayments } = require('../controllers/paymentController');
const auth = require('../middlewares/auth');
const adminAuth = require("../middlewares/adminAuth");
const router = express.Router();

router.post('/createOrder', auth, createRazorpayOrder);
router.post('/verification', auth, paymentVerification);
router.get("/", adminAuth, allPayments);

module.exports = router;