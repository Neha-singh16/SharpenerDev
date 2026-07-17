const express = require('express');

const router = express.Router();
const { addExpense, getAllExpenses, deleteExpense, updateExpense } = require("../controller/expenseController");
const auth = require("../utils/auth");

router.post("/", auth, addExpense);
router.get("/", auth, getAllExpenses);
router.delete("/:id", auth, deleteExpense);
router.put("/:id", auth, updateExpense);

module.exports = router;


