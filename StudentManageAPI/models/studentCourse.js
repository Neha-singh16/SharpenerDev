const {Sequelize, DataTypes} = require('sequelize');
const sequelize =require('../utils/db-connection');

const studentCourse = sequelize.define('StudentCourse',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },    
})

module.exports = studentCourse;