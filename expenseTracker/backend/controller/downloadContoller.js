const {downloadExpensesService} = require("../services/downloadService");

const downloadExpenses = async (req, res) => {
  try {
    if (!req.user.isPremium) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const url = await downloadExpensesService(req.user);
    res.status(200).json({
      fileURL: url,

      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = { downloadExpenses };
