// const { DataTypes } = require("sequelize");

// const sequelize = require("../utils/db");
// const Expense = sequelize.define("Expense", {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   amount: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//   },
//   description: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   category: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   note: {
//     type: DataTypes.STRING,

//     allowNull: true,
//   },
// });

// module.exports = Expense;




const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true
    },

    note: {
      type: String,
      default: ''
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

expenseSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Expense', expenseSchema);