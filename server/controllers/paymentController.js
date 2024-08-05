const razorpay = require("razorpay");
const Payment = require("../models/payment");

const razorpayInstance = new razorpay({
  key_id: process.env.RAZOR_PAY_KEY,
  key_secret: process.env.RAZOR_PAY_SECRET,
});

exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount,
      currency: "INR",
    };

    razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        console.error("Error creating Razorpay order:", err);
        res.status(500).json({ message: "Failed to create Razorpay order" });
      } else {
        res.json({ orderId: order.id });
      }
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

exports.paymentVerification = async (req, res, next) => {
  try {
    const {
      currency,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = req.body;

    const lastPayment = await Payment.findOne().sort({ id: -1 });
    const lastId = lastPayment && !isNaN(lastPayment.id) ? lastPayment.id : 0;

    const payment = new Payment({
      id: lastId + 1,
      userId: req.user.id,
      currency,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      status: "success",
    });

    await payment.save();

    res.json({
      message: "Payment details saved successfully",
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

exports.allPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find().populate('userId');
    res.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
