const CourseModel = require("../models/courses");
const Student = require("../models/students");

const addCourse  = async(req,res) => {
    try{
      const {name} = req.body;
      const course = await CourseModel.create({name});
      res.status(201).send(course);
    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
}


const addStudentsToCourse  = async(req,res) => {
    try{
      const {studentId, courseId} = req.body;
      const student = await Student.findByPk(studentId);
      const course =await CourseModel.findAll({
        where:{
            id:courseId,
        }
      })

// await student.addCourse(course);
await student.addCourses(course);
const updatedStudent = await Student.findByPk(studentId, {
   include: CourseModel
})

res.status(201).send(updatedStudent);

    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
}


module.exports= {addCourse, addStudentsToCourse};