const tableService = require("../services/tableService");
async function createTable(req, res) {
  try {
    const {tableName, columns} = req.body;
    await tableService.createTable(tableName, columns);

        res.status(201).json({
            success: true,
            message: "Table Created Successfully"
        });

  } catch (err) {
    console.log(err);

        if (err.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({
                success: false,
                message: "Table name already exists or duplicate column in same table",
            });
        }

        if (err.message && err.message.startsWith("Invalid payload")) {
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}





async function getAllTables(req, res) {

    try {

        const tables = await tableService.getAllTables();

        res.status(200).json({
            success: true,
            data: tables
        });

    }
    catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });

    }

}


async function getTableSchema(req, res) {

    try {

        const { tableName } = req.params;

        const schema = await tableService.getTableSchema(tableName);

        res.status(200).json({
            success: true,
            data: schema
        });

    }
    catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

}
module.exports = {
    createTable,
    getAllTables,
    getTableSchema
};