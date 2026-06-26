const productService = require('../services/productServices');
const {SendErrorResponse}= require('../utils/response');

const getProduct = (req,res) =>{
   const product = productService.getProduct();
if(!product){
   return SendErrorResponse(res, {statusCode: 404, message: "Product not found"});
}
   res.sendFile(product);
}

const getProductById = (req,res) => {
   const {id}  = req.params;
   const product = productService.getProductById(id);
   if(!product){
       return SendErrorResponse(res, {statusCode: 404, message: "Product not found"});
   }
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
