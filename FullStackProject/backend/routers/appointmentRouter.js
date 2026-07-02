const express = require('express');

const router = express.Router();

const {addAppointment,  getAppointment , deleteAppointment} =require('../controllers/appointmentController');

router.post('/', addAppointment);
router.get('/', getAppointment);
router.delete("/:id", deleteAppointment);


module.exports = router;