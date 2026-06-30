const express = require('express');
const router = express.Router();
const {addBus , getBuses} = require("../controllers/busController");

router.post("/" , addBus);
router.get("/available/:seats", getBuses);

module.exports = router;

