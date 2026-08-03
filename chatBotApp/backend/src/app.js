const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const db = require("./database/db-connection");
const userRouter = require("./routers/userRouter");
const chatRouter = require("./routers/chatRouter");
require("./models/index");

app.use(express.json());
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
app.set("io", io);
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});
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
