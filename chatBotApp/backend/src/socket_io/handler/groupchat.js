// const chatService = require("../../services/chatService");
// const groupService = require("../../services/groupService");

// module.exports = (socket, io) => {
//   socket.on("join-group", (groupId) => {
//     socket.join(`group_${groupId}`);

//     console.log(socket.user.username, "joined group", groupId);
//   });


//   socket.on("leave-group", (groupId) => {
//     socket.leave(`group_${groupId}`);
//   });


//   socket.on("group-message", async ({ groupId, message }) => {
//     const chat = await groupService.saveGroupMessage(
//       socket.user.id,

//       groupId,

//       message,
//     );

//     io.to(groupId).emit(
//       "receive-group-message",

//       chat,
//     );

//   });
//   socket.on("disconnect", () => {
//     console.log(socket.user.username, "left");
//   });
// };


const groupService = require("../../services/groupService");

module.exports = (socket, io) => {

    console.log("group handler loaded");
    console.log("io =", io);

    socket.on("join-group", (groupId) => {
        socket.join(`group_${groupId}`);
        console.log(socket.user.username, "joined", groupId);
    });

    socket.on("group-message", async ({ groupId, message }) => {

        console.log("Inside group-message");
        console.log("io =", io);

        const chat = await groupService.saveGroupMessage(
            socket.user.id,
            groupId,
            message
        );

        io.to(`group_${groupId}`).emit(
            "receive-group-message",
            chat
        );
    });
};