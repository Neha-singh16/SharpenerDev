const  { buyPremium: buyPremiumService, updateTransactionStatus}  = require("../services/cashFreeService");

const buyPremium = async (req, res) => {
  try {
    const result = await buyPremiumService(req.user);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const result = await updateTransactionStatus(orderId, status);
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = { buyPremium, updateTransactionStatus: updateTransaction };