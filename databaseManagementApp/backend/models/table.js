const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const Table = sequelize.define(
  "Table",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tableName: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = Table;
