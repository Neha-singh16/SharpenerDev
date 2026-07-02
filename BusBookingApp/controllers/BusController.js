const Users = require("../models/userModel");
const Booking = require("../models/bookingModel");

const addBus = async (req,res) => {
    try{
        const {name} = req.body;
        const bus = await Buses.create({name});
        res.status(201).send(bus);

    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
}

module.exports = {addBus};