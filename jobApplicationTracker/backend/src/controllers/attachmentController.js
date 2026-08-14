const attachmentService = require("../services/attachmentService");

// ======================================================
// UPLOAD
// ======================================================

async function uploadAttachment(req, res, next) {
  try {
    const attachment = await attachmentService.createAttachment(
      req.user.id,

      req.params.applicationId,

      req.file,

      req.body.documentType,
    );

    res.status(201).json({
      success: true,

      message: "Attachment uploaded successfully",

      data: attachment,
    });
  } catch (error) {
    next(error);
  }
}

// ======================================================
// GET ATTACHMENTS
// ======================================================

async function getAttachments(req, res, next) {
  try {
    const attachments = await attachmentService.getAttachments(
      req.user.id,

      req.params.applicationId,
    );

    res.status(200).json({
      success: true,

      data: attachments,
    });
  } catch (error) {
    next(error);
  }
}

// ======================================================
// DOWNLOAD
// ======================================================

async function downloadAttachment(req, res, next) {
  try {
    const result = await attachmentService.downloadAttachment(
      req.user.id,

      req.params.id,
    );

    const { attachment, stream } = result;

    res.setHeader("Content-Type", attachment.mimeType);

    res.setHeader("Content-Length", attachment.fileSize);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${attachment.originalName}"`,
    );

    stream.pipe(res);
  } catch (error) {
    next(error);
  }
}

// ======================================================
// DELETE
// ======================================================

async function deleteAttachment(req, res, next) {
  try {
    await attachmentService.deleteAttachment(
      req.user.id,

      req.params.id,
    );

    res.status(200).json({
      success: true,

      message: "Attachment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadAttachment,

  getAttachments,

  downloadAttachment,

  deleteAttachment,
};
