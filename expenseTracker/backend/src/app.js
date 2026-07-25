
require("dotenv").config();


const express = require("express");
const cors = require('cors');
const logger = require("../utils/requestLogger");
const app = express();
const db = require("../utils/db");
const userRouter = require("../router/userRouter")
const expenseRouter = require("../router/expenseRouter");
const { requestLogger , errorHandler, notFound} = require("../utils/middleware");
const purchaseRouter = require("../router/purchaseRouter");
const passwordRouter = require("../router/passwordRouter");



require("../models/index"); // Import associations so Sequelize registers the foreign keys

require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/users", userRouter);
app.use("/users/expenses", expenseRouter);
app.use("/users/purchase", purchaseRouter);
app.use("/users/password", passwordRouter);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

db.authenticate().then(()=> {
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

}).catch((err) => {
console.log(err);
})


