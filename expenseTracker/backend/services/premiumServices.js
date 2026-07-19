const User = require("../models/userModel");
const Expense = require("../models/expenseModel");
const seq = require("../utils/db");


const getLeaderboard = async (req, res) => {
  const leaderBoard = await User.findAll({
    attributes: [
      "id",
      "name",
      "email",
      [
        seq.fn(
          "SUM",
          seq.col("expenses.amount")
        ),
        "totalExpense"
      ]
    ],
    include: [
      {
        model: Expense,
        attributes: []
      }
    ],
    group: ["User.id"],
    order: [[seq.literal("totalExpense"), "DESC"]]

  });

  return leaderBoard;

};


module.exports = { getLeaderboard};