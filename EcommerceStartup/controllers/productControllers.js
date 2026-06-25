const getProduct = (req,res) =>{
    res.send("Fetch all products.")
}

const getProductById = (req,res) => {
     const {id}  = req.params;
   res.send(`Fetch a product by its ID.: ${id}`);
}

const addProduct = (req, res) => {
    res.send("Add a new product.");
}

module.exports = {
    getProduct,
    getProductById,
    addProduct
};
