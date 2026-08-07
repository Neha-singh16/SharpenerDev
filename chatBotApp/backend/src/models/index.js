const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Group = require("../models/groupModel");
const GroupMember = require("../models/groupMemberModel");


User.hasMany(Chat, { foreignKey: "userId" });
// Chat.belongsTo(User, { foreignKey: "userId" });
Chat.belongsTo(User,{
    foreignKey:"userId",
    as:"user"
})

Group.hasMany(Chat, {
    foreignKey: "groupId"
});

Chat.belongsTo(Group, {
    foreignKey: "groupId"
});

User.hasMany(GroupMember, {
    foreignKey: "userId"
});

GroupMember.belongsTo(User, {
    foreignKey: "userId"
});


Group.hasMany(GroupMember, {
    foreignKey: "groupId"
});

GroupMember.belongsTo(Group, {
    foreignKey: "groupId"
});


User.belongsToMany(Group, {
    through: GroupMember,
    foreignKey: "userId"
});

Group.belongsToMany(User, {
    through: GroupMember,
    foreignKey: "groupId"
});