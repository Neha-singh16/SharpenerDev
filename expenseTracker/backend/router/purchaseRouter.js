const {buyPremium, updateTransactionStatus , getLeaderBoard} = require("../controller/purchaseController");
const auth = require("../utils/auth");
const express= require("express");

const router = express.Router();

router.post("/buy-premium", auth, buyPremium);
router.post("/update-transaction-status", auth, updateTransactionStatus);
router.get("/leaderboard", auth , getLeaderBoard);

module.exports = router;