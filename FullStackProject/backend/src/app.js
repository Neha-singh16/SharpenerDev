const express = require('express');
const app = express();
const cors = require("cors");
// const busRouter = require("../routers/busRouter");
const  appointmentRouter = require("../routers/appointmentRouter");
const db = require("../utils/db-connection");

app.get("/", (req,res)=> {
    res.send("Welcome to Bus Booking App");
})

app.use(cors());
app.use(express.json());

app.use("/appointment" ,appointmentRouter);

db.sync({forced: false}).then(()=> {
    app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

}).catch((err) => {
console.log(err);
})
