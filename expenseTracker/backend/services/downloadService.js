const Expense = require("../models/expenseModel");
const s3 = require("../config/s3");

const downloadExpensesService = async (user) => {
  if (!user.isPremium) {
    throw new Error("Unauthorized");
  }
  const expense = await Expense.findAll({
    where: {
      UserId: user.id,
    },
  });

  const data = JSON.stringify(expense);

  const filename = `Expense_${user.id}_${Date.now()}.txt`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
    ContentType: "text/plain",
  };

  const result = await s3.upload(params).promise();
  return result.Location;
};


module.exports = {downloadExpensesService};