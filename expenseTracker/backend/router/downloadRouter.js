const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const auth = require("../utils/auth");
const {downloadExpensesService} = require("../services/downloadService");

// Route to get the download URL
router.get("/", auth, async (req, res) => {
  try {
    console.log("Download request from user:", req.user.id);
    
    if (!req.user.isPremium) {
      console.log("User is not premium:", req.user.id);
      return res.status(401).json({
        message: "Unauthorized - User must be premium",
      });
    }
    
    const filename = await downloadExpensesService(req.user);
    
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

// Route to serve the actual file
router.get("/:filename", auth, (req, res) => {
  try {
    const filename = req.params.filename;
    const backendDir = path.dirname(path.dirname(__dirname));
    const filePath = path.join(backendDir, 'uploads', filename);
    
    console.log("Serving file:", filePath);
    
    // Security check - ensure file is within uploads directory
    const uploadsDir = path.join(backendDir, 'uploads');
    if (!path.resolve(filePath).startsWith(path.resolve(uploadsDir))) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error("File not found:", filePath);
      return res.status(404).json({ error: "File not found" });
    }
    
    // Send the file
    res.download(filePath, filename);
  } catch (err) {
    console.error("File serving error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;