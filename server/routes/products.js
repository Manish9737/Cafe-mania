var express = require('express');
const { 
     addProduct,
     allProducts, 
     getProduct,
     addRatings,
     updateProduct,
     deleteProduct,
     getPopularProducts
} = require('../controllers/productController');
const upload = require('../utils/multerConfig');
var router = express.Router();

router.get('/', allProducts), 
router.post('/', upload("images").single("image"), addProduct),
router.get('/:id', getProduct),
router.patch('/:id', upload("images").single("image"), updateProduct),
router.delete('/:id', deleteProduct),
router.post('/ratings/:id', addRatings)

router.get("/popular", getPopularProducts);

module.exports = router;