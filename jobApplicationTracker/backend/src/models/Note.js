const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Note = sequelize.define(
    "Note",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "users",
                key: "id"
            }
        },

        applicationId: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "applications",
                key: "id"
            }
        },

        content: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        tableName: "notes"
    }
);

module.exports = Note;