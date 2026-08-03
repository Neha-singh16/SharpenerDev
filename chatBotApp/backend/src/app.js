const express = require("express");
const app = express();
const cors = require('cors');
require("dotenv").config();
const db = require("./database/db-connection");
const userRouter = require("./routers/userRouter");


app.use(express.json());
app.use(cors());
app.use("/users", userRouter);

const PORT = process.env.PORT || 3000;

db.sync()
.then(() => {
    console.log("Database synced successfully.");

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((err) => {
    console.log(err);
});
