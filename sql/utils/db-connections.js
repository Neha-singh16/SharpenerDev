const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '160308',
    database: "testdb"
});


connection.connect((err) => {
    if(err){
        console.log(err);
        return;
    }
    console.log("Connected to the database");

    const createQuery = `create table IF NOT EXISTS Students(
    // id INT AUTO_INCREMENT PRIMARY KEY,
    // name VARCHAR(20),
    // email VARCHAR(20)
    // )`

    
       const createUserQuery = `create table IF NOT EXISTS Users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200),
    email VARCHAR(200)
    )`


      const createBusesQuery = `create table IF NOT EXISTS Buses(
    id INT AUTO_INCREMENT PRIMARY KEY,
    busNumber INT,
    totalSeats INT,
    availableSeats INT
    )`


 const createSeatsQuery = `create table IF NOT EXISTS Seats(
    id INT AUTO_INCREMENT PRIMARY KEY,
    seatNumber INT,
    )`


     const createPaymentsQuery = `create table IF NOT EXISTS Payments(
    id INT AUTO_INCREMENT PRIMARY KEY,
    amountPaid INT,
    paymentStatus VARCHAR(200),
    )`

    connection.execute(createUserQuery , (err, result) => {
        if(err){
            console.log(err);
            connection.end();
            return;
        }
        console.log("User table created successfully");
    })
})


module.exports = connection;