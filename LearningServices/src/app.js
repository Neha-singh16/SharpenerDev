const express = require('express');

const app = express();
const productRouter = require("../routers/productRoute");

app.use("/products", productRouter)

app.use((req,res)=> {
    res.status(404).send("Route not found");
});

app.listen(3000 , () => {
    console.log("Server is running on port 3000");
})