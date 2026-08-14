const express = require("express");

const authenticate = require("../middleware/authMiddleware");

const {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder,
} = require("../controllers/reminderController");

const router = express.Router();

router.post(
  "/applications/:applicationId/reminders",
  authenticate,
  createReminder,
);

router.get(
  "/applications/:applicationId/reminders",
  authenticate,
  getReminders,
);

router.put("/reminders/:id", authenticate, updateReminder);

router.delete("/reminders/:id", authenticate, deleteReminder);

module.exports = router;
