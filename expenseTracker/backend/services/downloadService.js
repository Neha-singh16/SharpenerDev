// const Expense = require("../models/expenseModel");
// const fs = require('fs');
// const path = require('path');

// const downloadExpensesService = async (user) => {

//     if (!user.isPremium) {
//         throw new Error("Unauthorized");
//     }

//     const expense = await Expense.findAll({
//         where: {
//             UserId: user.id,
//         },
//     });

//     const data = JSON.stringify(expense, null, 2);

//     const filename = `Expense_${user.id}_${Date.now()}.txt`;

//     // Get the absolute path to the backend directory
//     const backendDir = path.dirname(path.dirname(__dirname));
//     const uploadsDir = path.join(backendDir, 'uploads');

//     console.log("Backend dir:", backendDir);
//     console.log("Uploads dir:", uploadsDir);

//     // Create uploads directory if it doesn't exist
//     if (!fs.existsSync(uploadsDir)) {
//         fs.mkdirSync(uploadsDir, { recursive: true });
//         console.log("Created uploads directory:", uploadsDir);
//     }

//     const filePath = path.join(uploadsDir, filename);

//     try {
//         fs.writeFileSync(filePath, data);
//         console.log(`Expense file saved successfully at: ${filePath}`);
//     } catch (error) {
//         console.error("Error saving file:", error);
//         throw new Error("Failed to save expense file");
//     }

//     // Return just the filename
//     return filename;
// };

// module.exports = { downloadExpensesService };

const Expense = require("../models/expenseModel");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

// ==========================================
// HELPER: CREATE LOCAL DATE
// Prevent timezone problems with YYYY-MM-DD
// ==========================================

function createLocalDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

// ==========================================
// DOWNLOAD FILTERED EXPENSES AS EXCEL
// ==========================================

const downloadExpensesService = async (user, filterData) => {
  // ------------------------------------------
  // PREMIUM CHECK
  // ------------------------------------------

  if (!user.isPremium) {
    throw new Error("Unauthorized. Premium membership required.");
  }

  // ------------------------------------------
  // GET FILTER
  // ------------------------------------------

  const { filter, selectedDate, startDate, endDate, month, year } = filterData;

  if (!filter) {
    throw new Error("Please apply a filter before downloading.");
  }

  // ------------------------------------------
  // BASE MONGODB QUERY
  // ------------------------------------------

  const query = {
    userId: user._id,
  };

  // ==========================================
  // DAILY FILTER
  // ==========================================

  if (filter === "Daily") {
    if (!selectedDate) {
      throw new Error("Please select a date.");
    }

    const start = createLocalDate(selectedDate);

    const end = new Date(start);

    end.setDate(end.getDate() + 1);

    query.createdAt = {
      $gte: start,
      $lt: end,
    };
  }

  // ==========================================
  // WEEKLY FILTER
  // Actually a custom date range
  // ==========================================
  else if (filter === "Weekly") {
    if (!startDate || !endDate) {
      throw new Error("Please select both start date and end date.");
    }

    const start = createLocalDate(startDate);

    const end = createLocalDate(endDate);

    // Validate dates
    if (start > end) {
      throw new Error("Start date cannot be after end date.");
    }

    // Include the complete end date
    end.setDate(end.getDate() + 1);

    query.createdAt = {
      $gte: start,
      $lt: end,
    };
  }

  // ==========================================
  // MONTHLY FILTER
  // ==========================================
  else if (filter === "Monthly") {
    if (month === undefined || month === null || !year) {
      throw new Error("Please select both month and year.");
    }

    const selectedMonth = Number(month);
    const selectedYear = Number(year);

    const start = new Date(selectedYear, selectedMonth, 1);

    const end = new Date(selectedYear, selectedMonth + 1, 1);

    query.createdAt = {
      $gte: start,
      $lt: end,
    };
  }

  // ==========================================
  // YEARLY FILTER
  // ==========================================
  else if (filter === "Yearly") {
    if (!year) {
      throw new Error("Please select a year.");
    }

    const selectedYear = Number(year);

    const start = new Date(selectedYear, 0, 1);

    const end = new Date(selectedYear + 1, 0, 1);

    query.createdAt = {
      $gte: start,
      $lt: end,
    };
  }

  // ==========================================
  // INVALID FILTER
  // ==========================================
  else {
    throw new Error("Invalid report filter.");
  }

  // ==========================================
  // FETCH ONLY FILTERED EXPENSES
  // ==========================================

  console.log("MongoDB filter query:", query);

  const expenses = await Expense.find(query).sort({
    createdAt: -1,
  });

  // ==========================================
  // NO EXPENSES FOUND
  // ==========================================

  if (expenses.length === 0) {
    throw new Error("No expenses found for the selected filter.");
  }

  console.log(`Found ${expenses.length} expenses for download`);

  // ==========================================
  // CREATE EXCEL WORKBOOK
  // ==========================================

  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Expense Tracker";

  const worksheet = workbook.addWorksheet("Expenses");

  // ==========================================
  // EXCEL COLUMNS
  // ==========================================

  worksheet.columns = [
    {
      header: "S.No",
      key: "serialNumber",
      width: 10,
    },

    {
      header: "Amount",
      key: "amount",
      width: 15,
    },

    {
      header: "Description",
      key: "description",
      width: 30,
    },

    {
      header: "Category",
      key: "category",
      width: 20,
    },

    {
      header: "Note",
      key: "note",
      width: 30,
    },

    {
      header: "Date",
      key: "date",
      width: 20,
    },
  ];

  // ==========================================
  // ADD EXPENSE DATA
  // ==========================================

  expenses.forEach((expense, index) => {
    worksheet.addRow({
      serialNumber: index + 1,

      amount: Number(expense.amount),

      description: expense.description,

      category: expense.category,

      note: expense.note || "",

      date: new Date(expense.createdAt).toLocaleDateString("en-IN"),
    });
  });

  // ==========================================
  // HEADER STYLE
  // ==========================================

  const headerRow = worksheet.getRow(1);

  headerRow.font = {
    bold: true,
    color: {
      argb: "FFFFFFFF",
    },
  };

  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "FF4F46E5",
    },
  };

  // ==========================================
  // ADD FILTER INFO AT TOP
  // Optional metadata
  // ==========================================

  worksheet.views = [
    {
      state: "frozen",
      ySplit: 1,
    },
  ];

  // ==========================================
  // TOTAL ROW
  // ==========================================

  const totalExpense = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0,
  );

  worksheet.addRow({});

  const totalRow = worksheet.addRow({
    description: "TOTAL EXPENSE",
    amount: totalExpense,
  });

  totalRow.font = {
    bold: true,
  };

  // ==========================================
  // CREATE UNIQUE FILENAME
  // ==========================================

  const safeFilter = filter.toLowerCase();

  const filename = `Expense_${safeFilter}_${user._id}_${Date.now()}.xlsx`;

  // ==========================================
  // CREATE UPLOADS DIRECTORY
  // ==========================================

  const backendDir = path.dirname(path.dirname(__dirname));

  const uploadsDir = path.join(backendDir, "uploads");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, {
      recursive: true,
    });
  }

  // ==========================================
  // CREATE EXCEL FILE
  // ==========================================

  const filePath = path.join(uploadsDir, filename);

  try {
    await workbook.xlsx.writeFile(filePath);

    console.log("Excel file saved successfully:", filePath);
  } catch (error) {
    console.error("Error creating Excel file:", error);

    throw new Error("Failed to create Excel expense file.");
  }

  return filename;
};

module.exports = {
  downloadExpensesService,
};
