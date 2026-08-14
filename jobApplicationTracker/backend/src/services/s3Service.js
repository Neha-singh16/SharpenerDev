const {
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} = require("@aws-sdk/client-s3");

const s3 =
    require("../config/s3");


const bucketName =
    process.env.AWS_S3_BUCKET_NAME;


async function uploadFile(
    file,
    key
) {

    const command =
        new PutObjectCommand({

            Bucket: bucketName,

            Key: key,

            Body: file.buffer,

            ContentType: file.mimetype

        });


    await s3.send(command);


    return key;
}


async function getFile(key) {

    const command =
        new GetObjectCommand({

            Bucket: bucketName,

            Key: key

        });


    return await s3.send(command);
}


async function deleteFile(key) {

    const command =
        new DeleteObjectCommand({

            Bucket: bucketName,

            Key: key

        });


    await s3.send(command);
}


module.exports = {
    uploadFile,
    getFile,
    deleteFile
};