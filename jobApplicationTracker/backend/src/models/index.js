const User = require("./User");
const Profile = require("./Profile");
const Company = require("./Company");
const JobListing = require("./JobListing");
const Application = require("./Application");
const Attachment = require("./Attachment");
const Reminder = require("./Reminder");
const Note = require("./Note");



/* USER ↔ PROFILE */

User.hasOne(Profile, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});

Profile.belongsTo(User, {
    foreignKey: "userId"
});


/* USER ↔ COMPANY */

User.hasMany(Company, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});

Company.belongsTo(User, {
    foreignKey: "userId"
});


/* USER ↔ JOB */

User.hasMany(JobListing, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});

JobListing.belongsTo(User, {
    foreignKey: "userId"
});


/* COMPANY ↔ JOB */

Company.hasMany(JobListing, {
    foreignKey: "companyId",
    onDelete: "RESTRICT"
});

JobListing.belongsTo(Company, {
    foreignKey: "companyId"
});


/* USER ↔ APPLICATION */

User.hasMany(Application, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});

Application.belongsTo(User, {
    foreignKey: "userId"
});


/* COMPANY ↔ APPLICATION */

Company.hasMany(Application, {
    foreignKey: "companyId",
    onDelete: "RESTRICT"
});

Application.belongsTo(Company, {
    foreignKey: "companyId"
});


/* JOB ↔ APPLICATION */

JobListing.hasMany(Application, {
    foreignKey: "jobListingId",
    onDelete: "SET NULL"
});

Application.belongsTo(JobListing, {
    foreignKey: "jobListingId"
});
  

// Application - Attachment

Application.hasMany(Attachment, {
    foreignKey: "applicationId",
    onDelete: "CASCADE"
});

Attachment.belongsTo(Application, {
    foreignKey: "applicationId"
});



// User - Attachment
User.hasMany(Attachment, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});

Attachment.belongsTo(User, {
    foreignKey: "userId"
});


// Application - Reminder
Application.hasMany(Reminder, {
    foreignKey: "applicationId",
    onDelete: "CASCADE"
});

Reminder.belongsTo(Application, {
    foreignKey: "applicationId"
});

// User - Reminder

User.hasMany(Reminder, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});

Reminder.belongsTo(User, {
    foreignKey: "userId"
});


//Application - Note
Application.hasMany(Note, {
    foreignKey: "applicationId",
    onDelete: "CASCADE"
});

Note.belongsTo(Application, {
    foreignKey: "applicationId"
});


//User - Note
User.hasMany(Note, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});

Note.belongsTo(User, {
    foreignKey: "userId"
});


module.exports = {
    User,
    Profile,
    Company,
    JobListing,
    Application,
    Attachment,
    Reminder,
    Note
};