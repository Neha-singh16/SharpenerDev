
const Users = require("../models/userModel");
const Booking = require("../models/bookingModel");


const addUser = async (req,res) => {
    try{
        const {name, phone} = req.body;
        const user = await Users.create({name, phone});
        res.status(201).send(user);

    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
}

const addvaluesToUserAndBooking = async(req,res) => {
    try{
        const user = await Users.create(req.body.user);
        const booking = await Booking.create({
            ...req.body.booking,
            UserId : user.id
        });

        res.status(201).send({user, booking})

    }catch(err){
          console.log(err);
        res.status(500).send(err.message);
    }
}


module.exports = {
   addUser,
   addvaluesToUserAndBooking
};