const { forgotPasswordService } = require("../services/passwordService");

async function forgotPassword(req,res){
    try{
       const {email} = req.body;
       const result = await forgotPasswordService(email);
       res.status(200).json(result);
    }catch(err){
         res.status(404).json({
            message: err.message,
        });
    }
}

module.exports = {
    forgotPassword,
};