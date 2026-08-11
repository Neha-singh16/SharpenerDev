const chatService = require("../services/chatService");

// ==========================================
// SEND PERSONAL MESSAGE
// ==========================================

async function postMessage(req, res) {
  try {
    const io = req.app.get("io");

    const {
      roomId,

      groupId,

      message = null,

      mediaUrl = null,

      mediaType = null,

      fileName = null,

      fileSize = null,
    } = req.body;

    const chat = await chatService.postMessage({
      userId: req.user.id,

      roomId,

      groupId,

      message,

      mediaUrl,

      mediaType,

      fileName,

      fileSize,
    });

    // Only emit to personal room
    if (roomId) {
      io.to(roomId).emit("receive-message", chat);
    }

    res.status(201).json(chat);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
}

// ==========================================
// GET ALL
// ==========================================

async function getAllMessages(req, res) {
  try {
    const chats = await chatService.getAllMessages();

    res.status(200).json({
      message: "Messages fetched successfully",

      chats,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}

async function getConversations(req, res) {
  try {
    const conversations = await chatService.getConversations(req.user.id);

    res.status(200).json({
      conversations,
    });
  } catch (err) {
    console.error("Get conversations error:", err);

    res.status(500).json({
      error: "Failed to load conversations",
    });
  }
}
// ==========================================
// GET PERSONAL CHAT
// ==========================================

async function getRoomMessages(req, res) {
  try {
    const { roomId } = req.params;

    const chats = await chatService.getRoomMessages(roomId);

    res.status(200).json({
      chats,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}

// ==========================================
// SEARCH USER
// ==========================================

async function searchEmail(req, res) {
  try {
    const { email } = req.query;
    console.log("QUERY:", req.query);
    console.log("EMAIL FROM QUERY:", email);

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
    console.log("SEARCH ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
}

module.exports = {
  postMessage,

  getAllMessages,

  getConversations,

  getRoomMessages,

  searchEmail,
};
