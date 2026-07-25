const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    
    accessKeyId : process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION

});
console.log("Access Key:", process.env.AWS_ACCESS_KEY);
console.log("Region:", process.env.AWS_REGION);
console.log("Bucket:", process.env.AWS_BUCKET_NAME);

module.exports = s3;