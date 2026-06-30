const express = require('express');
const app = express();
const studentRouter = require("./routers/studentRouters");
const db = require("./utils/db-connections");
const userRouter = require("./routers/userRouter");
const busRouter = require("./routers/busRouter");

app.use(express.json());

app.get('/', (req,res) => {
    res.send('Hello World');
})

app.use("/students", studentRouter);
app.use("/users", userRouter);
app.use("/buses", busRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})