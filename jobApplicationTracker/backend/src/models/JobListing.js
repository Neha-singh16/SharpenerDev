const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const JobListing = sequelize.define(
    "JobListing",
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

        companyId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        location: {
            type: DataTypes.STRING,
            allowNull: true
        },

        employmentType: {
            type: DataTypes.ENUM(
                "FULL_TIME",
                "PART_TIME",
                "CONTRACT",
                "INTERNSHIP"
            ),
            allowNull: true
        },

        salaryMin: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },

        salaryMax: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },

        jobUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },

        source: {
            type: DataTypes.STRING,
            allowNull: true
        },

        status: {
            type: DataTypes.ENUM(
                "SAVED",
                "APPLIED",
                "ARCHIVED"
            ),
            allowNull: false,
            defaultValue: "SAVED"
        },

        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        tableName: "job_listings"
    }
);

module.exports = JobListing;