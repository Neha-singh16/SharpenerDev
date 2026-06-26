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
    // const product = productService.addProduct();
    const data = req.body;
    console.log("Data received:", data);
    res.json({value: data.productName});
}

module.exports = {
    getProduct,
    getProductById,
    addProduct
};
