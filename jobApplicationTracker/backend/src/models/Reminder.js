const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Reminder = sequelize.define(
    "Reminder",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        applicationId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false
        },

        message: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        reminderAt: {
            type: DataTypes.DATE,
            allowNull: false
        },

        isCompleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        emailSent: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        tableName: "Reminders"
    }
);

module.exports = Reminder;