const cron = require("node-cron");

const { Reminder, User } = require("../models");

const { Op } = require("sequelize");

const { sendReminderEmail } = require("../services/emailService");

function startReminderJob() {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const reminders = await Reminder.findAll({
        where: {
          reminderAt: {
            [Op.lte]: now,
          },

          completed: false,

          emailSent: false,
        },

        include: [
          {
            model: User,
            attributes: ["email", "name"],
          },
        ],
      });

      for (const reminder of reminders) {
        try {
          await sendReminderEmail(
            reminder.User.email,

            `Job Application Reminder: ${reminder.title}`,

            reminder.message || `Reminder for your job application.`,
          );

          await reminder.update({
            emailSent: true,
          });
        } catch (emailError) {
          console.error("Email failed:", emailError.message);
        }
      }
    } catch (error) {
      console.error("Reminder job failed:", error.message);
    }
  });

  // console.log("Reminder scheduler started");
}

module.exports = {
  startReminderJob,
};
