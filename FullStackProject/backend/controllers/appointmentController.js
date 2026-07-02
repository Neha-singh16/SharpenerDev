const db = require("../utils/db-connection");
const Appointment = require("../models/appointmentModel");

const addAppointment = async (req, res)=>{
   try{
    const {name,phone} = req.body;
    const appointment = await Appointment.create({
        name:name,
        phone:phone
    });
   res.status(201).json(appointment);

   }catch(err){
    console.log(err);
    res.status(500).send(err.message);
   }
}

const getAppointment = async (req, res)=>{
   
    try{
        const appointment = await Appointment.findAll();
        res.status(200).send(appointment);

    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
}
}

const deleteAppointment = async (req, res)=>{
   
    try{
        const {id} = req.params;
        const appointment = await Appointment.findByPk(id);
        if(!appointment){
            return res.status(404).send("Appointment not found");
        }
        await appointment.destroy();
        res.status(200).send("Appointment deleted successfully");

    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
}
}




module.exports ={addAppointment,  getAppointment , deleteAppointment};