const User = require("../models/userModel");

async function createUser(req,res){
    try{
        const {name, email,password} = req.body;
        const user = await User.create({name,email,password});
        res.status(201).json({message: "User created sucessfully" , user});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

async function getAllUsers(req,res){
     try{
       const users = await User.findAll();
        res.status(200).json({message: "Users fetched successfully" , users});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}


module.exports = {createUser, getAllUsers};