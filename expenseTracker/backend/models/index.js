const User = require("./userModel");
const Expense = require("./expenseModel");
const Order = require("./orderModel");
const ForgotPassword = require('./forgotPasswordModel');
User.hasMany(Expense);
Expense.belongsTo(User);


User.hasMany(Order);
Order.belongsTo(User);


User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);