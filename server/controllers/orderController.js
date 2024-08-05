const Order = require("../models/order");
const Cart = require("../models/cart");
const Payment = require("../models/payment");

exports.createOrder = async (req, res) => {
  const orderDetails = req.body;

  try {
    if (!orderDetails) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });
    }

    const user = req.user.id;

    const {
      cart: cartId,
      paymentStatus,
      orderStatus,
      totalAmount,
      shippingAddress,
      billingAddress,
    } = orderDetails;

    const cart = await Cart.findById(cartId).populate("products.product");

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found." });
    }

    const lastOrder = await Order.findOne().sort({ id: -1 });
    const lastId = lastOrder ? lastOrder.id : 0;

    const orderCartProducts = cart.products.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    const newOrder = new Order({
      id: lastId + 1,
      user,
      cart: orderCartProducts,
      totalAmount,
      paymentStatus,
      orderStatus,
      shippingAddress,
      billingAddress,
    });

    const order = await newOrder.save();
    const populatedOrder = await Order.findById(order._id).populate(
      "cart.product"
    );

    cart.products = [];
    await cart.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "Order created successfully.",
        order: populatedOrder,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.getOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate("user").populate({
      path: "cart.product",
      model: "Product",
      select: "name price",
    });

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "internal server error." });

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.allOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate({
      path: "cart.product",
      model: "Product",
      select: "name price",
    });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const order = await Order.findById(id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found !" });

    const updatedOrder = await Order.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.status(200).json({ success: true, updatedOrder });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.userOrders = async (req, res) => {
  console.log(req.user)
  try {
    const user = req.user.id;
    const orders = await Order.find({user: user})
      .populate("user")
      .populate({
        path: "cart.product",
        model: "Product",
        select: "name price",
      });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
