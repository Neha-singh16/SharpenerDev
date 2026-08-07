const groupController = require("../controllers/groupController");
const {auth} = require("../middleware/auth");

const router = require("express").Router();

router.post("/create-group",auth , groupController.createGroup);
router.get("/", auth, groupController.getAllGroup);
router.get("/:groupId/messages",auth, groupController.getGroupMessages);
router.post("/add-members/:groupId", auth, groupController.addMembersToGroup);
router.delete("/delete-member/:groupId/:userId", auth, groupController.deleteMember);
module.exports = router;