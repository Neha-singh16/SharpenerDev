const express = require("express");

const authenticate = require("../middleware/authMiddleware");

const {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
} = require("../controllers/companyController");

const router = express.Router();

router.use(authenticate);

router.post("/", createCompany);

router.get("/", getCompanies);

router.get("/:id", getCompanyById);

router.put("/:id", updateCompany);

router.delete("/:id", deleteCompany);

module.exports = router;