const express = require('express');

const app = express();
const productRouter = require("./router/productRoute");
const userRouter = require("./router/userRoute");
const cartRouter = require("./router/cartRoute");

app.use("/products", productRouter)
app.use("/users", userRouter)
app.use("/cart", cartRouter);


app.use((req,res)=> {
    res.status(404).send("Route not found");
});

app.listen(3000 , () => {
    console.log("Server is running on port 3000");
})