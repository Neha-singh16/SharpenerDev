const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get("/", productController.getProduct);


router.post("/", productController.addProduct);

router.get("/:id", productController.getProductById);


module.exports = router;