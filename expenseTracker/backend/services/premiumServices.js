const User = require("../models/userModel");
const Expense = require("../models/expenseModel");
const seq = require("../utils/db");


const getLeaderboard = async (req, res) => {
  // const leaderBoard = await User.findAll({
  //   attributes: [
  //     "id",
  //     "name",
  //     "email",
  //     [
  //       seq.fn(
  //         "SUM",
  //         seq.col("expenses.amount")
  //       ),
  //       "totalExpense"
  //     ]
  //   ],
  //   include: [
  //     {
  //       model: Expense,
  //       attributes: []
  //     }
  //   ],
  //   group: ["User.id"],
  //   order: [[seq.literal("totalExpense"), "DESC"]]

  // });

  // return leaderBoard;

  const leaderBoard = await User.findAll({
    // sort by totalExpense in desc
     attributes: ["id", "name", "totalExpense"],
  order: [["totalExpense", "DESC"]],
  
  })


return res.status(200).json({
    leaderBoard
});

};


module.exports = { getLeaderboard};