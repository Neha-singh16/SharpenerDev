const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get("/", userController.getUser);

router.post("/", userController.addUser);

router.get("/:id", userController.getUserById);

module.exports = router;