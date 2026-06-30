const db = require("../utils/db-connections");

const addBus = (req,res) => {
    const {busNumber, totalSeats, availableSeats} = req.body;

    const insertQuery = `INSERT INTO Buses (busNumber, totalSeats, availableSeats) VALUES (?, ?, ?)`;

    db.execute(insertQuery, [busNumber, totalSeats, availableSeats], (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send(err.message);
            db.end();
            return;
        }
        console.log("Bus added successfully");
        res.send("Bus added successfully");
    });
}

const getBuses = (req,res)=> {
    const seats = req.params.seats;
    const selectQuery = `SELECT * FROM Buses WHERE availableSeats >  ?`;

    db.execute(selectQuery, [seats], (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send(err.message);
            return;
        }
        console.log("Bus retrieved successfully");
        res.send(result);
    });
}

module.exports = {addBus, getBuses};