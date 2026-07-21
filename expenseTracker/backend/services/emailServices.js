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

async function sendForgotPasswordEmail(toEmail, name, token) {
//   console.log("Sending forgot password email to:", toEmail);
const resetLink =`http://localhost:3000/users/password/resetpassword/${token}`;
  const email = {
    subject: "Reset your password!",

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
                Click the button below to reset your password.
            </p>

            <a
                href="${resetLink}"
                style="
                    background:#007bff;
                    color:white;
                    padding:10px 20px;
                    text-decoration:none;
                    border-radius:5px;
                    display:inline-block;
                "
            >
                Reset Password
            </a>

            <br><br>

            <p>
                If you did not request this, you can safely ignore this email.
            </p>

            <br>

            <p>Expense Tracker Team</p>
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
