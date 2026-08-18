// const sgMail = require("@sendgrid/mail");

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// async function sendReminderEmail(to, reminder, application) {
//   const message = {
//     to,

//     from: process.env.SENDGRID_FROM_EMAIL,

//     subject: `Job Tracker Reminder: ${reminder.title}`,

//     text: `
// Reminder: ${reminder.title}

// ${reminder.message || ""}

// Job: ${application.jobTitle}

// Reminder time:
// ${new Date(reminder.reminderAt).toLocaleString()}
//         `,

//     html: `
//             <div style="font-family: Arial, sans-serif;">

//                 <h2>Job Application Reminder</h2>

//                 <h3>
//                     ${reminder.title}
//                 </h3>

//                 <p>
//                     ${reminder.message || ""}
//                 </p>

//                 <p>
//                     <strong>Job:</strong>
//                     ${application.jobTitle}
//                 </p>

//                 <p>
//                     <strong>Reminder:</strong>
//                     ${new Date(reminder.reminderAt).toLocaleString()}
//                 </p>

//             </div>
//         `,
//   };

//   await sgMail.send(message);
// }

// module.exports = {
//   sendReminderEmail,
// };


const sgMail = require("@sendgrid/mail");

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY is not configured");
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

async function sendReminderEmail(to, reminder, application) {
  const message = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL,

    subject: `Job Tracker Reminder: ${reminder.title}`,

    text: `
Hello,

This is a reminder from your Job Application Tracker.

Reminder:
${reminder.title}

Message:
${reminder.message || "No additional message"}

Job:
${application.jobTitle}

Reminder Time:
${new Date(reminder.reminderAt).toLocaleString()}

Please check your Job Application Tracker.

Thanks,
Job Application Tracker
`,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">

        <h2>Job Application Reminder</h2>

        <p>Hello,</p>

        <p>
          This is a reminder from your Job Application Tracker.
        </p>

        <hr />

        <h3>${reminder.title}</h3>

        <p>
          ${reminder.message || "No additional message"}
        </p>

        <p>
          <strong>Job:</strong> ${application.jobTitle}
        </p>

        <p>
          <strong>Reminder Time:</strong>
          ${new Date(reminder.reminderAt).toLocaleString()}
        </p>

        <hr />

        <p>
          Please check your Job Application Tracker.
        </p>

      </div>
    `,
  };

  try {
    await sgMail.send(message);

    console.log(`Reminder email sent successfully to ${to}`);
  } catch (error) {
    console.error("SendGrid email error:", error.response?.body || error);
    throw error;
  }
}

module.exports = {
  sendReminderEmail,
};