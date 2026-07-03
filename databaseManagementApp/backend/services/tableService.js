const Table = require("../models/table");
const Column = require("../models/column");
const createDynamicModel = require("./dynamicModel");

async function createTable(tableName , columns){
    if (!tableName || !Array.isArray(columns) || columns.length === 0) {
        throw new Error("Invalid payload: tableName and columns are required");
    }

    const table = await Table.create({ tableName });
    for(const column of columns){
        await Column.create({
            columnName: column.columnName,
            columnType: column.columnType,
            TableId: table.id
        });

    }

    const DynamicModel = createDynamicModel(tableName, columns);
    await DynamicModel.sync();
    return DynamicModel;
}


async function getAllTables() {

    const tables = await Table.findAll({
        attributes: ["id", "tableName"],
        order: [["id", "ASC"]]
    });

    return tables;

}

async function getTableSchema(tableName) {

    const table = await Table.findOne({
        where: {
            tableName
        }
    });

    if (!table) {
        throw new Error("Table Not Found");
    }

    const columns = await Column.findAll({
        where: {
            TableId: table.id
        },
        attributes: ["columnName", "columnType"]
    });

    return columns;

}

module.exports = {createTable ,getAllTables, getTableSchema};