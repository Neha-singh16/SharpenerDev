

const Booking = require("../models/bookingModel");

const addBooking = async (req,res) => {
    try{
        const {availableSeats, totalSeats} = req.body;
        const booking = await Booking.create({availableSeats, totalSeats});
        res.status(201).send(booking);
    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
}



module.exports = {
   addBooking,
};