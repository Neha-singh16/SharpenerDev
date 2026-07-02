
const express = require('express');
const app = express();
const db = require("../utils/db-connection");

require("../models");

// require("../models/bookingModel");
// require("../models/userModel");

const userRouter = require("../router/userRouter");
const bookingRouter = require("../router/bookingRouter");
const busRouter = require("../router/busRouter");
app.use(express.json());

app.get("/", (req,res) => {
    res.send("Hieeeee!!");
})

app.use("/users", userRouter);
app.use("/bookings", bookingRouter);
app.use("/buses", busRouter );

db.sync({ alter: true }).then(()=> {
    app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

}).catch((err) => {
console.log(err);
})

