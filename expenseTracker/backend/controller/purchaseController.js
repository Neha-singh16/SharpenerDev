const  { buyPremium: buyPremiumService, updateTransactionStatus}  = require("../services/cashFreeService");
const { getLeaderboard} = require("../services/premiumServices");
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
    const { orderId } = req.body;
    const result = await updateTransactionStatus(orderId);
    // console.log(result);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getLeaderBoard = async(req,res) => {
  try{
    if(!req.user.isPremium){
      return res.status(403).json({message: "Access denied. Premium membership required."})
    }
    const result = await getLeaderboard();
    res.status(200).json(result);

  }catch(err){
      res.status(500).json({
      message: err.message,
    });
  }
}

module.exports = { buyPremium, updateTransactionStatus: updateTransaction , getLeaderBoard };