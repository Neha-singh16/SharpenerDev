

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Attachment = sequelize.define("Attachment", {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    applicationId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    originalName: {
        type: DataTypes.STRING,
        allowNull: false
    },

    fileName: {
        type: DataTypes.STRING,
        allowNull: false
    },

    fileKey: {
        type: DataTypes.STRING,
        allowNull: false
    },

    mimeType: {
        type: DataTypes.STRING,
        allowNull: false
    },

    fileSize: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    documentType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "OTHER"
    }

}, {
    tableName: "Attachments"
});

module.exports = Attachment;