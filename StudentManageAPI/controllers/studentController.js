// const db = require("../utils/db-connection");
// const Students = require("../models/students");
// const identityCard = require("../models/identityCard");

// const getStudent = (req,res) => {
//     const selectQuery = `SELECT * FROM Students`;
//     db.execute(selectQuery,   (err, results) => {
//     if(err){
//         console.log(err);
//         res.status(500).send(err.message);
        
//         return;
//     }
// console.log("Values selected successfully");
// res.send(results);
//     })

// }

// const getStudentById = (req,res) => {
//     const {id} = req.params;
//     const selectQuery = `SELECT * FROM Students
//     WHERE id = ?`;
//     db.execute(selectQuery, [id], (err, results) => {
//     if(err){
//         console.log(err);
//         res.status(500).send(err.message);
        
//         return;
//     }
// console.log("Values selected successfully");
// res.send(results);
//     })

// }

// const addValuesToStudentAndIdentityCard = async(req,res) => {
//     try{

//         const student = await Students.create(req.body.student);
//         const idCard = await identityCard.create({
//             ...req.body.identityCard,
//             StudentId: student.id
//         })

//         res.status(201).json({student,idCard});
//     }catch(err){
//         console.log(err);
//         res.status(500).send(err.message);
//     }
// }


// const addStudent = (req,res) => {
//  const {name, email} = req.body;
 
//  const insertQuery = `INSERT INTO Students (name , email) VALUES (?, ?)`;

//  db.execute(insertQuery, [name,email],  (err) => {
//     if(err){
//         console.log(err);
//         res.status(500).send(err.message);
        
//         return;
//     }
// console.log("Values inserted successfully");
// res.send(`student ${name} added successfully`);

//  })
// }


// const updateStudent = (req,res) => {
//     const {id} = req.params;
//     const {name, email} = req.body;

//      const updateQuery = `UPDATE Students SET name = ? , email = ? WHERE id =?`;

//      db.execute(updateQuery, [name,email,id] , (err) => {
//         if(err){
//         console.log(err);
//         res.status(500).send(err.message);
        
//         return;
//         }

//         console.log("Values updated successfully");
//         res.send(`student ${name} updated successfully`);
//      })
// }

// const deleteStudent = (req,res) => {
//     const {id} = req.params;
//     // const {name} = req.body;
//      const deleteQuery = `DELETE FROM Students WHERE id =?`;

//      db.execute(deleteQuery, [id] , (err) => {
//         if(err){
//         console.log(err);
//         res.status(500).send(err.message);
      
//         return;
//         }

//         console.log("Values deleted successfully");
//         res.send(`student  deleted successfully`);
//      })
// }
// module.exports = {getStudent , getStudentById, addStudent, updateStudent, deleteStudent, addValuesToStudentAndIdentityCard};


const Students = require("../models/students");
const IdentityCard = require("../models/identityCard");

// GET ALL STUDENTS
const getStudent = async (req, res) => {
    try {
        const students = await Students.findAll();

        res.status(200).json(students);

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};


// GET STUDENT BY ID
const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Students.findByPk(id);

        if (!student) {
            return res.status(404).send("Student not found");
        }

        res.status(200).json(student);

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};


// CREATE STUDENT + IDENTITY CARD
const addValuesToStudentAndIdentityCard = async (req, res) => {
    try {

        const student = await Students.create(req.body.student);

        const idCard = await IdentityCard.create({
            ...req.body.identityCard,
            StudentId: student.id
        });

        res.status(201).json({
            student,
            idCard
        });

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};


// ADD STUDENT
const addStudent = async (req, res) => {
    try {

        const student = await Students.create(req.body);

        res.status(201).json(student);

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};


// UPDATE STUDENT
const updateStudent = async (req, res) => {
    try {

        const { id } = req.params;

        const student = await Students.findByPk(id);

        if (!student) {
            return res.status(404).send("Student not found");
        }

        await student.update(req.body);

        res.status(200).json(student);

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};


// DELETE STUDENT
const deleteStudent = async (req, res) => {
    try {

        const { id } = req.params;

        const student = await Students.findByPk(id);

        if (!student) {
            return res.status(404).send("Student not found");
        }

        await student.destroy();

        res.status(200).send("Student deleted successfully");

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};


module.exports = {
    getStudent,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent,
    addValuesToStudentAndIdentityCard
};