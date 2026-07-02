const express = require("express");
const router =express.Router();

const {addBus} = require("../controllers/BusController");

router.post("/addbus" , addBus);
// router.post("/addvalues" , addvaluesToUserAndBooking);

module.exports = router;