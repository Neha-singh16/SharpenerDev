const express = require("express");
const router = express.Router();

const {
  createRecord,
  getAllRecords,
} = require("../controllers/recordController");

router.post("/:tableName", createRecord);
router.get("/:tableName", getAllRecords);

module.exports = router;
