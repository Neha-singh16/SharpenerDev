const chatService = require("../services/chatService");


async function postMessage(req, res) {
  try {
    const io = req.app.get("io");
    const { message } = req.body;
    const chat = await chatService.postMessage(req.user.id, message);
    // io.emit("receive-message", chat);
    io.emit("receive-message", {
   userId: chat.user.id,
    username: chat.user.username,
    message: chat.message,
    createdAt: chat.createdAt
});

    res.status(201).json({ message: "Message posted successfully", chat });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}

async function getAllMessages(req,res){
    try{
        const chats = await chatService.getAllMessages();
        
          res.status(201).json({ message: "Message fetched successfully", chats });
         

    }catch(err){
         res.status(500).json({
      error: err.message,
    });
    }
}


module.exports = {
  postMessage,
  getAllMessages
};
