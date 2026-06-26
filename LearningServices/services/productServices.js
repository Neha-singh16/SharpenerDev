const path = require('path');

const getProduct = () =>{
  
    return path.join(__dirname, "..", "view", "products.html");
    // return "Fetch all products.";
    
}

const getProductById = (id) => {
   return `Fetch a product by its ID.: ${id}`;
}

// const addProduct = () => {
//     return "Add a new product.";
// }

module.exports = {
    getProduct,
    getProductById,
    // addProduct
};
