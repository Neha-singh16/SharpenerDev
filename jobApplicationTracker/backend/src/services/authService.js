const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Profile } = require("../models");
const sequelize = require("../config/database");


async function registerUser({ name, email, password }) {
  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const transaction = await sequelize.transaction();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create(
      {
        name,
        email,
        password: hashedPassword,
      },
      {
        transaction,
      },
    );

    await Profile.create(
      {
        userId: user.id,
      },
      {
        transaction,
      },
    );

    await transaction.commit();

    const token = generateToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
}
async function loginUser({ email, password }) {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
}

function generateToken(userId) {
  console.log("userid", userId);
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
}

module.exports = {
  registerUser,
  loginUser,
};
