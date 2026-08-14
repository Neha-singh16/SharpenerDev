const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const {  getProfile,
    updateProfile} = require("../controllers/profileController");

const router = express.Router();

router.get("/me", authenticate, getProfile);
router.put("/me", authenticate, updateProfile);

module.exports = router;