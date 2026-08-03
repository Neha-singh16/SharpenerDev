const router = require("express").Router();
const chatController = require("../controllers/chatController");
const {auth} = require("../middleware/auth");

router.post("/post-message", auth, chatController.postMessage);
router.get("/read-messages", auth, chatController.getAllMessages);

module.exports = router;