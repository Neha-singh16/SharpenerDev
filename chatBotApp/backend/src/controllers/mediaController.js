const mediaService = require("../services/mediaService");
const groupService = require("../services/groupService");

async function uploadMedia(req,res){
    try{
      if(!req.file){
         return res.status(400).json({
                error: "No file uploaded"
            });
      }

      console.log(req.file);
      const url = await mediaService.uploadFile(req.file);
        res.status(200).json({
            message: "Uploaded Successfully",
            url
        });
    }catch(err){
        console.log(err);
          res.status(500).json({
            error: err.message
        });

    }
}


async function sendMedia(req,res){

    const {groupId, mediaUrl, mediaType} = req.body;

    const chat = await groupService.saveGroupMessage(
        req.user.id,
        groupId,
        mediaUrl,
        mediaType,
         null,
    );

    req.app.get("io")
        .to(`group_${groupId}`)
        .emit("receive-group-message", chat);

    res.json(chat);
}


module.exports = {
    uploadMedia,
    sendMedia
};