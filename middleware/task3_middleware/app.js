const express = require('express');

const app = express();

app.use((req, res, next)=>{
    console.log(`The request URL is ${req.url} and the request method  is ${req.method}`);
    next();
})

app.get("/products", (req, res) => {
    res.send("Here is the list of all products.");
});

app.post("/products",(req,res) =>{
    req.send("A new product has  been added.");
})

app.get("/categories", (req,res) =>{
    res.send("Here is the list of all categories. ");
})

app.post("/categories",(req,res) =>{
    req.send("A new category has been created.")
})

app.listen(3000, () =>{
    console.log("Server is running on port 3000");
})