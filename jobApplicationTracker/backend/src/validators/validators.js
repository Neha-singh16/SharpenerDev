const { body ,query, params} = require("express-validator");

const registerValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
];


const loginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
];



const applicationQueryValidator = [

    query("status")
        .optional()
        .isIn([
            "SAVED",
            "APPLIED",
            "SCREENING",
            "INTERVIEW",
            "OFFERED",
            "REJECTED",
            "WITHDRAWN",
            "ACCEPTED"
        ])
        .withMessage("Invalid application status"),


    query("companyId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("companyId must be a positive integer"),


    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("page must be at least 1"),


    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("limit must be between 1 and 100"),


    query("sortBy")
        .optional()
        .isIn([
            "appliedAt",
            "createdAt",
            "updatedAt",
            "jobTitle",
            "status"
        ])
        .withMessage("Invalid sort field"),


    query("order")
        .optional()
        .isIn(["ASC", "DESC", "asc", "desc"])
        .withMessage("order must be ASC or DESC"),


    query("from")
        .optional()
        .isISO8601()
        .withMessage("Invalid from date"),


    query("to")
        .optional()
        .isISO8601()
        .withMessage("Invalid to date")
];


module.exports = {
    registerValidator,
    loginValidator,
    applicationQueryValidator
};