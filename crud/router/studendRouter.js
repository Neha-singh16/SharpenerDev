const express  =require("express");
const router =express.Router();

const students = [
{ id: 1, name: "Alice" },
{ id: 2, name: "Bob" },
{ id: 3, name: "Charlie" }
];

router.get("/", (req,res) =>{
    const studentNames = students.map(student =>student.name);
    res.send(`List of students: ${studentNames.join(", ")}`);
})

router.get("/:id",(req,res) => {
    const id = req.params.id;

    const student = students.find(student => student.id == id);
    if(!student){
        return res.status(404).send("Student not found.");
    }

    res.send(`Fetched a student by their id : ${id} and their name is ${student.name}`);
})

module.exports = router;