
const express = require('express');
const app = express();
const cors = require("cors");
const db = require("../utils/db");
const userRouter = require("../router/userRouter");
const {requestLogger ,  notFound, errorHandler}  = require("../utils/middleware")



app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use("/users", userRouter);
app.use(notFound);
app.use(errorHandler);
db.sync({ alter: true }).then(()=> {
    app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

}).catch((err) => {
console.log(err);
})

