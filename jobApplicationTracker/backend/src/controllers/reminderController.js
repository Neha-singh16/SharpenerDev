const reminderService = require("../services/reminderService");

async function createReminder(req, res, next) {
  try {
    const reminder = await reminderService.createReminder(
      req.user.id,

      req.params.applicationId,

      req.body,
    );

    res.status(201).json({
      success: true,

      message: "Reminder created successfully",

      data: reminder,
    });
  } catch (error) {
    next(error);
  }
}

async function getAllReminders(req, res, next) {

    try {

        const reminders =
            await reminderService.getAllReminders(
                req.user.id
            );

        res.status(200).json({
            success: true,
            data: reminders
        });

    } catch (error) {

        next(error);
    }
}

async function getReminders(req, res, next) {
  try {
    const reminders = await reminderService.getReminders(
      req.user.id,

      req.params.applicationId,
    );

    res.status(200).json({
      success: true,

      data: reminders,
    });
  } catch (error) {
    next(error);
  }
}

async function updateReminder(req, res, next) {
  try {
    const reminder = await reminderService.updateReminder(
      req.user.id,

      req.params.id,

      req.body,
    );

    res.status(200).json({
      success: true,

      message: "Reminder updated successfully",

      data: reminder,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteReminder(req, res, next) {
  try {
    await reminderService.deleteReminder(
      req.user.id,

      req.params.id,
    );

    res.status(200).json({
      success: true,

      message: "Reminder deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createReminder,
  getAllReminders,
  getReminders,
  updateReminder,
  deleteReminder,
};
