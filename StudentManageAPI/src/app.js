const express = require('express');
const app = express();
const db = require("../utils/db-connection");
const studentRouter = require("../router/studentRouter");
const studentModels = require("../models/students");

app.use(express.json());

app.get("/", (req,res) => {
    res.send("Hieeeee!!");
})

app.use("/students", studentRouter);

db.sync({forced: false}).then(()=> {
    app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

}).catch((err) => {
console.log(err);
})

