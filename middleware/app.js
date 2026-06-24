const express = require('express');

const app = express();

const adduser = ((req, res, next) => {
    // Middleware logic here
    req.user = 'guest';
    next();
});


app.get("/welcome" ,adduser , (req,res) =>{
    res.send(`<h1>Welcome ${req.user}</h1>`);
} )

app.listen(3000 , () => {
 console.log("Server is running on port 3000");   
})