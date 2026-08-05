const chatService = require("../../../services/chatService");

module.exports = (socket , io) => {
  console.log(socket.user.username, "connected");
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(socket.user.username, "joined", roomId);
  });


  socket.on("new-message", async ({ roomId, message }) => {
    console.log({ roomId, message });

    const chat = await chatService.postMessage(
      socket.user.id,
      message
    );

    io.to(roomId).emit("receive-message", {
      username: socket.user.username,

      userId: socket.user.id,

      message,

      createdAt: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log(socket.user.username, "left");
  });
};
