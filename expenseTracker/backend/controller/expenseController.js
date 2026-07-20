const Expense = require("../models/expenseModel");
const bcrypt = require("bcrypt");
const sequelize = require("../utils/db");
const { suggestCategory } = require("../services/geminiServices");

const generateToken = require("../utils/generateToken");

const auth = require("../utils/auth");

async function addExpense(req, res) {
  let aiCategory = "Others";
  let t;
  try {
    const { amount, description } = req.body;
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
    const userId = req.user.id;
    console.log(userId);
    const expense = await Expense.findAll({ where: { UserId: userId } });
    console.log(expense);

    res.status(201).json({ message: "expense fetched successfully", expense });
  } catch (err) {
    res.status(500).json({ message: "Error fetching expenses", err });
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
    const { amount, description, category } = req.body;

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
