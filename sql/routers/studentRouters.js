const express = require('express');
const router = express.Router();
const {addEnter , updateStudent, deleteStudent} = require("../controllers/studentControllers");


router.post("/" , addEnter);

router.put("/:id", updateStudent); 

router.delete("/:id", deleteStudent);

module.exports = router;