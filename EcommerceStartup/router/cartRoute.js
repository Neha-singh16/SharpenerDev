const express = require('express');
const router = express.Router();

router.get("/:userId", (req,res) => {
   const id = req.params.userId;
   res.send(`Fetch a product by its ID.: ${id}`);
})


router.post("/:userId", (req,res) => {
    const id = req.params.userId;
    res.send(`Add a new product to user ${id}'s cart.`);
})


module.exports = router;