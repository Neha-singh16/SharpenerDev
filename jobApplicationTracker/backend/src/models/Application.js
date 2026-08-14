const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Application = sequelize.define(
  "Application",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "companies",
        key: "id",
      },
    },

 jobListingId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
        model: "job_listings",
        key: "id"
    }
},
    jobTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "SAVED",
        "APPLIED",
        "SCREENING",
        "INTERVIEW",
        "OFFERED",
        "REJECTED",
        "WITHDRAWN",
        "ACCEPTED",
      ),
      allowNull: false,
      defaultValue: "APPLIED",
    },

    appliedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    jobUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "applications",
  },
);

module.exports = Application;
