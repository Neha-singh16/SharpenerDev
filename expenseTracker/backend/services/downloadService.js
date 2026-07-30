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
        ContentType: "text/plain",
    };

    // Upload first
    await s3.upload(params).promise();

    // Then generate signed URL
    const signedUrl = s3.getSignedUrl("getObject", {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Expires: 60 * 5,
    });

    return signedUrl;
};

module.exports = { downloadExpensesService };