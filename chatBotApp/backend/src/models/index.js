const User = require("../models/userModel");
const Chat = require("../models/chatModel");

User.hasMany(Chat, { foreignKey: "userId" });
// Chat.belongsTo(User, { foreignKey: "userId" });
Chat.belongsTo(User,{
    foreignKey:"userId",
    as:"user"
})

