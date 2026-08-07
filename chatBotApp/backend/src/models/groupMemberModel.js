const { DataTypes } = require("sequelize");
const sequelize = require("../database/db-connection");

const GroupMember = sequelize.define(
  "GroupMember",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = GroupMember;
