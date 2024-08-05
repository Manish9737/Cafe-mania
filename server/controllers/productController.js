const Product = require("../models/products");
const fs = require('fs');
const path = require('path');

exports.addProduct = async (req, res) => {
    const { name, subcategory, category, description, price } = req.body;
    // console.log(req.body)
    const imgFile = req.file ? req.file.filename : null;
    const image = `/images/${imgFile}`
    console.log(image)

    try {
        if (!name || !subcategory || !category || !price) {
            return res.status(422).json({ success: false, message: "Please fill all fields." })
        }

        const lastProduct = await Product.findOne().sort({ id: -1 });
        const lastId = lastProduct ? lastProduct.id : 0;


        const newProduct = new Product({
            id: lastId + 1,
            name,
            subcategory,
            category,
            image,
            description,
            price,
            ratings: []
        });

        await newProduct.save()
        res.status(201).json({ success: true, message: "Product added successfully." })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internel server error." })
    }
}

exports.allProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: true, Products: products })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internel server error." })
    }
}

exports.getProduct = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(422).json({ success: false, message: "Product id is missing." })
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        res.status(200).json({ success: true, Product: product })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internel server error." })
    }
}

exports.addRatings = async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;


    try {
        if (!id) {
            return res.status(422).json({ success: false, message: "Product id is missing." });
        }
        if (rating == null || rating < 1 || rating > 5) {
            return res.status(422).json({ success: false, message: "Rating must be between 1 and 5." });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        product.ratings.push(rating);
        product.averageRating = product.ratings.reduce((a, b) => a + b, 0) / product.ratings.length;

        await product.save();

        res.status(200).json({ success: true, message: "Rating added successfully.", product });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
        updates.image = `/images/${req.file.filename}`;
    }

    try {
        const updatedProduct = await Product.findOneAndUpdate({ _id: id }, updates, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        // console.log(updatedProduct)
        res.status(200).json({ success: true, message: 'Product updated successfully.', product: updatedProduct });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByIdAndDelete(id);

        if (!product) return res.status(404).json({ success: false, message: "Product not found." });

          
        const imagePath = path.join(__dirname, '..', 'public', product.image); 
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        res.status(200).json({ success: true, message: "Product deleted successfully." });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
}
