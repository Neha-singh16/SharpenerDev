const express  =require("express");
const router =express.Router();

const courses = [
{ id: 1, name: "Frontend", description: "HTML, CSS, JS, React" },
{ id: 2, name: "Backend", description: "Node.js, Express, MongoDB" }
];

router.get("/", (req,res) =>{
    const courseNames = courses.map(course =>course.name);
    res.send(`List of courses: ${courseNames.join(", ")}`);
})

router.get("/:id",(req,res) => {
    const id = req.params.id;
    const course = courses.find(course => course.id == id);
    if(!course){
        return res.status(404).send("Course not found.");
    }
    res.send(`Fetched a course by their id : ${id} and their name is ${course.name}`);
})

module.exports = router;