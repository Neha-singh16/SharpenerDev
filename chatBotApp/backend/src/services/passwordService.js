const User = require("../models/userModel");
const ForgotPassword = require("../models/passwordModel");
const { sendForgotPasswordEmail } = require("../services/emailService");
const bcrypt=require("bcrypt");
const { v4: uuid } = require("uuid");

async function forgotPasswordService(email) {
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    throw new Error("User not found");
  }

  const token = uuid();
  await ForgotPassword.create({
    id: token,
    active: true,
    UserId: User.id,
  });

  // Send email - non-blocking, errors are logged but don't fail the request
  try {
    await sendForgotPasswordEmail(user.email, user.name, token);
    console.log("Forgot password email sent successfully");
  } catch (emailErr) {
    console.error("Failed to send forgot password email (non-critical):", emailErr.message);
    // Email failure doesn't fail the forgot password - token is already created
  }

  // res.status(200).json({message: "Password reset email sent successfully"})
  return {
    message: "Password reset email sent successfully",
  };
}

async function updatePasswordService(token, password){
    const request = await ForgotPassword.findOne({where: {id: token , active: true},    include: [
        {
            model: User
        }
    ]});
    if(!request){
        throw new Error("Invalid Token");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await request.User.update({password: hashedPassword});
    request.active = false;
    await request.save();
    
}

module.exports = {
  forgotPasswordService,
  updatePasswordService
};

