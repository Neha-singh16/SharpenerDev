// const express = require("express");

// const authenticate = require("../middleware/authMiddleware");

// const {
//   createReminder,
//   getAllReminders,
//   getReminders,
//   updateReminder,
//   deleteReminder,
// } = require("../controllers/reminderController");

// const router = express.Router();

// router.post(
//   "/applications/:applicationId/reminders",
//   authenticate,
//   createReminder,
// );

// router.get(
//   "/applications/:applicationId/reminders",
//   authenticate,
//   getReminders,
// );

// router.put("/reminders/:id", authenticate, updateReminder);

// router.delete("/reminders/:id", authenticate, deleteReminder);

// module.exports = router;



const express = require("express");

const authenticate = require("../middleware/authMiddleware");

const {
  createReminder,
  getAllReminders,
  getReminders,
  updateReminder,
  deleteReminder,
} = require("../controllers/reminderController");

const router = express.Router();

// Create reminder for an application
router.post(
  "/applications/:applicationId/reminders",
  authenticate,
  createReminder,
);

// Get all reminders for logged-in user
router.get(
  "/reminders",
  authenticate,
  getAllReminders,
);

// Get reminders for a specific application
router.get(
  "/applications/:applicationId/reminders",
  authenticate,
  getReminders,
);

// Update reminder
router.put(
  "/reminders/:id",
  authenticate,
  updateReminder,
);

// Delete reminder
router.delete(
  "/reminders/:id",
  authenticate,
  deleteReminder,
);

module.exports = router;