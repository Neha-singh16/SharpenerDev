const express = require('express');
const path = require('path');

const app = express();
const productRouter = require("../routers/productRoute");
app.use(express.json());

app.use("/products", productRouter)

app.use(express.static('../public'));
// app.use(express.static(path.join(__dirname, "../public")));
app.use((req,res)=> {
    res.status(404).send("Route not found");
});

app.listen(3000 , () => {
    console.log("Server is running on port 3000");
})