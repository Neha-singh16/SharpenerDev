require("dotenv").config();

const { sendReminderEmail } = require("./src/services/emailService");

const reminder = {
  title: "Interview Follow-up",
  message: "Follow up with HR regarding the interview.",
  reminderAt: new Date(),
};

const application = {
  jobTitle: "Software Engineer",
};

async function testEmail() {
  try {
    await sendReminderEmail(
      "singhn5443@gmail.com",
      reminder,
      application
    );

    console.log("TEST EMAIL SENT");
  } catch (error) {
    console.error("TEST EMAIL FAILED");
    console.error(error);
  }
}

testEmail();