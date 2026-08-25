// const {DataTypes} = require('sequelize');

// const sequelize = require('../utils/db');

// const ForgotPassword = sequelize.define('ForgotPassword', {
//     id: {
//         type: DataTypes.UUID,
//         defaultValue: DataTypes.UUIDV4,
//         primaryKey:true,
//     },
//   active: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: true
//   }
// })

// module.exports = ForgotPassword;


const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true
    },

    active: {
      type: Boolean,
      default: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  'ForgotPassword',
  forgotPasswordSchema
);