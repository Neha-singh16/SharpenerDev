const router = require("express").Router();
const chatController = require("../controllers/chatController");

router.post("/message", chatController.postMessage);

module.exports = router;