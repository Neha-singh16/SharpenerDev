const express = require('express');
const router = express.Router();

const { forgotPassword} = require("../controller/passwordController");

router.post("/forgotpassword", forgotPassword);
module.exports = router;