const { DataTypes } = require("sequelize");
const db = require("../utils/db-connection");

function createDynamicModel(tableName, columns){
    const attributes = {};

    columns.forEach((column) => {
        let dataType;
        switch(column.columnType){
            case "STRING":
                dataType = DataTypes.STRING;
                break;
            case "INTEGER":
                dataType = DataTypes.INTEGER;
                break;
            case "FLOAT":
                dataType = DataTypes.FLOAT;
                break;

            case "BOOLEAN":
                dataType = DataTypes.BOOLEAN;
                break;
            default:
                dataType = DataTypes.STRING;
        }
        attributes[column.columnName] = {
            type: dataType,
            allowNull: column.allowNull
        };
    });

    const DynamicModel = db.define(tableName , attributes, {
        freezeTableName:true,
        timestamps:false
    })
    return DynamicModel;
    // return db.define(tableName, attributes, { timestamps: false });
}

module.exports = createDynamicModel;