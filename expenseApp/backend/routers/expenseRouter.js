const express = require("express");
const router =express.Router();

const {addExpense , getExpense , deleteExpense , updateExpense} =require("../controllers/expenseController");
 
router.post("/", addExpense);
router.get("/", getExpense);
router.delete("/:id", deleteExpense);
router.put("/:id", updateExpense);

module.exports = router;