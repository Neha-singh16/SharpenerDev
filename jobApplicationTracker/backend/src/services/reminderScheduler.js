const { Op } = require("sequelize");

const { Reminder, User, Application } = require("../models");

const { sendReminderEmail } = require("./emailService");

async function processReminders() {
  const now = new Date();

  const reminders = await Reminder.findAll({
    where: {
      reminderAt: {
        [Op.lte]: now,
      },

      emailSent: false,

      isCompleted: false,
    },

    include: [
      {
        model: User,

        attributes: ["id", "email"],
      },

      {
        model: Application,

        attributes: ["id", "jobTitle"],
      },
    ],
  });

  for (const reminder of reminders) {
    try {
      await sendReminderEmail(
        reminder.User.email,

        reminder,

        reminder.Application,
      );

      await reminder.update({
        emailSent: true,
      });

      console.log(`Reminder email sent: ${reminder.id}`);
    } catch (error) {
      console.error(`Failed reminder ${reminder.id}:`, error.message);
    }
  }
}

module.exports = {
  processReminders,
};
