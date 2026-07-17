const jwt = require('jsonwebtoken');

const generateToken = (user) =>{
  return jwt.sign({
    userId: user.id
  },
  process.env.JWT_SECRET,{
    expiresIn: '1d'
  }
);
}

module.exports = generateToken;