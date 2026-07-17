const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    // const token = req.header("Authorization");
    // console.log(req.header("Authorization"));
    // if(!token){
    //       return res.status(401).json({
    //         error: "Token Missing"
    //     });
    // }

    const authHeader = req.header("Authorization");
    console.log(req.header("Authorization"));

    if (!authHeader) {
      return res.status(401).json({
        error: "Token Missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.userId);
    console.log("User:", user);
    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid Token",
    });
  }
};

module.exports = auth;
