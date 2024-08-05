const express = require("express");
const { createOrder, getOrder, allOrders, updateOrder, userOrders } = require("../controllers/orderController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get('/user', auth, userOrders);
router.get("/",  allOrders);
router.get("/:id", getOrder);
router.post("/", auth, createOrder);
router.patch("/:id", updateOrder);


module.exports = router;
