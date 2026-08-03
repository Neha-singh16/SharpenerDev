const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../middleware/generateToken");



async function createUser(username, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword });
  return user;
}


async function loginUser(email, password){
    const user = await User.findOne({where: {email}});
    if(!user){
        throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }
    const token = generateToken(user);
    return {user, token};
}
module.exports = { createUser, loginUser };