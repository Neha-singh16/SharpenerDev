const getCartById = (req,res) => {
    const {userId} = req.params;
     res.send(`Fetch a cart by its id : ${userId}`);
}

const addToCart = (req,res) => {
    const {userId} = req.params;
      res.send(`Add a new product to user ${userId}'s cart.`);
}

module.exports ={
    getCartById,
    addToCart
};