// const multer = require('multer');
// const path = require("path");
// const crypto = require("crypto");
// const fs = require("fs");

// const uploadDirectory = path.join(__dirname, "../../uploads/applications");

// if (!fs.existsSync(uploadDirectory)) {
//     fs.mkdirSync(uploadDirectory, {
//         recursive: true
//     });
// }

// const storage = multer.diskStorage({

//     destination: function (req, file, cb) {
//         cb(null, uploadDirectory);
//     },

//     filename: function (req, file, cb) {

//         const extension =
//             path.extname(file.originalname);

//         const uniqueName =
//             `${crypto.randomUUID()}${extension}`;

//         cb(null, uniqueName);
//     }
// });

// const allowedMimeTypes = [
//     "application/pdf",

//     "application/msword",

//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

//     "image/jpeg",

//     "image/png"
// ];

// const fileFilter = (req, file, cb) => {

//     console.log("Uploaded file:");
//     console.log("Original name:", file.originalname);
//     console.log("MIME type:", file.mimetype);

//     if (!allowedMimeTypes.includes(file.mimetype)) {

//         const error = new Error(
//             "Only PDF, DOC, DOCX, JPG and PNG files are allowed"
//         );

//         error.statusCode = 400;

//         return cb(error);
//     }

//     cb(null, true);
// };
// const upload = multer({

//     storage,

//     fileFilter,

//     limits: {
//         fileSize: 5 * 1024 * 1024
//     }

// });

// module.exports = upload;

const multer = require("multer");

// Store uploaded file temporarily in memory.
// We will immediately send it to AWS S3.
const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "application/pdf",

  "application/msword",

  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  "image/jpeg",

  "image/png",
];

const fileFilter = (req, file, cb) => {
  console.log("Uploaded file:");
  console.log("Original name:", file.originalname);
  console.log("MIME type:", file.mimetype);

  if (!allowedMimeTypes.includes(file.mimetype)) {
    const error = new Error(
      "Only PDF, DOC, DOCX, JPG and PNG files are allowed",
    );

    error.statusCode = 400;

    return cb(error);
  }

  cb(null, true);
};

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;
