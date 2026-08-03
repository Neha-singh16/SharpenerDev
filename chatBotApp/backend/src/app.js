const express = require("express");
const app = express();
const cors = require('cors');
require("dotenv").config();
const db = require("./database/db-connection");
const userRouter = require("./routers/userRouter");
const chatRouter = require("./routers/chatRouter");
 require("./models/index");


app.use(express.json());
app.use(cors());
app.use("/users", userRouter);
app.use("/chat", chatRouter);

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
