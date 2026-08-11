const router = require("express").Router();
const chatController = require("../controllers/chatController");
const { auth } = require("../middleware/auth");

router.post("/post-message", auth, chatController.postMessage);
router.get("/read-messages", auth, chatController.getAllMessages);
router.get(
    "/conversations",
    auth,
    chatController.getConversations
);
router.get("/search", auth, chatController.searchEmail);
router.get("/messages/:roomId", auth, chatController.getRoomMessages);

module.exports = router;
