const express = require("express");
const cors = require("cors");

const authRoutes = require("./routers/authRouter");
const profileRoutes = require("./routers/profileRouter");
const companyRoutes = require("./routers/companyRouter");
const jobRoutes = require("./routers/jobRouter");
const applicationRoutes = require("./routers/applicationRouter");
const attachmentRoutes = require("./routers/attachmentRoutes");
const reminderRoutes = require("./routers/reminderRouter");
const { startReminderJob } = require("./jobs/reminderJobs");
const noteRoutes = require("./routers/noteRouter");
const dashboardRoutes = require("./routers/dashboardRouter");
const errorHandler = require("./middleware/errorMiddleware");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Job Application Tracker API is running",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1", attachmentRoutes);
app.use("/api/v1", reminderRoutes);
app.use("/api/v1", noteRoutes);
app.use("/api/v1", dashboardRoutes);
app.use(errorHandler);

startReminderJob();
module.exports = app;
