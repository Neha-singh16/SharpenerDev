const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Company = sequelize.define(
    "Company",
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

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        website: {
            type: DataTypes.STRING,
            allowNull: true
        },

        industry: {
            type: DataTypes.STRING,
            allowNull: true
        },

        companySize: {
            type: DataTypes.STRING,
            allowNull: true
        },

        location: {
            type: DataTypes.STRING,
            allowNull: true
        },

        contactName: {
            type: DataTypes.STRING,
            allowNull: true
        },

        contactEmail: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true
            }
        },

        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        tableName: "companies"
    }
);

module.exports = Company;