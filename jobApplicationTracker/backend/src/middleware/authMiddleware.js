const jwt = require("jsonwebtoken");

function authenticate(req,res,next){
    try{
       const authHeader = req.headers.authorization;
       if(!authHeader || !authHeader.startsWith("Bearer ")){
        const error = new Error("Authorization header missing");
        error.statusCode = 401;
        throw error;
       }

       const token = authHeader.split(" ")[1];
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = {
        id : decoded.userId
       };


        console.log("Authenticated user:", req.user);
       next();

    }catch(error){
        error.statusCode = 401;
        next(error);
    }
}
module.exports = authenticate;