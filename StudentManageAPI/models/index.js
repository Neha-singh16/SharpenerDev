const StudentModel = require('./students');
const IdentityModel = require("./identityCard");
const DepartmentModel = require("./department")


StudentModel.hasOne(IdentityModel);
IdentityModel.belongsTo(StudentModel);


DepartmentModel.hasMany(StudentModel);
StudentModel.belongsTo(DepartmentModel);

module.exports = {
    StudentModel,
    IdentityModel,
    DepartmentModel
}