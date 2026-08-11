// AWS S3 Configuration - Commented out for local development
// Uncomment the following for AWS S3 usage:
/*
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
*/

// Local File Storage Configuration for development
const fs = require('fs');
const path = require('path');

// Create a local mock object that mimics S3 interface
const localStorage = {
    upload: async (params) => {
        try {
            const uploadsDir = path.join(__dirname, '../uploads');
            
            // Create uploads directory if it doesn't exist
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }
            
            const filePath = path.join(uploadsDir, params.Key);
            fs.writeFileSync(filePath, params.Body);
            
            console.log(`File uploaded locally: ${params.Key}`);
            return {
                Location: `local://${params.Key}`,
                Key: params.Key,
            };
        } catch (error) {
            console.error('Local upload error:', error);
            throw error;
        }
    },
    getSignedUrl: (operation, params) => {
        // For local development, return a file:// URL or a local server path
        const fileUrl = `/downloads/${params.Key}`;
        console.log(`Generated local URL: ${fileUrl}`);
        return fileUrl;
    }
};

console.log("Using Local File Storage Configuration");

module.exports = localStorage;