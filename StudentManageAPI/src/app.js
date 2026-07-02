const express = require('express');
const app = express();
const db = require("../utils/db-connection");
const studentRouter = require("../router/studentRouter");
const courseRouter = require("../router/courseRouter");
// const studentModels = require("../models/students");

require("../models");

app.use(express.json());

app.get("/", (req,res) => {
    res.send("Hieeeee!!");
})

app.use("/students", studentRouter);
app.use("/courses", courseRouter);



db.sync({forced: false}).then(()=> {
    app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

}).catch((err) => {
console.log(err);
})

