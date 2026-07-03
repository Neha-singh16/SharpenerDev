const recordService = require("../services/recordService");

async function createRecord(req, res) {
	try {
		const { tableName } = req.params;
		const data = req.body;

		const record = await recordService.createRecord(tableName, data);
		res.status(201).json({
			success: true,
			data: record,
			message: "Record created successfully",
		});
	} catch (err) {
		console.log(err);

		const isKnown =
			err.message === "Table Not Found" ||
			err.message === "No valid fields found for this table";

		res.status(isKnown ? 400 : 500).json({
			success: false,
			message: err.message || "Something went wrong",
		});
	}
}

async function getAllRecords(req, res) {
	try {
		const { tableName } = req.params;
		const records = await recordService.getAllRecords(tableName);

		res.status(200).json({
			success: true,
			data: records,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			success: false,
			message: err.message || "Something went wrong",
		});
	}
}

module.exports = {
	createRecord,
	getAllRecords,
};
