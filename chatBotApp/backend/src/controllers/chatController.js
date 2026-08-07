const chatService = require("../services/chatService");


async function postMessage(req, res) {
  try {
    const io = req.app.get("io");

    const { message, roomId , groupId } = req.body;

    const chat = await chatService.postMessage(
      req.user.id,

      roomId,
      groupId,

    
      message,
    );

    io.to(roomId).emit("receive-message", {
      userId: chat.user.id,

      username: chat.user.username,

      message: chat.message,

      createdAt: chat.createdAt,
    });

    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}
async function getAllMessages(req, res) {
  try {
    const chats = await chatService.getAllMessages();

    res.status(201).json({ message: "Message fetched successfully", chats });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}
async function getRoomMessages(req,res){

    try{

        const {roomId}=req.params;

        const chats=await chatService.getRoomMessages(roomId);

        res.status(200).json({

            chats

        });

    }

    catch(err){

        res.status(500).json({

            error:err.message

        });

    }

}
async function searchEmail(req, res) {
  try {
    const { email } = req.query;

    const user = await chatService.searchEmail(email);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.status(200).json({
      message: "User found",
      user,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}

module.exports = {
  postMessage,
  getAllMessages,
  getRoomMessages,
  searchEmail,
};
