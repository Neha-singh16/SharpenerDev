const companyService = require("../services/companyService");


async function createCompany(req, res, next) {

    try {
           console.log("USER FROM JWT:", req.user);

        const company = await companyService.createCompany(
            req.user.id,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Company created successfully",
            data: company
        });

    } catch (error) {
        next(error);
    }
}


async function getCompanies(req, res, next) {

    try {

        const companies = await companyService.getCompanies(
            req.user.id
        );

        res.status(200).json({
            success: true,
            data: companies
        });

    } catch (error) {
        next(error);
    }
}


async function getCompanyById(req, res, next) {

    try {

        const company = await companyService.getCompanyById(
            req.user.id,
            req.params.id
        );

        res.status(200).json({
            success: true,
            data: company
        });

    } catch (error) {
        next(error);
    }
}


async function updateCompany(req, res, next) {

    try {

        const company = await companyService.updateCompany(
            req.user.id,
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Company updated successfully",
            data: company
        });

    } catch (error) {
        next(error);
    }
}


async function deleteCompany(req, res, next) {

    try {

        await companyService.deleteCompany(
            req.user.id,
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Company deleted successfully"
        });

    } catch (error) {
        next(error);
    }
}


module.exports = {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
};