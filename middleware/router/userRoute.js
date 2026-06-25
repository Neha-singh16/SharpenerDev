const express = require("express");
const router = express.Router();

router.get("/", (req,res)=>{
    res.send("Here is the user route.");
})

router.post("/",(req,res)=> {
    res.send("A new user has been created.");
})

module.exports = router;