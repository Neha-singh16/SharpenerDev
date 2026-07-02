const userModel = require("../models/userModel");
const bookingModel = require("../models/bookingModel");


//one to one
userModel.hasOne(bookingModel);
bookingModel.belongsTo(userModel);

module.exports = {
    userModel,
    bookingModel
}