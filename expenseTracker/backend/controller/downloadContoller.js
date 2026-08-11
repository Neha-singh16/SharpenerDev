const {downloadExpensesService} = require("../services/downloadService");

const downloadExpenses = async (req, res) => {
  try {
    console.log("Download request from user:", req.user.id);
    
    if (!req.user.isPremium) {
      console.log("User is not premium:", req.user.id);
      return res.status(401).json({
        message: "Unauthorized - User must be premium",
      });
    }
    
    const url = await downloadExpensesService(req.user);
    
    console.log("Download URL generated:", url);
    
    res.status(200).json({
      fileURL: url,
      success: true,
    });
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({
      error: err.message,
      success: false,
    });
  }
};

module.exports = { downloadExpenses };
