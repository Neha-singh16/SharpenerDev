const router = require("express").Router();

const upload = require("../middleware/upload");

const mediaController = require("../controllers/mediaController");

const {auth} = require("../middleware/auth");

router.post(
    "/upload",
   auth,
    upload.single("file"),
    mediaController.uploadMedia
);
router.post("/send", auth, mediaController.sendMedia);
module.exports = router;