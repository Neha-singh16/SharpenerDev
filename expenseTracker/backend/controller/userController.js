// const User = require("../models/userModel");
// const bcrypt = require("bcrypt");

// const { sendWelcomeEmail } = require("../services/emailServices");

// const generateToken = require("../utils/generateToken");


// async function createUser(req, res) {
//   try {
//     console.log("Controller reached");
//     const { name, email, password } = req.body;
//     console.log(req.body);
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email, password: hashedPassword });
//     console.log("User created");

//     // Send welcome email - non-blocking, errors are logged but don't fail signup
//     try {
//       await sendWelcomeEmail(user.email, user.name);
//       console.log("Welcome email sent successfully");
//     } catch (emailErr) {
//        console.error('Welcome email failed:', emailErr.message);
//       // Email failure doesn't fail the signup - user is already created
//     }

//     res.status(201).json({ message: "User created sucessfully", user });
//   } catch (err) {
//      if (err.code === 11000) {
//       return res.status(409).json({
//         error: 'User already exists'
//       });
      
//     }
//       res.status(500).json({
//       error: err.message
//     });
  
//   }
// }

// async function getAllUsers(req, res) {
//   try {
//     const users = await User.find();
//     console.log(users);
//     res.status(200).json({ message: "Users fetched successfully", users });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

// async function loginUser(req, res) {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email })
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // console.log("Email from frontend:", email);
//     // console.log("Password from frontend:", password);
//     // console.log("User from DB:", user);

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({
//         error: "Invalid credentials",
//       });
//     }
//     const token = generateToken(user);
//     res.status(200).json({ message: "Login successful", user, token });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }


// const getProfile = (req, res) => {
//   const user = req.user;
//   if (!user) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   res.json({
//     name: user.name,

//     email: user.email,

//     isPremium: user.isPremium,
//   });
// };


// module.exports = {
//   createUser,
//   getAllUsers,
//   loginUser,
 
//   getProfile,

// };


const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const { sendWelcomeEmail } = require("../services/emailServices");
const generateToken = require("../utils/generateToken");


// ==========================================
// SIGN UP
// ==========================================

async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required",
      });
    }

    // Check whether user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        error: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create MongoDB user document
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailErr) {
      console.error(
        "Welcome email failed:",
        emailErr.message
      );
    }

    // Don't send password back to frontend
    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
      },
    });

  } catch (err) {
    console.error("Signup error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
}


// ==========================================
// GET ALL USERS
// ==========================================

async function getAllUsers(req, res) {
  try {
    const users = await User.find()
      .select("-password");

    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}


// ==========================================
// LOGIN
// ==========================================

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // Generate JWT
    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
      },

      token,
    });

  } catch (err) {
    console.error("Login error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
}


// ==========================================
// GET PROFILE
// ==========================================

const getProfile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isPremium: req.user.isPremium,
    totalExpense: req.user.totalExpense,
  });
};


module.exports = {
  createUser,
  getAllUsers,
  loginUser,
  getProfile,
};