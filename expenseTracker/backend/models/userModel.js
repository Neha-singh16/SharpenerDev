// const {DataTypes} = require('sequelize');

// const sequelize = require('../utils/db');

// const User = sequelize.define('User', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey:true,
//     },
//     name : {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     email : {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//     },
//     password: {
//         type : DataTypes.STRING,
//         allowNull : false

//     },
//     isPremium: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false
// },totalExpense: {
//     type: DataTypes.INTEGER,
//     defaultValue: 0
// }
// })

// module.exports = User;


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    isPremium: {
      type: Boolean,
      default: false
    },

    totalExpense: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);