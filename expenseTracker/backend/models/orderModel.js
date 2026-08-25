// const { DataTypes } = require("sequelize");
// const sequelize = require("../utils/db");

// const Order = sequelize.define("Order", {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   orderId: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   amount: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   status: {
//     type: DataTypes.ENUM("PENDING", "SUCCESSFUL", "FAILED"),
//     defaultValue: "PENDING",
//   },
// });


// module.exports = Order;

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true
    },

    amount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ['PENDING', 'SUCCESSFUL', 'FAILED'],
      default: 'PENDING'
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

module.exports = mongoose.model('Order', orderSchema);