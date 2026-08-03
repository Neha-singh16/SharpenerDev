const UserService = require("../services/userService");

async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;
    const user = await UserService.createUser(username, email, password);
    res.status(201).json({ message: "User created sucessfully", user , token: user.token });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const { user, token } = await UserService.loginUser(email, password);
    res.status(200).json({ message: "User logged in successfully", user, token });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}

module.exports = { createUser, loginUser };
