const { Server } = require("socket.io");
const socketAuth = require("./middleware");
const chatHandler = require("./handler/chat");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  socketAuth(io);


  io.on("connection", (socket) => {
    chatHandler(socket);
  });
  return io;
};
