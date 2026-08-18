
const { Op } = require("sequelize");

const { Reminder, User, Application } = require("../models");
const { sendReminderEmail } = require("./emailService");

async function processReminders() {
  try {
    const now = new Date();

    console.log("=================================");
    console.log("Checking reminders:", now.toLocaleString());
    console.log("Current UTC:", now.toISOString());

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
          attributes: ["id", "email", "name"],
        },

        {
          model: Application,
          attributes: ["id", "jobTitle"],
        },
      ],
    });

    console.log("Due reminders found:", reminders.length);

    if (reminders.length === 0) {
      console.log("No reminders are due.");
      return;
    }

    for (const reminder of reminders) {
      console.log("---------------------------------");
      console.log("Processing reminder:", reminder.id);
      console.log("Title:", reminder.title);
      console.log("Reminder time:", reminder.reminderAt);
      console.log("Email sent:", reminder.emailSent);
      console.log("Completed:", reminder.isCompleted);

      if (!reminder.User) {
        console.error(
          `User not found for reminder ${reminder.id}`,
        );

        continue;
      }

      if (!reminder.Application) {
        console.error(
          `Application not found for reminder ${reminder.id}`,
        );

        continue;
      }

      console.log("Recipient:", reminder.User.email);
      console.log(
        "Application:",
        reminder.Application.jobTitle,
      );

      try {
        console.log("Sending email through SendGrid...");

        await sendReminderEmail(
          reminder.User.email,
          reminder,
          reminder.Application,
        );

        console.log("SendGrid accepted the email.");

        await reminder.update({
          emailSent: true,
           isCompleted: true,
        });

        console.log(
          `Reminder ${reminder.id} marked as emailSent=true`,
        );

      } catch (emailError) {
        console.error(
          "SENDGRID ERROR:",
          emailError.response?.body || emailError,
        );
      }
    }

    console.log("=================================");

  } catch (error) {
    console.error(
      "REMINDER SCHEDULER ERROR:",
      error,
    );
  }
}

module.exports = {
  processReminders,
};