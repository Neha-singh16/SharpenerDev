const Table = require("../models/table");
const Column = require("../models/column");
const createDynamicModel = require("./dynamicModel");

async function getSchema(tableName) {
	const table = await Table.findOne({ where: { tableName } });
	if (!table) {
		throw new Error("Table Not Found");
	}

	const columns = await Column.findAll({
		where: { TableId: table.id },
		attributes: ["columnName", "columnType"],
	});

	return columns;
}

async function createRecord(tableName, data) {
	const columns = await getSchema(tableName);
	const DynamicModel = createDynamicModel(tableName, columns);

	const allowedColumns = new Set(columns.map((col) => col.columnName));
	const payload = {};

	Object.keys(data || {}).forEach((key) => {
		if (allowedColumns.has(key)) {
			payload[key] = data[key];
		}
	});

	if (Object.keys(payload).length === 0) {
		throw new Error("No valid fields found for this table");
	}

	const record = await DynamicModel.create(payload);
	return record;
}

async function getAllRecords(tableName) {
	const columns = await getSchema(tableName);
	const DynamicModel = createDynamicModel(tableName, columns);
	const records = await DynamicModel.findAll({ raw: true });
	return records;
}

module.exports = {
	createRecord,
	getAllRecords,
};
