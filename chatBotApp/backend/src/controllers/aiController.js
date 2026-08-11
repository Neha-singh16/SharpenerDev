const geminiService = require("../services/geminiService");
const chatService = require("../services/chatService");

async function predictTyping(req, res) {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    const suggestions = await geminiService.generateTypingSuggestions(
      text.trim(),
    );

    res.status(200).json({
      suggestions,
    });
  } catch (err) {
    console.error("AI prediction error:", err);

    res.status(500).json({
      error: "Failed to generate suggestions",
    });
  }
}
async function smartReplies(req, res) {

    try {

        const { message } = req.body;

        const recentMessages =
            await chatService.getUserRecentMessages(
                req.user.id
            );

        const replies =
            await geminiService.generateSmartReplies(
                message,
                recentMessages
            );

        res.status(200).json({
            replies
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }
}

module.exports = {
    predictTyping,
    smartReplies
};