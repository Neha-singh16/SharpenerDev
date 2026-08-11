const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

const http = require("http");
require("./jobs/archivedChats")
const db = require("./database/db-connection");
const userRouter = require("./routers/userRouter");
const chatRouter = require("./routers/chatRouter")
const groupRouter = require("./routers/groupRouter");
const mediaRouter = require("./routers/mediaRouter");
const archiveRouter = require("./routers/archivedChatRouter");
const aiRouter = require("./routers/aiRouter");
const passwordRouter = require("./routers/passwordRouter");
require("./models/index");
const socketIO = require("./socket_io");
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

const io = socketIO(server);

app.set("io", io);
app.use("/users", userRouter);
app.use("/chat", chatRouter);
app.use("/groups", groupRouter);
app.use("/media", mediaRouter);
app.use(
    "/admin",
    archiveRouter
);

app.use("/ai", aiRouter);
app.use("/users/password", passwordRouter);
const PORT = process.env.PORT || 3000;

db.sync()
// db.sync({alter: true})
  .then(() => {
    console.log("Database synced successfully.");

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
