const Expense = require("../models/expenseModel");

const getExpenses = async (userId, page, ITEMS_PER_PAGE) => {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const { count, rows } = await Expense.findAndCountAll({
    where: {
      UserId: userId,
    },
    limit: ITEMS_PER_PAGE,

    offset: offset,
    order: [["createdAt", "DESC"]],
  });

  const hasNextPage = ITEMS_PER_PAGE * page < count;
  const hasPreviousPage = page > 1;

  return {
    expenses: rows,
    currentPage: page,
    hasNextPage: hasNextPage,
    nextPage: hasNextPage ? page + 1 : null,

    hasPreviousPage: hasPreviousPage,
    previousPage: hasPreviousPage ? page - 1 : null,
    lastPage: Math.ceil(count / ITEMS_PER_PAGE),
    totalExpenses: count,
  };
};

module.exports = {
  getExpenses,
};

// : ITEMS_PER_PAGE * page < count,
// hasPreviousPage ? page - 1 : null,
