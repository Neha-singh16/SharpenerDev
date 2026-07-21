const User = require("../models/userModel");

const { sendForgotPasswordEmail } = require("../services/emailServices");

async function forgotPasswordService(email) {

    // const { email } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      throw new Error("User not found");
    }

    await sendForgotPasswordEmail(user.email, user.name);

    // res.status(200).json({message: "Password reset email sent successfully"})
    return {
      message: "Password reset email sent successfully",
    };
  } 


module.exports = {
    forgotPasswordService,
};