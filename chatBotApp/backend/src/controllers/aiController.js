const geminiService = require("../services/geminiService");

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

async function smartReplies(req,res){
    try{
        const {message} = req.body;
          if (!message || !message.trim()) {

            return res.status(400).json({
                error: "Message is required"
            });

        }

        const replies =
            await geminiService.generateSmartReplies(
                message.trim()
            );

        res.status(200).json({
            replies
        });


    }catch(err){
          console.error(
            "Smart replies error:",
            err
        );

        res.status(500).json({
            error: "Failed to generate smart replies"
        });
    }
}

module.exports = {
    predictTyping,
    smartReplies
};