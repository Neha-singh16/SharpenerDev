const { Server } = require("socket.io");
const socketAuth = require("./middleware");
const chatHandler = require("./handler/personal_chat/chat");
const personalChatHandler = require("./handler/personal_chat/personal_chat");


module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  socketAuth(io);


  io.on("connection", (socket, io) => {
    chatHandler(socket);
    personalChatHandler(socket,io);
  });
  return io;
};
