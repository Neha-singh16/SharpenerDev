// const Expense = require("../models/expenseModel");
// const bcrypt = require("bcrypt");
// // const sequelize = require("../utils/db");
// const { getExpenses } = require("../services/ExpenseServices");
// const { suggestCategory } = require("../services/geminiServices");

// const generateToken = require("../utils/generateToken");

// const auth = require("../utils/auth");

// async function addExpense(req, res) {
//   let aiCategory = "Others";
//   let t;
//   try {
//     const { amount, description } = req.body;
//     try {
//       aiCategory = await suggestCategory(description);
//     } catch (aiError) {
//       console.error(
//         "Gemini AI failed, falling back to 'Others':",
//         aiError.message || aiError,
//       );
//       aiCategory = "Others";
//     }
//     const userId = req.user.id;
//     t = await sequelize.transaction();
//     const expense = await Expense.create(
//       {
//         amount,

//         description,
//         category: aiCategory,
//         UserId: userId,
//       },
//       {
//         transaction: t,
//       },
//     );

//     const user = req.user;
//     const totalExpense = user.totalExpense + parseInt(amount);
//     await user.update(
//       { totalExpense },
//       {
//         transaction: t,
//       },
//     );
//     await t.commit();

//     res.status(201).json({ message: "expense added successfully", expense });
//   } catch (error) {
//     if (t) {
//       await t.rollback();
//     }

//     res.status(500).json({
//       message: "Error adding expense",
//       error: error.message,
//     });
//   }
// }

// async function getAllExpenses(req, res) {
//   try {

//     const page = parseInt(req.query.page) || 1;
//     const allowedLimits = [5, 10, 20, 40];
//     let ITEMS_PER_PAGE = parseInt(req.query.limit) || 10;
//     if (!allowedLimits.includes(ITEMS_PER_PAGE)) {
//       ITEMS_PER_PAGE = 10;
//     }
//     const result = await getExpenses(req.user.id, page, ITEMS_PER_PAGE);

//     res.status(200).json(result);
//   } catch (err) {
//     console.error(err);

//     res.status(500).json({
//       message: "Error fetching expenses",

//       error: err.message,

//       stack: err.stack,
//     });
//   }
// }

// async function deleteExpense(req, res) {
//   const t = await sequelize.transaction();
//   try {
//     const expenseId = req.params.id;
//     const userId = req.user.id;

//     // const expense = await Expense.findOne({
//     //   where: { id: expenseId, UserId: userId },
//     // });

//     const expense = await Expense.findOne({
//       _id: expenseId,
//       userId: req.user._id
//     });
//     if (!expense) {
//       return res.status(404).json({ message: "Expense not found" });
//     }
//     await expense.destroy({
//       transaction: t,
//     });
//     const user = req.user;
//     const totalExpense = user.totalExpense - expense.amount;
//     await user.update({ totalExpense }, { transaction: t });

//     await t.commit();
//     res.status(200).json({ message: "Expense deleted successfully" });
//   } catch (err) {
//     await t.rollback();
//     res.status(500).json({ message: "Error deleting expense", err });
//   }
// }

// async function updateExpense(req, res) {
//   const t = await sequelize.transaction();
//   try {
//     const expenseId = req.params.id;
//     const userId = req.user.id;
//     const { amount, description, category } = req.body;

//     const expense = await Expense.findOne({
//       where: {
//         id: expenseId,
//         UserId: userId,
//       },
//       transaction: t,
//     });
//     if (!expense) {
//       return res.status(404).json({ message: "Expense not found" });
//     }

//     // const updateExpense = await Expense.update(
//     //   { amount, description, category },
//     //   { where: { id: expenseId, UserId: userId }, transaction: t },
//     // );

//     expense.amount = amount;
//     expense.description = description;
//     expense.category = category;
//     // expense.note = note;

//     await expense.save({
//       transaction: t,
//     });

//     const user = req.user;
//     const totalExpense = user.totalExpense - expense.amount + parseInt(amount);
//     await user.update({ totalExpense }, { transaction: t });

//     await t.commit();

//     res.status(200).json({
//       message: "Expense updated successfully",
//       expense: updateExpense,
//     });
//   } catch (err) {
//     await t.rollback();
//     res.status(500).json({ message: "Error updating expense", err });
//   }
// }

// module.exports = { addExpense, getAllExpenses, deleteExpense, updateExpense };

const Expense = require("../models/expenseModel");
const User = require("../models/userModel");

const { getExpenses } = require("../services/ExpenseServices");
const { suggestCategory } = require("../services/geminiServices");

async function addExpense(req, res) {
  try {
    const { amount, description, category, note } = req.body;

    if (!amount || !description) {
      return res.status(400).json({
        message: "Amount and description are required",
      });
    }

    let expenseCategory = category;

    // If category is not provided, try AI categorization
    if (!expenseCategory) {
      try {
        expenseCategory = await suggestCategory(description);
      } catch (error) {
        console.log("AI categorization failed. Using Others:", error.message);

        expenseCategory = "Others";
      }
    }

    const expense = await Expense.create({
      amount: Number(amount),
      description,
      category: expenseCategory,
      note: note || "",
      userId: req.user._id,
    });

    // Increase user's precomputed total expense
    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        totalExpense: Number(amount),
      },
    });

    res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error("Error adding expense:", error);

    res.status(500).json({
      message: "Error adding expense",
      error: error.message,
    });
  }
}

async function getAllExpenses(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const itemsPerPage = Number(req.query.itemsPerPage) || 10;

    const result = await getExpenses(req.user._id, page, itemsPerPage);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching expenses:", error);

    res.status(500).json({
      message: "Error fetching expenses",
      error: error.message,
    });
  }
}

async function deleteExpense(req, res) {
  try {
    const expenseId = req.params.id;

    // Find expense AND verify it belongs to logged-in user
    const expense = await Expense.findOne({
      _id: expenseId,
      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    // First update user's total
    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        totalExpense: -expense.amount,
      },
    });

    // Then delete the expense
    await expense.deleteOne();

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting expense:", error);

    res.status(500).json({
      message: "Error deleting expense",
      error: error.message,
    });
  }
}

async function updateExpense(req, res) {
  try {
    const expenseId = req.params.id;

    const { amount, description, category, note } = req.body;

    // Find expense AND verify ownership
    const expense = await Expense.findOne({
      _id: expenseId,
      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    // IMPORTANT: Save old amount before changing it
    const oldAmount = expense.amount;
    const newAmount = Number(amount);

    expense.amount = newAmount;

    if (description !== undefined) {
      expense.description = description;
    }

    if (category !== undefined) {
      expense.category = category;
    }

    if (note !== undefined) {
      expense.note = note;
    }

    await expense.save();

    // Calculate how much the total changed
    const difference = newAmount - oldAmount;

    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        totalExpense: difference,
      },
    });

    res.status(200).json({
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    console.error("Error updating expense:", error);

    res.status(500).json({
      message: "Error updating expense",
      error: error.message,
    });
  }
}

module.exports = {
  addExpense,
  getAllExpenses,
  deleteExpense,
  updateExpense,
};
