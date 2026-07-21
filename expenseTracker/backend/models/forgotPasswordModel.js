const {DataTypes} = require('sequelize');

const sequelize = require('../utils/db');

const ForgotPassword = sequelize.define('ForgotPassword', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey:true,
    },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
})

module.exports = ForgotPassword;