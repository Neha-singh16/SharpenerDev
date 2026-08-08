// const mediaService = require("../services/mediaService");
// const groupService = require("../services/groupService");

// async function uploadMedia(req, res) {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         error: "No file uploaded",
//       });
//     }

//     console.log(req.file);
//     const url = await mediaService.uploadFile(req.file);
//     res.status(200).json({
//       message: "Uploaded Successfully",
//       mediaUrl: url,

//       mediaType: req.file.mimetype,

//       fileName: req.file.originalname,

//       fileSize: req.file.size,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       error: err.message,
//     });
//   }
// }

// async function sendMedia(req, res) {
//   try {
//     const { groupId, mediaUrl, mediaType, fileName, fileSize } = req.body;

//     const chat = await groupService.saveGroupMessage({
//       userId: req.user.id,
//       groupId,
//       mediaUrl,
//       mediaType,
//       fileName,
//       fileSize,
//         message: null
//     });

//     req.app
//       .get("io")
//       .to(`group_${groupId}`)
//       .emit("receive-group-message", chat);

//     res.json(chat);
//   } catch (err) {
//     res.status(500).json({
//       error: err.message,
//     });
//   }
// }

// module.exports = {
//   uploadMedia,
//   sendMedia,
// };

const mediaService = require("../services/mediaService");
const chatService = require("../services/chatService");

// ==========================================
// UPLOAD FILE TO S3
// ==========================================

async function uploadMedia(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    const mediaUrl = await mediaService.uploadFile(req.file);

    res.status(200).json({
      message: "Uploaded Successfully",

      mediaUrl,

      mediaType: req.file.mimetype,

      fileName: req.file.originalname,

      fileSize: req.file.size,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
}

// ==========================================
// CREATE MEDIA CHAT MESSAGE
// ==========================================

async function sendMedia(req, res) {
  try {
    const { groupId, mediaUrl, mediaType, fileName, fileSize } = req.body;

    if (!groupId || !mediaUrl || !mediaType) {
      return res.status(400).json({
        error: "groupId, mediaUrl and mediaType are required",
      });
    }

    const chat = await chatService.postMessage({
      userId: req.user.id,

      groupId,

      message: null,

      mediaUrl,

      mediaType,

      fileName,

      fileSize,
    });

    const io = req.app.get("io");

    io.to(`group_${groupId}`).emit("receive-group-message", chat);

    res.status(201).json(chat);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
}

module.exports = {
  uploadMedia,

  sendMedia,
};
