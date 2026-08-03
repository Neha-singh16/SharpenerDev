const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({
        error: "Token Missing",
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
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


function ValidateUser(req,res,next){
    const {name, email,password} = req.body;
    if(!name|| !email|| !password){
        return res.status(400).json({error: "Name,email and password are required"});
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailPattern.test(email)) {
    return res.status(400).json({ message: 'Email is invalid' });
}
    next();
}



function notFound(req,res,next){
    res.status(404).json({error: "Route not found"});

}

function errorHandler(err,req,res,next){
    console.error(err);
     res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
    });
}




module.exports = { auth, ValidateUser, notFound, errorHandler };