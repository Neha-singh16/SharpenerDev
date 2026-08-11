const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Profile = sequelize.define(
    "Profile",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },

        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },

        location: {
            type: DataTypes.STRING,
            allowNull: true
        },

        careerGoal: {
            type: DataTypes.STRING,
            allowNull: true
        },

        experienceLevel: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        tableName: "profiles"
    }
);

module.exports = Profile;