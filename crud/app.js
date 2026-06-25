const express = require("express");
const app = express();
const courseRouter = require("./router/courseRouter");
const studentRouter = require("./router/studendRouter");



app.get("/",(req,res)=> {
    res.send("Welcome to the Student & Course Portal API!");
});

app.use("/students" , studentRouter);
app.use("/courses" , courseRouter);

app.use((req,res) => {
    res.status(404).send("Page not found");
});
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})