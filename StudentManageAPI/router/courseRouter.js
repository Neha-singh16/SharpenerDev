const express = require("express");
const router =express.Router();
const db = require("../utils/db-connection");

const {addCourse , addStudentsToCourse} = require("../controllers/coursesController");

router.post("/" , addCourse);
router.post("/addStudentToCourse", addStudentsToCourse);

module.exports = router;