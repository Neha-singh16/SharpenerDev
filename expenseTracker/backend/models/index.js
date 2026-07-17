const User = require("./userModel");
const Expense = require("./expenseModel");
const Order = require("./orderModel");

User.hasMany(Expense);
Expense.belongsTo(User);


User.hasMany(Order);
Order.belongsTo(User);

