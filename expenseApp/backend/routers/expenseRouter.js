const express = require("express");
const router =express.Router();

const {addExpense , getExpense , deleteExpense} =require("../controllers/expenseController");
 
router.post("/", addExpense);
router.get("/", getExpense);
router.delete("/:id", deleteExpense);

module.exports = router;