// const cron = require("node-cron");

// const { Reminder, User } = require("../models");

// const { Op } = require("sequelize");

// const { sendReminderEmail } = require("../services/emailService");

// function startReminderJob() {
//   cron.schedule("* * * * *", async () => {
//     try {
//       const now = new Date();

//       const reminders = await Reminder.findAll({
//         where: {
//           reminderAt: {
//             [Op.lte]: now,
//           },

//           completed: false,

//           emailSent: false,
//         },

//         include: [
//           {
//             model: User,
//             attributes: ["email", "name"],
//           },
//         ],
//       });

//       for (const reminder of reminders) {
//         try {
//           await sendReminderEmail(
//             reminder.User.email,

//             `Job Application Reminder: ${reminder.title}`,

//             reminder.message || `Reminder for your job application.`,
//           );

//           await reminder.update({
//             emailSent: true,
//           });
//         } catch (emailError) {
//           console.error("Email failed:", emailError.message);
//         }
//       }
//     } catch (error) {
//       console.error("Reminder job failed:", error.message);
//     }
//   });

//   // console.log("Reminder scheduler started");
// }

// module.exports = {
//   startReminderJob,
// };



const cron = require("node-cron");
const { Reminder, User, Application } = require("../models");
const { Op } = require("sequelize");

const { sendReminderEmail } = require("../services/emailService");

function startReminderJob() {
  console.log("Reminder scheduler started");

  // Runs every minute
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      console.log("Checking reminders:", now.toLocaleString());

      const reminders = await Reminder.findAll({
        where: {
          reminderAt: {
            [Op.lte]: now,
          },

          isCompleted: false,
          emailSent: false,
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

      if (reminders.length === 0) {
        return;
      }

      console.log(`Found ${reminders.length} reminder(s)`);

      for (const reminder of reminders) {
        try {
          if (!reminder.User) {
            console.error(
              `User not found for reminder ${reminder.id}`
            );
            continue;
          }

          if (!reminder.Application) {
            console.error(
              `Application not found for reminder ${reminder.id}`
            );
            continue;
          }

          await sendReminderEmail(
            reminder.User.email,
            reminder,
            reminder.Application
          );

          await reminder.update({
            emailSent: true,
          });

          console.log(
            `Reminder ${reminder.id} processed successfully`
          );

        } catch (emailError) {
          console.error(
            `Failed to send reminder ${reminder.id}:`,
            emailError.response?.body || emailError.message
          );
        }
      }

    } catch (error) {
      console.error(
        "Reminder scheduler failed:",
        error.message
      );
    }
  });
}

module.exports = {
  startReminderJob,
};