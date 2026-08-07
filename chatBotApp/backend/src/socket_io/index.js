const { Server } = require("socket.io");
const socketAuth = require("./middleware");
const chatHandler = require("./handler/personal_chat/chat");
const personalChatHandler = require("./handler/personal_chat/personal_chat");
const groupChatHandler = require("./handler/groupchat")


module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

    console.log("IO CREATED =", !!io);
  socketAuth(io);


  io.on("connection", (socket) => {
        console.log("Connection established");

    console.log("Passing io =", !!io);

    chatHandler(socket);
    personalChatHandler(socket,io);
    groupChatHandler(socket,io);
  });
  return io;
};
