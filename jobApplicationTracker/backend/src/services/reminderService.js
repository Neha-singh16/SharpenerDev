const { Reminder, Application } = require("../models");

async function verifyApplication(userId, applicationId) {
  const application = await Application.findOne({
    where: {
      id: applicationId,
      userId,
    },
  });

  if (!application) {
    const error = new Error("Application not found");

    error.statusCode = 404;

    throw error;
  }

  return application;
}

// ======================================================
// CREATE
// ======================================================

async function createReminder(userId, applicationId, data) {
  await verifyApplication(userId, applicationId);

  const { title, message, reminderAt } = data;

  if (!title || !title.trim()) {
    const error = new Error("Reminder title is required");

    error.statusCode = 422;

    throw error;
  }

  if (!reminderAt) {
    const error = new Error("Reminder date and time is required");

    error.statusCode = 422;

    throw error;
  }

  const reminderDate = new Date(reminderAt);

  if (Number.isNaN(reminderDate.getTime())) {
    const error = new Error("Invalid reminder date");

    error.statusCode = 422;

    throw error;
  }

  if (reminderDate <= new Date()) {
    const error = new Error("Reminder must be in the future");

    error.statusCode = 422;

    throw error;
  }

  return await Reminder.create({
    userId,

    applicationId,

    title: title.trim(),

    message: message?.trim() || null,

    reminderAt: reminderDate,

    isCompleted: false,

    emailSent: false,
  });
}



async function getAllReminders(userId) {

    return await Reminder.findAll({

        where: {
            userId
        },

        order: [
            ["reminderAt", "ASC"]
        ]

    });
}
// ======================================================
// GET
// ======================================================

async function getReminders(userId, applicationId) {
  await verifyApplication(userId, applicationId);

  return await Reminder.findAll({
    where: {
      userId,
      applicationId,
    },

    order: [["reminderAt", "ASC"]],
  });
}

// ======================================================
// UPDATE
// ======================================================

async function updateReminder(userId, reminderId, data) {
  const reminder = await Reminder.findOne({
    where: {
      id: reminderId,
      userId,
    },
  });

  if (!reminder) {
    const error = new Error("Reminder not found");

    error.statusCode = 404;

    throw error;
  }

  const updates = {};

  if (data.title !== undefined) {
    updates.title = data.title.trim();
  }

  if (data.message !== undefined) {
    updates.message = data.message?.trim() || null;
  }

  if (data.reminderAt !== undefined) {
    const date = new Date(data.reminderAt);

    if (Number.isNaN(date.getTime())) {
      const error = new Error("Invalid reminder date");

      error.statusCode = 422;

      throw error;
    }

    updates.reminderAt = date;

    // If time changes, email should be allowed again.
    updates.emailSent = false;
  }

  if (data.isCompleted !== undefined) {
    updates.isCompleted = Boolean(data.isCompleted);
  }

  await reminder.update(updates);

  return reminder;
}

// ======================================================
// DELETE
// ======================================================

async function deleteReminder(userId, reminderId) {
  const reminder = await Reminder.findOne({
    where: {
      id: reminderId,
      userId,
    },
  });

  if (!reminder) {
    const error = new Error("Reminder not found");

    error.statusCode = 404;

    throw error;
  }

  await reminder.destroy();
}

module.exports = {
  createReminder,
  getAllReminders,
  getReminders,
  updateReminder,
  deleteReminder,
};
