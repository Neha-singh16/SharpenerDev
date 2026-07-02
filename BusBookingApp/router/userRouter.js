const express = require("express");
const router =express.Router();

const {addUser , addvaluesToUserAndBooking} = require("../controllers/UserController");

router.post("/adduser" , addUser);
router.post("/addvalues" , addvaluesToUserAndBooking);

module.exports = router;