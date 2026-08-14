const express = require("express");

const authenticate =
    require("../middleware/authMiddleware");

const upload =
    require("../middleware/uploadMiddleware");

const {
    uploadAttachment,
    getAttachments,
    downloadAttachment,
    deleteAttachment
} = require("../controllers/attachmentController");


const router = express.Router();


// Upload
router.post(
    "/applications/:applicationId/attachments",
    authenticate,
    upload.single("file"),
    uploadAttachment
);


// Get attachment list
router.get(
    "/applications/:applicationId/attachments",
    authenticate,
    getAttachments
);


// Download
router.get(
    "/attachments/:id/download",
    authenticate,
    downloadAttachment
);


// Delete
router.delete(
    "/attachments/:id",
    authenticate,
    deleteAttachment
);


module.exports = router;