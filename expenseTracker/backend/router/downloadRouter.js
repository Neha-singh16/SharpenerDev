const express = require('express');
const router = express.Router();

const auth = require("../utils/auth");
const {downloadExpenses} = require("../controller/downloadContoller");

router.get("/", auth, downloadExpenses);

module.exports = router;