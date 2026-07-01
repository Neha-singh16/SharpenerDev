
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('studentDB', 'root', '160308', {
  host: 'localhost',
  dialect: 'mysql'
});



try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}


module.exports = sequelize;

// const mysql = require("mysql2");

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "160308",
//   database: "studentDB",
// });

// connection.connect((err) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log("Connected to the database");

//   const createStudentQuery = `create table IF NOT EXISTS Students(
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(100),
//         email VARCHAR(100) UNIQUE,
//         age INT
//         )`;


// connection.execute(createStudentQuery, (err) => {
//   if (err) {
//     console.log(err);
//     return;
//   }

//   console.log("Student table created successfully");
// });
// });

// module.exports = connection;
