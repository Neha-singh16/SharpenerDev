
require("dotenv").config();


const express = require("express");
const cors = require('cors');
const app = express();
const db = require("../utils/db");
const userRouter = require("../router/userRouter")
const expenseRouter = require("../router/expenseRouter");
const { requestLogger , errorHandler, notFound} = require("../utils/middleware");
const purchaseRouter = require("../router/purchaseRouter");
const passwordRouter = require("../router/passwordRouter");



require("../models/index"); // Import associations so Sequelize registers the foreign keys

require("dotenv").config();


app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use("/users", userRouter);
app.use("/users/expenses", expenseRouter);
app.use("/users/purchase", purchaseRouter);
app.use("/users/password", passwordRouter);
app.use(notFound);
app.use(errorHandler);

db.sync().then(()=> {
    app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

}).catch((err) => {
console.log(err);
})


