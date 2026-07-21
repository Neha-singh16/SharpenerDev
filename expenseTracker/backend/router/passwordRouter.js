const express = require("express");
const router = express.Router();

const {forgotPassword, resetPassword, updatePassword } = require("../controller/passwordController");
// const {forgotPasswordService} = require("../services/passwordService")

router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:token", resetPassword);
router.post("/updatepassword/:token", updatePassword);
module.exports = router;
