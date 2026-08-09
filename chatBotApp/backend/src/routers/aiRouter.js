const router = require("express").Router();
const aiController = require("../controllers/aiController");
const {auth} = require("../middleware/auth");

router.post("/predict", auth , aiController.predictTyping);

router.post(
    "/smart-replies",
    auth,
    aiController.smartReplies
);
module.exports = router;