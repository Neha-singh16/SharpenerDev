const Expense = require("../models/expenseModel");
const bcrypt = require("bcrypt");
const sequelize = require("../utils/db");
const { getExpenses } = require("../services/ExpenseServices");
const { suggestCategory } = require("../services/geminiServices");

const generateToken = require("../utils/generateToken");

const auth = require("../utils/auth");

async function addExpense(req, res) {
  let aiCategory = "Others";
  let t;
  try {
    const { amount, description , note } = req.body;
    try {
      aiCategory = await suggestCategory(description);
    } catch (aiError) {
      console.error(
        "Gemini AI failed, falling back to 'Others':",
        aiError.message || aiError,
      );
      aiCategory = "Others";
    }
    const userId = req.user.id;
    t = await sequelize.transaction();
    const expense = await Expense.create(
      {
        amount,

        description,
        category: aiCategory,
        note,
        UserId: userId,
      },
      {
        transaction: t,
      },
    );

    const user = req.user;
    const totalExpense = user.totalExpense + parseInt(amount);
    await user.update(
      { totalExpense },
      {
        transaction: t,
      },
    );
    await t.commit();

    res.status(201).json({ message: "expense added successfully", expense });
  } catch (error) {
    if (t) {
      await t.rollback();
    }

    res.status(500).json({
      message: "Error adding expense",
      error: error.message,
    });
  }
}

async function getAllExpenses(req, res) {
  try {
    // const userId = req.user.id;
    // console.log(userId);
    // const expense = await Expense.findAll({ where: { UserId: userId } });
    // console.log(expense);
    const page = parseInt(req.query.page) || 1;
    const allowedLimits = [5, 10, 20, 40];
    let ITEMS_PER_PAGE = parseInt(req.query.limit) || 10;
    if (!allowedLimits.includes(ITEMS_PER_PAGE)) {
      ITEMS_PER_PAGE = 10;
    }
    const result = await getExpenses(req.user.id, page, ITEMS_PER_PAGE);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Error fetching expenses",

      error: err.message,

      stack: err.stack,
    });
  }
}

async function deleteExpense(req, res) {
  const t = await sequelize.transaction();
  try {
    const expenseId = req.params.id;
    const userId = req.user.id;

    const expense = await Expense.findOne({
      where: { id: expenseId, UserId: userId },
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    await expense.destroy({
      transaction: t,
    });
    const user = req.user;
    const totalExpense = user.totalExpense - expense.amount;
    await user.update({ totalExpense }, { transaction: t });

    await t.commit();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "Error deleting expense", err });
  }
}

async function updateExpense(req, res) {
  const t = await sequelize.transaction();
  try {
    const expenseId = req.params.id;
    const userId = req.user.id;
    const { amount, description, category  , note} = req.body;

    const expense = await Expense.findOne({
      where: {
        id: expenseId,
        UserId: userId,
      },
      transaction: t,
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // const updateExpense = await Expense.update(
    //   { amount, description, category },
    //   { where: { id: expenseId, UserId: userId }, transaction: t },
    // );

    expense.amount = amount;
    expense.description = description;
    expense.category = category;
    expense.note = note;

    await expense.save({
      transaction: t,
    });

    const user = req.user;
    const totalExpense = user.totalExpense - expense.amount + parseInt(amount);
    await user.update({ totalExpense }, { transaction: t });

    await t.commit();

    res.status(200).json({
      message: "Expense updated successfully",
      expense: updateExpense,
    });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "Error updating expense", err });
  }
}
module.exports = { addExpense, getAllExpenses, deleteExpense, updateExpense };
