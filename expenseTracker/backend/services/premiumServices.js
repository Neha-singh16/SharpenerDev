const User = require("../models/userModel");

const getLeaderboard = async () => {
  try {
    const leaderboard = await User.find()
      .select("_id name totalExpense")
      .sort({ totalExpense: -1 });

    return leaderboard;
  } catch (error) {
    throw new Error("Could not fetch leaderboard");
  }
};

module.exports = {
  getLeaderboard,
};
