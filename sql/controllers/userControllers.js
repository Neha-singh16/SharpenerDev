const db = require("../utils/db-connections");

const addUser = (req,res) => {
 const {name, email} = req.body;
 
 const insertQuery = `INSERT INTO Users (name , email) VALUES (?, ?)`;

 db.execute(insertQuery, [name,email],  (err) => {
    if(err){
        console.log(err);
        res.status(500).send(err.message);
        db.end();
        return;
    }
console.log("Values inserted successfully");
res.send(`user ${name} added successfully`);

 })
}


const updateUser = (req,res) => {
    const {id} = req.params;
    const {name, email} = req.body;

     const updateQuery = `UPDATE Users SET name = ? , email = ? WHERE id =?`;

     db.execute(updateQuery, [name,email,id] , (err) => {
        if(err){
        console.log(err);
        res.status(500).send(err.message);
        db.end();
        return;
        }

        console.log("Values updated successfully");
        res.send(`user ${name} updated successfully`);
     })
}

const deleteUser = (req,res) => {
    const {id} = req.params;
    // const {name} = req.body;
     const deleteQuery = `DELETE FROM Users WHERE id =?`;

     db.execute(deleteQuery, [id] , (err) => {
        if(err){
        console.log(err);
        res.status(500).send(err.message);
        db.end();
        return;
        }

        console.log("Values deleted successfully");
        res.send(`user  deleted successfully`);
     })
}
module.exports = {addUser , updateUser, deleteUser};