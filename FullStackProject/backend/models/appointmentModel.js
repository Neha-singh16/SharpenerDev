const {Sequelize,DataTypes} = require('sequelize');
const sequelize = require("../utils/db-connection");

const Appointment = sequelize.define('appointments', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone:{
        type : DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Appointment;