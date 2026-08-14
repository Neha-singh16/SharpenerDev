require("dotenv").config();

const app = require("./src/app");
const cron = require("node-cron");
const sequelize = require("./src/config/database");

require("./src/models");
const { processReminders } = require("./src/services/reminderScheduler");

cron.schedule("* * * * *", async () => {
  console.log("Checking reminders...");

  await processReminders();
});

console.log("Reminder scheduler started");
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();

    console.log("Database connected successfully");

    await sequelize.sync();

    console.log("Database tables synchronized");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
  }
}

startServer();
