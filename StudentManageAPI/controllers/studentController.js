const db = require("../utils/db-connection");

const getStudent = (req,res) => {
    const selectQuery = `SELECT * FROM Students`;
    db.execute(selectQuery,   (err, results) => {
    if(err){
        console.log(err);
        res.status(500).send(err.message);
        
        return;
    }
console.log("Values selected successfully");
res.send(results);
    })

}

const getStudentById = (req,res) => {
    const {id} = req.params;
    const selectQuery = `SELECT * FROM Students
    WHERE id = ?`;
    db.execute(selectQuery, [id], (err, results) => {
    if(err){
        console.log(err);
        res.status(500).send(err.message);
        
        return;
    }
console.log("Values selected successfully");
res.send(results);
    })

}


const addStudent = (req,res) => {
 const {name, email} = req.body;
 
 const insertQuery = `INSERT INTO Students (name , email) VALUES (?, ?)`;

 db.execute(insertQuery, [name,email],  (err) => {
    if(err){
        console.log(err);
        res.status(500).send(err.message);
        
        return;
    }
console.log("Values inserted successfully");
res.send(`student ${name} added successfully`);

 })
}


const updateStudent = (req,res) => {
    const {id} = req.params;
    const {name, email} = req.body;

     const updateQuery = `UPDATE Students SET name = ? , email = ? WHERE id =?`;

     db.execute(updateQuery, [name,email,id] , (err) => {
        if(err){
        console.log(err);
        res.status(500).send(err.message);
        
        return;
        }

        console.log("Values updated successfully");
        res.send(`student ${name} updated successfully`);
     })
}

const deleteStudent = (req,res) => {
    const {id} = req.params;
    // const {name} = req.body;
     const deleteQuery = `DELETE FROM Students WHERE id =?`;

     db.execute(deleteQuery, [id] , (err) => {
        if(err){
        console.log(err);
        res.status(500).send(err.message);
      
        return;
        }

        console.log("Values deleted successfully");
        res.send(`student  deleted successfully`);
     })
}
module.exports = {getStudent , getStudentById, addStudent, updateStudent, deleteStudent};