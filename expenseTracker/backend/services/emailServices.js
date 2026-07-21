const { BrevoClient } = require("@getbrevo/brevo");

const apiInstance = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

async function sendWelcomeEmail(toEmail, name) {
  console.log("Inside sendWelcomeEmail");
  console.log("To:", toEmail);

  const email = {
    subject: "Welcome to Expense Tracker",
    sender: {
      name: "Expense Tracker",
      email: "singhn5443@gmail.com",
    },
    to: [
      {
        email: toEmail,
        name: name,
      },
    ],
    htmlContent: `
      <h1>Welcome to Expense Tracker, ${name}!</h1>
      <p>Thank you for signing up.</p>
    `,
  };

  try {
    const response =
      await apiInstance.transactionalEmails.sendTransacEmail(email);

    // console.log("Brevo Response:", response);

    return response;
  } catch (err) {
    console.error("Brevo Error:", err);
    throw err;
  }
}

async function sendForgotPasswordEmail(toEmail, name) {
//   console.log("Sending forgot password email to:", toEmail);
  const email = {
    subject: "Password Reset",

    sender: {
      name: "Expense Tracker",
      email: "singhn5443@gmail.com",
    },

    to: [
      {
        email: toEmail,
        name,
      },
    ],

    htmlContent: `

        <h2>Hello ${name},</h2>

        <p>We received a request to reset your password.</p>

        <p>
            If you did not request this,
            simply ignore this email.
        </p>

        <br>

        <p>
            This is a dummy reset email for now.
        </p>

        <br>

        <b>Expense Tracker Team</b>

        `,
  };

  const response =
    await apiInstance.transactionalEmails.sendTransacEmail(email);
  console.log("Brevo Response:", response);
  return response;
}
module.exports = {
  sendWelcomeEmail,
  sendForgotPasswordEmail,
};
