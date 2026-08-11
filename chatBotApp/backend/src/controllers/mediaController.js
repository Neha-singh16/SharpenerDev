const mediaService = require("../services/mediaService");
const chatService = require("../services/chatService");
const groupService = require("../services/groupService");


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


        const mediaUrl =
            await mediaService.uploadFile(req.file);


        res.status(200).json({

            message: "Uploaded Successfully",

            mediaUrl,

            mediaType: req.file.mimetype,

            fileName: req.file.originalname,

            fileSize: req.file.size,

        });


    } catch (err) {

        console.error(
            "Upload error:",
            err
        );

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

        const {
            roomId = null,
            groupId = null,
            mediaUrl,
            mediaType,
            fileName,
            fileSize,
        } = req.body;


        // ------------------------------------
        // Validate destination
        // ------------------------------------

        if (!roomId && !groupId) {

            return res.status(400).json({
                error: "roomId or groupId is required",
            });

        }


        if (!mediaUrl || !mediaType) {

            return res.status(400).json({
                error: "mediaUrl and mediaType are required",
            });

        }


        // ====================================
        // PERSONAL CHAT
        // ====================================

        if (roomId) {

            const chat =
                await chatService.postMessage({

                    userId: req.user.id,

                    roomId,

                    groupId: null,

                    message: null,

                    mediaUrl,

                    mediaType,

                    fileName,

                    fileSize,

                });


            // Socket.IO
            req.app
                .get("io")
                .to(roomId)
                .emit(
                    "receive-message",
                    chat
                );


            return res.status(201).json(chat);
        }


        // ====================================
        // GROUP CHAT
        // ====================================

        if (groupId) {

            const chat =
                await groupService.saveGroupMessage({

                    userId: req.user.id,

                    groupId,

                    message: null,

                    mediaUrl,

                    mediaType,

                    fileName,

                    fileSize,

                });


            req.app
                .get("io")
                .to(`group_${groupId}`)
                .emit(
                    "receive-group-message",
                    chat
                );


            return res.status(201).json(chat);
        }

    } catch (err) {

        console.error(
            "Send media error:",
            err
        );

        return res.status(500).json({
            error: err.message,
        });
    }
}


module.exports = {
    uploadMedia,
    sendMedia,
};