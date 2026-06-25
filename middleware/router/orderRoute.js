const express = require("express");
const router = express.Router();

router.get("/", (req,res)=>{
    console.log("Inside order route");
    res.send("Here is the order route.");
})

router.post("/",(req,res)=> {
    res.send("A new order has been created.");
})

module.exports = router;