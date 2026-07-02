const express = require("express");
const router = express.Router();

const { addBooking } = require("../controllers/BookingController");

router.post("/addBooking", addBooking);


module.exports = router;
