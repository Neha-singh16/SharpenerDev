const express = require("express");
const router =express.Router();
const db = require("../utils/db-connection");

const {getStudentById, getStudent, addStudent, updateStudent, deleteStudent, addValuesToStudentAndIdentityCard} = require("../controllers/studentController");

router.get("/", getStudent);

router.get("/:id", getStudentById);


router.post("/" , addStudent);
router .post("/addStudentWithCard", addValuesToStudentAndIdentityCard);

router.put("/:id", updateStudent); 

router.delete("/:id", deleteStudent);

module.exports = router;