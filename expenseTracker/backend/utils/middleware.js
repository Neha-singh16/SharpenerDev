function requestLogger(req,res, next){
    console.log(`${req.method} ${req.originalUrl}`);
next();
}

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


module.exports = {requestLogger, ValidateUser, notFound, errorHandler};