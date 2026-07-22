const User = require("../models/userModel");
const ForgotPassword = require("../models/forgotPasswordModel");
const { sendForgotPasswordEmail } = require("../services/emailServices");
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
    UserId: user.id,
});
  await sendForgotPasswordEmail(user.email, user.name, token);

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

