const { DataTypes } = require("sequelize");
const sequelize = require("../database/db-connection");

const Chat = sequelize.define(
  "Chat",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    roomId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }, mediaUrl:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    mediaType: {
    type: DataTypes.STRING,
    allowNull: true,
},
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = Chat;
