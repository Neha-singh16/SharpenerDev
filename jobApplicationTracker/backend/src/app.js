const express = require("express");
const cors = require("cors");

const authRoutes = require("./routers/authRouter");
const profileRoutes = require("./routers/profileRouter");
const errorHandler = require("./middleware/errorMiddleware")
;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Job Application Tracker API is running"
    });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);

app.use(errorHandler);
module.exports = app;