const User = require("../models/userModel");
const bcrypt = require("bcrypt");

async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: "User created sucessfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();
    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Email from frontend:", email);
    console.log("Password from frontend:", password);
    console.log("User from DB:", user);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }
    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createUser, getAllUsers, loginUser };
