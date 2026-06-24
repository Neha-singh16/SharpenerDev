const express = require('express');

const app = express();

const adduser = ((req, res, next) => {
    // Middleware logic here
    req.user = 'guest';
    next();
});


app.get("/orders" , (req,res) =>{
    res.send(`<h1>Here is the list of all orders.</h1>`);
})

app.post("/orders", (res ,req) =>{
    req.send("A new order has been created.");
})

app.get("/users", (res , req)=>{
    res.send("Here is the list of all users.");
})

app.post("/users" , (res,req)=> {
    req.send("A new user has been added.");
})


app.listen(3000 , () => {
 console.log("Server is running on port 3000");   
})