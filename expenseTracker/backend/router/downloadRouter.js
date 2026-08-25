const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const auth = require("../utils/auth");
const {
  downloadExpensesService,
} = require("../services/downloadService");


// ==========================================
// CREATE FILTERED EXCEL FILE
// POST /users/download
// ==========================================

router.post("/", auth, async (req, res) => {
  try {
    console.log("Download request from user:", req.user._id);

    // Premium check
    if (!req.user.isPremium) {
      console.log("User is not premium:", req.user._id);

      return res.status(403).json({
        message: "Unauthorized - User must be premium",
        success: false,
      });
    }

    // Get filter data from frontend
    const filterData = req.body;

    // User must apply a filter
    if (!filterData || !filterData.filter) {
      return res.status(400).json({
        message: "Please apply a filter before downloading.",
        success: false,
      });
    }

    // Generate filtered Excel file
    const filename = await downloadExpensesService(
      req.user,
      filterData
    );

    console.log("Download file generated:", filename);

    res.status(200).json({
      fileURL: filename,
      success: true,
    });

  } catch (err) {
    console.error("Download error:", err);

    res.status(500).json({
      error: err.message,
      success: false,
    });
  }
});


// ==========================================
// DOWNLOAD ACTUAL FILE
// GET /users/download/:filename
// ==========================================

router.get("/:filename", auth, (req, res) => {
  try {
    const filename = path.basename(req.params.filename);

    // Only allow Excel files
    if (!filename.endsWith(".xlsx")) {
      return res.status(400).json({
        error: "Invalid file type",
      });
    }

    const backendDir = path.dirname(
      path.dirname(__dirname)
    );

    const uploadsDir = path.join(
      backendDir,
      "uploads"
    );

    const filePath = path.join(
      uploadsDir,
      filename
    );

    console.log("Serving file:", filePath);

    // Check file exists
    if (!fs.existsSync(filePath)) {
      console.error("File not found:", filePath);

      return res.status(404).json({
        error: "File not found",
      });
    }

    // Download Excel file
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Download failed:", err);
      }
    });

  } catch (err) {
    console.error("File serving error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});


module.exports = router;