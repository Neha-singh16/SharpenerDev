const chatService = require("../../services/chatService");

module.exports = (socket, io) => {
  socket.on("join-group", (groupId) => {
    socket.join(`group_${groupId}`);

    console.log(socket.user.username, "joined group", groupId);
  });

  socket.on("leave-group", (groupId) => {
    socket.leave(`group_${groupId}`);
  });

  socket.on("group-message", async ({ groupId, message }) => {
    try {
      const chat = await chatService.postMessage({
        userId: socket.user.id,

        groupId,

        message,

        mediaUrl: null,

        mediaType: null,

        fileName: null,

        fileSize: null,
      });

      io.to(`group_${groupId}`).emit("receive-group-message", chat);
    } catch (err) {
      console.error("Group message error:", err);
    }
  });
  socket.on("disconnect", () => {
    console.log(socket.user.username, "left");
  });
};
