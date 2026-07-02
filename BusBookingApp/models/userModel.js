const {Sequelize, DataTypes} = require('sequelize');
const sequelize =require('../utils/db-connection');

const Users = sequelize.define('Users',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phone:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
})

module.exports = Users;