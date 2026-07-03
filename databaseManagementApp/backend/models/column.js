const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");
const Table = require("./table");

const Column = sequelize.define(
  "Column",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    columnName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "unique_column_per_table",
    },
    columnType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    TableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "unique_column_per_table",
    },
  },
  {
    timestamps: false,
  },
);


Table.hasMany(Column);
Column.belongsTo(Table);
module.exports = Column;
