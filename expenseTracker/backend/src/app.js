
require("dotenv").config();


const express = require("express");
const cors = require('cors');
const compression = require("compression");
const path = require('path');
const fs = require('fs');
const app = express();

const connectDB = require('../utils/db');

const userRouter = require("../router/userRouter")
const expenseRouter = require("../router/expenseRouter");
const { requestLogger , errorHandler, notFound} = require("../utils/middleware");
const purchaseRouter = require("../router/purchaseRouter");
const passwordRouter = require("../router/passwordRouter");
const downloadRouter = require("../router/downloadRouter");



app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(compression());
app.use(requestLogger);

// Serve static files from uploads directory for local development
const backendDir = path.dirname(__dirname);
const uploadsPath = path.join(backendDir, 'uploads');

// Ensure uploads directory exists
// if (!fs.existsSync(uploadsPath)) {
//     fs.mkdirSync(uploadsPath, { recursive: true });
// }

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, {
    recursive: true,
  });
}

console.log("Serving downloads from:", uploadsPath);
app.use('/downloads', express.static(uploadsPath));

app.use("/users", userRouter);
app.use("/users/expenses", expenseRouter);
app.use("/users/purchase", purchaseRouter);
app.use("/users/password", passwordRouter);
app.use("/users/download", downloadRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// console.log("Registered models:", Object.keys(connectDB.models));

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
 
// db.sync()
// .then(() => {
//     console.log("Database synced successfully.");

//     app.listen(PORT, () => {
//         console.log(`Server is running on port ${PORT}`);
//     });
// })
// .catch((err) => {
//     console.log(err);
// });

