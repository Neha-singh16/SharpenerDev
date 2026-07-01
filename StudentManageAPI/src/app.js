const express = require('express');
const app = express();
const db = require("../utils/db-connection");
const studentRouter = require("../router/studentRouter");

app.use(express.json());

app.get("/", (req,res) => {
    res.send("Hieeeee!!");
})

app.use("/students", studentRouter);

app.

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})