const Expense = require("../models/expenseModel");
const fs = require('fs');
const path = require('path');

const downloadExpensesService = async (user) => {

    if (!user.isPremium) {
        throw new Error("Unauthorized");
    }

    const expense = await Expense.findAll({
        where: {
            UserId: user.id,
        },
    });

    const data = JSON.stringify(expense, null, 2);

    const filename = `Expense_${user.id}_${Date.now()}.txt`;

    // Get the absolute path to the backend directory
    const backendDir = path.dirname(path.dirname(__dirname));
    const uploadsDir = path.join(backendDir, 'uploads');
    
    console.log("Backend dir:", backendDir);
    console.log("Uploads dir:", uploadsDir);
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log("Created uploads directory:", uploadsDir);
    }
    
    const filePath = path.join(uploadsDir, filename);
    
    try {
        fs.writeFileSync(filePath, data);
        console.log(`Expense file saved successfully at: ${filePath}`);
    } catch (error) {
        console.error("Error saving file:", error);
        throw new Error("Failed to save expense file");
    }
    
    // Return just the filename
    return filename;
};

module.exports = { downloadExpensesService };