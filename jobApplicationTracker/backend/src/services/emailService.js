const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendReminderEmail(to, reminder, application) {
  const message = {
    to,

    from: process.env.SENDGRID_FROM_EMAIL,

    subject: `Job Tracker Reminder: ${reminder.title}`,

    text: `
Reminder: ${reminder.title}

${reminder.message || ""}

Job: ${application.jobTitle}

Reminder time:
${new Date(reminder.reminderAt).toLocaleString()}
        `,

    html: `
            <div style="font-family: Arial, sans-serif;">

                <h2>Job Application Reminder</h2>

                <h3>
                    ${reminder.title}
                </h3>

                <p>
                    ${reminder.message || ""}
                </p>

                <p>
                    <strong>Job:</strong>
                    ${application.jobTitle}
                </p>

                <p>
                    <strong>Reminder:</strong>
                    ${new Date(reminder.reminderAt).toLocaleString()}
                </p>

            </div>
        `,
  };

  await sgMail.send(message);
}

module.exports = {
  sendReminderEmail,
};
