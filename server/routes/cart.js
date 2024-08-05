var express = require("express");
const {
  addProduct,
  removeProduct,
  getUserCart,
  updateCart,
} = require("../controllers/cartController");
const { getCart } = require("../middlewares/cart");
const auth = require("../middlewares/auth");
var router = express.Router();

router.get("/", auth, getCart, getUserCart);
router.post("/add", auth, getCart, addProduct);
router.post("/remove", auth, getCart, removeProduct);
router.patch("/", auth, getCart, updateCart);

module.exports = router;
