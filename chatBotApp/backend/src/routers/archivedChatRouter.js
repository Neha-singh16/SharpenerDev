const router = require("express").Router();
const archivedController = require("../controllers/archivedChatController");
const {auth }= require("../middleware/auth");

router.post("/archive",auth, archivedController.archiveChats);

module.exports = router;