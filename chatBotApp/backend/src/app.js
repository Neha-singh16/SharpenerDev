const express = require("express");
const app = express();
const cors = require("cors");


// Import Node's built-in HTTP module
// We need this because Socket.IO attaches to an HTTP server, NOT directly to Express.
require("dotenv").config();


// Import Node's built-in HTTP module
// We need this because Socket.IO attaches to an HTTP server, NOT directly to Express.
const http = require("http");

// Create an actual HTTP server and pass the Express app into it.
// Think of it as:
// Browser --> HTTP Server --> Express
const server = http.createServer(app);

const { Server } = require("socket.io");
const db = require("./database/db-connection");
const userRouter = require("./routers/userRouter");
const chatRouter = require("./routers/chatRouter");
require("./models/index");

app.use(express.json());
app.use(cors());

//
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store the Socket.IO instance inside Express.
//
// Why?
// Because later inside controllers we need access to "io".
//
// app.js
// |
// |-- io
//
// Controller
// |
// |-- req.app.get("io")  <-- retrieves it
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
 // We use server.listen()
    // NOT app.listen()
    //
    // because Socket.IO is attached to "server".
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

