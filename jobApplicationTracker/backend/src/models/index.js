const User = require("./User");
const Profile = require("./Profile");

User.hasOne(Profile, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});

Profile.belongsTo(User, {
    foreignKey: "userId"
});

module.exports = {
    User,
    Profile
};