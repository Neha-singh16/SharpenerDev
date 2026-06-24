const express = require('express');
const app = express();

app.get("/products" , (req , res)=>{
    res.send(`<h1>Here is the list of all products.</h1>`)
})

app.post("/products", (req , res) =>{
    req.send("A new product has been added.")
})

app.get("/categories" , (req , res) => {
    res.send("Here is the list of all categories.");
})

app.post("/categories" , (req,res) => {
    req.send("A new category has been created.");
})

app.use((req,res) => {
    res.status(404).send(`<h1>404-Page Not Found</h1>`)
})

app.listen(4000 , () => {
console.log("Server is running on port 4000");
})

