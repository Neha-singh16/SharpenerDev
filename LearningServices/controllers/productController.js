const productService = require('../services/productServices');

const getProduct = (req,res) =>{
   const product = productService.getProduct();
   res.sendFile(product);
}

const getProductById = (req,res) => {
   const {id}  = req.params;
   const product = productService.getProductById(id);
   res.send(product);
}

const addProduct = (req, res) => {
    const product = productService.addProduct();
    res.send(product);
}

module.exports = {
    getProduct,
    getProductById,
    addProduct
};
