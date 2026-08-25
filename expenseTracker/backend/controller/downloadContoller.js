// const {
//   downloadExpensesService,
// } = require("../services/downloadService");

// const downloadExpenses = async (req, res) => {
//   try {
//     console.log(
//       "Download request from user:",
//       req.user._id
//     );

//     // Extra protection: only premium users can download
//     if (!req.user.isPremium) {
//       console.log(
//         "User is not premium:",
//         req.user._id
//       );

//       return res.status(403).json({
//         message: "Unauthorized - User must be premium",
//         success: false,
//       });
//     }

//     // Generate the expense file
//     const filename = await downloadExpensesService(req.user);

//     console.log(
//       "Expense file generated:",
//       filename
//     );

//     res.status(200).json({
//       fileURL: filename,
//       success: true,
//     });

//   } catch (err) {
//     console.error("Download error:", err);

//     res.status(500).json({
//       error: err.message,
//       success: false,
//     });
//   }
// };

// module.exports = {
//   downloadExpenses,
// };

const Expense = require("../models/expenseModel");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

const downloadExpensesService = async (user) => {
  // Only premium users can download
  if (!user.isPremium) {
    throw new Error("Unauthorized. Premium membership required.");
  }

  // Get this user's expenses
  const expenses = await Expense.find({
    userId: user._id,
  }).sort({
    createdAt: -1,
  });

  // Create a new Excel workbook
  const workbook = new ExcelJS.Workbook();

  // Add a worksheet
  const worksheet = workbook.addWorksheet("Expenses");

  // Define Excel columns
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

  // Add expense data to Excel
  expenses.forEach((expense, index) => {
    worksheet.addRow({
      serialNumber: index + 1,
      amount: expense.amount,
      description: expense.description,
      category: expense.category,
      note: expense.note || "",
      date: new Date(expense.createdAt).toLocaleDateString(),
    });
  });

  // Make header bold
  worksheet.getRow(1).font = {
    bold: true,
  };

  // Create unique Excel filename
  const filename = `Expense_${user._id}_${Date.now()}.xlsx`;

  // Backend directory
  const backendDir = path.dirname(path.dirname(__dirname));

  // uploads folder
  const uploadsDir = path.join(backendDir, "uploads");

  // Create uploads folder if it doesn't exist
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, {
      recursive: true,
    });
  }

  // Complete file path
  const filePath = path.join(uploadsDir, filename);

  try {
    // Generate Excel file
    await workbook.xlsx.writeFile(filePath);

    console.log("Excel file saved successfully at:", filePath);
  } catch (error) {
    console.error("Error creating Excel file:", error);
    throw new Error("Failed to create Excel expense file");
  }

  // Return filename
  return filename;
};

module.exports = {
  downloadExpensesService,
};
