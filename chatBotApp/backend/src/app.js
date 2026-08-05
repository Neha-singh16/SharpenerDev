const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

const http = require("http");
const db = require("./database/db-connection");
const userRouter = require("./routers/userRouter");
const chatRouter = require("./routers/chatRouter");
require("./models/index");
const socketIO = require("./socket_io");
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

const io = socketIO(server);

app.set("io", io);
app.use("/users", userRouter);
app.use("/chat", chatRouter);

const PORT = process.env.PORT || 3000;

db.sync()
  .then(() => {
    console.log("Database synced successfully.");

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
