const express = require('express');
const mysql = require('mysql2');
const app = express();


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

    // const createQuery = `create table Students(
    // id INT AUTO_INCREMENT PRIMARY KEY,
    // name VARCHAR(20),
    // email VARCHAR(20)
    // )`
       const createUserQuery = `create table Users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20),
    email VARCHAR(20)
    )`


      const createBusesQuery = `create table Buses(
    id INT AUTO_INCREMENT PRIMARY KEY,
    busNumber INT,
    totalSeats INT,
    availableSeats INT
    )`


 const createSeatsQuery = `create table Seats(
    id INT AUTO_INCREMENT PRIMARY KEY,
    seatNumber INT,
    )`


     const createPaymentsQuery = `create table Payments(
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
        console.log("Users table created successfully");
    })
})



app.get('/', (req,res) => {
    res.send('Hello World');
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})