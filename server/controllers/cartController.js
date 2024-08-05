const Cart = require("../models/cart")
const Product = require("../models/products")

exports.addProduct = async (req, res) => {
    console.log(req.body)
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findOne({ _id: productId });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const existingProductIndex = req.cart.products.findIndex(item => item.product.equals(productId));

        if (existingProductIndex !== -1) {
            req.cart.products[existingProductIndex].quantity += quantity;
        } else {
            req.cart.products.push({ product: productId, quantity });
        }

        await req.cart.save();
        res.json(req.cart);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.removeProduct = async (req, res) => {
    const { productId } = req.body;

    try {
        req.cart.products = req.cart.products.filter(item => !item.product.equals(productId));
        await req.cart.save();
        res.json(req.cart);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.getUserCart = async (req, res) => {
    res.json(req.cart);
};

exports.updateCart = async(req, res) => {
    const { productId, quantity} = req.body;
    try {
        const product = await Product.findOne({_id: productId});
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found'});
        }
                
        const existingProductIndex = req.cart.products.findIndex(item => item.product.equals(productId));
        if (existingProductIndex !== -1) {
            req.cart.products[existingProductIndex].quantity += quantity;
            if (req.cart.products[existingProductIndex].quantity < 1) {
                req.cart.products.splice(existingProductIndex, 1);
            }
        } else {
            req.cart.products.push({ product: productId, quantity });
        }

        await req.cart.save();
        res.json(req.cart);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error"});  
    }
}