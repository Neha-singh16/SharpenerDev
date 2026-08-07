const {PutObjectCommand} = require("@aws-sdk/client-s3");
const {v4: uuidv4} = require("uuid");

const s3 = require("../utils/aws");

async function uploadFile(file){
    const fileName = `${uuidv4()}-${file.originalname}`;
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    });

    await s3.send(command);
    
return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}

// async function mediaSend(){

// }
module.exports = {
    uploadFile,
};