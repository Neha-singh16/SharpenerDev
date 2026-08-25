// const {Sequelize} = require('sequelize');

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   dialect: 'mysql',
//   logging: console.log
// });


// console.log("HOST:", process.env.DB_HOST);
// console.log("DATABASE:", process.env.DB_NAME);
// console.log("USER:", process.env.DB_USER);

// console.log("Database:", sequelize.config.database);
// (async () => {
//   try {
//   await sequelize.authenticate();
//   console.log('Connection has been established successfully.');
// } catch (error) {
//   console.error('Unable to connect to the database:', error);
// }
// })();

// module.exports = sequelize;


//Mongoose connection
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;