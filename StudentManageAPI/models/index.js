const StudentModel = require('./students');
const IdentityModel = require("./identityCard");
const DepartmentModel = require("./department");
const CourseModel = require("./courses");
const StudentCourseModel = require("./studentCourse");

//one to one
StudentModel.hasOne(IdentityModel);
IdentityModel.belongsTo(StudentModel);

//one  to many
DepartmentModel.hasMany(StudentModel);
StudentModel.belongsTo(DepartmentModel);

//many to  many
StudentModel.belongsToMany(CourseModel, {through: StudentCourseModel});
CourseModel.belongsToMany(StudentModel, {through: StudentCourseModel});


module.exports = {
    StudentModel,
    IdentityModel,
    DepartmentModel,
    CourseModel,
    StudentCourseModel
}