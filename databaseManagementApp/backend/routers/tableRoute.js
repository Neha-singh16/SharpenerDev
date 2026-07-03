const express = require("express");

const router = express.Router();

const {  createTable ,getAllTables,  getTableSchema } = require("../controllers/tableController");

router.post(
    "/",
    createTable
);

router.get(
    "/",
    getAllTables
);

router.get(
    "/:tableName/schema",
   getTableSchema
);
module.exports = router;