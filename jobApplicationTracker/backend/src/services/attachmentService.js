// const { Attachment, Application } = require("../models");

// const fs = require("fs/promises");

// async function createAttachment(userId, applicationId, file, documentType) {
//   if (!file) {
//     const error = new Error("File is required");

//     error.statusCode = 400;

//     throw error;
//   }

//   const application = await Application.findOne({
//     where: {
//       id: applicationId,
//       userId,
//     },
//   });

//   if (!application) {
//     const error = new Error("Application not found");

//     error.statusCode = 404;

//     // Multer has already saved the file.
//     // Remove it because the application is invalid.

//     await fs.unlink(file.path).catch(() => {});

//     throw error;
//   }

//   const attachment = await Attachment.create({
//     userId,

//     applicationId,

//     originalName: file.originalname,

//     fileName: file.filename,

//     filePath: file.path,

//     mimeType: file.mimetype,

//     fileSize: file.size,

//     documentType: documentType || "OTHER",
//   });

//   return attachment;
// }

// async function getAttachments(userId, applicationId) {

//     const application = await Application.findOne({
//         where: {
//             id: applicationId,
//             userId
//         }
//     });

//     if (!application) {
//         const error = new Error("Application not found");
//         error.statusCode = 404;
//         throw error;
//     }

//     const attachments = await Attachment.findAll({
//         where: {
//             applicationId,
//             userId
//         },

//         attributes: [
//             "id",
//             "originalName",
//             "fileName",
//             "mimeType",
//             "fileSize",
//             "documentType",
//             "createdAt"
//         ],

//         order: [
//             ["createdAt", "DESC"]
//         ]
//     });
//     console.log("Attachments found:", attachments);

//     return attachments;
// }

// module.exports = {
//   createAttachment,
//   getAttachments
// };


const { Attachment, Application } = require("../models");

const crypto = require("crypto");

const { uploadFile, getFile, deleteFile } = require("./s3Service");


async function createAttachment(userId, applicationId, file, documentType) {
  // ------------------------------------------
  // 1. Check file
  // ------------------------------------------

  if (!file) {
    const error = new Error("File is required");

    error.statusCode = 400;

    throw error;
  }

  // ------------------------------------------
  // 2. Verify application belongs to user
  // ------------------------------------------

  const application = await Application.findOne({
    where: {
      id: applicationId,
      userId,
    },
  });

  if (!application) {
    const error = new Error("Application not found");

    error.statusCode = 404;

    throw error;
  }

  // ------------------------------------------
  // 3. Generate unique S3 filename
  // ------------------------------------------

  const extension = file.originalname.split(".").pop().toLowerCase();

  const uniqueName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

  // ------------------------------------------
  // 4. Create S3 object key
  // ------------------------------------------

  const fileKey = `users/${userId}/applications/${applicationId}/${uniqueName}`;

  // ------------------------------------------
  // 5. Upload to S3
  // ------------------------------------------

  await uploadFile(file, fileKey);

  // ------------------------------------------
  // 6. Save metadata in SQL database
  // ------------------------------------------

  try {
    const attachment = await Attachment.create({
      userId,

      applicationId,

      originalName: file.originalname,

      fileName: uniqueName,

      fileKey,

      mimeType: file.mimetype,

      fileSize: file.size,

      documentType: documentType || "OTHER",
    });

    return attachment;
  } catch (error) {
    /*
     * Database insert failed AFTER
     * S3 upload succeeded.
     *
     * Remove the S3 file so that we
     * don't leave an orphaned object.
     */

    await deleteFile(fileKey).catch(() => {});

    throw error;
  }
}

// ======================================================
// GET ATTACHMENTS
// ======================================================

async function getAttachments(userId, applicationId) {
  // ------------------------------------------
  // Verify application ownership
  // ------------------------------------------

  const application = await Application.findOne({
    where: {
      id: applicationId,
      userId,
    },
  });

  if (!application) {
    const error = new Error("Application not found");

    error.statusCode = 404;

    throw error;
  }

  // ------------------------------------------
  // Get attachment metadata
  // ------------------------------------------

  const attachments = await Attachment.findAll({
    where: {
      applicationId,
      userId,
    },

    attributes: [
      "id",
      "originalName",
      "fileName",
      "fileKey",
      "mimeType",
      "fileSize",
      "documentType",
      "createdAt",
    ],

    order: [["createdAt", "DESC"]],
  });

  return attachments;
}

// ======================================================
// DOWNLOAD ATTACHMENT
// ======================================================

async function downloadAttachment(userId, attachmentId) {
  // ------------------------------------------
  // Find attachment belonging to user
  // ------------------------------------------

  const attachment = await Attachment.findOne({
    where: {
      id: attachmentId,
      userId,
    },
  });

  if (!attachment) {
    const error = new Error("Attachment not found");

    error.statusCode = 404;

    throw error;
  }

  // ------------------------------------------
  // Get object from S3
  // ------------------------------------------

  const s3Object = await getFile(attachment.fileKey);

  return {
    attachment,
    stream: s3Object.Body,
  };
}

// ======================================================
// DELETE ATTACHMENT
// ======================================================

async function deleteAttachment(userId, attachmentId) {
  // ------------------------------------------
  // Find attachment belonging to user
  // ------------------------------------------

  const attachment = await Attachment.findOne({
    where: {
      id: attachmentId,
      userId,
    },
  });

  if (!attachment) {
    const error = new Error("Attachment not found");

    error.statusCode = 404;

    throw error;
  }

  // ------------------------------------------
  // Delete from S3
  // ------------------------------------------

  await deleteFile(attachment.fileKey);

  await attachment.destroy();
}

module.exports = {
  createAttachment,
  getAttachments,
  downloadAttachment,
  deleteAttachment,
};
