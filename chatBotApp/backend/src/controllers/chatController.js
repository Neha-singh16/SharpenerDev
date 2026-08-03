const chatService = require("../services/chatService");

async function postMessage(req, res) {
  try {
    const { userId, message } = req.body;
    const chat = await chatService.postMessage(userId, message);
    res.status(201).json({ message: "Message posted successfully", chat });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}

module.exports = {
  postMessage,
};
