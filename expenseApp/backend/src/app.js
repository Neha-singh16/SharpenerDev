
const express = require('express');
const app = express();
const cors = require("cors");
const db = require("../utils/db-connection");
const expenseRouter = require("../routers/expenseRouter");

app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
    res.send("Hieeeee!!");
})

app.use("/expenses",expenseRouter);


db.sync({ alter: true }).then(()=> {
    app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

}).catch((err) => {
console.log(err);
})

