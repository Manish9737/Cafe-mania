const Cart = require("../models/cart")

const getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id, status: 'active' }).populate('products.product');
        if (!cart) {
            // return res.status(404).json({ message: 'Cart not found' });
            cart = new Cart({ user: req.user.id, products: [] });
            await cart.save();
        }
        req.cart = cart;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCart }